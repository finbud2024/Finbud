<template>
  <div class="predictive-dashboard">
    <!-- Fixed Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="logo-section">
          <font-awesome-icon icon="fa-solid fa-chart-line" class="logo-icon" />
          <h1>AI Predictive Dashboard</h1>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <span class="stat-label">Models Active</span>
            <span class="stat-value">{{ selectedModels.length }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Accuracy</span>
            <span class="stat-value">{{ averageAccuracy }}%</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Stock</span>
            <span class="stat-value">{{ selectedStock }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Layout -->
    <div class="dashboard-layout">
      <!-- Control Panel -->
      <div class="control-panel">
        <!-- AI Assistant Card -->
        <div class="assistant-card">
          <div class="assistant-header">
            <div class="bot-avatar">
              <img
                src="@/assets/botrmbg.png"
                alt="FinBud AI"
                class="bot-image"
              />
            </div>
            <div>
              <h3>AI Assistant</h3>
              <p>Real-time guidance</p>
            </div>
          </div>
          <div class="assistant-message" v-html="currentGuidanceMessage"></div>
        </div>

        <!-- Quick Controls -->
        <div class="quick-controls">
          <div class="control-group">
            <label>Stock Symbol</label>
            <StockSearchInput
              v-model="selectedStock"
              placeholder="Search stocks..."
              @stock-selected="handleStockSelection"
              class="stock-input"
            />
          </div>

          <div class="control-group">
            <label>Prediction Period</label>
            <div class="slider-control">
              <input
                type="range"
                v-model="predictSize"
                min="1"
                max="365"
                class="slider"
              />
              <span class="slider-value">{{ predictSize }} days</span>
            </div>
          </div>

          <div class="control-group">
            <label>Historical Data</label>
            <div class="slider-control">
              <input
                type="range"
                v-model="showSize"
                min="4"
                max="104"
                class="slider"
              />
              <span class="slider-value">{{ showSize }} weeks</span>
            </div>
          </div>

          <!-- Model Selection Cards -->
          <div class="control-group">
            <label>AI Models</label>
            <div class="model-cards">
              <div
                v-for="model in availableModels"
                :key="model.key"
                :class="[
                  'model-card',
                  { selected: selectedModels.includes(model.key) },
                ]"
                @click="toggleModel(model.key)"
              >
                <font-awesome-icon :icon="model.icon" class="model-icon" />
                <span class="model-name">{{ model.name }}</span>
                <div class="model-accuracy">{{ model.accuracy }}</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-section">
            <button
              class="predict-btn"
              @click="runPrediction"
              :disabled="isLoading || selectedModels.length === 0"
            >
              <font-awesome-icon
                :icon="isLoading ? 'fa-solid fa-spinner' : 'fa-solid fa-play'"
                :class="{ 'fa-spin': isLoading }"
              />
              {{ isLoading ? "Analyzing..." : "Run Prediction" }}
            </button>
            <button class="reset-btn" @click="resetConfiguration">
              <font-awesome-icon icon="fa-solid fa-undo" />
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="main-content">
        <!-- Chart Section -->
        <div class="chart-section">
          <div class="section-header">
            <h2>Price Prediction Analysis</h2>
            <div class="model-indicators">
              <div
                v-for="model in selectedModels"
                :key="model"
                class="model-indicator"
                :style="{ backgroundColor: getModelColor(model) }"
              >
                {{ getModelName(model) }}
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="loading-state">
            <div class="ai-processing">
              <div class="neural-animation">
                <div class="node" v-for="i in 12" :key="i"></div>
              </div>
              <h3>{{ loadingMessage }}</h3>
              <p>{{ loadingSubtext }}</p>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: progress + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Chart Display -->
          <div v-else-if="chartData.length > 0" class="chart-display">
            <PredictiveChart
              :data="chartData"
              :models="selectedModels"
              :confidence-level="confidenceLevel"
              :model-colors="modelColors"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="empty-chart">
            <div class="empty-animation">
              <font-awesome-icon icon="fa-solid fa-chart-line" />
            </div>
            <h3>Ready to Predict</h3>
            <p>Select models and run prediction to see AI-powered forecasts</p>
          </div>
        </div>

        <!-- Metrics Dashboard -->
        <div class="metrics-section" v-if="modelMetrics && !isLoading">
          <div class="section-header">
            <h2>Model Performance Metrics</h2>
          </div>
          <div class="metrics-grid">
            <div
              v-for="(metric, model) in modelMetrics"
              :key="model"
              class="metric-card"
            >
              <div class="metric-header">
                <div class="model-info">
                  <div
                    class="model-color"
                    :style="{ backgroundColor: getModelColor(model) }"
                  ></div>
                  <span class="model-name">{{ getModelName(model) }}</span>
                </div>
                <div class="accuracy-badge">{{ getModelAccuracy(model) }}%</div>
              </div>
              <div class="metric-stats">
                <div class="stat-item">
                  <span class="stat-label">RMSE</span>
                  <span class="stat-value">{{
                    metric.rmse?.toFixed(4) || "N/A"
                  }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">MAE</span>
                  <span class="stat-value">{{
                    metric.mae?.toFixed(4) || "N/A"
                  }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">R²</span>
                  <span class="stat-value">{{
                    metric.r2?.toFixed(4) || "N/A"
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChartLine,
  faPlay,
  faSpinner,
  faTree,
  faRocket,
  faBolt,
  faLayerGroup,
  faLightbulb,
  faArrowUp,
  faShieldAlt,
  faUndo,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";
import StockSearchInput from "@/components/FinInvest/StockSimulatorPage/StockSearchInput.vue";
import PredictiveChart from "@/components/FinInvest/PredictiveCalculator/PredictiveChart.vue";
import axios from "axios";

// Add icons to library
library.add(
  faChartLine,
  faPlay,
  faSpinner,
  faTree,
  faRocket,
  faBolt,
  faLayerGroup,
  faLightbulb,
  faArrowUp,
  faShieldAlt,
  faUndo,
  faBrain
);

export default {
  name: "PredictiveCalculatorPage",
  components: {
    FontAwesomeIcon,
    StockSearchInput,
    PredictiveChart,
  },
  data() {
    return {
      selectedStock: "AAPL",
      selectedModels: ["lr", "rf"],
      predictSize: 60,
      showSize: 26,
      confidenceLevel: 0.95,
      isLoading: false,
      chartData: [],
      modelMetrics: null,
      progress: 0,
      loadingMessage: "Initializing AI models...",
      loadingSubtext: "This may take a few moments",
      currentGuidanceMessage: `
        <div class="welcome-message">
          <h4>🚀 Welcome to AI Prediction</h4>
          <ul>
            <li>Select stock symbol above</li>
            <li>Choose AI models to compare</li>
            <li>Adjust prediction period</li>
            <li>Click "Run Prediction" to see results</li>
    </ul>
        </div>
  `,
      availableModels: [
        {
          key: "lr",
          name: "Linear Regression",
          icon: "fa-solid fa-chart-line",
          accuracy: "85",
          description: "Fast and reliable for trend analysis",
        },
        {
          key: "rf",
          name: "Random Forest",
          icon: "fa-solid fa-tree",
          accuracy: "88",
          description: "Balanced accuracy and performance",
        },
        {
          key: "xgb",
          name: "XGBoost",
          icon: "fa-solid fa-rocket",
          accuracy: "92",
          description: "High accuracy for complex patterns",
        },
        {
          key: "lstm",
          name: "LSTM",
          icon: "fa-solid fa-brain",
          accuracy: "90",
          description: "Deep learning for time series",
        },
        {
          key: "transformer",
          name: "Transformer",
          icon: "fa-solid fa-bolt",
          accuracy: "94",
          description: "State-of-the-art AI model",
        },
        {
          key: "ensemble",
          name: "Ensemble",
          icon: "fa-solid fa-layer-group",
          accuracy: "96",
          description: "Combines multiple models",
        },
      ],
      modelColors: {
        lr: "#22c55e", // Green for Linear Regression
        rf: "#3b82f6", // Blue for Random Forest
        xgb: "#f59e0b", // Orange for XGBoost
        lstm: "#ef4444", // Red for LSTM
        transformer: "#8b5cf6", // Purple for Transformer
        ensemble: "#06b6d4", // Cyan for Ensemble
      },
    };
  },
  computed: {
    averageAccuracy() {
      if (this.selectedModels.length === 0) return 0;
      const totalAccuracy = this.selectedModels.reduce((sum, modelKey) => {
        const model = this.availableModels.find((m) => m.key === modelKey);
        return sum + parseInt(model?.accuracy || 0);
      }, 0);
      return Math.round(totalAccuracy / this.selectedModels.length);
    },
    marketTrend() {
      if (!this.chartData.length) return "No data available";
      const predictions = this.chartData.filter((d) => d.type === "prediction");
      if (!predictions.length) return "Analyzing...";

      const firstPred = predictions[0];
      const lastPred = predictions[predictions.length - 1];
      const firstValue = firstPred[this.selectedModels[0]];
      const lastValue = lastPred[this.selectedModels[0]];

      if (lastValue > firstValue * 1.05) return "Strong upward trend detected";
      if (lastValue < firstValue * 0.95) return "Downward trend identified";
      return "Sideways movement expected";
    },
    volatilityLevel() {
      if (!this.chartData.length) return "Calculating...";
      return "Moderate volatility expected";
    },
    aiRecommendation() {
      if (!this.chartData.length) return "Run prediction for insights";
      return "Consider position sizing and risk management";
    },
  },
  mounted() {
    setTimeout(() => {
      this.runPrediction();
    }, 1000);
  },
  methods: {
    toggleModel(modelKey) {
      const index = this.selectedModels.indexOf(modelKey);
      if (index > -1) {
        this.selectedModels.splice(index, 1);
      } else {
        this.selectedModels.push(modelKey);
      }
    },
    getModelColor(modelKey) {
      return this.modelColors[modelKey] || "#6b7280";
    },
    getModelName(modelKey) {
      const model = this.availableModels.find((m) => m.key === modelKey);
      return model?.name || modelKey.toUpperCase();
    },
    getModelAccuracy(modelKey) {
      const model = this.availableModels.find((m) => m.key === modelKey);
      return model?.accuracy || "N/A";
    },
    handleStockSelection(stock) {
      this.selectedStock = stock;
    },
    resetConfiguration() {
      this.selectedModels = ["lr"];
      this.predictSize = 60;
      this.showSize = 26;
      this.confidenceLevel = 0.95;
      this.chartData = [];
      this.modelMetrics = null;
    },
    async runPrediction() {
      if (this.selectedModels.length === 0) return;

      this.isLoading = true;
      this.progress = 0;
      this.loadingMessage = "Initializing AI models...";
      this.loadingSubtext = "Preparing neural networks";

      // Simulate loading progress
      const progressInterval = setInterval(() => {
        if (this.progress < 90) {
          this.progress += Math.random() * 15;
          if (this.progress > 30) {
            this.loadingMessage = "Training models...";
            this.loadingSubtext = "Processing historical data";
          }
          if (this.progress > 60) {
            this.loadingMessage = "Generating predictions...";
            this.loadingSubtext = "Almost ready";
          }
        }
      }, 200);

      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 3000));

        clearInterval(progressInterval);
        this.progress = 100;

        // Generate enhanced mock data
        const mockHistoricalData = [];
        const mockPredictionData = [];
        const basePrice = 150 + Math.random() * 100;
        const today = new Date();

        // Generate historical data with more realistic patterns
        for (let i = this.showSize * 7; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);

          // Add trend and seasonality
          const trend = -0.1 * i;
          const seasonality = 10 * Math.sin((i / 7) * Math.PI);
          const noise = (Math.random() - 0.5) * 8;

          const price = Math.max(10, basePrice + trend + seasonality + noise);

          mockHistoricalData.push({
            datetime: date.toISOString(),
            close: price,
            type: "historical",
          });
        }

        // Generate prediction data with model variations
        const lastPrice =
          mockHistoricalData[mockHistoricalData.length - 1].close;

        for (let i = 1; i <= this.predictSize; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() + i);

          const predictionItem = {
            datetime: date.toISOString(),
            type: "prediction",
          };

          // Generate predictions for selected models with different characteristics
          this.selectedModels.forEach((model) => {
            let trend = 0.02 * i; // Base upward trend
            let volatility = 3;

            // Adjust based on model characteristics
            switch (model) {
              case "lr":
                trend *= 0.8; // More conservative
                volatility *= 0.6;
                break;
              case "rf":
                trend *= 1.1;
                volatility *= 0.8;
                break;
              case "xgb":
                trend *= 1.2;
                volatility *= 1.1;
                break;
              case "lstm":
                trend += Math.sin(i / 10) * 2; // Add cyclical pattern
                volatility *= 0.9;
                break;
              case "transformer":
                trend *= 1.15;
                volatility *= 0.7;
                break;
              case "ensemble":
                trend *= 1.05; // Average of all models
                volatility *= 0.5;
                break;
            }

            const noise = (Math.random() - 0.5) * volatility;
            predictionItem[model] = Math.max(10, lastPrice + trend + noise);
          });

          mockPredictionData.push(predictionItem);
        }

        this.chartData = [...mockHistoricalData, ...mockPredictionData];

        // Generate enhanced mock metrics
        this.modelMetrics = {};
        this.selectedModels.forEach((model) => {
          const baseAccuracy = parseInt(
            this.availableModels.find((m) => m.key === model)?.accuracy || 85
          );
          this.modelMetrics[model] = {
            rmse: ((Math.random() * 5 + 2) * (100 - baseAccuracy)) / 100,
            mae: ((Math.random() * 3 + 1) * (100 - baseAccuracy)) / 100,
            r2: (baseAccuracy + Math.random() * 10 - 5) / 100,
          };
        });
      } catch (error) {
        console.error("Prediction error:", error);
      } finally {
        clearInterval(progressInterval);
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
    },
  },
};
</script>

<style scoped>
.predictive-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Fixed Header */
.dashboard-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #e2e8f0;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  font-size: 2rem;
  background: linear-gradient(45deg, #000000, #333333);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-section h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 2rem;
}

.stat-card {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

/* Dashboard Layout */
.dashboard-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  height: 100vh;
  padding-top: 80px;
}

/* Control Panel */
.control-panel {
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 2rem;
  overflow-y: auto;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.05);
}

