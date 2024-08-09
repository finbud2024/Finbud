<template>
    <div>
      <h2>Images</h2>
      <div v-for="image in images" :key="image.link" class="image">
        <h3>{{ image.title }}</h3>
        <img :src="image.link" :alt="image.title" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      images: {
        type: Array,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .image {
    margin-bottom: 10px;
  }
  </style>
  