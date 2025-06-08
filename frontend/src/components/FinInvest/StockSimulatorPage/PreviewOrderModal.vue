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
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.order-modal {
  background: var(--bg-primary);
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
  animation: slideIn 0.4s ease;
}

.order-modal h3 {
  font-size: 1.8rem;
  margin-bottom: 25px;
  font-weight: 700;
  background: linear-gradient(45deg, var(--text-primary), var(--text-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  background: var(--bg-secondary);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.detail:hover {
  transform: translateX(5px);
  background: var(--hover-bg);
}

.detail span:first-child {
  color: var(--text-secondary);
  font-size: 1rem;
}

.detail span:last-child {
  color: var(--text-primary);
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
  padding: 14px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.clear-btn {
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  color: var(--text-primary);
}

.clear-btn:hover {
  background: var(--hover-bg);
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.submit-btn {
  background: var(--primary-color);
  border: none;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: var(--primary-color-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
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
