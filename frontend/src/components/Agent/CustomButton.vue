<template>
  <button
    :class="['custom-button', buttonClass]"
    @click="handleClick"
  >
    {{ text }}
    <span v-if="icon" :class="'icon-' + icon"></span>
  </button>
</template>

<script>
export default {
  name: 'CustomButton',
  props: {
    text: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: null
    },
    buttonClass: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.custom-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  border-radius: 20px;
  padding: 10px 20px;
}

.custom-button:hover {
  opacity: 0.9;
}

.icon-arrow-right::after {
  content: '→';
  margin-left: 5px;
}
</style>