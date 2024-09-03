<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <h3>Order Successful</h3>
      <p>
        Your transaction of {{ quantity }} shares of {{ stockSymbol }} has been
        placed successfully!
      </p>
      <button @click="closeModal" class="ok-btn">OK</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stockSymbol: String,
    quantity: Number,
  },
  methods: {
    closeModal() {
      this.$emit("close");
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
  text-align: center;
}

.ok-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #28a745;
  color: white;
  cursor: pointer;
  margin-top: 20px;
}

.ok-btn:hover {
  background-color: #218838;
}
</style>
