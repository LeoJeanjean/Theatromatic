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
          <button id="starter" @click="startScene()"> Commencer </button>
        </div>
        <div v-else class="contenu">
          <div class="grille"></div>
          <div class="container-speak">
              <div class="speaking-char">
                  <span class="span-speaking-char"></span>
              </div>
              <div class="text-speaking-char">
                  <span class="span-text"></span>
              </div>
          </div>
          </div>
      </transition>
  </div>
</template>

<script>
import axios from "axios";

export default {


    data() {
        return {
            scenario: `
               [{"s":{"magasin d'informatique":[2,3],"Titouan":[0,0],"Robin":[0,7]}},{"b":"Titouan et Robin ont décidé de se rendre dans un magasin d'informatique pour acheter un nouvel ordinateur. Ils se sont tous les deux levés tôt ce matin pour faire leurs achats."},{"a":"En entrant dans le magasin, Titouan est immédiatement fasciné par les lumières vives et les écrans d'ordinateurs. Robin, quant à lui, s'est dirigé directement vers l'un des employés du magasin pour demander de l'aide.","p":[0,7,"Robin"]},{"d":"Bonjour, pouvez-vous nous aider à trouver le meilleur ordinateur pour nos besoins?","t":"Robin","p":[0,7,"Robin"]},{"d":"Bien sûr, quels sont vos besoins en matière d'ordinateur?","t":"Employé du magasin","p":[2,1,"Employé du magasin"]},{"d":"Nous cherchons un ordinateur qui est rapide et efficace pour travailler sur des projets de développement informatique","t":"Robin","p":[0,7,"Robin"]},{"d":"Je suis surtout intéressé par les ordinateurs qui ont un design cool et qui peuvent jouer à des jeux vidéo","t":"Titouan","p":[0,0,"Titouan"]},{"d":"Très bien, nous avons quelques modèles que vous pourriez aimer. Suivez-moi","t":"Employé du magasin","p":[2,1,"Employé du magasin"]},{"a":"L'employé du magasin les amène dans une section de l'établissement où des ordinateurs de jeu haut de gamme sont exposés sur des étagères en verre. Titouan est immédiatement attiré par les lumières vives et les effets de couleur sur les ordinateurs","p":[1,1,"Titouan"]},{"d":"Regarde ça! Cet ordinateur a un processeur super rapide!","t":"Robin","p":[1,4,"Robin"]},{"a":"Titouan s'approche pour voir l'ordinateur que Robin a trouvé.","p":[1,3,"Titouan"]},{"d":"Qu'en penses-tu, Titouan? C'est ce que tu recherches?","t":"Robin","p":[1,4,"Robin"]},{"d":"Je ne sais pas...","t":"Titouan","p":[1,3,"Titouan"]},{"a":"Robin explique les spécifications techniques de l'ordinateur à Titouan.","p":[1,4,"Robin"]},{"d":"Je le veux! C'est parfait!","t":"Titouan","p":[1,3,"Titouan"]},{"a":"Robin se dirige vers la caisse pour acheter l'ordinateur tandis que Titouan reste en arrière pour regarder les autres ordinateurs.","p":[0,7,"Robin"]},{"a":"Titouan passe devant un écran d'ordinateur avec un jeu vidéo à l'affichage et décide de l'essayer.","p":[1,1,"Titouan"]},{"a":"Il commence à jouer et est complètement absorbé par le jeu, oubliant complètement le temps qui passe.","p":[1,1,"Titouan"]},{"d":"Bonjour monsieur, le magasin ferme dans 10 minutes, il va falloir quitter le magasin.","t":"Employé du magasin","p":[1,1,"Employé du magasin"]},{"d":"Oh désolé, j'ai perdu la notion du temps. Je vais rejoindre mon ami à la caisse","t":"Titouan","p":[1,1,"Titouan"]},{"a":"Titouan se dirige vers la caisse et rejoint Robin qui vient juste de terminer l'achat.","p":[0,7,"Robin",1,3,"Titouan"]},{"d":"Alors Titouan, as-tu trouvé quelque chose?","t":"Robin","p":[0,7,"Robin"]},{"d":"Oui, j'ai trouvé cet ordinateur de jeu super cool!","t":"Titouan","p":[1,3,"Titouan"]},{"d":"Génial, j'ai hâte de voir à quoi ça ressemble chez nous","t":"Robin","p":[0,7,"Robin"]},{"a":"Les deux amis sortent du magasin et se dirigent vers leur voiture pour rentrer chez eux avec leur nouvel ordinateur.","p":[0,7,"Robin",1,3,"Titouan"]},{"E":"Ils sont tous les deux heureux de leur nouvel achat et sont impatients de l'utiliser pour leurs projets et leurs jeux vidéo."}]
            `,
            scenarioGrid: `[{"s": {"arène": [2, 4], "Bob": [0, 1], "Jean": [4, 6]}}, {"b": "Bob et Jean se sont croisés dans une arène de combat."}, {"d": "Salut l'ami, tu as l'air d'avoir besoin d'un coup de main avec ton armure", "t": "Bob", "p": [0, 1, "Bob"]}, {"d": "Oh, merci beaucoup !", "t": "Jean", "p": [0, 6, "Jean"]}, {"a": "Bob aide Jean à réparer son armure et les deux commencent à discuter de leur passion pour la mécanique.", "p": [2, 2, "Bob"]}, {"d": "Je n'ai jamais vu un aussi bon travail d'ingénierie sur une armure, Bob. Tu es vraiment doué dans ce domaine.", "t": "Jean", "p": [4, 6, "Jean"]}, {"d": "Merci, je suis juste un bricoleur passionné.", "t": "Bob", "p": [0, 1, "Bob"]}, {"a": "Soudain, un lion s'échappe de sa cage et se dirige droit vers eux.", "p": [3, 4, null]}, {"d": "Je suis sûr que nous pouvons trouver un moyen de sortir de cette situation ensemble.", "t": "Bob", "p": [0, 1, "Bob"]}, {"d": "D'accord, je suis prêt.", "t": "Jean", "p": [4, 6, "Jean"]}, {"a": "Bob utilise son savoir-faire pour créer une arme à partir de matériaux trouvés dans l'arène, tandis que Jean l'utilise pour distraire le lion.", "p": [2, 2, null]}, {"d": "Attrape !", "t": "Jean", "p": [4, 6, "Jean"]}, {"a": "Jean lance une pierre sur le lion pour attirer son attention.", "p": [4, 6, "Jean"]}, {"a": "Bob lance l'arme improvisée vers le lion, atteignant sa cible avec précision et permettant à Jean de fuir.", "p": [0, 1, "Bob"]}, {"d": "Hé, tu as réussi ! Nous avons survécu grâce à toi, Bob.", "t": "Jean", "p": [4, 6, "Jean"]}, {"d": "C'était une équipe formidable. Nous devrions travailler ensemble à l'avenir.", "t": "Bob", "p": [0, 1, "Bob"]}, {"E": "Les deux se séparent, sachant qu'ils ont fait un ami pour la vie."}]`,
            imgs: `[{"url" : "https://cdn.pixabay.com/photo/2014/07/31/21/32/bullfight-406865_1280.jpg", "nomPersoOuItem": "arène"},{"url" : "https://cdn.pixabay.com/photo/2017/07/20/18/34/plumber-2523231_1280.png", "nomPersoOuItem": "Bob"},{"url" : "https://cdn.pixabay.com/photo/2017/06/19/06/56/arrow-2418321_1280.jpg", "nomPersoOuItem": "Jean"}]`,
            api: 'https://pixabay.com/api/?key=35717457-65a4b6adba7729f12e69b314c&safesearch=true&image_type=illustration&image_type=vector&per_page=10',
            selectedImage: "",
            preparation: true,
        }
    }, 
    methods: {
      startScene() {
        this.showTime()
        let interval = setInterval(function () {
          this.preparation = false;
          clearInterval(interval)
        }.bind(this), 5000);
        let grid = setInterval(function () {
          this.initGrid();
          clearInterval(grid)
          this.createScene();
        }.bind(this), 6000);
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
        }, 2000)
      },
      initGrid() {
        const container = document.querySelector('.grille');
        container.setAttribute("class", "grille container");
        const row = 8;
        const col = 5;
        for (let i = 0; i < row * col; i++) {
          let gridCase = document.createElement('div');
          const rowIndex = Math.floor(i / col);
          const colIndex = i % col;
          gridCase.classList.add("case")
          gridCase.classList.add("c" + colIndex + "r" + rowIndex)
          container.appendChild(gridCase);
          let divimg = document.createElement('div');
          let img = document.createElement('img');
          img.classList.add("c" + colIndex + "r" + rowIndex + "img")
          divimg.appendChild(img)
          gridCase.appendChild(divimg)
        }

        // {"s": {"arène": [2, 4], "Bob": [0, 1], "Jean": [4, 6]}}

        let scenarioGridJson = JSON.parse(this.scenarioGrid);

        console.log(scenarioGridJson[0]["s"]);


        for (const keyScenarioGrid in scenarioGridJson[0]["s"]) {
            let value = scenarioGridJson[0]["s"][keyScenarioGrid];
            let imgCase = document.querySelector('.'+"c"+value[0]+"r"+value[1]+"img")
            for (const key in JSON.parse(this.imgs)) {
                if(keyScenarioGrid == JSON.parse(this.imgs)[key]["nomPersoOuItem"]) {
                    imgCase.setAttribute('src', JSON.parse(this.imgs)[key]["url"])
                }                
            }

        }

        return 'test'
      },

      async createScene() {

        let parsedScenario = JSON.parse(this.scenarioGrid);

        let charcterSpeech = document.querySelector('.span-text');
        let characterText = document.querySelector('.span-speaking-char');

        const sleep = (milliseconds) => {
          return new Promise(resolve => setTimeout(resolve, milliseconds))
        }

        const itemOrCharcater = parsedScenario[0]["s"];

        characterText.innerHTML = ""
        charcterSpeech.innerHTML = parsedScenario[1]["b"];

        await sleep(2000)


        for (let i = 2; i < parsedScenario.length - 1; i++) {

          const scenarioLine = parsedScenario[i];

          if (scenarioLine["d"]) {

            if (scenarioLine["p"]) {
                
              let getImgCell = document.querySelector('.c' + scenarioLine["p"][0] + "r" + scenarioLine["p"][1] + "img")
              this.getRightImage(scenarioLine["p"][2],getImgCell)
              
            }
            characterText.innerHTML = scenarioLine["t"];
            charcterSpeech.innerHTML = scenarioLine["d"];
            await sleep(2000)
          } else {
            if (scenarioLine["p"]) {
              let getImgCell = document.querySelector('.c' + scenarioLine["p"][0] + "r" + scenarioLine["p"][1] + "img")
              this.getRightImage(scenarioLine["p"][2],getImgCell)
            }
            characterText.innerHTML = "";
            charcterSpeech.innerHTML = scenarioLine["a"];
            await sleep(2000)
          }
        }
        characterText.innerHTML = ""
        charcterSpeech.innerHTML = parsedScenario[parsedScenario.length - 1]["E"];


      },
      searchImage(sText, imgCell) {

        axios.get(this.api + '&q=' + encodeURIComponent(sText))
            .then(response => {
              let images = response.data.hits
              this.selectedImage = images[this.getRandomInt(10)]["largeImageURL"];
              imgCell.setAttribute("src", this.selectedImage)
            })
            .catch(error => {
              console.log(error)
            })

      },
      getRandomInt(max) {
        return Math.floor(Math.random() * max);
      },
      getRightImage(nameCharacterOrItem, getImgCell) {

        var images = document.getElementsByTagName('img');

        for (const key in JSON.parse(this.imgs)) {
                if(nameCharacterOrItem == JSON.parse(this.imgs)[key]["nomPersoOuItem"]) {

                    for (let i = 0; i < images.length; i++) {
                        if (images[i].src == JSON.parse(this.imgs)[key]["url"] && images[i].className !== "c"+getImgCell[1]+"r"+getImgCell[3]) {
                            images[i].setAttribute('src',"");
                        }
                    }

                    getImgCell.setAttribute("src", JSON.parse(this.imgs)[key]["url"] )
                    return JSON.parse(this.imgs)[key]["url"]
                }                
            }
        return null

    }
    }
}
</script>

<style>
@import '../assets/scene.css';
@import '../assets/curtain.css';

    .container-speak {
        width: 80%;
    }

    .text-speaking-char {
        border:solid 2px #000;
        height: 20vh;
        margin-top: 30px;
    }

    img {
        width: 30%;
    }

    .contenu {
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 50px;
        height: 100%;
    }

    .container-scene {
        width: 100%;
        height: 100%;
        padding: 5% 3% 3% 3% ;
    }

    .grille {
        display: flex;
        flex-wrap: wrap;
        border: 1px solid #000;
        width: 75%;
        height: 66%;
        margin: 0 auto;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }

    .grille > div {
        flex: 1 1 80px;
    }

    .container {
        display: grid;
        grid-row: 8;
        grid-template-columns: repeat(5, minmax(0,1fr));
        grid-gap: 0;
    }

    .container > div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }


    .case {

        width: 14%;
        height: 13%;
    }

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