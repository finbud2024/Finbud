<template>
  <div class="modal-overlay" v-if="show" @click.self="close">
    <div class="modal-content">
      <span class="close-button" @click="$emit('close')">&times;</span>
      <iframe :src="url" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script>screenLeft
export default {
  name: 'Modal',
  props: {
    show: Boolean,
    url: String,
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    height: 80%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 24px;
    cursor: pointer;
  }

  iframe {
    width: 100%;
    height: 100%;
  }
  </style>