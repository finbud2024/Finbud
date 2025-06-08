<template>
  <div class="chart-container">
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
import { useI18n } from 'vue-i18n';
// Register Chart.js components
const { t } = useI18n();
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

// Props
const props = defineProps({
  tickerA: { type: String, required: true },
  tickerB: { type: String, required: true },
  tickerC: { type: String, required: true },
  duration: {
    type: Number,
    default: 1 // Duration in years
  }
});

const chartData = ref(null);

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
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
      title: { display: true, text: t('quantPage.CloseValue')},
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
  const dataC = await parseCSV(`/${props.tickerC}.csv`);

  // Filter based on duration
  const now = new Date();
  const startDate = new Date(now.getFullYear() - props.duration, now.getMonth(), now.getDate());

  const filteredDataA = dataA.filter(d => new Date(d.date) >= startDate);
  const filteredDataB = dataB.filter(d => new Date(d.date) >= startDate);
  const filteredDataC = dataC.filter(d => new Date(d.date) >= startDate);

  const dates = filteredDataA.map(d => d.date);
  const closeA = filteredDataA.map(d => d.close);
  const closeB = filteredDataB.map(d => d.close);
  const closeC = filteredDataC.map(d => d.close);

  chartData.value = {
    labels: dates,
    datasets: [
      {
        label: `${props.tickerA} ${t('quantPage.CloseValue')}`,
        data: closeA,
        borderColor: '#000000',
        backgroundColor: '#000000',
        tension: 0.3
      },
      {
        label: `${props.tickerB} ${t('quantPage.CloseValue')}`,
        data: closeB,
        borderColor: 'green',
        backgroundColor: 'green',
        tension: 0.3
      },
      {
        label: `${props.tickerC} ${t('quantPage.CloseValue')}`,
        data: closeC,
        borderColor: 'red',
        backgroundColor: 'rgba(200, 99, 132, 0.2)',
        tension: 0.3
      }
    ]
  };

  chartOptions.value.plugins.title.text =
    `${t('quantPage.CloseValue')}: ${props.tickerA} vs ${props.tickerB} vs ${props.tickerC} (Last ${props.duration} Year(s))`;
};

// Watch props and reload chart
watch(
  [() => props.tickerA, () => props.tickerB, () => props.tickerC, () => props.duration],
  loadChart,
  { immediate: true }
);
</script>
<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  position: relative;
}
</style>
