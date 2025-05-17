<template>
  <div class="search-input-container" :class="{ focused: isFocused }">
    <input
      type="text"
      class="search-input"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup.enter="$emit('search')"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
  </div>
</template>

<script>
export default {
  name: "SearchInput",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "What do you want to learn today...",
    },
  },
  emits: ["update:modelValue", "search"],
  data() {
    return {
      isFocused: false,
    };
  },
};
</script>

<style scoped>
.search-input-container {
  width: 100%;
  max-width: 1000px;
  margin: 10px auto;
  padding: 0.5rem;
  border-radius: 50px;
  background: linear-gradient(135deg, #ffffff 0%, #d6e4ff 100%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
}

.search-input-container:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.search-input-container.focused {
  box-shadow: 0 8px 25px rgba(100, 180, 245, 0.15);
}

.search-input {
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  color: #546880;
  background: transparent;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
}

.search-input::placeholder {
  color: #546880;
  font-style: italic;
}

@media (max-width: 640px) {
  .search-input-container {
    max-width: 90%;
  }

  .search-input {
    padding: 0.8rem 1.2rem;
    font-size: 0.9rem;
  }
}
</style>