.assistant-card {
  background: linear-gradient(135deg, #000000 0%, #000000 100%);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  margin-bottom: 2rem;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.assistant-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.bot-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bot-image {
  width: 32px;
  height: 32px;
  object-fit: cover;
}

.assistant-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.assistant-header p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.assistant-message {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  backdrop-filter: blur(10px);
}

.welcome-message h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
}

.welcome-message ul {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.9rem;
  line-height: 1.6;
}

.welcome-message li {
  margin-bottom: 0.25rem;
}

/* Quick Controls */
.quick-controls {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.control-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stock-input {
  width: 100%;
}

.slider-control {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(45deg, #000000, #333333);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.slider-value {
  font-weight: 600;
  color: #000000;
  min-width: 80px;
  text-align: right;
  font-size: 0.9rem;
}

/* Model Cards */
.model-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.model-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.model-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #000000, #06b6d4);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.model-card:hover {
  border-color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.model-card:hover::before {
  transform: scaleX(1);
}

.model-card.selected {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  border-color: #000000;
  color: white;
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.model-card.selected::before {
  transform: scaleX(1);
  background: rgba(255, 255, 255, 0.3);
}

.model-icon {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  display: block;
  color: #000000;
}

.model-card.selected .model-icon {
  color: white;
}

.model-name {
  font-weight: 600;
  font-size: 0.8rem;
  display: block;
  margin-bottom: 0.25rem;
}

.model-accuracy {
  font-size: 0.75rem;
  opacity: 0.7;
}

/* Action Section */
.action-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.predict-btn {
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.predict-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.predict-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reset-btn {
  background: #f8fafc;
  color: #374151;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.reset-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

/* Main Content */
.main-content {
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* Chart Section */
.chart-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  flex: 1;
  /* min-height: 500px; */
  height: fit-content;
}

.model-indicators {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.model-indicator {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.ai-processing {
  text-align: center;
  max-width: 400px;
}

.neural-animation {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  justify-items: center;
}

.node {
  width: 16px;
  height: 16px;
  background: linear-gradient(45deg, #000000, #333333);
  border-radius: 50%;
  animation: neuralPulse 2s ease-in-out infinite;
}

.node:nth-child(1) {
  animation-delay: 0s;
}
.node:nth-child(2) {
  animation-delay: 0.2s;
}
.node:nth-child(3) {
  animation-delay: 0.4s;
}
.node:nth-child(4) {
  animation-delay: 0.6s;
}
.node:nth-child(5) {
  animation-delay: 0.8s;
}
.node:nth-child(6) {
  animation-delay: 1s;
}
.node:nth-child(7) {
  animation-delay: 1.2s;
}
.node:nth-child(8) {
  animation-delay: 1.4s;
}
.node:nth-child(9) {
  animation-delay: 1.6s;
}
.node:nth-child(10) {
  animation-delay: 1.8s;
}
.node:nth-child(11) {
  animation-delay: 2s;
}
.node:nth-child(12) {
  animation-delay: 2.2s;
}

@keyframes neuralPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
  }
  50% {
    transform: scale(1.4);
    opacity: 1;
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
}

.loading-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.loading-state p {
  color: #64748b;
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #000000, #333333);
  border-radius: 4px;
  transition: width 0.5s ease;
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.chart-display {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Empty Chart */
.empty-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #64748b;
}

.empty-animation {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-chart h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Metrics Section */
.metrics-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  animation: fadeInUp 1s ease-out 0.2s both;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.model-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.model-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.model-info .model-name {
  font-weight: 600;
  color: #374151;
}

.accuracy-badge {
  background: linear-gradient(45deg, #10b981, #059669);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.metric-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-item .stat-label {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.25rem;
}

.stat-item .stat-value {
  font-weight: 600;
  color: #1e293b;
  font-size: 1.1rem;
}

/* Insights Section */
.insights-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  animation: fadeInUp 1.2s ease-out 0.4s both;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.insight-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.insight-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #000000, #06b6d4);
}

.insight-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.insight-card.trend::before {
  background: linear-gradient(90deg, #10b981, #059669);
}
.insight-card.volatility::before {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}
.insight-card.confidence::before {
  background: linear-gradient(90deg, #8b5cf6, #7c3aed);
}
.insight-card.recommendation::before {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.insight-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #000000;
}

.insight-card h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.insight-card p {
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .dashboard-layout {
    grid-template-columns: 300px 1fr;
  }

  .header-stats {
    gap: 1rem;
  }

  .stat-value {
    font-size: 1.25rem;
  }
}

@media (max-width: 768px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .control-panel {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    max-height: 400px;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .dashboard-header {
    height: auto;
    position: relative;
  }

  .dashboard-layout {
    padding-top: 0;
  }

  .header-stats {
    justify-content: center;
  }

  .model-cards {
    grid-template-columns: 1fr;
  }

  .main-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .metrics-grid,
  .insights-grid {
    grid-template-columns: 1fr;
  }

  .metric-stats {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

/* Dark mode styles */
.dark-mode .predictive-calculator {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: #f9fafb;
}

.dark-mode .dashboard-header {
  background: #374151;
  border-color: #4b5563;
}

.dark-mode .dashboard-title {
  color: #f9fafb;
}

.dark-mode .dashboard-subtitle {
  color: #d1d5db;
}

.dark-mode .stat-card {
  background: #4b5563;
  border-color: #6b7280;
}

.dark-mode .stat-card:hover {
  background: #6b7280;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.dark-mode .stat-label {
  color: #9ca3af;
}

.dark-mode .stat-value {
  color: #f9fafb;
}

.dark-mode .control-panel {
  background: #374151;
  border-color: #4b5563;
}

.dark-mode .section-title {
  color: #f9fafb;
}

.dark-mode .stock-search-container {
  background: #4b5563;
  border-color: #6b7280;
}

.dark-mode .model-selection {
  background: #4b5563;
  border-color: #6b7280;
}

.dark-mode .model-card {
  background: #6b7280;
  border-color: #9ca3af;
  color: #f9fafb;
}

.dark-mode .model-card.selected {
  background: #1f2937;
  border-color: #f9fafb;
}

.dark-mode .model-card:hover {
  background: #9ca3af;
  border-color: #d1d5db;
}

.dark-mode .model-icon {
  color: #f9fafb;
}

.dark-mode .model-name {
  color: #f9fafb;
}

.dark-mode .model-accuracy {
  background: #059669;
}

.dark-mode .model-description {
  color: #d1d5db;
}

.dark-mode .param-section {
  background: #4b5563;
  border-color: #6b7280;
}

.dark-mode .param-label {
  color: #f9fafb;
}

.dark-mode .param-input {
  background: #374151;
  border-color: #6b7280;
  color: #f9fafb;
}

.dark-mode .param-input:focus {
  border-color: #9ca3af;
}

.dark-mode .run-prediction-btn {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  color: #f9fafb;
}

.dark-mode .run-prediction-btn:hover {
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
}

.dark-mode .guidance-section {
  background: #4b5563;
  border-color: #6b7280;
}

.dark-mode .guidance-content {
  color: #d1d5db;
}

.dark-mode .main-content {
  background: #374151;
}

.dark-mode .chart-section {
  background: #4b5563;
  border-color: #6b7280;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.dark-mode .loading-container {
  background: #4b5563;
  border-color: #6b7280;
}

.dark-mode .loading-title {
  color: #f9fafb;
}

.dark-mode .loading-message {
  color: #d1d5db;
}

.dark-mode .loading-subtext {
  color: #9ca3af;
}

.dark-mode .progress-bar {
  background: #6b7280;
}

.dark-mode .progress-fill {
  background: linear-gradient(90deg, #1f2937, #374151);
}

.dark-mode .metrics-section {
  background: #4b5563;
  border-color: #6b7280;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.dark-mode .metric-card {
  background: #6b7280;
  border-color: #9ca3af;
}

.dark-mode .metric-card:hover {
  background: #9ca3af;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
}

.dark-mode .model-info .model-name {
  color: #f9fafb;
}

.dark-mode .stat-item .stat-label {
  color: #9ca3af;
}

.dark-mode .stat-item .stat-value {
  color: #f9fafb;
}

.dark-mode .insights-section {
  background: #4b5563;
  border-color: #6b7280;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.dark-mode .insight-card {
  background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
  border-color: #9ca3af;
}

.dark-mode .insight-card:hover {
  background: linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
}

.dark-mode .insight-icon {
  color: #f9fafb;
}

.dark-mode .insight-card h4 {
  color: #f9fafb;
}

.dark-mode .insight-card p {
  color: #d1d5db;
}
</style>
