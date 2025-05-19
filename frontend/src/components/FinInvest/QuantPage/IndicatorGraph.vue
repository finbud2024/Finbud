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
  import { computeSMA, computeEMA, computeRSI, computeMACD, computeBollingerBands } from './backend/functions/indicator.js';
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);
  
  const props = defineProps({
    tickerA: String,
    tickerB: String,
    indicator: {
      type: String,
      default: 'sma'
    },
    period: {
      type: Number,
      default: 20
    },
    returnType: {
      type: String,
      default: 'daily' // or 'cumulative'
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
        title: { display: true, text: 'Value' }
      }
    }
  });
  
  const parseCSV = async (url) => {
    const response = await fetch(url);
    const text = await response.text();
  
    return new Promise((resolve) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = [];
          for (const row of results.data) {
            if (row.Date && row.Close) {
              data.push({ date: row.Date, close: parseFloat(row.Close) });
            }
          }
          resolve(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
        }
      });
    });
  };
  
  const applyIndicator = (prices, indicator, period) => {
    switch (indicator.toLowerCase()) {
      case 'sma': return computeSMA(prices, period);
      case 'ema': return computeEMA(prices, period);
      case 'rsi': return computeRSI(prices, period);
  case 'macd': {
    const { macd, signal } = computeMACD(prices);
    return { macd, signal }; // return both series
  }
      case 'bollinger': return computeBollingerBands(prices, period).middleBand;
      default: return prices;
    }
  };
  
  const loadChartData = async () => {
    if (!props.tickerA || !props.tickerB) {
      console.warn('Missing ticker values:', { tickerA: props.tickerA, tickerB: props.tickerB });
      return;
    }
  
    const dataA = await parseCSV(`/${props.tickerA}.csv`);
    const dataB = await parseCSV(`/${props.tickerB}.csv`);
    const dates = dataA.map(d => d.date);
    const closeA = dataA.map(d => d.close);
    const closeB = dataB.map(d => d.close);
  
    const processedA = applyIndicator(closeA, props.indicator, props.period);
    const processedB = applyIndicator(closeB, props.indicator, props.period);
  
    chartData.value = {
      labels: dates,
      datasets: [
        {
          label: `${props.tickerA} ${props.indicator.toUpperCase()}`,
          data: processedA,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3
        },
        {
          label: `${props.tickerB} ${props.indicator.toUpperCase()}`,
          data: processedB,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.3
        }
      ]
    };
  
    chartOptions.value.plugins.title.text = `${props.period}-Day ${props.indicator.toUpperCase()}: ${props.tickerA} vs ${props.tickerB}`;
  };
  
  // Watch for changes in props and reload the chart
  watch([() => props.tickerA, () => props.tickerB, () => props.indicator, () => props.period], loadChartData, { immediate: true });
  </script>