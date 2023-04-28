<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView @changeMusic="changeMusic" @send="receive"/>
</template>

<script>
import useUserStore from "./stores/user";
import { mapState } from 'pinia';
import LoginView from './views/LoginView.vue';

export default {
    data() {
        return {
            loginOrLogout: undefined,
            isConnected: false,
            music: false,
            audio: new Audio
        };
    },
    methods : {
      redirectPage (route) {
        this.$router.push(route)
      },
      receive(childData) {
          this.isConnected = true
      },
      login(){
        this.$router.push("/login")
      },
      logout() {
        localStorage.removeItem("user")
        this.$router.push("/login")
        this.isConnected = false;
      },
      changeMusic(childData) {
        this.audio.src = childData
        this.audio.play();
      }
    },
    computed: {
        ...mapState(useUserStore, ["userDatas"]),
    },
    mounted() {
      this.isConnected = localStorage.getItem("user") !== null;
      this.audio.loop = true;
    },
    components: { LoginView }
}
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
.nav-elements {
  display: flex;
  list-style-type: none;
  justify-content: flex-end;
}

.nav-elements > li {
  margin-right: 10px;
  cursor: pointer;
}
.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  height: 40px;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
