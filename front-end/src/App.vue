<script setup>
import { RouterView } from 'vue-router'


</script>

<template>
  <RouterView @send="receive"/>
  <div id="music" @click="playMusic()"
       style="
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    position: absolute;
    bottom: 0;
    width: 350px;
    height: 30px;
    right: 0;
    opacity: 1;
    background: no-repeat center url('../src/assets/Planche1.png');
    background-size: 350px 30px;"
  >
    <p>Cliquer pour lancer le thème musical</p>
  </div>
</template>

<script>
import useUserStore from "./stores/user";
import { mapState } from 'pinia';
import LoginView from './views/LoginView.vue';
import Test from './assets/Test.mp3';

export default {
    data() {
        return {
            loginOrLogout: undefined,
            isConnected: false,
            music: false
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
      async playMusic() {
        if (!this.music) {
          this.music = true;
          let audio = new Audio(Test);
          audio.loop = true;
          audio.play();
          const sleep = (milliseconds) => {
                return new Promise(resolve => setTimeout(resolve, milliseconds))
          }
          for (let i = 100; i >= 0; i--) {
            document.getElementById('music').style.opacity = i/100
            await sleep(1)
          }
          document.getElementById('music').style.zIndex = -100
        }
      }
    },
    computed: {
        ...mapState(useUserStore, ["userDatas"]),
    },
    mounted() {
      this.isConnected = localStorage.getItem("user") !== null;
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
