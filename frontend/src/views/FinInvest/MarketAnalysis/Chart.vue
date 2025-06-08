<!-- MarketLineChart.vue -->
<template>
    <div class="chart-select-container">
      <select v-model="selectedDataset" class="chart-select">
        <option value="all">All</option>
        <option value="positive">Positive</option>
        <option value="negative">Negative</option>
        <option value="neutral">Neutral</option>
      </select>
    </div>

    <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
} from 'chart.js'

import { Line } from 'vue-chartjs';
import { computed } from 'vue';
import marketAnalysisData from './marketAnalysis.json';
import { ref } from 'vue';

const selectedDataset = ref('all');

// Register required Chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, Filler)

// Helper to generate past 30 days of dates
function generateLast30DaysLabels() {
  const today = new Date();
  const labels = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Format: "MM/DD" (e.g., "05/13")
    const label = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
    labels.unshift(label);
  }
  return labels;
}

// Computed chart data
const chartData = computed(() => {
  const allDatasets = {
    vnIndex: {
    label: 'VN-Index',
    data: marketAnalysisData.marketAnalysisInsight.chart.vnIndex,
    fill: false,
    borderColor: '#000000',
    backgroundColor: 'transparent',
    borderWidth: 2,
    tension: 0.4,
    order: 1,
    pointRadius: 0,
  },
  positive: {
    label: 'Positive',
    data: marketAnalysisData.marketAnalysisInsight.chart.positive,
    fill: true,
    borderColor: '#a9ffad',
    backgroundColor: '#a9ffad',
    tension: 0.4,
    borderWidth: 1,
    order: 2,
    stack: 'sentiment', 
    pointRadius: 0,
  },
  negative: {
    label: 'Negative',
    data: marketAnalysisData.marketAnalysisInsight.chart.negative,
    fill: true,
    borderColor: '#ffa9a9',
    backgroundColor: '#ffa9a9',
    tension: 0.4,
    borderWidth: 1,
    order: 2,
    stack: 'sentiment', 
    pointRadius: 0,
  },
  neutral: {
    label: 'Neutral',
    data: marketAnalysisData.marketAnalysisInsight.chart.neutral,
    fill: true,
    borderColor: '#f9ffa9',
    backgroundColor: '#f9ffa9',
    tension: 0.4,
    borderWidth: 1,
    order: 2,
    stack: 'sentiment', 
    pointRadius: 0,
  }


}

  let datasets = []
  if (selectedDataset.value === 'all') {
    datasets = [allDatasets['positive'], allDatasets['negative'], allDatasets['neutral'], allDatasets['vnIndex']]
  } else if (allDatasets[selectedDataset.value]) {
    datasets = [allDatasets[selectedDataset.value], allDatasets['vnIndex']]
  }

  return {
    labels: generateLast30DaysLabels(),
    datasets
  }
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Market Sentiment Over Time'
    },
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    }
  }
}


</script>

<style scoped>
.chart-select-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;  
}

.chart-select {
  border-radius: 4px;
  padding: 5px;
  background-color: var(--whtie-in-light-mode);
  color: var(--black-in-light-mode);
  border: 1px solid var(--black-in-light-mode);
}

</style>
