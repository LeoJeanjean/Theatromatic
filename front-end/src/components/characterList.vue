<template>
  <div class="charaList">
    <div @click="check(perso.id)" v-for="perso in persoList">
        {{ perso.name }}
        <input :id="perso.id" v-model="perso.inScenar" class="check" type="checkbox" />
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
  height: 70%;
  width: 90%;
  background-color: white;
  overflow-y: scroll;
}
div {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 100%;
  border-bottom: black solid;
}
</style>