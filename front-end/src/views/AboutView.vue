<template>
  <div class="about">
    <h1>This is an about page</h1>
    <input type="textarea" v-model="promptTextArea" />
    <button @click="this.handleClick">Click me</button>
    <div>
      <p>{{this.responseGPT}}</p>
    </div>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: "AboutView",
  data() {
    return {
      prompt: "",
      responseGPT: "",
      promptTextArea: "",
    };
  },
  methods: {
    async handleClick() {
      const response = await axios.post(
        'http://localhost:3000/gpt',
        {
          prompt: this.promptTextArea,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then((response) => {
        this.responseGPT = response.data["data"];
      })
    }
  },
};
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
