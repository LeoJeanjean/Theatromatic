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
            <label for="img"> Choisir une image : </label>
            <input v-model = "this.choosenImageUrl" type="text" name="img" id="img">



            <div>
                <button @click="showDialog = true">Ouvrir la librarie d'image</button>
                <div v-if="showDialog">
                <div class="overlay"></div>
                <div class="dialog">
                    <div class="dialog-header">
                    <h2>Dialog Title</h2>
                    <span @click="showDialog = false">X</span>
                    </div>
                    <div class="dialog-content">
                        <input type="text" v-model="sText"  name="searchImg" id="searchImg">
                        <button @click="this.searchImage()">Chercher</button>
                            <div class="container-pixabay">
                                    <div v-for="(image, i) in images" :key="image.id" class="card">
                                        <div class="img-and-button">
                                            <img :src="image.webformatURL" class="card-img" alt="">
                                            <span class="chooseImage" @click="this.chooseThisImage(image['largeImageURL']); showDialog = false" >Choisir</span> 
                                        </div>
                                    </div>
                            </div>
                    </div>
                </div>
                </div>
            </div>
        </p>


        <p>
            <button on@click:checkForm>Submit</button> 
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
            api: 'https://pixabay.com/api/?key=35717457-65a4b6adba7729f12e69b314c&safesearch=true&image_type=illustration&image_type=vector&per_page=200',
            images: null,
            sText: '',
            showDialog: false,
            choosenImageUrl: null
        }
    },
    methods:{
        checkForm: function (e) {
            if (this.name && this.gender && this.job && this.choosenImageUrl) {
                this.createNewCharacter(this.name,this.gender,this.job,this.characteristic,this.choosenImageUrl);
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
        createNewCharacter: async function (name,gender,job,characteristics,choosenImageUrl) {
            var user = JSON.parse(localStorage.getItem('user')); //retrieve the object
            const newCharacter = new Character(name,gender,job,characteristics,user["_id"], choosenImageUrl);
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
        searchImage: function(){
            
            axios.get(this.api+'&q='+this.sText)
            .then(response=>{
            this.images = response.data.hits
            })
            .catch(error=>{
            console.log(error)
            })

        },
        chooseThisImage(imageUrl) {
            this.choosenImageUrl = imageUrl;
        }
    }, mounted() {
        this.getImages()
    }
}

</script>

<style>

    .chooseImage {
        cursor: pointer;
    }
    
    .container-pixabay {
        width: 100%;
        max-height: 40vh;
        overflow-y: scroll;
        display: flex;
        flex-wrap: wrap;
    }

    .card {
        width: 33%;

    }
    .card-img {
        width: 71%;
    }


    .div-form-character {     
        height: 40vh;
    }


    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }

    .dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 20px;
        z-index: 1000;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        max-width: 500px;
        width: 100%;
    }

    .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .dialog-content {
        margin-top: 20px;
    }
</style>