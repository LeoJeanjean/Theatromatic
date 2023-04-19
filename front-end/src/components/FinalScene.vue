<template>

  <div class="background-final-scene"></div> 
  <div class="container-final-scene">
    <h1>Dialog</h1>
    <div class="speaking-char">
      <div class="text" id="text-id">
        <svg class="corner" viewBox="0 0 65 62" fill="none" xmlns="http://www.w3.org/2000/svg">
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        i: 0,
        original: null,
        speeds: {
          pause: 500,
          slow: 120,
          normal: 90,
          fast: 40,
          superFast: 10
        },
        textLines: [
          {speed: 10, string: "Oh, hello!", character: "Tom"},
          {speed: 10, string: "Oh, hello!", character: "Tom"},
          {speed: 10, string: "Oh, hello!", character: "Tom"},
          {speed: 10, string: "Oh, hello!", character: "Tom"},
          {speed: 10, string: "Have you seen my pet frog around?", character: "Sasha"},
          {speed: 10, string: "No", classes: ["green"], character: "Tom"},
          {speed: 10, string: "Ok", character: "Sasha"}
        ]
      }
    },
    methods : {
      async duplicate(text, character) { 

        var clone = this.original.cloneNode(true);
        clone.id = "duplicater" + ++this.i;


        let speakingCharacter = document.createElement('div');
        speakingCharacter.innerText = character;
        speakingCharacter.classList.add("character-talking");
        document.querySelector('.speaking-char').appendChild(speakingCharacter)

        let divText = document.createElement('div');

        divText.innerText = text;
        clone.appendChild(divText);
        clone.style.display = "inherit"
        this.original.parentNode.appendChild(clone);
      },


      async timeSensativeAction() {
        const sleep = (milliseconds) => {
          return new Promise(resolve => setTimeout(resolve, milliseconds))
        }

        for (let i = 0; i < this.textLines.length; i++) {
          await sleep(2000)
          this.duplicate(this.textLines[i].string, this.textLines[i].character)
        }
        await sleep(1000)
      }
  },mounted() {
      this.original = document.getElementById('text-id')
      this.timeSensativeAction();
    }
  }

</script>

<style>
  @import '../assets/curtain.css';
  .background-final-scene {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: url("../assets/stage.jpeg");
    background-repeat: no-repeat;
    background-size: cover;
  }

  .container-final-scene {
    padding: 20px;
  }
</style>
