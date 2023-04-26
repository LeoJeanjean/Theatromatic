<script>

import { RouterLink } from 'vue-router'
import useUserStore from "../stores/user";
import { mapState } from 'pinia';

export default {
  data() {
    return {
      isConnected: false,
      userData: JSON.parse(localStorage.getItem("user"))
    };
  },
  mounted() { 
    if (localStorage.getItem("user") == null) {
            this.$router.push('/login')
        }
  },
  methods: {
    logout() {
      localStorage.removeItem("user")
      this.$router.push("/login")
      this.isConnected = false;
    }
  },
  computed: {
    ...mapState(useUserStore, ["userDatas"]),
  }
}

</script>

<template>
  <div class="background">
    <div class="title">
      <h1>Theatromatic</h1>
      <span>Le générateur de pièce de théâtre</span>
    </div>
    <nav class='buttons'>
      <RouterLink class='b1' to="/personnages">Personnages</RouterLink>
      <RouterLink class='b1' to="/scenario">Lancer une pièce</RouterLink>
    </nav>
    <div class="account">Connecté: {{ userData["name"] }} <br/><span @click="logout()" class="logout"> Se déconnecter </span> </div>
  </div>
</template>


<style>

.background{
  background: repeat url('../src/assets/Planches.png');
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  color: white;
}

.title{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title h1{
  font-size: 120px;
  font-weight: 900;
}
.title span{
  font-size: 30px;
  font-weight: 900;
}

.buttons{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.logout{
  cursor: pointer;
  color: red;
}

.account {
  text-align: center;
}
</style>