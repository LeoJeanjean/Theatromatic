<template>
  <div class="scene-background" v-if="this.preparation"></div>
  <div class="container-scene-page">
    <transition name="fade">
      <div class="container-curtain" v-if="this.preparation">
        <div id="scene">
          <div id="curtain">
            <h3 class="title-scene">Préparation</h3>
            <div class="ground"></div>
            <div class="left"></div>
            <div class="right"></div>
          </div>
        </div>
        <button id="starter" :disabled="disabled" @click="startScene()"> Commencer </button>
      </div>
      <div v-else>
        <FinalScene v-if="this.sceneType=='dialog'" :scenarioText="reponseString" />
        <FinalSceneGrid v-if="this.sceneType=='grid'" :scenarioText="reponseString" :elementsImages="elementsImages"/>
      </div>
    </transition>
  </div>
</template>

<script>

import FinalScene from "../components/FinalScene.vue";
import FinalSceneGrid from "../components/FinalSceneGrid.vue";
import axios from "axios";
  export default {
    data() {
      return {
        statementIsTrue: true,
        preparation: true,
        self: this,
        disabled: true,
        elements: [],
        personnages: [],
        elementsImages: [],
        sceneType: localStorage.getItem('sceneType'),
        urlImages: 'https://pixabay.com/api/?key=35717457-65a4b6adba7729f12e69b314c&safesearch=true&image_type=vector&per_page=3',
        finalString: `Je vais te donner un resume de texte et un ou plusieurs personnage avec des paramètre a respecter . Ecris moi un scenario en une seule ligne impliquant ces personnages et le resume, sous la forme JSON valide suivante: [ {"s":  {nom du/des item(s) entre 1 et 3 et leurs nombres si plusieurs et la position initial des personnages si ils sont là dès le debut par exemple table: position dans une grille de 5 (0 à 4) par 8 (0 à 7)  },{ "b" : phrase introductive }, { "d":  replique du personnage qui parle  sans mettre son nom pour renseigner qu'il parle, "t" : nom du personnage qui parle  si il n'y en a pas car il s'agit jute d'une action mettre null, "a": action n'impliquant pas les répliques de personnages s'il y en a, "p": [position du personnage dans une grille de 5 (0 à 4) par 8 (0 à 7)  il ne peut y avoir 2 elements dans la meme position, nom du personnage positionne] comme [1,2,Bebo]}, répéter sur ce même model à chaque fois que quelque chose de nouveau arrive comme action ou personnage prenant la parole, {"E": texte de fin} ]. Un seul personnage peut se déplacer à la fois.
Exemple: Bebo: grand, bête, brave, guerrier. Jeanne: petite, feroce, sorciere. Ils se battent dans un bar.[{"s": {"table": [2, 5], "Bebo": [0, 2], "Jeanne": [4, 5]}}, {"b": "Bebo et Jeanne se sont rencontrés dans un bar mal famé."},{"d": "Je vais te casser en deux, petit morceau de viande !", "t": "Bebo", "p": [0, 2, "Bebo"]},{"d": "Je ne suis pas si facilement brisable, gros tas de muscles.", "t": "Jeanne", "p": [4, 5, "Jeanne"]},{"a": "Bebo charge Jeanne avec toute sa force, mais Jeanne utilise sa magie pour le faire tomber par terre.", "p": [2, 2, null]},{"d": "Je suis impressionné, tu es plus forte que tu n'en as l'air.", "t": "Bebo", "p": [2, 2, "Bebo"]},{"d": "Tu as sous-estimé mes pouvoirs, Bebo.", "t": "Jeanne", "p": [4, 5, "Jeanne"]},{"a": "Bebo et Jeanne continuent à se battre, mais finalement Jeanne l'emporte avec un sortilège qui le transforme en souris.", "p": [2, 2, null]},{"d": "C'est terminé, Bebo. Tu n'es plus qu'un petit rongeur maintenant.", "t": "Jeanne", "p": [4, 5, "Jeanne"]},{"d": "Je me vengerai, sorcière !", "t": "Bebo (sous forme de souris)", "p": [2, 2, "Bebo"]},{"a": "Jeanne attrape Bebo-souris et le met dans sa poche, fière de sa victoire.", "p": [4, 5, "Jeanne"]},{"E": "Jeanne sort triomphante du bar, sachant qu'elle a montré sa force à tous les clients présents."}]
Exemple plus long: `,
        reponseString:''
      };
    },
    methods: {
      setup() {
        document.body.addEventListener('onload', focus());
      },
        startScene() {
        this.showTime()
        let interval = setInterval(function () {
          this.preparation = false;
          clearInterval(interval)
        }.bind(this), 5000);
      },
      showTime() {
        var curtain = document.getElementById("curtain");
        curtain.className = "open";

        var scene = document.getElementById("scene");
        scene.className = "expand";

        var starter = document.getElementById("starter");
        starter.className = "fade-out";

        let titleScene = document.querySelector('.title-scene');
        titleScene.innerHTML = localStorage.getItem('name')
        setTimeout(function () {
          starter.style.display = 'none';
        }, 2000);
      },
      async getScenarioResponse() {

        JSON.parse(localStorage.getItem('persoList')).forEach((element) => {
         this.finalString += element.name + ': ' + element.characteristics + ", " + element.job + ", " + element.gender + ". "

         const elt = {url: element.choosenImageUrl, name: element.name}
         this.elementsImages.push(elt)
         this.personnages.push(element.name)
        })

        this.finalString += localStorage.getItem('script') 
    
        await axios.post(
          'http://localhost:3000/gpt',
          {
            prompt: this.finalString
          },
      ).then((response) => {
        this.reponseString = response.data;
        this.getImagesOfElements()
        //console.log(this.reponseString);
      })
      },
      getImagesOfElements (){     // Donc on prends reponseString[0]["s"] et on stocke chaque clé comme nom dans le tableau "elements"

        let indexOfOpenBracket = this.reponseString.data.indexOf("[");
        let indexOfCloseBracket = this.reponseString.data.lastIndexOf("]");
        this.reponseString.data =  this.reponseString.data.substring(indexOfOpenBracket, indexOfCloseBracket + 1)
        let scenar = JSON.parse(this.reponseString.data); 

        //console.log(scenar[0]);
        //this.disabled = false;
      
        Object.keys(scenar[0].s).forEach(element => {
          console.log(element)
          if(!this.personnages.includes(element)){
            this.elements.push(element)
          }
        });
      
        this.elements.forEach(element => {
          axios.get(this.urlImages+'&q='+element)
          .then(response=>{
            this.images = response.data.hits
            var elt = {url: this.images[0].largeImageURL, name: element}
            this.elementsImages.push(elt)
          })
          .catch(error=>{
            console.log(error)
          })
        });
        console.log(this.elementsImages)
        this.disabled = false;
      },
    },
    components: {
      FinalScene,
      FinalSceneGrid
    },
    mounted() {
      if (localStorage.getItem("user") == null) {
            this.$router.push('/login')
      }
      this.setup();
      console.log(localStorage.getItem('script'));
      console.log(JSON.parse(localStorage.getItem('persoList')));
      console.log(this.sceneType);
      console.log(this.sceneType=='grid');

      this.getScenarioResponse();
    },
    beforeUnmount() {
      localStorage.removeItem('script')
      localStorage.removeItem('persoList')
    }
  }

</script>

<style>
  @import '../assets/scene.css';

  .container-scene-page {
    width: 100%;
    height: 100%;
  }

  .scene-background {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: radial-gradient(circle at 24.1% 68.8%, rgb(50, 50, 50) 0%, rgb(0, 0, 0) 99.4%); 
  }
  .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
