<template>
  <div class="modal-overlay" v-if="show" @click.self="close">
    <div class="modal-content">
      <iframe :src="url" frameborder="0" class="modal-iframe"></iframe>
      <button class="close-button" @click="close">Close</button>
    </div>
  </div>
</template>

<script>
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
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure this is high enough */
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 800px;
  width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1001; /* Ensure this is high enough */
}

.modal-iframe {
  width: 100%;
  height: 500px;
  border: none;
  border-radius: 8px;
}

.close-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #000000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1002; /* Ensure this is high enough */
}

.close-button:hover {
  background-color: #333333;
}
</style>
