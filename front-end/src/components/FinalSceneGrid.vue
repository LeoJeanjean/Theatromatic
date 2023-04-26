<template>
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
</template>

<script>
export default {
    data() {
        return {
            scenario: `
            [{"s": {"Bebo": [0, 3], "Jeanne": [4, 3]}}, {"b": "Bebo et Jeanne se font face, prêts à se battre."}, {"d": "Je vais te battre sans aucune difficulté !", "t": "Bebo", "p": [0, 3, "Bebo"]}, {"d": "Je ne crains personne, je suis la plus puissante des sorcières !", "t": "Jeanne", "p": [4, 3, "Jeanne"]}, {"a": "Bebo s'élance vers Jeanne pour l'attaquer.", "p": [0, 3, "Bebo"]}, {"a": "Jeanne lève sa baguette magique et lance un sortilège sur Bebo.", "p": [4, 3, "Jeanne"]}, {"d": "Aïe ! Qu'est-ce que tu m'as fait ?!", "t": "Bebo", "p": [0, 3, "Bebo"]}, {"d": "Je t'avais prévenu, tu n'es pas de taille contre moi !", "t": "Jeanne", "p": [4, 3, "Jeanne"]}, {"E": "Bebo s'enfuit, vaincu, laissant Jeanne triomphante."}]
            `
        }
    }, 
    methods: {
        initGrid() {
            const container = document.querySelector('.grille');
            container.setAttribute("class", "grille container");
            const row = 8;
            const col = 5;
            for(let i = 0; i < row*col; i++) {
                let gridCase = document.createElement('div');
                const rowIndex = Math.floor(i / col);
                const colIndex = i % col;
                gridCase.classList.add("case")
                gridCase.classList.add("c"+colIndex +"r"+rowIndex )
                container.appendChild(gridCase);
                let divimg = document.createElement('div');
                let img = document.createElement('img');
                img.setAttribute('src', "") // https://cdn.pixabay.com/photo/2013/07/12/19/16/battle-axe-154454_1280.png
                img.classList.add("c"+colIndex +"r"+rowIndex+"img")
                divimg.appendChild(img)
                gridCase.appendChild(divimg)
            }
        },
            
        async createScene() {

            let parsedScenario = JSON.parse(this.scenario);
            console.log(parsedScenario);

            let charcterSpeech = document.querySelector('.span-text');
            let characterText = document.querySelector('.span-speaking-char');

            const sleep = (milliseconds) => {
                return new Promise(resolve => setTimeout(resolve, milliseconds))
            }

            // {"s": {"Bebo": [0, 3], "Jeanne": [4, 3]}}


    
            // TODO : check if it is a character or item

            console.log(parsedScenario[0]);
            const itemOrCharcater = parsedScenario[0]["s"];
            console.log(itemOrCharcater);

            for (let j = 0; j  < Object.keys(itemOrCharcater).length; j++) {
                const element = Object.keys(itemOrCharcater)[j];
                console.log(itemOrCharcater[element]);
                let getImgCell = document.querySelector('.c'+itemOrCharcater[element][0]+"r"+itemOrCharcater[element][1]+"img")
                getImgCell.setAttribute("src", "https://cdn.pixabay.com/photo/2023/04/24/02/51/crimson-rosella-7947000_1280.jpg")
                
            }
                
            console.log(Object.keys(itemOrCharcater));


            // {"b": "Bebo et Jeanne se font face, prêts à se battre."}
            // {"E": "Bebo s'enfuit, vaincu, laissant Jeanne triomphante."}


            charcterSpeech.innerHTML = parsedScenario[1]["b"];
           
            await sleep(2000)


            for (let i = 2; i < parsedScenario.length - 1 ; i++) {
                
                const scenarioLine = parsedScenario[i];
                
                console.log();
                if (scenarioLine["d"]) {
                    // {"d": "Je vais te battre sans aucune difficulté !", "t": "Bebo", "p": [0, 3, "Bebo"]}
                    if (scenarioLine["p"]){ 
                        let getImgCell = document.querySelector('.c'+scenarioLine["p"][0]+"r"+scenarioLine["p"][1]+"img")
                        getImgCell.setAttribute("src", "https://cdn.pixabay.com/photo/2013/07/12/19/16/battle-axe-154454_1280.png")
                    }


                    characterText.innerHTML = scenarioLine["t"];
                    charcterSpeech.innerHTML = scenarioLine["d"];
                
                    
                    await sleep(2000)

                    // {"d": "Je n'en suis pas si sûre, Bebo. Mes pouvoirs de sorcière sont puissants aujourd'hui!", "t": "Jeanne", "p": [4, 7, "Jeanne"]},
                    // {"a": "Bebo appuie frénétiquement sur les boutons de sa manette tandis que Jeanne agite sa baguette magique en faisant des incantations."},

                    // <div class="container-speak">
                    //     <div class="speaking-char">
                    //         <span class="span-speaking-char"></span>
                    //     </div>
                    //     <div class="text-speaking-char">
                    //         <span class="span-text"></span>
                    //     </div>
                    // </div>



                } else {
                    //                           {"a": "Jeanne esquive l'attaque de Bebo et lui jette un sort.", "p": [0, 5, "Jeanne"]},
                    if (scenarioLine["p"]){ 
                        let getImgCell = document.querySelector('.c'+scenarioLine["p"][0]+"r"+scenarioLine["p"][1]+"img")
                        getImgCell.setAttribute("src", "https://cdn.pixabay.com/photo/2013/07/13/11/43/boxing-158519_1280.png")
                    } 
                    
                    characterText.innerHTML = "";
                    charcterSpeech.innerHTML = scenarioLine["a"];
                    
                    await sleep(2000)
                }



                
            }

            charcterSpeech.innerHTML = parsedScenario[parsedScenario.length -1]["E"];


        }
        


    }, 
    mounted() {
        this.initGrid();
        this.createScene();
    }
}
</script>

<style>

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
        border:1px solid white;
    }

    .container {
        display: grid;
        grid-row: 8;
        grid-template-columns: repeat(5, minmax(0,1fr));
        grid-gap: 0px;
    }

    .container > div {
        display: flex;
        justify-content: center;
        align-items: center;
        /* border: 1px solid rgb(101, 9, 175); */
        width: 100%;
        height: 100%;
    }


    .case {
        border: 1px solid rgb(0, 0, 0);
        width: 14%;
        height: 13%;
    }

</style>