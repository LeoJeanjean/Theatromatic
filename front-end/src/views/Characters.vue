<template>
  <div class="charaPage">
    <div class="charaList">
      <div class="charaRow">
        <p class="case">Nom</p>
        <p class="case">Genre</p>
        <p class="case">Métier</p>
        <p class="case">Caractéristiques</p>
      </div>
      <div v-if="persoList !== null" @click="selectCharacter(perso._id)" class="charaRow" v-for="perso in persoList">
        <p class="case" :id="perso._id+'n'">{{ perso.name }}</p>
        <p class="case" :id="perso._id+'g'">{{ perso.gender }}</p>
        <p class="case" :id="perso._id+'j'">{{ perso.job }}</p>
        <p class="case" :id="perso._id+'c'" v-text="perso.characteristics ? perso.characteristics.toString() : 'pas de caractéristique'"></p>
        <button class="suppr" @click="deleteCharacter(perso._id)">X</button>
      </div>
    </div>
    <div class="div-form-character">
      <form
          id="app"
          @submit="checkForm"
          action="https://vuejs.org/"
          method="post"
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


        <p class="input">
          <label for="characteristic">Caractéristique(s)</label>
          <textarea
              id="characteristic"
              v-model="persoSelect.characteristic"
              rows="5" cols="33"
              type="text"
              name="characteristic"
              placeholder="Grand, sournois, diabolique, avec un pistolet, etc..."
              style="resize: none;"
          >
            </textarea>
        </p>

        <p class="input">
          <button class="submit" type="submit" @click:="checkForm">Submit</button>
        </p>

        <p class="input" v-if="errors.length">
          <b>Veuillez corriger les erreurs suivantes:</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
        </p>
      </form>
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
      characteristics:''
    },
    el: '#app',
    errors: [],
  }),
  methods: {
    checkForm: async function (e) {
      if (this.persoSelect.name && this.persoSelect.gender && this.persoSelect.job) {
        this.createNewCharacter(this.persoSelect.name, this.persoSelect.gender, this.persoSelect.job, this.persoSelect.characteristic);
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

      e.preventDefault();
    },
    createNewCharacter: async function (name, gender, job, characteristics) {
      let user = JSON.parse(localStorage.getItem('user')); //retrieve the object
      const newCharacter = new Character(name, gender, job, characteristics, user["_id"]);
      await axios.post(
          'http://localhost:3000/addCharacter',
          {
            character: newCharacter,
          },
          {}
      ).then(async () => {
        await this.getCharacter()
      })
    },
    selectCharacter(id) {
      this.persoSelect.name = document.getElementById(id+'n').innerText
      this.persoSelect.gender = document.getElementById(id+'g').innerText
      this.persoSelect.job = document.getElementById(id+'j').innerText
      this.persoSelect.characteristics = document.getElementById(id+'c').innerText
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
      await this.recupId().then(()=>{
        const charactersID = JSON.parse(localStorage.getItem('user')).characters
        this.persoList = null
        if (charactersID !== undefined) {
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
          this.getCharacter()
        } else {
          console.log("erreur")
        }
      })
    }
  },
  async mounted() {
    await this.getCharacter()
  }
}
</script>

<style scoped>
.charaPage {
  display: flex;
}
.charaList {
  display: flex;
  flex-direction: column;
  width: 50vw;
  height: 100vh;
  background-color: white;
  overflow-y: scroll;
}
.charaRow {
  display: flex;
}
.case {
  width: 24%;
  margin: 0;
  border: black solid;
}
.suppr {
  width: 4%;
  padding: 0;
  background-color: red;
  border: solid black;
  text-align: center;
  font-weight: bold;
}

.div-form-character {
  height: 40vh;
}

.input {
  display: flex;
}
</style>