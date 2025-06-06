<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ $t('addTransaction') }}</h3>
      </div>

      <div class="modal-body">
        <!-- Transaction Type -->
        <div class="form-group">
          <label>{{ $t('transactionType') }}</label>
          <select v-model="transaction.type" class="input">
            <option disabled value="">{{ $t('selectType') }}</option>
            <option value="Income">{{ $t('income') }}</option>
            <option value="Expense">{{ $t('expense') }}</option>
          </select>
        </div>

        <!-- Description -->
        <div class="form-group description-group">
          <label>{{ $t('description') }}</label>
          <input
            type="text"
            placeholder="Transaction description"
            class="input"
            v-model="transaction.description"
            @input="generateRecommendations"
            @keydown="generateRecommendations"
            @focus="showRecommendations"
            @blur="hideRecommendations"
          />
          <ul
            v-if="recommendations.length && recommendationsVisible"
            class="recommendation-list"
            @mousedown.prevent
          >
            <li
              v-for="(recommendation, index) in recommendations"
              :key="index"
              @click="selectRecommendation(recommendation)"
              :class="{ highlighted: index === highlightedIndex }"
            >
              {{ recommendation }}
            </li>
          </ul>
        </div>

        <!-- Amount + Currency -->
        <div class="form-group">
          <label>{{ $t('amount') }}</label>
          <div class="currency-input">
            <input
              type="number"
              placeholder="Amount"
              class="input"
              v-model="transaction.amount"
            />
            <select
              :value="selectedCurrency"
              @change="$emit('update:selectedCurrency', $event.target.value)"
              class="input"
            >
              <option value="USD">USD</option>
              <option value="VND">VND</option>
            </select>
          </div>
        </div>

        <!-- Category -->
        <div class="form-group">
          <label>{{ $t('category') }}</label>
          <select v-model="transaction.category" class="input">
            <option disabled value="">{{ $t('selectCategory') }}</option>
            <option v-for="cat in filteredCategories" :key="cat">{{ cat }}</option>
          </select>
        </div>

        <!-- Date -->
        <div class="form-group">
          <label>{{ $t('dateTime') }}</label>
          <input type="date" v-model="transaction.date" class="input" />
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button @click="$emit('close')" class="btn cancel">{{ $t('cancel') }}</button>
        <button @click="$emit('submit', transaction)" class="btn confirm">
          {{ $t('addTransaction') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddTransactionModal",
  props: {
    transaction: Object,
    selectedCurrency: String,
    recommendations: Array,
    recommendationsVisible: Boolean,
    highlightedIndex: Number,
  },
  emits: [
    "close",
    "submit",
    "update:selectedCurrency",
    "generate-recommendations",
    "select-recommendation",
    "show-recommendations",
    "hide-recommendations",
  ],
  data() {
    return {
      expenseCategories: [
        "Food & Groceries",
        "Housing & Utilities",
        "Transportation",
        "Health & Wellness",
        "Lifestyle & Subscriptions"
      ],
      incomeCategories: [
        "Salary",
        "Freelance & Side Job",
        "Allowance",
        "Investment Return",
        "Gift",
        "Refund",
        "Other Income"
      ]
    };
  },
  computed: {
    filteredCategories() {
      return this.transaction.type === "Income"
        ? this.incomeCategories
        : this.expenseCategories;
    }
  },
  methods: {
    generateRecommendations(event) {
      this.$emit("generate-recommendations", event);
    },
    selectRecommendation(rec) {
      this.$emit("select-recommendation", rec);
    },
    showRecommendations() {
      this.$emit("show-recommendations");
    },
    hideRecommendations() {
      setTimeout(() => this.$emit("hide-recommendations"), 100);
    },
  },
};
</script>

<style scoped>

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield; /* Firefox */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--card-bg, white);
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  padding: 25px 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary, #333);
}

.modal-body {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.description-group {
  margin-bottom: 24px;
}

.input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 6px;
  border: 1px solid var(--border-color, #ccc);
  font-size: 15px;
  box-sizing: border-box;
  background-color: white;
}

.currency-input {
  display: flex;
  gap: 10px;
  width: 100%;
}

.currency-input .input {
  height: 44px; /* Force uniform height */
  padding: 10px 12px;
  font-size: 15px;
  border-radius: 6px;
  border: 1px solid var(--border-color, #ccc);
  box-sizing: border-box;
  background-color: white;
}

.currency-input input.input {
  flex: 2;
}

.currency-input select.input {
  flex: 1;
  appearance: none; 
  background-image: url("data:image/svg+xml,<svg fill='black' height='14' viewBox='0 0 24 24' width='14' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.cancel {
  background-color: #ccc;
  color: #333;
  margin-right: 10px;
}

.confirm {
  background-color: var(--link-color, #000000);
  color: white;
}

.recommendation-list {
  list-style: none;
  padding: 0;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 6px;
  max-height: 120px;
  overflow-y: auto;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recommendation-list li {
  padding: 8px 12px;
  cursor: pointer;
}

.recommendation-list li.highlighted,
.recommendation-list li:hover {
  background-color: #eee;
}
</style>
