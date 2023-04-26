<template>
  <div class="background display-flex">
    <h2>Nouvelle pièce</h2>
    <div class="scenarForm">
      <div class="formPart">
        <textarea v-model="script" class="scenarea" placeholder="Ils arrivent dans une forêt..."></textarea>
      </div>
      <div class="formPart">
        <character-list :persoList="persoList" />
      </div>
    </div>
    <div class="buttons">
      <button @click="redirectPage('/')" class="scenarBtn b1">Retour</button>
      <button @click="submit()" class="scenarBtn b1" type="button">Créer scène</button>
    </div>
  </div>
</template>

<script>
import CharacterList from "@/components/characterList.vue";
import router from "@/router";
import axios from "axios";
export default {
  name: "ScenarioView",
  components: {CharacterList},
  data: () => ({
    persoList: [],
    script: ''
  }),
  methods: {
    submit() {
      this.persoInScenar = []
      for (const index in this.persoList) {
        if (this.persoList[index].inScenar === true) {
          this.persoInScenar.push(
              {
                _id: this.persoList[index]._id,
                name: this.persoList[index].name,
                gender: this.persoList[index].gender,
                job: this.persoList[index].job,
                characteristics: this.persoList[index].characteristics
              }
          )
        }
      }
      localStorage.setItem('script', this.script)
      localStorage.setItem('persoList', JSON.stringify(this.persoInScenar))
      router.push({ name: 'scene'})
    },
    redirectPage (route) {
      this.$router.push(route)
    }
  },
  async mounted() {
    const charactersID = JSON.parse(localStorage.getItem('user')).characters
    let IDs = ''
    for (let i = 0; i < charactersID.length; i++) {
      if (i+1 === charactersID.length) {
        IDs += charactersID[i]
      } else {
        IDs += charactersID[i]+'-'
      }
    }
    await axios.get(
        'http://localhost:3000/characters/'+IDs,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
    ).then((response) => {
      for (const index in response.data) {
        this.persoList.push(
            {
              _id: response.data[index]._id,
              name: response.data[index].name,
              gender: response.data[index].gender,
              job: response.data[index].job,
              characteristics: response.data[index].characteristics,
              InScenar: false
            }
        )
      }
    })
  }
}
</script>

<style scoped>
.scenarForm {
  color: black;
  display: flex;
  height: 70%;
  width: 60%;
}
.formPart {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  height: 80%;
}
.formPart character-list{
  display: flex;
  justify-content: space-between;
}
.scenarea {
  overflow-y: scroll;
  width: 100%;
  height: 80%;
}
.scenarBtn {
  width: 20%;
  font-size: 24px;
}

.background{
  background: repeat url('../src/assets/Planches.png');
  width: 100%;
  height: 100%;
  color: white;
}

.display-flex {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column nowrap;
}

h2 {
  font-size: 48px;
} 

.buttons {
  display: flex;
  justify-content: center;
  width: 100%;
}

</style>