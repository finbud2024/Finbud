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
  padding: 1.25em 2.5em;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1em;
  margin: 0.25em 0.125em;
  transition-duration: 0.4s;
  cursor: pointer;
  border-radius: 0.5em;
  box-shadow: 0 0.3125em #e9e2e2;
  width: 20%;
  min-width: 100px;
}

.big-green-button:hover {
  background: linear-gradient(145deg, #45a049, #4CAF50);
}

.big-green-button:active {
  box-shadow: 0 0.125em #666;
  transform: translateY(0.25em);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .big-green-button {
    width: 80%;
    padding: 1em 1.5em;
    font-size: 0.875em;
  }
}

@media (max-width: 480px) {
  .big-green-button {
    width: 100%;
    padding: 0.75em 1em;
    font-size: 0.75em;
  }
}
</style>
