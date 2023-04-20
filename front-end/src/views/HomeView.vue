<script>

import { RouterLink } from 'vue-router'
export default {
  mounted() { 
    if (localStorage.getItem("user") == null) {
            this.$router.push('/login')
        }
  }
}

</script>

<template>
  <nav class='buttons'>
    <RouterLink class='button' to="/personnages">Personnages</RouterLink>
    <RouterLink class='button' to="/scenario">Lancer une pièce</RouterLink>
  </nav>
</template>


<style>
.buttons{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>