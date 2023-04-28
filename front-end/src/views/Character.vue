<template>

    <div class="character">
        <h2>Création de personnages</h2>

        <div class="presentation-page-character">
            <CharacterForm class="character-form"/>
        </div>

        <button @click="redirectPage('/')" class="scenarBtn b1">Retour</button>
    </div>
</template>

<script>


import { mapState } from 'pinia';
import CharacterForm from '../components/CharacterForm.vue'
import useUserStore from "../stores/user";


export default  {
    methods: {
    redirectPage (route) {
        this.$router.push(route)
      },
    },

    components: {
        CharacterForm
    },
    computed: {
        ...mapState(useUserStore, ["userDatas"]),
    },
    mounted() {
        if (localStorage.getItem("user") == null) {
            this.$router.push('/login')
        }

    }
}

</script>

<style>


.character {
  background: repeat url('../src/assets/Planches.png');
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  color: white;
}

.presentation-page-character {
    display: flex;
    flex-flow: wrap column;
    background-color: white;
    border-radius: 10px;
    padding: 30px;
}
.presentation-page-character p {
    display: flex;
    flex-flow: wrap column;
    margin-bottom: 5px;
}

.image-characters {
    /* height: 40vh; */
    width: 50%; 
}

h2 {
  font-size: 48px;
} 
</style>