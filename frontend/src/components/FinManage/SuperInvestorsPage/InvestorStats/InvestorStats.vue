<script setup>
import { onMounted, ref, computed, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import './InvestorStats.css';

Chart.register(...registerables);

// Define Props
const props = defineProps({
  basicStats: Object,
  industryBreakdown: Object
});

const pieChartCanvas = ref(null);
let pieChartInstance = null; // Store the Chart instance

const processedBasicStats = computed(() => {
  return props.basicStats || {};
});

const processedIndustryBreakdown = computed(() => {
  const rawData = props.industryBreakdown || {};
  const convertedData = {};
  for (const key in rawData) {
    convertedData[key] = parseFloat(rawData[key]) || 0;
  }
  return convertedData;
});

// Draw/Update Pie Chart
const drawChart = () => {
  if (!pieChartCanvas.value) return;

  if (pieChartInstance) {
    pieChartInstance.destroy();
  }

  const config = {
    type: 'pie',
    data: {
      labels: Object.keys(processedIndustryBreakdown.value),
      datasets: [
        {
          data: Object.values(processedIndustryBreakdown.value),
          backgroundColor: [
            '#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56', '#A569BD',
            '#8E44AD', '#2ECC71', '#E74C3C', '#3498DB', '#F39C12'
          ],
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'black',
            font: { size: 18 }
          }
        }
      }
    }
  };

  const ctx = pieChartCanvas.value.getContext('2d');
  if (ctx) {
    pieChartInstance = new Chart(ctx, config);
  }
};

// Watch for changes in industry breakdown
watch(processedIndustryBreakdown, () => {
  drawChart();
}, { deep: true });

// Initial chart render
onMounted(() => {
  drawChart();
});
</script>

<template>
  <div class="investor-stats-container">

    <div class="content-wrapper">
      <!-- Left Section: Basic Stats + Industry Breakdown -->
      <div class="text-data">
        <!-- Basic Stats -->
        <div class="stats-container">
          <h3>Basic Stats</h3>
          <ul class="stats-list">
            <li v-for="(value, key) in processedBasicStats" :key="key">
              <strong>{{ key }}:</strong> {{ value }}
            </li>
          </ul>
        </div>

        <!-- Industry Breakdown -->
        <div class="stats-container">
          <h3>Industry Breakdown</h3>
          <ul class="stats-list">
            <li v-for="(value, key) in processedIndustryBreakdown" :key="key">
              <strong>{{ key }}:</strong> {{ value }}%
            </li>
          </ul>
        </div>
      </div>

      <!-- Right Section: Pie Chart -->
      <div class="pie-chart-section">
        <h3 class="pie-chart-title">Market Value</h3>
        <div class="pie-chart-container">
          <canvas ref="pieChartCanvas"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>
