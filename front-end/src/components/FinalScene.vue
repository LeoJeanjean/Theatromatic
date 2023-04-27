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
          superFast: 10,
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
    props: {
      scenarioText:String
    },
    methods : {
   
      async duplicate(completeScenario) { 

        var clone = this.original.cloneNode(true);
        clone.id = "duplicater" + ++this.i;

        if (completeScenario["d"]) {
          let speakingCharacter = document.createElement('div');
          speakingCharacter.innerText = completeScenario["t"];
          speakingCharacter.classList.add("character-talking");
          document.querySelector('.speaking-char').appendChild(speakingCharacter)

          let divText = document.createElement('div');

          divText.innerText = completeScenario["d"];
          clone.appendChild(divText);
          clone.style.display = "inherit"
          this.original.parentNode.appendChild(clone);
  
        } else {

          let divActionText = document.createElement('div');

          divActionText.innerText = completeScenario["a"];
          clone.appendChild(divActionText);
          clone.style.display = "inherit"
          this.original.parentNode.appendChild(clone);
        }
        this.original.parentNode.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      },

      async createDivText(completeScenario) {
        var clone = this.original.cloneNode(true);

        let divText = document.createElement('div');
        
        if (completeScenario["b"]) {
          divText.innerText = completeScenario["b"];
        } else {
          divText.innerText = completeScenario["E"];
        }
        
        clone.appendChild(divText);
        clone.style.display = "inherit"
        this.original.parentNode.appendChild(clone);
        this.original.parentNode.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      },

      async timeSensativeAction() {
        const sleep = (milliseconds) => {
          return new Promise(resolve => setTimeout(resolve, milliseconds))
        }

        let indexOfOpenBracket = this.scenarioText.data.indexOf("[");

        let indexOfCloseBracket = this.scenarioText.data.lastIndexOf("]");

        this.scenarioText.data =  this.scenarioText.data.substring(indexOfOpenBracket, indexOfCloseBracket + 1)


        let scenar = JSON.parse(this.scenarioText.data);

        this.createDivText(scenar[1])
        for (let i = 2; i < scenar.length - 1; i++) {
          await sleep(2000)

          this.duplicate(scenar[i])
        }
        this.createDivText(scenar[scenar.length - 1])

        await sleep(1000)
      }

  },mounted() {
      this.original = document.getElementById('text-id')      
      this.timeSensativeAction();
      console.log(JSON.parse(this.scenarioText.data));
      let persoList = JSON.parse(localStorage.getItem("persoList"));
      console.log(persoList);
      let detailScenario = "";
      for(let i = 0; i < persoList.length; i++ ) {
        console.log(persoList[i]["name"]);
        detailScenario += persoList[i]["name"] + ": " + persoList[i]["gender"] + ", " + persoList[i]["job"] + ", "  + persoList[i]["characteristics"] + ". "
      }
      detailScenario += "\n" + localStorage.getItem("script");

      this.chatGptRequest += "\n" + detailScenario;

      console.log(this.chatGptRequest);
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
