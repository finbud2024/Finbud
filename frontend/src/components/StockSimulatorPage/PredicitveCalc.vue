<template>
  <div class="predictive-calc">
    <h3>Predictive Calculator</h3>
    <div class="chart-controls">
      <div class="form-container">
        <div class="column">
          <!-- Stock Selection Dropdown -->
          <label for="stock">Select Stock:</label>
          <select id="stock" v-model="selectedStock" @change="fetchData">
            <option v-for="(stock, index) in stocks" :key="index" :value="stock.symbol">
              {{ stock.name }}
            </option>
          </select>
          <!-- Model Selection Checkboxes -->
          <label>Select Models:</label>
          <div>
            <span>
              <input type="checkbox" value="lr" v-model="selectedModels" />
              Linear Regression
            </span>
            <span>
              <input type="checkbox" value="rf" v-model="selectedModels" />
              Random Forest
            </span>
          </div>
          
        </div>

        <div class="column">
          <!-- Prediction Size Input (Days) -->
          <label for="predictSize">Prediction Size (days):</label>
          <input id="predictSize" v-model="predictSize" type="number" />

          <!-- Show Size Input (Weeks) -->
          <label for="showSize">Show Size (weeks):</label>
          <input id="showSize" v-model="showSize" type="number" />
        </div>
      </div>

      <!-- Fetch Button Below the Grid -->
      <button @click="fetchPredictionData" class="fetch-btn">Fetch Prediction</button>

      <!-- Display the Chart -->
      <StockChart :data="chartData" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import StockChart from './StockChart.vue';

export default {
  name: 'PredictiveCalculator',
  components: {
    StockChart
  },
  data() {
    return {
      selectedStock: 'AAPL',
      stocks: [
        { symbol: 'AAPL', name: 'Apple' },
        { symbol: 'ABNB', name: 'Airbnb' },
        { symbol: 'ADBE', name: 'Adobe' },
        { symbol: 'AMZN', name: 'Amazon' },
        { symbol: 'GOOGL', name: 'Google' },
        { symbol: 'MSFT', name: 'Microsoft' },
        { symbol: 'NVDA', name: 'NVIDIA' },
        { symbol: 'TSLA', name: 'Tesla' }
      ],
      predictSize: 60,
      showSize: 26,
      selectedModels: ['lr'],  // Default to Linear Regression
      chartData: []
    };
  },
  methods: {
    async fetchPredictionData() {
      try {
        const modelsParam = this.selectedModels.join(',');  // Join selected models to a comma-separated string
        const response = await axios.post(`https://o5az2qbdw6.execute-api.us-east-2.amazonaws.com/predict?stock=${this.selectedStock}&predict_size=${this.predictSize}&show_size=${this.showSize}&models=${modelsParam}`);
        // const response = await axios.post(`http://localhost:8000/api/predict?stock=${this.selectedStock}&predict_size=${this.predictSize}&show_size=${this.showSize}&models=${modelsParam}`);
        const { show, predict } = response.data;

        // Prepare the data for the chart
        this.chartData = [
          ...show.map(item => ({
            datetime: item.datetime,
            close: item.close,
            type: 'show'
          })),
          ...predict.map(item => ({
            datetime: item.datetime,
            lr: item.lr,  // Linear Regression prediction
            rf: item.rf,  // Random Forest prediction
            type: 'predict'
          }))
        ];
        console.log("Prediction data fetched successfully:", this.chartData);
      } catch (error) {
        console.error("Error fetching prediction data:", error);
      }
    }
  }
};
</script>

<style scoped>
h3 {
  color: #007bff; /* Blue color for the header */
  font-weight: bold; /* Make it bold */
  font-size: 1.5rem; /* Font size for the header */
  margin-bottom: 20px;
}

.chart-controls {
  margin-bottom: 20px;
}

.form-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.column {
  display: flex;
  flex-direction: column;
  width: 45%;  /* Set to smaller width for a more compact layout */
}

.column label {
  margin-bottom: 5px;
  font-size: 1rem;
}

.column input, 
.column select {
  margin-bottom: 10px;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
}

.fetch-btn {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;  /* Button takes full width below the inputs */
  margin-top: 20px;
  font-size: 1.2rem !important; /* Increase font size */
}

.fetch-btn:hover {
  background-color: #0056b3;
}

.chart-controls label {
  margin-bottom: 5px;
}

select, input[type="number"] {
  width: 200px;  /* Set a fixed width for the number input */
}

.fetch-btn {
  padding: 10px 20px;
  margin: 20px auto;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1rem;
  width: 30%;
  display: block; /* Makes the button a block element */
  text-align: center; /* Centers the text inside the button */
}

label {
  font-weight: bold; /* Make the labels bold */
}

.predictive-calc {
  margin: 20px; 
  margin-top: 40px;
}
</style>
