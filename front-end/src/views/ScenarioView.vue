<template>
  <div class="upClap"><div class="motifClap"></div></div>
  <div class="scenarForm">
    <div class="formPart">
    <textarea v-model="script" class="scenarea" />
    </div>
    <div class="formPart">
      <character-list :persoList="persoList" />
      <div class="sceneChoose" @click="check">
        <input class="switch" v-model="sceneType" type="checkbox">
        <div class="customSlider">Dialogue</div>
      </div>
      <button @click="submit()" class="scenarBtn" type="button">Créer scène</button>
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
    sceneType: false,
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
                characteristics: this.persoList[index].characteristics,
                choosenImageUrl: this.persoList[index].choosenImageUrl
              }
          )
        }
      }
      localStorage.setItem('script', this.script)
      localStorage.setItem('persoList', JSON.stringify(this.persoInScenar))
      if (this.sceneType) {
        router.push({name: 'scenegrid'})
      } else {
        router.push({name: 'scene'})
      }
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
  display: flex;
  align-items: center;
  height: 90vh;
}
.formPart {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
.sceneChoose {
  height: 10%;
  width: 90%;
  background-color: grey;
  border: solid black;
}
.switch {
  opacity: 0;
  position: absolute;
}
@keyframes uncheck {
  0% {left: 50%;color:white;}
  40% {left: 30%; width: 20%;color:white;}
  100% {left: 0;width: 50%;color:black;}
}
@keyframes check {
  0% {left: 0;color:white;}
  40% {left:50% ;width: 20%;color:white;}
  100% {width: 50%;color:black;}
}
.customSlider {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 50%;
  background-color: white;
}
.uncheck {
  left: 0;
  animation-name: uncheck;
  animation-duration: 1s;
}
.check {
  left: 50%;
  animation-name: check;
  animation-duration: 1s;
}
.scenarea {
  width: 90%;
  height: 90%;
  overflow-y: scroll;
}
.scenarBtn {
  height: 10%;
  width: 90%;
  font-size: 24px;
  background-color: white;
  border: solid black;
}
</style>