<template>
    <div class="contenu">
        <div class="grille"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    }, 
    methods: {
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
        }
    }, 
    mounted() {
        this.initGrid();
    }
}
</script>

<style>

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