<template>
  <div class="background display-flex">
    <h2>Nouvelle pièce</h2>
    <div class="scenarForm">
      <div class="formPart">
        <h3>Cadre de l'histoire</h3>
        <textarea v-model="script" class="scenarea" placeholder="Ils arrivent dans une forêt..."></textarea>
      </div>
      <div class="formPart">
        <h3>Personnages</h3>
        <character-list :persoList="persoList" />
      </div>
    </div>
    <div class="middle">
      <h3>Titre de la pièce</h3>
      <input type="text" placeholder=". . ." class="b3" v-model="sceneName">
    </div>
    <h3>Format</h3>
    <div class="sceneChoose">
      <div class="sceneChoose">
        <div class="b2" :class="sceneType == 'dialog' ? 'choose' : 'noChoose'" @click="sceneType='dialog'">Dialogue</div>
        <div class="b2" :class="sceneType == 'grid' ? 'choose' : 'noChoose'" @click="sceneType='grid'">Grille</div>
      </div>
    </div>
    <div class="bottom">
      <div class="buttons">
      <router-link to="/" class="scenarBtn b1">Retour</router-link>
      <button @click="submit()" class="scenarBtn b1" type="button">Commencer</button>
      </div>
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
    sceneType: "dialog",
    persoList: [],
    script: '',
    sceneName: ''
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
                characteristics: this.persoList[index].characteristics,
                choosenImageUrl: this.persoList[index].choosenImageUrl
              }
          )
        }
      }
      localStorage.setItem('script', this.script)
      localStorage.setItem('name', this.sceneName)
      localStorage.setItem('persoList', JSON.stringify(this.persoInScenar))
      localStorage.setItem('sceneType', this.sceneType)
      this.$router.push({name: 'scene'})
    },
    check() {
      this.sceneType = !this.sceneType
      if (this.sceneType) {
        const slider = document.getElementsByClassName('customSlider')[0]
        slider.className = 'customSlider check'
        slider.innerHTML = 'Grille'
      } else {
        const slider = document.getElementsByClassName('customSlider')[0]
        slider.className = 'customSlider uncheck'
        slider.innerHTML = 'Dialogue'
      }
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
              choosenImageUrl: response.data[index].choosenImageUrl,
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
  height: 50%;
  width: 60%;
}
.formPart {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  height: 90%;
}
.formPart character-list{
  display: flex;
  justify-content: space-between;
}
.scenarea {
  overflow-y: scroll;
  width: 90%;
  height: 100%;
}
.scenarBtn {
  width: 20%;
  font-size: 24px;
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
h3 {
  color: white;
}

.middle {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  margin-bottom: 20px;
}
.middle .b3{
  width: 80%;
  max-width: 420px;
  font-size: 24px;
  margin: 0 10px;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  text-decoration: none;
  color: white;
  cursor: text;
}

.sceneChoose {
  display: flex;
  justify-content: center;
  width: 100%;
}
.sceneChoose .b2 {
  text-align: center;
  width: 120px;

}

.bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.buttons {
  display: flex;
  justify-content: center;
  width: 100%;
}

.sceneChoose {
  display: flex;
  justify-content: center;
}
@keyframes choose {
  from {filter: hue-rotate(-45deg) brightness(50%);}
  to {filter: hue-rotate(0) brightness(100%);}
}
@keyframes nochoose {
  from {filter: hue-rotate(0) brightness(100%);}
  to {filter: hue-rotate(-45deg) brightness(50%);}
}

.choose {
  width: 50%;
  animation-name: choose;
  animation-duration: 1s;
}

.noChoose {
  width: 50%;
  filter: hue-rotate(-45deg) brightness(50%);
  animation-name: nochoose;
  animation-duration: 1s;
}

.charaList {
  height: 100%;
}
</style>