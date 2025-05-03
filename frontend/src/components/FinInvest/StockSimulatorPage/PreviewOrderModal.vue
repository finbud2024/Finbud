<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <h3>Preview Order</h3>
      <div class="order-details">
        <div class="detail">
          <span>Stock:</span><span>{{ stockSymbol }}</span>
        </div>
        <div class="detail">
          <span>Quantity:</span><span>{{ quantity }}</span>
        </div>
        <div class="detail">
          <span>Estimated Price:</span
          ><span>{{ calculatedEstimatedPrice }} USD</span>
        </div>
        <div class="detail">
          <span>Commission:</span
          ><span>{{ calculatedCommissionPrice }} USD</span>
        </div>
        <div class="detail">
          <span>Estimated Total:</span
          ><span>{{ calculatedEstimatedTotal }} USD</span>
        </div>
        <div class="detail">
          <span>Remaining Cash Balance:</span
          ><span>{{ remainingBalance }} USD</span>
        </div>
      </div>
      <div class="modal-actions">
        <button @click="clearOrder" class="clear-btn">CLEAR ORDER</button>
        <button @click="submitOrder" :disabled="isSubmittingOrder" class="submit-btn">
          <span v-if="isSubmittingOrder">
            <i class="fas fa-spinner fa-spin"></i> Submitting...
          </span>
          <span v-else>
            Submit Order
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stockSymbol: String,
    quantity: Number,
    estimatedPrice: Number, // Assume the base price is passed as a prop
    remainingBalance: Number,
    isSubmittingOrder: Boolean,
  },
  computed: {
    calculatedEstimatedPrice() {
      return (this.estimatedPrice * this.quantity).toFixed(2);
    },
    calculatedCommissionPrice() {
      return (0.01 * this.estimatedPrice * this.quantity).toFixed(2);
    },
    calculatedEstimatedTotal() {
      return (
        parseFloat(this.calculatedEstimatedPrice) +
        parseFloat(this.calculatedCommissionPrice)
      ).toFixed(2);
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    clearOrder() {
      this.$emit("clear-order");
    },
    submitOrder() {
      this.$emit("submit-order");
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 80%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.order-details {
  margin: 20px 0;
}

.detail {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.clear-btn,
.submit-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.clear-btn {
  background-color: #6c757d;
  color: white;
}

.clear-btn:hover {
  background-color: #5a6268;
}

.submit-btn {
  background-color: #007bff;
  color: white;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.submit-btn:hover {
  background-color: #0056b3;
}
</style>
