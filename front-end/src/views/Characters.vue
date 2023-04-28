<template>
  <div class="background">
    <h2>Vos personnages</h2>
    <div class="display-flex container">
      <div style="overflow: scroll;">
        <table class="charaList">
          <tr style="position:sticky;top:0;z-index: 1;">
            <th class="case">Nom</th>
            <th class="case">Genre</th>
            <th class="case">Métier</th>
            <th class="case">Caractéristiques</th>
            <th class="case">Image</th>
            <th class="case">__</th>
          </tr>
          <tr v-if="persoList !== null" v-for="perso in persoList">
            <td :id="perso._id+'n'">{{ perso.name }}</td>
            <td :id="perso._id+'g'">{{ perso.gender }}</td>
            <td :id="perso._id+'j'">{{ perso.job }}</td>
            <td :id="perso._id+'c'" v-text="perso.characteristics ? perso.characteristics.toString() : 'pas de caractéristique'"></td>
            <td><img class="case" :id="perso._id+'i'" :src="perso.choosenImageUrl" alt="aucune image sélectionnée" onerror="placeHolder(perso._id+'i')"/></td>
            <td class="flex-column">
              <button class="edit" @click="selectCharacter(perso._id)" title="Modifier le personnage">|</button>
              <button class="suppr" @click="deleteConfirm(perso._id,perso.name)" title="Supprimer le personnage">X</button>
            </td>
          </tr>
        </table>
      </div>
      <div
          class="character-form"
      >
        <p>
          <label for="name">Nom</label>
          <input
              id="name"
              v-model="persoSelect.name"
              type="text"
              name="name"
              placeholder="Jean-Michel"
          >
        </p>
        <p>
          <label for="gender">Genre</label>
          <select v-model="persoSelect.gender">
            <option disabled value="">Choisir un genre</option>
            <option>Masculin</option>
            <option>Feminin</option>
          </select>
        </p>
        <p>
          <label for="job">Fonction</label>
          <input
              id="job"
              v-model="persoSelect.job"
              name="job"
              placeholder="Charpentier"
          >
        </p>
        <p class="input display-flex">
          <label for="characteristic">Caractéristique(s)</label>
          <textarea
              id="characteristic"
              v-model="persoSelect.characteristics"
              rows="5" cols="33"
              name="characteristic"
              placeholder="Grand, sournois, diabolique, avec un pistolet..."
              style="resize: none;"
          >
            </textarea>
        </p>
        <p>
          <label for="img"> Choisir une image : </label>
          <input v-model="persoSelect.choosenImageUrl" type="text" name="img" id="img" placeholder="URL web">
        <div>
          <button class="b3" @click="showDialog = true">Ouvrir la librairie d'image</button>
          <div v-if="showDialog">
            <div class="overlay"></div>
            <div class="dialog">
              <div class="dialog-header">
                <h2>Banque d'image</h2>
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
        <p>
          <button class="submit b2" @click="checkForm(false)">Ajouter</button>
          <button class="submit b2" v-if="persoSelect._id !== ''" @click="checkForm(true)">Modifier</button>
        </p>
        <p v-if="errors.length">
          <b>Veuillez corriger les erreurs suivantes:</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>
        <p v-else-if="created !== ''">
          <b>Personnage {{created}}.</b>
        </p>
      </div>
    </div>
    <button @click="redirectPage('/')" class="scenarBtn b1">Retour</button>
  </div>
  <div :class="confirm ? 'show' : 'hide'">
    <div class="confirm">
    Vous allez supprimez {{persoDelete.name}}.
    Êtes-vous sûr ?
    <button class="b1" @click="confirm = false">Non</button>
    <button class="b1" @click="deleteCharacter(persoDelete._id)">Oui</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CharacterForm from '../components/CharacterForm.vue'
import Character from "@/models/Character";
import PlaceHolder from "@/assets/placeholder.png"

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
    persoDelete: {
      _id:'',
      name:''
    },
    errors: [],
    isItHisOwnImage: false,
    api: 'https://pixabay.com/api/?key=35717457-65a4b6adba7729f12e69b314c&safesearch=true&image_type=illustration&image_type=vector&per_page=200',
    images: null,
    sText: '',
    showDialog: false,
    created: '',
    confirm: false
  }),
  methods: {
    placeHolder: function (id) {
      document.getElementById(id).src = PlaceHolder
    },
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
      if (!this.persoSelect.choosenImageUrl) {
        this.errors.push("URL d'image requise.");
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
      ).then(async () => {
        await this.getCharacter()
        this.created = 'créé';
      })
    },
    async updateCharacter() {
      try {
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
        ).then(async () => {
          await this.getCharacter()
          this.created = 'modifié';
        })
      } catch (err) {
        console.log(err)
      }
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
    deleteConfirm(id,name) {
      this.confirm = true
      this.persoDelete._id = id
      this.persoDelete.name = name
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
          this.persoDelete._id = ''
          this.persoDelete.name = ''
          this.confirm = false
          this.created = 'supprimé';
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
    },
    redirectPage (route) {
      this.$router.push(route)
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
  height: 70%;
  overflow-y: scroll;
  color: white;
  margin-left: 10%;
}

.charaList img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.charaList tr {
  background: white;
  color: black;
}

.case {
  width: 20%;
  margin: 0;
  border: white solid;
  background-color: grey;
}
.suppr {
  padding: 0;
  background-color: red;
  border: solid white;
  text-align: center;
  font-weight: bold;
  height: 50%;
  cursor:pointer;
}
.edit {
  padding: 0;
  background-color: green;
  border: solid white;
  text-align: center;
  font-weight: bold;
  height: 50%;
  cursor:pointer;
}
.character-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 30%;
  color: black;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  margin-right: 10%;
}
.character-form p {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
}

.display-flex {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: stretch;
}

.container {
  height: 80vh;
}

.flex-column {
  display:flex;
  flex-direction: column;
  font-family: 'YosterIsland';
  height: 100%;
}
.dialog {
  color: black
}

.background {
  background: repeat url('../src/assets/Planches.png');
  width: 100%;
  height: 100%;
  color: white;
}
.background .b1 {
  margin-top: 0;
}

h2 {
  font-size: 48px;
}
.confirm {
  background-color: white;
  border-radius: 8px;
}
.show {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.50);
  opacity: 1;
}
.hide {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -5;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
}
</style>