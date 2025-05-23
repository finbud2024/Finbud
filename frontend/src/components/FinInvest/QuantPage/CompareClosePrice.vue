<template>
  <div>
    <Line v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
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
import Papa from 'papaparse';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

// Props
const props = defineProps({
  tickerA: { type: String, required: true },
  tickerB: { type: String, required: true },
  duration: {
    type: Number,
    default: 1 // Duration in years
  }
});

const chartData = ref(null);

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: { display: true },
    title: {
      display: true,
      text: ''
    }
  },
  scales: {
    x: {
      title: { display: true, text: 'Date' },
      ticks: { maxTicksLimit: 10 }
    },
    y: {
      title: { display: true, text: 'Close Price ($)' },
      ticks: {
        callback: value => `$${value}`
      }
    }
  }
});

// Helper: CSV Parser
const parseCSV = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  return new Promise((resolve) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data
          .filter(row => row.Date && row.Close)
          .map(row => ({ date: row.Date, close: parseFloat(row.Close) }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        resolve(data);
      }
    });
  });
};

// Load and plot close prices
const loadChart = async () => {
  const dataA = await parseCSV(`/${props.tickerA}.csv`);
  const dataB = await parseCSV(`/${props.tickerB}.csv`);

  // Filter based on duration
  const now = new Date();
  const startDate = new Date(now.getFullYear() - props.duration, now.getMonth(), now.getDate());

  const filteredDataA = dataA.filter(d => new Date(d.date) >= startDate);
  const filteredDataB = dataB.filter(d => new Date(d.date) >= startDate);

  const dates = filteredDataA.map(d => d.date);
  const closeA = filteredDataA.map(d => d.close);
  const closeB = filteredDataB.map(d => d.close);

  chartData.value = {
    labels: dates,
    datasets: [
      {
        label: `${props.tickerA} Close Price`,
        data: closeA,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.3
      },
      {
        label: `${props.tickerB} Close Price`,
        data: closeB,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3
      }
    ]
  };

  chartOptions.value.plugins.title.text =
    `Close Prices: ${props.tickerA} vs ${props.tickerB} (Last ${props.duration} Year(s))`;
};

// Watch props and reload chart
watch(
  [() => props.tickerA, () => props.tickerB, () => props.duration],
  loadChart,
  { immediate: true }
);
</script>
