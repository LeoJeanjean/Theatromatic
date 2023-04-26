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
            >
            </textarea>
        </p>

        <p>
            <input class="b1 b1plus"
            type="submit"
            value="Submit"
            >
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
    export default {
    data() {
        return {
            el: '#app',
            errors: [],
            name: null,
            gender: null,
            job: null,
            gender: null,
            characteristic: null
        }
    },
    methods:{
        checkForm: function (e) {
            if (this.name && this.gender && this.job) {
                return true;
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

    .b1plus {
        width: fit-content;
        margin: 20px auto 20px auto ;
    }
 
</style>