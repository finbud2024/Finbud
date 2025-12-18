<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="order-modal">
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
        <button
          @click="submitOrder"
          :disabled="isSubmittingOrder"
          class="submit-btn"
        >
          <span v-if="isSubmittingOrder">
            <i class="fas fa-spinner fa-spin"></i> Submitting...
          </span>
          <span v-else> Submit Order </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PreviewOrderModal",
  props: {
    stockSymbol: String,
    quantity: Number,
    estimatedPrice: Number,
    remainingBalance: Number,
    isSubmittingOrder: Boolean,
  },
  mounted() {
    console.log("PreviewOrderModal mounted with props:", {
      stockSymbol: this.stockSymbol,
      quantity: this.quantity,
      estimatedPrice: this.estimatedPrice,
      remainingBalance: this.remainingBalance,
    });
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
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.order-modal {
  background: var(--bg-primary, #ffffff);
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color, #e0e0e0);
  animation: slideIn 0.4s ease;
}

.order-modal h3 {
  color: #333333;
  font-size: 1.8rem;
  margin-bottom: 25px;
  font-weight: 700;
  text-align: center;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: var(--bg-secondary, #f8f9fa);
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.detail:hover {
  transform: translateX(5px);
  background: var(--hover-bg, #e9ecef);
}

.detail span:first-child {
  color: var(--text-secondary, #212529);
  font-size: 1rem;
}

.detail span:last-child {
  color: var(--text-primary, #212529);
  font-weight: 600;
  font-size: 1.1rem;
}

.modal-actions {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.clear-btn,
.submit-btn {
  flex: 1;
  padding: 16px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn {
  background: #f8f9fa;
  border: 2px solid #dee2e6;
  color: #495057;
  font-weight: 600;
}

.clear-btn:hover {
  background: #e9ecef;
  border-color: #007bff;
  color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
}

.submit-btn {
  background: #333333;
  border: none;
  color: white;
  font-weight: 600;
}

.submit-btn:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading Spinner */
.fa-spinner {
  margin-right: 8px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .order-modal {
    width: 95%;
    padding: 20px;
  }

  .order-modal h3 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .detail {
    padding: 12px;
  }

  .detail span:first-child {
    font-size: 0.9rem;
  }

  .detail span:last-child {
    font-size: 1rem;
  }

  .clear-btn,
  .submit-btn {
    padding: 12px;
    font-size: 0.9rem;
  }
}
</style>
