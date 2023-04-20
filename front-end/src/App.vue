<script setup>
import { RouterView } from 'vue-router'


</script>

<template>

  <div style="background-color: antiquewhite;">
    <nav>
      <ul class="nav-elements">
        <li>Home</li>
        <li>Personnages</li>
        <li>{{ this.loginOrLogout }}</li>
      </ul>
    </nav>
  </div>
  <RouterView @send="receive"/>

  
</template>

<script>
import useUserStore from "./stores/user";
import { mapState } from 'pinia';
import LoginView from './views/LoginView.vue';

export default {
    data() {
        return {
            loginOrLogout: undefined
        };
    },
    methods : {
      receive(childData) {
        if (childData) {
          this.loginOrLogout = "Se déconncter"
        } else {
          this.loginOrLogout = "Se conncter"
        }
        console.log(childData); // "Hello World"
      }
    },
    computed: {
        ...mapState(useUserStore, ["userDatas"]),
    },
    mounted() {
        console.log("mounted");
        if (this.userDatas == null) {
            this.loginOrLogout = "Se connecter";
        }
        else {
            this.loginOrLogout = "Se déconnecter";
        }
        console.log(this.userDatas);
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
