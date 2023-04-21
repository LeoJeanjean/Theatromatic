<template>
  <div class="upClap"><div class="motifClap"></div></div>
  <div class="scenarForm">
    <div class="formPart">
    <textarea v-model="script" class="scenarea" />
    </div>
    <div class="formPart">
      <character-list :persoList="persoList" />
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
    persoList: [],
    script: ''
  }),
  methods: {
    submit() {
      this.persoInScenar = []
      for (const index in this.persoList) {
        if (this.persoList[index].inScenar === true) {
          this.persoInScenar.push(this.persoList[index])
        }
      }
      localStorage.setItem('script', this.script)
      localStorage.setItem('persoList', JSON.stringify(this.persoInScenar))
      router.push({ name: 'scene'})
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
      this.persoList = response.data
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
.scenarea {
  width: 90%;
  height: 90%;
  overflow-y: scroll;
}
.scenarBtn {
  height: 20%;
  width: 90%;
  font-size: 24px;
  background-color: white;
  border-style: none;
}
</style>