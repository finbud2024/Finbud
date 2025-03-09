<template>
  <div class="mortgage-calc">
    <h1>Mortgage Payment Calculator</h1>
    
    <div class="input-group">
      <label>Home price</label>
      <div class="input-wrapper">
        <input type="number" v-model="homePrice" min="10000" />
        <span class="unit">$</span>
      </div>
      <span v-if="homePrice < 10000" class="error">Minimum of $10,000 required</span>
    </div>
    
    <div class="input-group">
      <label>Down payment</label>
      <div class="split-input">
        <div class="input-wrapper">
          <input type="number" v-model="downPayment" />
          <span class="unit">$</span>
        </div>
        <div class="input-wrapper">
          <input type="number" v-model="downPaymentPercentage" />
          <span class="unit">%</span>
        </div>
      </div>
    </div>
    
    <div class="input-group">
      <label>Loan term</label>
      <select v-model="loanTerm">
        <option value="30">30-year fixed</option>
        <option value="15">15-year fixed</option>
      </select>
    </div>
    
    <div class="input-group">
      <label>Interest rate</label>
      <div class="input-wrapper">
        <input type="number" v-model="interestRate" step="0.01" />
        <span class="unit">%</span>
      </div>
    </div>
    
    <div class="input-group">
      <label>Taxes, Insurance, HOA Fees</label>
      <select v-model="showExtras">
        <option :value="false">Hidden</option>
        <option :value="true">Show</option>
      </select>
    </div>
    
    <div v-if="showExtras" class="extra-content">
      <div class="input-group">
        <label>Property tax</label>
        <div class="input-wrapper">
          <input type="number" v-model="propertyTax" />
          <span class="unit">$/month</span>
        </div>
      </div>
      <div class="input-group">
        <label>Homeowners insurance</label>
        <div class="input-wrapper">
          <input type="number" v-model="homeInsurance" />
          <span class="unit">$/month</span>
        </div>
      </div>
      <div class="input-group">
        <label>Private mortgage insurance</label>
        <div class="input-wrapper">
          <input type="number" v-model="pmi" />
          <span class="unit">$/month</span>
        </div>
      </div>
      <div class="input-group">
        <label>HOA fees</label>
        <div class="input-wrapper">
          <input type="number" v-model="hoaFees" />
          <span class="unit">$/month</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      homePrice: 10000,
      downPayment: 2000,
      downPaymentPercentage: 20,
      loanTerm: 30,
      interestRate: 6.319,
      propertyTax: 3,
      homeInsurance: 150,
      pmi: 0,
      hoaFees: 0,
      showExtras: false
    };
  }
};
</script>

<style scoped>
.mortgage-calc {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.unit {
  position: absolute;
  right: 10px;
  font-size: 14px;
  color: #555;
}

.split-input {
  display: flex;
  gap: 10px;
}

.extra-content {
  margin-top: 10px;
  padding: 10px;
  background: #f1f1f1;
  border-radius: 5px;
}

.error {
  color: red;
  font-size: 14px;
}
</style>
