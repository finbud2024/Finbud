<template>
  <div>
    <Line v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const selectedRange = ref('1'); // 1 year by default
const chartData = ref(null);
const chartRef = ref(null); // Reference to the Line chart instance

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true },
    title: { display: true, text: 'GBM Stock Simulation' }
  },
  scales: {
    x: { title: { display: true, text: 'Days' } },
    y: { title: { display: true, text: 'Price' } }
  }
};

// GBM Simulation Function
function generateGBM(S0, mu, sigma, T, steps) {
  const dt = T / steps;
  const prices = [S0];
  for (let i = 1; i <= steps; i++) {
    const epsilon = Math.random() * 2 - 1; // Random value for stochastic process
    const prev = prices[i - 1];
    const newPrice = prev * Math.exp((mu - 0.5 * sigma ** 2) * dt + sigma * Math.sqrt(dt) * epsilon);
    prices.push(newPrice);
  }
  return prices;
}

// Main simulation
const simulate = () => {
  // Destroy the previous chart instance if it exists
  if (chartRef.value && chartRef.value.chart) {
    chartRef.value.chart.destroy();
  }

  const T = parseFloat(selectedRange.value); // Time in years
  const steps = T * 252; // Assuming 252 trading days in a year
  const S0 = 100; // Initial stock price
  const mu = 0.1; // Drift (expected return)
  const sigma = 0.2; // Volatility

  const prices = generateGBM(S0, mu, sigma, T, steps);
  const labels = Array.from({ length: steps + 1 }, (_, i) => `Day ${i}`);

  chartData.value = {
    labels,
    datasets: [
      {
        label: 'Simulated GBM Price',
        data: prices,
        borderColor: 'blue',
        tension: 0.3
      }
    ]
  };
};

// Call simulate on component mount
onMounted(() => {
  simulate();
});
</script>