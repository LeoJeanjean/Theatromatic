<template>
    <div class="div-form-character">
        <form
        id="app"
        @submit="checkForm"
        action="https://vuejs.org/"
        method="post"
        class="character-form"
        >

        <p>
            <label for="name">Nom</label>
            <input
            id="name"
            v-model="name"
            type="text"
            name="name"
            >
        </p>

        <p>
            <label for="gender">Genre</label>
            <select v-model="gender">
                <option disabled value="">Choisir un genre</option>
                <option>Masculin</option>
                <option>Feminin</option>
            </select>
        </p>

        <p>
            <label for="job">Fonction</label>
            <input
            id="job"
            v-model="job"
            name="job"
            >
        </p>


        <p>
            <label for="characteristic">Caractéristique(s)</label>
            <textarea
            id="characteristic"
            v-model="characteristic"
            rows="5" cols="33"
            type="text"
            name="characteristic"
            placeholder="Grand, sournois, diabolique, avec un pistolet, etc..."
            style="resize: none;"
            >
            </textarea>
        </p>

        <p>
            <button type="submit" @click:="checkForm">Submit</button>
        </p>

        <p v-if="errors.length">
            <b>Veuillez corriger les erreurs suivantes:</b>
            <ul>
            <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
        </form>
    </div>
</template>

<script>

import Character from "../models/Character.js"
import axios from "axios"

export default {
    props: ['perso'],
    data() {
        return {
            el: '#app',
            errors: [],
            name: null,
            job: null,
            gender: null,
            characteristic: null
        }
    },
    methods: {
      checkForm: async function (e) {
        if (this.name && this.gender && this.job) {
          this.createNewCharacter(this.name, this.gender, this.job, this.characteristic);
        }

        this.errors = [];

        if (!this.name) {
          this.errors.push('Nom requis.');
        }
        if (!this.gender) {
          this.errors.push('Genre requis.');
        }
        if (!this.job) {
          this.errors.push('Fonction requis.');
        }

        e.preventDefault();
      },
      createNewCharacter: async function (name, gender, job, characteristics) {
        let user = JSON.parse(localStorage.getItem('user')); //retrieve the object
        const newCharacter = new Character(name, gender, job, characteristics, user["_id"]);
        await axios.post(
            'http://localhost:3000/addCharacter',
            {
              character: newCharacter,
            },
            {}
        )
      },
      change() {
        this.name = this.perso.name
        this.gender = this.perso.gender
        this.job = this.perso.job
        this.characteristic = this.perso.characteristics
      }
    }
}

</script>

<style>

    .character-form {
       /* height: 40vh; */
    }

    .div-form-character {
               height: 40vh;

    }

    p {
      display: flex;
    }
 
</style>