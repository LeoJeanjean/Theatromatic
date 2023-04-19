<template>
  <div class="background" v-if="this.preparation"></div>
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
          <FinalScene v-else/>
      </transition>
    </div>
</template>

<script>

  import FinalScene from "../components/FinalScene.vue";

  export default {
    data() {
      return {
        statementIsTrue: true,
        preparation: true,
        self: this
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
        titleScene.innerHTML = "Ma pièce"
        setTimeout(function () {
          starter.style.display = 'none';
        }, 2000);
      }
    },

    components: {
      FinalScene
    },
    mounted() {
      this.setup();
    }  
  }

</script>

<style>
  @import '../assets/scene.css';

  .container-scene-page {
    width: 100%;
    height: 100%;
  }

  .background {
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
