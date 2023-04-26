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
            scenario: `FIREPLACE,1(2;2)#TABLES,4(3;6)(7;6)(3;11)(7;11)#

(Scene starts with Bebo and Jeanne entering the Inn, they look around and head towards a table near the fireplace)

@BEBO#RT#7;4#Finally, we found shelter for the night.
@JEANNE#LT#3;4#Don't get too comfortable, Bebo. We're still in enemy territory.
@BEBO#RT#7;4#Pfft, nothing can stand in my way. Not even those damn orcs.
@JEANNE#LT#3;4#You're going to get us killed, Bebo. We need to be cautious.
@BEBO#RT#7;4#I'm not afraid of anything. Bring on the danger!

(The Innkeeper approaches their table)

@INNKEEPER#RT#9;8#What can I get for you, travelers?
@JEANNE#LT#3;4#Just some water for me, please.
@BEBO#RT#7;4#Ale for me. Make it two!

(The Innkeeper nods and leaves to get their order. As they wait, a group of orcs enters the Inn and heads towards their table)

@ORC_LEADER#RT#7;14#Well, well, well. Look who we have here.
@BEBO#RT#7;4#I was wondering when you cowards would show up.
@JEANNE#LT#3;4#Bebo, please, let's just leave.

(The orcs draw their weapons and surround Bebo and Jeanne)

@ORC_LEADER#RT#7;14#Hand over the witch, and we'll let you live.
@BEBO#RT#7;4#You'll have to go through me first!

(A fight ensues between Bebo and the orcs. Bebo fights bravely but is outnumbered. Jeanne uses her magic to help him)

@JEANNE#LT#3;4#Take this, you foul creatures!

(Jeanne casts a spell, and the orcs are knocked out. Bebo looks at her with admiration)

@BEBO#RT#7;4#You saved my life, Jeanne. I won't forget this.
@JEANNE#LT#3;4#Let's go. We need to keep moving.

(Bebo and Jeanne exit the Inn, leaving the unconscious orcs behind)

#END_SCENE`,
                        wholeScenario: []

        }
    }, 
    methods: {
        initGrid() {
            const container = document.querySelector('.grille');
            container.setAttribute("class", "grille container");
            const row = 16;
            const col = 10;
            for(let i = 0; i < row*col; i++) {
                let gridCase = document.createElement('div');
                const rowIndex = Math.floor(i / col);
                const colIndex = i % col;
                // console.log(rowIndex, colIndex);
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
        parseScene(sceneText) {
            const lines = sceneText.split("@");
            return lines;
        },
        parseScenario() {
            const scenes = this.parseScene(this.scenario);
            const scenes2 = [];
            scenes.forEach(element => {
                if(scenes.indexOf(element) === 0){
                    element.split("(").forEach(element => {
                        var elt = element;
                        elt.replace("\n", "");
                        elt.replace(")", "");
                        const eltArray = elt.split("#");
                        scenes2.push(eltArray);
                        console.log(scenes2);
                    })
                    var elt = element.split("#")
                    scenes2.push(elt);
                }else{
                    element.split("(").forEach(element => {
                        var elt = element;
                        elt.replace("\n", "");
                        elt.replace(")", "");
                        const eltArray = elt.split("#");
                        scenes2.push(eltArray); 
                    })
                }; 
            });
            console.log(scenes2);

            this.createText(scenes2);
        },
        createText(scenesScript) {


            let bool = false;
            let k  = 0;
            let firstSetupNumber;


            
            for (let index = 0; index < scenesScript.length; index++) {
                const element = scenesScript[index];

                if (element.length == 1 && element.includes(",")) {
                    console.log("innnn");
                    let firstSetup = element.split(',');
                    firstSetupNumber = parseInt(firstSetup[1]);
                    bool = true;
                }
                console.log(firstSetupNumber);

                if (bool) {
                    k++;
                }
            }



            for (let index = 0; index < scenesScript.length; index++) {
                const element = scenesScript[index];

                if (element.length == 4) {

                    let characterSpeaking = {
                        speakingChar : element[0],
                        position: element[2],
                        text: element[3]
                    }

                    this.wholeScenario.push(characterSpeaking)

                } else if (element.length == 1) {

                    if (/[a-z]/.test(element[0])) {
                        let narration = {
                            speakingChar : null,
                            text: element[0]
                        }
                        this.wholeScenario.push(narration)
                    } else {
                        // console.log('The string does not contain any lowercase characters.');
                    }

                }                
            }

        console.log(this.wholeScenario);
        },
        async createScene() {
            let speakingCharText = document.querySelector('.span-speaking-char')
            let spanText = document.querySelector('.span-text');

            const sleep = (milliseconds) => {
                return new Promise(resolve => setTimeout(resolve, milliseconds))
            }

            for (let index = 0; index < this.wholeScenario.length; index++) {
                
                const element = this.wholeScenario[index];
                let getCell;
                let getImgCell;
                if (element["position"]) {
                    let splitPos = element["position"].split(";")
                    getCell = document.querySelector('.c'+ splitPos[0] + "r" + splitPos[1]);
                    getImgCell = document.querySelector('.c'+ splitPos[0] + "r" + splitPos[1] + "img");                   
                    getImgCell.setAttribute('src', "https://pixabay.com/get/g9c0ad61b74493d09df7e320ecfe090126a53e7b3184d1ceac6892d7e0543938710e49bb05c3e13854109133b69793d40ed74781c3876ecd8f6f9e83ff3e88c9e_1280.png");
                }
                speakingCharText.innerHTML = element["speakingChar"];
                spanText.innerHTML = element["text"];
                await sleep(2000)

            }
        }
        


    }, 
    mounted() {
        this.initGrid();
        this.parseScenario();
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
        grid-row: 16;
        grid-template-columns: repeat(10, minmax(0,1fr));
        grid-gap: 0px;
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

</style>