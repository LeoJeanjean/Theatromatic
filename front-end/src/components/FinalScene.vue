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
                
[{"begin": "Bebo et Hamza se tiennent devant la porte d'une maison en ruine construite il y a 2000 ans, réputée hantée."},
{"dialogue": "Je ne suis pas sûr que nous devrions entrer ici. Ça me semble dangereux.", "talkingCharacter": "Hamza"},
{"dialogue": "Ne t'inquiète pas, Hamza. J'ai entendu dire que cette maison était hantée par un fantôme inoffensif. Et puis, nous avons besoin de trouver des indices pour notre projet d'histoire.", "talkingCharacter": "Bebo"},
{"action": "Bebo ouvre la porte et entre dans la maison. Hamza hésite un moment, puis le suit."},
{"action": "Les deux amis commencent à explorer la maison. Ils remarquent des objets antiques et des peintures sur les murs."},
{"dialogue": "Je me sens observé...", "talkingCharacter": "Hamza"},
{"dialogue": "Tu imagines des choses, Hamza. Tout est calme ici.", "talkingCharacter": "Bebo"},
{"action": "Soudain, un objet tombe du plafond et Hamza se met à crier."},
{"dialogue": "Je te l'avais dit que c'était dangereux!", "talkingCharacter": "Hamza"},
{"dialogue": "Ce n'était qu'une chauve-souris, Hamza. Tu n'as pas besoin d'avoir peur.", "talkingCharacter": "Bebo"},
{"action": "Les amis continuent leur exploration et découvrent un passage secret qui mène à une pièce cachée."},
{"dialogue": "Regarde, Hamza! Il y a une vieille carte ici. C'est peut-être la clé pour trouver un trésor caché.", "talkingCharacter": "Bebo"},
{"dialogue": "Je ne suis pas sûr de vouloir chercher un trésor dans une maison hantée, Bebo.", "talkingCharacter": "Hamza"},
{"dialogue": "Allons, Hamza. C'est notre chance de devenir riches!", "talkingCharacter": "Bebo"},
{"action": "Les deux amis prennent la carte et commencent leur quête pour trouver le trésor caché. Finalement, ils trouvent un coffre rempli de pièces d'or et de pierres précieuses."},
{"dialogue": "Nous avons réussi, Hamza! Nous sommes riches!", "talkingCharacter": "Bebo"},
{"dialogue": "Je ne sais pas si ça en valait la peine. J'ai encore des frissons en pensant à cette maison hantée.", "talkingCharacter": "Hamza"},
{"Fin": "Bebo et Hamza sortent de la maison hantée avec le trésor en main. Bien qu'Hamza n'était pas convaincu de l'idée d'explorer une maison hantée, il était heureux de pouvoir partager les richesses trouvées avec son ami Bebo."}]
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
//        this.createDivText(JSON.parse(this.scenarioText)[0])
        for (let i = 1; i < JSON.parse(this.scenarioText).length - 1; i++) {
          await sleep(2000)

          this.duplicate(JSON.parse(this.scenarioText)[i])
          console.log(JSON.parse(this.scenarioText)[i]);
        }
      //  this.createDivText(scenar[scenar.length - 1])
        // create for end
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
