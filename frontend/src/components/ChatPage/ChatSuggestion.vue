<template>
  <div class="suggestion-bar">
    <div class="suggestion-scroll">
      <button
        type="button"
        class="suggestion-chip"
        v-for="(suggestion, index) in displaySuggestions"
        :key="index"
        @click="selectSuggestion(suggestion)"
      >
        {{ suggestion }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lan: String,
  },
  data() {
    return {
      randomSuggestions: [],
    };
  },
  computed: {
    conversationalSuggestions() {
      if (this.lan === "vi") {
        return [
          "Danh mục của em ổn không?",
          "Hôm nay có gì đáng chú ý?",
          "Nếu em mua cổ phiếu thì sao?",
          "Giải thích giúp em cái này",
        ];
      }
      return [
        "Is my portfolio on track?",
        "What's worth watching today?",
        "What if I buy a stock now?",
        "Explain this in simple terms",
      ];
    },
    displaySuggestions() {
      return this.randomSuggestions.length
        ? this.randomSuggestions
        : this.conversationalSuggestions;
    },
  },
  methods: {
    getRandomSuggestions() {
      const pool = [...this.conversationalSuggestions];
      const out = [];
      const count = Math.min(4, pool.length);
      for (let i = 0; i < count && pool.length; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        out.push(pool[idx]);
        pool.splice(idx, 1);
      }
      return out;
    },
    selectSuggestion(suggestion) {
      this.$emit("suggestion-selected", suggestion);
    },
  },
  created() {
    this.randomSuggestions = this.getRandomSuggestions();
  },
  watch: {
    lan() {
      this.randomSuggestions = this.getRandomSuggestions();
    },
  },
};
</script>

<style scoped>
.suggestion-bar {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  padding: 6px 0 14px;
  box-sizing: border-box;
}

.suggestion-scroll {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.suggestion-chip {
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
  padding: 10px 18px;
  background: #eceef2;
  color: #3d4354;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1.35;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  text-align: left;
  max-width: 100%;
}

.suggestion-chip:hover {
  background: #e0e4eb;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  transform: translateY(-1px);
}

.suggestion-chip:active {
  transform: translateY(0);
}
</style>
