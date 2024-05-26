<template>
  <button class="big-green-button" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BigGreenButton',
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
};
</script>

<style scoped>
.big-green-button {
  background: linear-gradient(145deg, #20ed2b, #47a24a);
  border: none;
  color: white;
  padding: 20px 40px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-family: 'Space Grotesk', sans-serif;
  margin: 4px 2px;
  transition-duration: 0.4s;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 5px #e9e2e2;
}

.big-green-button:hover {
background: linear-gradient(145deg, #45a049, #4CAF50);
}

.big-green-button:active {
  box-shadow: 0 2px #666;
  transform: translateY(4px);
}
</style>
