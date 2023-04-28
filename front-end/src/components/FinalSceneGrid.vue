<template>
    <div class="scene-background" v-if="this.preparation"></div>
    <div class="scene-stage" v-else></div>
    <div class="container-scene-page">
      <div class="contenu">
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
  </div>
</template>

<script>

export default {


    data() {
        return {
            selectedImage: "",
            preparation: true,
        }
    }, 
    props: {
      elementsImages:Array,
      scenarioText:String
    },
    mounted() {
      this.startScene()
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

        let indexOfOpenBracket = this.scenarioText.data.indexOf("[");

        let indexOfCloseBracket = this.scenarioText.data.lastIndexOf("]");

        this.scenarioText.data =  this.scenarioText.data.substring(indexOfOpenBracket, indexOfCloseBracket + 1)

        let scenarioGridJson = JSON.parse(this.scenarioText.data);

        console.log(scenarioGridJson[0]["s"]);


        for (const keyScenarioGrid in scenarioGridJson[0]["s"]) {
            let value = scenarioGridJson[0]["s"][keyScenarioGrid];
            let imgCase = document.querySelector('.'+"c"+value[0]+"r"+value[1]+"img")
            for (const key in this.elementsImages) {
                if(keyScenarioGrid == this.elementsImages[key]["name"]) {
                    imgCase.setAttribute('src', this.elementsImages[key]["url"])
                }                
            }

        }

        return 'test'
      },

      async createScene() {

        let parsedScenario = JSON.parse(this.scenarioText.data);

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
      getRandomInt(max) {
        return Math.floor(Math.random() * max);
      },
      getRightImage(nameCharacterOrItem, getImgCell) {

        var images = document.getElementsByTagName('img');

        for (const key in this.elementsImages) {
                if(nameCharacterOrItem == this.elementsImages[key]["name"]) {

                    for (let i = 0; i < images.length; i++) {
                        if (images[i].src == this.elementsImages[key]["url"] && images[i].className !== "c"+getImgCell[1]+"r"+getImgCell[3]) {
                            images[i].setAttribute('src',"");
                        }
                    }

                    getImgCell.setAttribute("src", this.elementsImages[key]["url"] )
                    return this.elementsImages[key]["url"]
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

    .scene-stage {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: no-repeat url("../assets/images/Stage.png");
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