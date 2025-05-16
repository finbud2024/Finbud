<template>
  <div>
    <Line v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
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
  returnType: {
    type: String,
    default: 'cumulative', // 'daily' or 'cumulative'
    validator: (val) => ['daily', 'cumulative'].includes(val)
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
      title: { display: true, text: 'Return (%)' },
      ticks: {
        callback: value => `${value}%`
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

// Compute daily return
const computeDailyReturn = (prices) => {
  return prices.map((price, i) =>
    i === 0 ? 0 : ((price - prices[i - 1]) / prices[i - 1]) * 100
  );
};

// Compute cumulative return
const computeCumulativeReturn = (prices) => {
  const base = prices[0];
  return prices.map((price, i) =>
    i === 0 ? 0 : ((price - base) / base) * 100
  );
};

// Load data and compute returns
const loadChart = async () => {
  const dataA = await parseCSV(`/${props.tickerA}.csv`);
  const dataB = await parseCSV(`/${props.tickerB}.csv`);

  const dates = dataA.map(d => d.date);
  const pricesA = dataA.map(d => d.close);
  const pricesB = dataB.map(d => d.close);

  const returnA = props.returnType === 'daily'
    ? computeDailyReturn(pricesA)
    : computeCumulativeReturn(pricesA);

  const returnB = props.returnType === 'daily'
    ? computeDailyReturn(pricesB)
    : computeCumulativeReturn(pricesB);

  chartData.value = {
    labels: dates,
    datasets: [
      {
        label: `${props.tickerA} ${props.returnType} return`,
        data: returnA,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.3
      },
      {
        label: `${props.tickerB} ${props.returnType} return`,
        data: returnB,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3
      }
    ]
  };

  chartOptions.value.plugins.title.text =
    `${props.returnType === 'daily' ? 'Daily' : 'Cumulative'} Return: ${props.tickerA} vs ${props.tickerB}`;
};

watch(
  [() => props.tickerA, () => props.tickerB, () => props.returnType],
  loadChart,
  { immediate: true }
);
</script>
