<template>
  <div class="display-flex">
    <div class="charaList">
      <div class="charaRow">
        <p class="case">Nom</p>
        <p class="case">Genre</p>
        <p class="case">Métier</p>
        <p class="case">Caractéristiques</p>
        <p class="case">Image</p>
      </div>
      <div v-if="persoList !== null" @click="selectCharacter(perso._id)" class="charaRow" v-for="perso in persoList">
        <p class="case" :id="perso._id+'n'">{{ perso.name }}</p>
        <p class="case" :id="perso._id+'g'">{{ perso.gender }}</p>
        <p class="case" :id="perso._id+'j'">{{ perso.job }}</p>
        <p class="case" :id="perso._id+'c'" v-text="perso.characteristics ? perso.characteristics.toString() : 'pas de caractéristique'"></p>
        <img class="case" :id="perso._id+'i'" :src="perso.choosenImageUrl" alt="aucune image sélectionnée"/>
        <button class="suppr" @click="deleteCharacter(perso._id)">X</button>
      </div>
    </div>
    <div class="div-form-character">
      <div
          id="app"
          class="character-form"
      >
        <p class="input">
          <label for="name">Nom</label>
          <input
              id="name"
              v-model="persoSelect.name"
              type="text"
              name="name"
          >
        </p>
        <p class="input">
          <label for="gender">Genre</label>
          <select v-model="persoSelect.gender">
            <option disabled value="">Choisir un genre</option>
            <option>Masculin</option>
            <option>Feminin</option>
          </select>
        </p>
        <p class="input">
          <label for="job">Fonction</label>
          <input
              id="job"
              v-model="persoSelect.job"
              name="job"
          >
        </p>
        <p class="input display-flex">
          <label for="characteristic">Caractéristique(s)</label>
          <textarea
              id="characteristic"
              v-model="persoSelect.characteristics"
              rows="5" cols="33"
              name="characteristic"
              placeholder="Grand, sournois, diabolique, avec un pistolet, etc..."
              style="resize: none;"
          >
            </textarea>
        </p>
        <p class="input">
          <label for="img"> Choisir une image : </label>
          <input v-model="persoSelect.choosenImageUrl" type="text" name="img" id="img">
        <div>
          <button @click="showDialog = true">Ouvrir la librairie d'image</button>
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
                  <div v-for="(image) in images" :key="image.id" class="card">
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
        <p class="input">
          <button class="submit" @click="checkForm(false)">Submit</button>
          <button class="submit" @click="checkForm(true)">Update</button>
        </p>
        <p class="input" v-if="errors.length">
          <b>Veuillez corriger les erreurs suivantes:</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CharacterForm from '../components/CharacterForm.vue'
import Character from "@/models/Character";

export default {
  name: "Characters",
  components: {
    CharacterForm
  },
  data: () => ({
    persoList: [],
    persoSelect: {
      _id:'',
      name:'',
      gender:'',
      job:'',
      characteristics:'',
      choosenImageUrl: null
    },
    el: '#app',
    errors: [],
    isItHisOwnImage: false,
    api: 'https://pixabay.com/api/?key=35717457-65a4b6adba7729f12e69b314c&safesearch=true&image_type=illustration&image_type=vector&per_page=200',
    images: null,
    sText: '',
    showDialog: false,
  }),
  methods: {
    checkForm: async function (update) {
      if (this.persoSelect.name && this.persoSelect.gender && this.persoSelect.job && this.persoSelect.choosenImageUrl) {
        if (!update) {
          this.createNewCharacter()
        } else if (update && this.persoSelect._id !== '') {
          this.updateCharacter()
        }
      }
      this.errors = [];
      if (!this.persoSelect.name) {
        this.errors.push('Nom requis.');
      }
      if (!this.persoSelect.gender) {
        this.errors.push('Genre requis.');
      }
      if (!this.persoSelect.job) {
        this.errors.push('Fonction requis.');
      }
    },
    createNewCharacter: async function () {
      let user = JSON.parse(localStorage.getItem('user'));
      const newCharacter = new Character(this.persoSelect.name, this.persoSelect.gender, this.persoSelect.job, this.persoSelect.characteristics, user["_id"], this.persoSelect.choosenImageUrl);
      await axios.post(
          'http://localhost:3000/addCharacter',
          {
            character: newCharacter,
          },
          {}
      ).then(() => {
        this.getCharacter()
      })
    },
    async updateCharacter() {
      await axios.put(
          'http://localhost:3000/updateCharacter',
          {
            character: {
              _id: this.persoSelect._id,
              name: this.persoSelect.name,
              gender: this.persoSelect.gender,
              job: this.persoSelect.job,
              characteristics: this.persoSelect.characteristics,
              choosenImageUrl: this.persoSelect.choosenImageUrl
            }
          },
          {}
      ).then(() => {
        this.getCharacter()
      })
    },
    selectCharacter(id) {
      this.persoSelect._id = id
      this.persoSelect.name = document.getElementById(id+'n').innerText
      this.persoSelect.gender = document.getElementById(id+'g').innerText
      this.persoSelect.job = document.getElementById(id+'j').innerText
      this.persoSelect.characteristics = document.getElementById(id+'c').innerText
      this.persoSelect.choosenImageUrl = document.getElementById(id+'i').src
    },
    async recupId() {
      let user = JSON.parse(localStorage.getItem('user'))
      let userInfos = {"name" : user.name, "password": user.password }
      await axios.post(
          'http://localhost:3000/login',
          {
            userInput: userInfos
          },
      ).then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data))
      })
    },
    async getCharacter() {
      await this.recupId().then(()=> {
        const charactersID = JSON.parse(localStorage.getItem('user')).characters
        this.persoList = null
        if (charactersID !== undefined && charactersID[0] !== undefined) {
          let IDs = ''
          for (let i = 0; i < charactersID.length; i++) {
            if (i + 1 === charactersID.length) {
              IDs += charactersID[i]
            } else {
              IDs += charactersID[i] + '-'
            }
          }
          axios.get(
              'http://localhost:3000/characters/' + IDs,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
          ).then((response) => {
            for (let i = 0; i < response.data.length; i++) {
              if (response.data[i] == null) {
                response.data.splice(i,1)
              }
            }
            this.persoList = response.data
          })
        }
      })
    },
    async deleteCharacter(id) {
      const userId = JSON.parse(localStorage.getItem('user'))._id
      await axios.delete(
          'http://localhost:3000/deleteCharacter/'+userId+'/'+id,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
      ).then(async (response) => {
        if (response.data) {
          await this.getCharacter()
        } else {
          console.log("erreur")
        }
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
          .catch((error) => console.log(error))
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
      this.persoSelect.choosenImageUrl = imageUrl;
    }
  },
  async mounted() {
    await this.getCharacter()
    await this.getImages()
  }
}
</script>

<style scoped>
.charaList {
  display: flex;
  flex-direction: column;
  width: 50vw;
  height: 100vh;
  overflow-y: scroll;
  color: white;
}
.charaRow {
  display: flex;
}
.case {
  width: 19%;
  margin: 0;
  border: white solid;
  background-color: grey;
}
.suppr {
  width: 5%;
  padding: 0;
  background-color: red;
  border: solid white;
  text-align: center;
  font-weight: bold;
}
.character-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 50vw;
  color: white;
}
.input {
  display: flex;
  gap: 8px;
  color: white;
}
.display-flex {
  display: flex;
}
.dialog {
  color: black
}
</style>