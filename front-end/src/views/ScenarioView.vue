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
export default {
  name: "ScenarioView",
  components: {CharacterList},
  data: () => ({
    persoList: [],
    script: ''
  }),
  methods: {
    submit() {
      this.persoInScenar = ''
      for (const index in this.persoList) {
        if (this.persoList[index].inScenar === true) {
          this.persoInScenar += this.persoList[index].id + "-"
        }
      }
      this.persoInScenar = this.persoInScenar.slice(0,-1)
      router.push({ name: 'scene', params: {personnage: this.persoInScenar, script: this.script}})
    }
  },
  created() {
    for (let i = 1; i <= 20; i++) {
      this.persoList.push({id: i,name: 'test'+i,inScenar: false})
    }
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