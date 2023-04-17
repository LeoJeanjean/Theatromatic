<script>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class='buttons'>
    <RouterLink class='button' to="/personnages">Personnages</RouterLink>
    <RouterLink class='button' to="/scene">Lancer une pièce</RouterLink>
  </nav>
</template>

<style>
.buttons{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>