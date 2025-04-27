<template>
  <div class="suggestion-bar">
    <div class="suggestion-scroll">
      <div
        class="suggestion-item"
        v-for="(suggestion, index) in randomSuggestions"
        :key="index"
        @click="selectSuggestion(suggestion)" 
      >
        {{ suggestion }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lan: String
  },
  data() {
    return {
      randomSuggestions: []
    }
  },
  computed: {
    localizedSuggestions() {
      if (this.lan === 'vi') {
        return [
          'Mua cổ phiếu',
          'Giao dịch giá chứng khoán',
          'REALESTATE',
          'Phân tích ngân sách của tôi',
          'Xem Top 5 tiền điện tử',
          'Tính toán lợi nhuận đầu tư chứng khoán',
          'Phân tích danh mục đầu tư',
          'Tạo mục tiêu',
          'Tạo kế hoạch tiết kiệm 6 tháng',
          'Giá vàng hôm nay'
        ]
      } else {
        return [
          'Buy stock',
          'Stock price transactions',
          'REALESTATE',
          'Analyze my budget',
          'View Top 5 cryptocurrencies',
          'Calculate stock investment profit',
          'Portfolio analysis',
          'Create goals',
          'Create a 6-month savings plan',
          'Gold price today'
        ]
      }
    }
  },
  methods: {
    getRandomSuggestions() {
      const suggestions = [...this.localizedSuggestions];
      const randomSuggestions = [];
      
      for (let i = 0; i < 4 && suggestions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * suggestions.length);
        randomSuggestions.push(suggestions[randomIndex]);
        suggestions.splice(randomIndex, 1);
      }
      
      return randomSuggestions;
    },
    selectSuggestion(suggestion) {
      this.$emit('suggestion-selected', suggestion);  // Emit the selected suggestion
    }
  },
  created() {
    this.randomSuggestions = this.getRandomSuggestions();
  },
  watch: {
    lan() {
      this.randomSuggestions = this.getRandomSuggestions();
    }
  }
}
</script>

<style scoped>
/* Your existing styles remain the same */
.suggestion-bar {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px 5px;
}

.suggestion-scroll {
  display: flex;
  gap: 12px;
  padding: 5px;
}

.suggestion-item {
  padding: 8px 14px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.2s;
}

.suggestion-item:hover {
  background-color: #f0f0f0;
  border-color: #ccc;
  transform: translateY(-1px);
}
</style>