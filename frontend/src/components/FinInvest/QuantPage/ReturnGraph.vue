<template>
    <div class="chart-container">
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
  import { useI18n } from 'vue-i18n';

  ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);
  
  // Props
  const props = defineProps({
    tickerA: { type: String, required: true },
    tickerB: { type: String, required: true },
    tickerC: { type: String, required: true },
    returnType: {
      type: String,
      default: 'cumulative', // 'daily' or 'cumulative'
      validator: (val) => ['daily', 'cumulative'].includes(val)
    },
    duration: {
      type: Number,
      default: 1 // Duration in years (default: 1 year)
    }
  });
  const { t } = useI18n(); // Initialize the translation function
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
        title: { display: true, text: t('quantPage.Date') },
        ticks: { maxTicksLimit: 10 }
      },
      y: {
        title: { display: true, text: t('quantPage.Returns') },
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
    const dataC = await parseCSV(`/${props.tickerC}.csv`);
  
    // Filter data based on duration
    const now = new Date();
    const startDate = new Date(now.getFullYear() - props.duration, now.getMonth(), now.getDate());
  
    const filteredDataA = dataA.filter(d => new Date(d.date) >= startDate);
    const filteredDataB = dataB.filter(d => new Date(d.date) >= startDate);
    const filteredDataC = dataC.filter(d => new Date(d.date) >= startDate);
  
    const dates = filteredDataA.map(d => d.date);
    const pricesA = filteredDataA.map(d => d.close);
    const pricesB = filteredDataB.map(d => d.close);
    const pricesC = filteredDataC.map(d => d.close);
  
    const returnA = props.returnType === 'daily'
      ? computeDailyReturn(pricesA)
      : computeCumulativeReturn(pricesA);
  
    const returnB = props.returnType === 'daily'
      ? computeDailyReturn(pricesB)
      : computeCumulativeReturn(pricesB);

    const returnC = props.returnType === 'daily'
      ? computeDailyReturn(pricesC)
      : computeCumulativeReturn(pricesC);
  
    chartData.value = {
      labels: dates,
      datasets: [
        {
          label: `${props.tickerA} ${props.returnType} return`,
          data: returnA,
          borderColor: 'blue',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.3
        },
        {
          label: `${props.tickerB} ${props.returnType} return`,
          data: returnB,
          borderColor: 'green',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.3
        },
        {
          label: `${props.tickerC} ${props.returnType} return`,
          data: returnC,
          borderColor: 'red',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          tension: 0.3
        }
      ]
    };
  
    chartOptions.value.plugins.title.text =
      `${props.returnType === 'daily' ? 'Daily' : 'Cumulative'} Return: ${props.tickerA} vs ${props.tickerB} vs ${props.tickerC} (Last ${props.duration} Year(s))`;
  };
  
  watch(
    [() => props.tickerA, () => props.tickerB, () => props.tickerC, () => props.returnType, () => props.duration],
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