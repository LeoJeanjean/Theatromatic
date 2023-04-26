<template>
  <div class="charaList">
    <div @click="check(perso._id)" v-for="perso in persoList">
        <span>{{ perso.name }}</span>
        <input @click="check(perso._id)" :id="perso._id" v-model="perso.inScenar" class="check" type="checkbox" />
    </div>
  </div>
</template>

<script>
export default {
  name: "characterList",
  props: {
    persoList:Array
  },
  methods: {
    check(id) {
      document.getElementById(id).click()
    }
  }
}
</script>

<style scoped>
.charaList {
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 0;
  width: 90%;
  height: 80%;
  background-color: white;
  overflow-y: scroll;
  cursor: pointer;
}
div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  width: 100%;
  border: black solid;
  padding: 2px;
}
</style>