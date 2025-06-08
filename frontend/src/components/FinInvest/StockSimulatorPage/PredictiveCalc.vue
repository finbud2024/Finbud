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
      <div v-if="fetchingdata" class="loading">
        <div class="loader"></div>
      </div>

      <div v-else>
      <StockChart :data="chartData" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import StockChart from './StockChart.vue';
import { ref } from 'vue';

const fetchingdata = ref(false);

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
      chartData: [],
      fetchingdata: false  // Loading state
    };
  },
  methods: {
    async fetchPredictionData() {
      try {
        this.fetchingdata = true;  // Set loading state
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
        this.fetchingdata = false;  // Reset loading state
      } catch (error) {
        console.error("Error fetching prediction data:", error);
      }
    }
  }
};
</script>

<style scoped>
.predictive-calc {
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.05),
    0 1px 8px rgba(0, 0, 0, 0.03);
  margin: 2rem auto;
  max-width: 1200px;
  position: relative;
  overflow: hidden;
}

.predictive-calc::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #000000, #333333);
}

h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

h3::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background: #000;
  margin: 1rem auto 0;
  border-radius: 2px;
}

.chart-controls {
  margin-bottom: 2rem;
}

.form-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  margin-bottom: 2rem;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.column label {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.column select,
.column input {
  padding: 0.8rem 1rem;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
}

.column select:focus,
.column input:focus {
  border-color: #000;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

/* Checkbox styles */
.column div {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.column span {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
}

.column input[type="checkbox"] {
  width: 20px;
  height: 20px;
  border: 2px solid #eee;
  border-radius: 4px;
  cursor: pointer;
}

.fetch-btn {
  background: #000;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: auto;
  margin: 0 auto;
  display: block;
  min-width: 200px;
  position: relative;
  overflow: hidden;
}

.fetch-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 120%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%) scale(0);
  border-radius: 50%;
  transition: transform 0.5s ease;
}

.fetch-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.fetch-btn:hover::after {
  transform: translate(-50%, -50%) scale(1);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
}

.loader {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  position: relative;
}

.loader::after {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border: 4px solid transparent;
  border-top: 4px solid rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .predictive-calc {
    margin: 1rem;
    padding: 1.5rem;
  }

  .form-container {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }

  .column {
    gap: 1rem;
  }

  .fetch-btn {
    width: 100%;
  }
}

/* Chart Container */
.chart-container {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  margin-top: 2rem;
  min-height: 400px;
}

/* Animation for chart appearance */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
