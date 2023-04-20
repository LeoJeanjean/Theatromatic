<template>
  <div class="charaPage">
    <div class="charaList">
      <div class="charaRow">
        <p>Nom</p>
        <p>Genre</p>
        <p>Métier</p>
        <p>Caractéristiques</p>
      </div>
      <div @click="selectPerso(perso._id)" :id="perso._id" class="charaRow" v-for="perso in persoList">
        <p :id="perso._id+'n'">{{ perso.name }}</p>
        <p :id="perso._id+'g'">{{ perso.gender }}</p>
        <p :id="perso._id+'j'">{{ perso.job }}</p>
        <p :id="perso._id+'c'" v-text="perso.characteristics ? perso.characteristics.toString() : 'pas de caractéristique'"></p>
      </div>
    </div>
    <CharacterForm :perso="persoSelect" class="form"></CharacterForm>
  </div>
</template>

<script>
import axios from "axios";
import CharacterForm from '../components/CharacterForm.vue'

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
    }
  }),
  methods: {
    selectPerso(id) {
      this.persoSelect.name = document.getElementById(id+'n').innerText
      this.persoSelect.gender = document.getElementById(id+'g').innerText
      this.persoSelect.job = document.getElementById(id+'j').innerText
      this.persoSelect.characteristics = document.getElementById(id+'c').innerText
      console.log(this.persoSelect)
    }
  },
  async created() {
    await axios.get(
        'http://localhost:3000/characters',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
    ).then((response) => {
      this.persoList = response.data
    })
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
p {
  width: 25%;
  height: 5vh;
  border: black solid;
}
</style>