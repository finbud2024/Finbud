<template>
  <section class="performance-chart">
    <h3>Performance</h3>
    <div class="chart-controls">
      <button
        class="timeframe-btn"
        :class="{ active: selectedTimeFrame === '1W' }"
        @click="setTimeFrame('1W')"
      >
        1W
      </button>
      <button
        class="timeframe-btn"
        :class="{ active: selectedTimeFrame === '1M' }"
        @click="setTimeFrame('1M')"
      >
        1M
      </button>
      <button
        class="timeframe-btn"
        :class="{ active: selectedTimeFrame === '3M' }"
        @click="setTimeFrame('3M')"
      >
        3M
      </button>
      <button
        class="timeframe-btn"
        :class="{ active: selectedTimeFrame === '6M' }"
        @click="setTimeFrame('6M')"
      >
        6M
      </button>
      <button
        class="timeframe-btn"
        :class="{ active: selectedTimeFrame === '1Y' }"
        @click="setTimeFrame('1Y')"
      >
        1Y
      </button>
    </div>

    <LineChart 
      :data="performanceData" 
      xName="Time Series" 
      yName="Account Balance" 
      :yRange="[95, 115]" 
    />

    <div class="performance-history">
      <button class="performance-history-btn">Performance History</button>
    </div>
  </section>
</template>

<script>
import LineChart from '../components/LineChart.vue';

export default {
  name: 'PerformanceChart',
  components: {
    LineChart
  },
  props: {
    performanceData: Array, 
  },
  data() {
    return {
      selectedTimeFrame: '1W'
    };
  },
  methods: {
    setTimeFrame(timeframe) {
      this.selectedTimeFrame = timeframe;
      this.$emit('timeframeChanged', timeframe); // Emit event to parent
    }
  }
};
</script>

<style scoped>
.performance-chart {
  width: 100%; 
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
  position: relative; 
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  min-height: 520px;
}

.chart-controls {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  margin-bottom: 20px; 
  width: 100%;
}

.timeframe-btn {
  background-color: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 10px 20px;
  font-weight: bold;
  text-align: center;
  flex-grow: 1; 
  height: 50px; 
  line-height: 30px; 
  margin: 0 5px; 
  border-radius: 5px; 
  transition: background-color 0.3s, border-color 0.3s; 
}

.timeframe-btn.active {
  background-color: #dfe6f1;
  border: 2px solid #2e5cb8;
  color: #2e5cb8;
}

.timeframe-btn:hover {
  background-color: #dfe6f1;
  border-radius: 5px;
}

.performance-history-btn {
  background-color: #000000;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
}

.performance-history-btn:hover {
  background-color: #1d3e8e;
}
</style>
