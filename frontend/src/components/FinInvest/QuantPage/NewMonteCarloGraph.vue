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
      title: { display: true, text: t('quantPage.MonteCarloSimulation') }
    },
    scales: {
      x: { title: { display: true, text:  t('quantPage.Date') } },
      y: { title: { display: true, text: t('quantPage.Value') } }
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
  .p-4 {
    padding: 1rem;
    background: var(--quant-card-background);
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }
  
  .p-4:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
  
  .text {
    font-size: 1rem;
    font-weight: 500;
    color: var(--quant-text-color);
    margin-right: 1rem;
  }
  
  select {
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.95rem;
    color: var(--quant-text-color);
    background-color: var(--quant-background);
    transition: all 0.2s ease;
    cursor: pointer;
    min-width: 120px;
  }
  
  select:hover {
    border-color: #cbd5e1;
  }
  
  select:focus {
    outline: none;
    border-color: #94a3b8;
    box-shadow: 0 0 0 2px rgba(148, 163, 184, 0.1);
  }
  
  .mt-4 {
    margin-top: 1rem;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.5s ease forwards;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Loading animation */
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--quant-text-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Error state */
  .error {
    padding: 1rem;
    background: #fee2e2;
    border: 1px solid #ef4444;
    border-radius: 8px;
    color: #b91c1c;
    margin: 1rem 0;
  }
  
  /* Success animation */
  .success-enter-active {
    animation: bounceIn 0.5s ease-out;
  }
  
  @keyframes bounceIn {
    0% {
      transform: scale(0.3);
      opacity: 0;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
    70% { transform: scale(0.9); }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .p-4 {
      padding: 0.75rem;
    }
    
    select {
      width: 100%;
      margin-top: 0.5rem;
    }
    
    .text {
      display: block;
      margin-bottom: 0.5rem;
    }
  }
  </style>
  