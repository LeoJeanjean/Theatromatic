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
      </div>
    </transition>
  </div>
</template>

<script>
export default {
    data() {
        return {
          preparation: true,
        }
    }, 
    props: {
      elementsImages:Array
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
            const row = 7;
            const col = 5
            for(let i = 0; i < row*col; i++) {
                let gridCase = document.createElement('div');
                gridCase.classList.add("case")
                container.appendChild(gridCase);
                let divimg = document.createElement('div');
                let img = document.createElement('img');
                img.setAttribute('src', "https://cdn.pixabay.com/photo/2013/07/12/19/16/battle-axe-154454_1280.png")
                //divimg.appendChild(img)
               // gridCase.appendChild(divimg)
            }
            return 'test'
        }
    }
}
</script>

<style>
@import '../assets/scene.css';
@import '../assets/curtain.css';

    img {
        width: 30%;
    }

    .contenu {
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
        border:1px solid white;
    }

    .container {
        display: grid;
        grid-row: 7;
        grid-template-columns: repeat(5, minmax(0,1fr));
        grid-gap: 0;
    }

    .container > div {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid rgb(101, 9, 175);
        width: 100%;
        height: 100%;
    }


    .case {
        border: 1px solid rgb(0, 0, 0);
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