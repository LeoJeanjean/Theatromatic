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
        scenarioText: `
        [{"begin": "Luc était un bosseur et un rêveur qui travaillait dur pour réaliser ses aspirations."},
{"action": "Il se levait tôt chaque matin pour aller à la salle de sport avant de se rendre à son travail dans une entreprise de technologie en plein essor."},
{"dialogue": "Salut Luc, tu as l'air fatigué ce matin. Tu as passé une mauvaise nuit ?", "talkingCharacter": "Louis"},
{"dialogue": "Non, je suis juste un peu stressé. J'ai une grande présentation aujourd'hui et j'espère que tout ira bien.", "talkingCharacter": "Luc"},
{"action": "Luc passa la journée à travailler sur sa présentation, révisant chaque détail plusieurs fois pour s'assurer qu'il n'oublierait rien."},
{"dialogue": "Luc, ta présentation était incroyable ! Tu as vraiment impressionné tout le monde dans la salle.", "talkingCharacter": "Stéphanie"},
{"dialogue": "Merci beaucoup Stéphanie, je suis content que tout ait bien marché.", "talkingCharacter": "Luc"},
{"dialogue": "Hé les gars, regardez ça !", "talkingCharacter": "Jean"},
{"action": "Jean montra un article sur son téléphone portable qui annonçait qu'un petit garçon était coincé dans un arbre près de l'entreprise."},
{"dialogue": "Nous devons faire quelque chose pour aider ce garçon !", "talkingCharacter": "Jean"},
{"dialogue": "Je suis d'accord, allons-y tout de suite !", "talkingCharacter": "Luc"},
{"action": "Ils coururent tous ensemble vers l'arbre où le garçon était coincé."},
{"dialogue": "Ne t'inquiète pas petit gars, nous allons te sortir de là.", "talkingCharacter": "Jean"},
{"action": "Jean grimpa à l'arbre et aida le garçon à descendre en toute sécurité."},
{"dialogue": "Merci beaucoup les gars, vous êtes des héros !", "talkingCharacter": "Le petit garçon"},
{"Fin": "Luc réalisa qu'il pouvait être à la fois un bosseur et un rêveur tout en étant un héros pour quelqu'un d'autre."}]

          `,
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
   
      async duplicate(completeScenario) { 

        var clone = this.original.cloneNode(true);
        clone.id = "duplicater" + ++this.i;

        if (completeScenario["dialogue"]) {
          let speakingCharacter = document.createElement('div');
          speakingCharacter.innerText = completeScenario["talkingCharacter"];
          speakingCharacter.classList.add("character-talking");
          document.querySelector('.speaking-char').appendChild(speakingCharacter)

          let divText = document.createElement('div');

          divText.innerText = completeScenario["dialogue"];
          clone.appendChild(divText);
          clone.style.display = "inherit"
          this.original.parentNode.appendChild(clone);
        } else {

          let divActionText = document.createElement('div');

          divActionText.innerText = completeScenario["action"];
          clone.appendChild(divActionText);
          clone.style.display = "inherit"
          this.original.parentNode.appendChild(clone);
        }
        
      },

      async createDivText(completeScenario) {
        var clone = this.original.cloneNode(true);

        let divText = document.createElement('div');
        
        if (completeScenario["begin"]) {
          divText.innerText = completeScenario["begin"];  
        } else {
          divText.innerText = completeScenario["Fin"];
        }
        
        clone.appendChild(divText);
        clone.style.display = "inherit"
        this.original.parentNode.appendChild(clone);
      },

      async timeSensativeAction() {
        const sleep = (milliseconds) => {
          return new Promise(resolve => setTimeout(resolve, milliseconds))
        }

        let scenar = JSON.parse(this.scenarioText); 

        console.log(JSON.parse(this.scenarioText));
        this.createDivText(JSON.parse(this.scenarioText)[0])
        for (let i = 1; i < JSON.parse(this.scenarioText).length - 1; i++) {
          await sleep(2000)

          this.duplicate(JSON.parse(this.scenarioText)[i])
          console.log(JSON.parse(this.scenarioText)[i]);
        }
        this.createDivText(scenar[scenar.length - 1])

        await sleep(1000)
      }

  },mounted() {
      this.original = document.getElementById('text-id')      
      this.timeSensativeAction();
      console.log(JSON.parse(this.scenarioText));
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
