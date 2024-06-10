<template>
    <div class="global-overlay" v-if="show" @click.self="$emit('close')"></div>
  </template>
  
  <script>
  export default {
    name: 'GlobalOverlay',
    props: {
      show: Boolean,
    },
    methods: {
      close() {
      this.$emit('close');
      },
    },
  };
  </script>
  
  <style scoped>
  .global-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000; /* Ensure it covers everything */
  }
  </style>
  