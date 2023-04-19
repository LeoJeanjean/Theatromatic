<template>

    <div class="character">

        <h2>Personnages</h2>

        <div class="presentation-page-character">
            <img class="image-characters" src="../assets/characters.jpg" alt="">

            <CharacterForm class="character-form"/>
        </div>


    </div>

</template>

<script>


import CharacterForm from '../components/CharacterForm.vue'

export default  {
    methods: {

    },

    components: {
        CharacterForm
    },
}

</script>

<style>


    .character {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .presentation-page-character {
        display: flex;
        align-items: center;

        margin-top: 20vh;

        border: 5px solid #555;
        /* width: 50vw; */
    }

    .image-characters {
        /* height: 40vh; */
        width: 50%; 

    }


    .footer {

        text-align: center;
        border: #5e370d;
        background-color: #5e370d;
        color: aliceblue;
        height: 100px;
    }

</style>