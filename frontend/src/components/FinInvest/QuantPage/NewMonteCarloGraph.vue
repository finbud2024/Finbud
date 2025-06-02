<template>
    <div class="p-4">
      <label for="ticker" class="text">{{t('quantPage.SelectTicker') }}</label>
      <select id="ticker" v-model="selectedTicker" class="ml-2 p-1 border rounded">
        <option v-for="ticker in tickers" :key="ticker" :value="ticker">{{ ticker }}</option>
      </select>
  
      <Line v-if="chartData" :data="chartData" :options="chartOptions" class="mt-4" />
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { Line } from 'vue-chartjs';
  import Papa from 'papaparse';
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
  import { useI18n } from 'vue-i18n';
  // Register Chart.js components
  const { t } = useI18n();
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);
  
  // === Configuration ===
  const tickers = ['AAPL', 'MSFT', 'GOOG','TSLA']; // Add available ticker CSVs in /public/
  const selectedTicker = ref('');
  
  const chartData = ref(null);
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Monte Carlo Simulation' }
    },
    scales: {
      x: { title: { display: true, text: 'Days' } },
      y: { title: { display: true, text: 'Simulated Price ($)' } }
    }
  };
  
  // === CSV Loader ===
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
  
  // === Monte Carlo Simulation ===
  function simulateGBMPaths(S0, mu, sigma, days, paths = 50) {
    const dt = 1 / 252;
    const results = [];
  
    for (let i = 0; i < paths; i++) {
      const path = [S0];
      for (let t = 1; t <= days; t++) {
        const prev = path[t - 1];
        const rand = Math.random();
        const Z = Math.sqrt(-2 * Math.log(rand)) * Math.cos(2 * Math.PI * rand);
        const next = prev * Math.exp((mu - 0.5 * sigma ** 2) * dt + sigma * Math.sqrt(dt) * Z);
        path.push(next);
      }
      results.push(path);
    }
  
    return results;
  }
  
  // === Update chart on ticker change ===
  const generateChart = async () => {
    const rawData = await parseCSV(`/${selectedTicker.value}.csv`);
    const closes = rawData.map(d => d.close);
  
    const logReturns = closes.slice(1).map((c, i) => Math.log(c / closes[i]));
    const mu = logReturns.reduce((a, b) => a + b, 0) / logReturns.length;
    const sigma = Math.sqrt(logReturns.reduce((a, b) => a + (b - mu) ** 2, 0) / logReturns.length);
  
    const S0 = closes[closes.length - 1];
    const paths = simulateGBMPaths(S0, mu, sigma, 252);
    const quantTextColor = getComputedStyle(document.documentElement).getPropertyValue('--quant-text-color').trim();
    chartData.value = {
      labels: Array.from({ length: 253 }, (_, i) => i),
      datasets: paths.map((path, index) => ({
        label: `Path ${index + 1}`,
        data: path,
        borderColor: quantTextColor, // Cycle through colors
        borderWidth: 1,
        pointRadius: 0
      }))
    };
  };
  
  watch(selectedTicker, generateChart, { immediate: true });
  </script>
  
  <style scoped>
  select {
    font-family: sans-serif;
  }
  .text{
    color: var(--quant-text-color);
  }
  
  </style>
  