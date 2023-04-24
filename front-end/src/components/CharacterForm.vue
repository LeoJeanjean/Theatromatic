<template>
    <div class="div-form-character">
        <form
        id="app"
        @submit="checkForm"
        action="https://vuejs.org/"
        method="post"
        class="character-form"
        >

        <p>
            <label for="name">Nom</label>
            <input
            id="name"
            v-model="name"
            type="text"
            name="name"
            >
        </p>

        <p>
            <label for="gender">Genre</label>
            <select v-model="gender">
                <option disabled value="">Choisir un genre</option>
                <option>Masculin</option>
                <option>Feminin</option>
            </select>
        </p>

        <p>
            <label for="job">Fonction</label>
            <input
            id="job"
            v-model="job"
            name="job"
            >
        </p>


        <p>
            <label for="characteristic">Caractéristique(s)</label>
            <textarea
            id="characteristic"
            v-model="characteristic"
            rows="5" cols="33"
            type="text"
            name="characteristic"
            placeholder="Grand, sournois, diabolique, avec un pistolet, etc..."
            style="resize: none;"
            >
            </textarea>
        </p>

        <p>
            <button on@click:checkForm>Submit</button> 
        </p>

        <p>
            <label for="img"> Choisir une image : </label>
            <div v-if="isItHisOwnImage">
                <input type="text" name="img" id="img">
            </div>
            <div v-else>
                <input type="text" v-model="sText" onchange='this.searchImage(e)' name="searchImg" id="searchImg">
                <div class="container">
                    <div class="row">
                        <div class="col-md-3 col-sm-6" v-for="(image, i) in images" :key="image.id">
                        <div class="card">
                            <img :src="image.webformatURL" class="card-img-top" alt="">
                            <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <button class="btn btn-icon" @click="makeFav(i)">
                                <i class="mdi mdi-heart"></i>
                                </button>
                                <div>{{image.likes}}</div>
                                <button class="btn btn-icon" @click="downloadWithAxios(image.largeImageURL)">
                                <i class="mdi mdi-download"></i>
                                </button>
                                <div>{{image.downloads}}</div>
                                <button class="btn btn-icon" @click="viewImg(image.largeImageURL)">
                                <i class="mdi mdi-eye"></i>
                                </button>
                                <div>{{image.views}}</div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

        </p>

        <p v-if="errors.length">
            <b>Veuillez corriger les erreurs suivantes:</b>
            <ul>
            <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
        </form>
    </div>
</template>

<script>

import Character from "../models/Character.js"
import axios from "axios"

export default {
    data() {
        return {
            el: '#app',
            errors: [],
            name: null,
            gender: null,
            job: null,
            gender: null,
            characteristic: null,
            isItHisOwnImage: false,
            api: 'https://pixabay.com/api/?key=35717457-65a4b6adba7729f12e69b314c',
            images: null,
            sText: ''
        }
    },
    methods:{
        checkForm: function (e) {
            if (this.name && this.gender && this.job) {
                this.createNewCharacter(this.name,this.gender,this.job,this.characteristic);
            }

            this.errors = [];

            if (!this.name) {
                this.errors.push('Nom requis.');
            }
            if (!this.gender) {
                this.errors.push('Genre requis.');
            }
            if (!this.job) {
                this.errors.push('Fonction requis.');
            }

            e.preventDefault();
        },
        createNewCharacter: async function (name,gender,job,characteristics,userID) {
            var user = JSON.parse(localStorage.getItem('user')); //retrieve the object
            const newCharacter = new Character(name,gender,job,characteristics,user["_id"]);
            const response = await axios.post(
                'http://localhost:3000/addCharacter',
                {
                character: newCharacter,
                },
                {}
            ).then((response) => {
                console.log("C'est bon ! Perso créé");
            })

        },
        getImages: function(){
            axios.get(this.api).then(response => {
                this.images = response.data.hits
            }).catch(error => (console.log(error)))
        },
        forceFileDownload(response){
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            var rand = Math.floor(Math.random()*999)
            link.setAttribute('download', 'wallpep'+rand+'.png') //or any other extension
            document.body.appendChild(link)
            link.click()
        },
        downloadWithAxios(link){
            axios({
            method: 'get',
            url: link,
            responseType: 'arraybuffer'
            })
            .then(response => {
            this.forceFileDownload(response)
            })
            .catch((errror) => console.log(errror))
        },
        searchImage: function(e){
            this.sText = e.target.value
            axios.get(this.api+'&q='+this.sText)
            .then(response=>{
            this.images = response.data.hits
            })
            .catch(error=>{
            console.log(error)
            })

        },
    }, mounted() {
        this.getImages()
    }
}

</script>

<style>

    .character-form {
       /* height: 40vh; */
    }

    .div-form-character {
               height: 40vh;

    }
 
</style>