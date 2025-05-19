
<!--Close Price Compare using Alpha Vantage-->
<template>
    <div class="chart-container">
      <canvas ref="chartRef"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
  import { Chart, registerables } from 'chart.js';
  import axios from 'axios';
  
  Chart.register(...registerables);
  
  const props = defineProps({
    symbols: {
      type: Array,
      required: true,
    },
  });
  
  const chartRef = ref(null);
  let chartInstance = null;
  const apiKey = process.env.VUE_APP_ALPHA_VANTAGE_API_KEY;
  
  const fetchDataForSymbol = async (symbol) => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${apiKey}`;
    const response = await axios.get(url);
    const timeSeries = response.data['Time Series (Daily)'];
    if (!timeSeries) throw new Error(`Invalid response for ${symbol}`);
  
    const dates = Object.keys(timeSeries).sort();
    const closePrices = dates.map((date) => parseFloat(timeSeries[date]['4. close']));
    return { symbol, dates, closePrices };
  };
  
  const fetchAllData = async () => {
    try {
      if (!props.symbols || props.symbols.length === 0) {
        console.warn('No symbols provided');
        return;
      }
  
      const stockDataList = await Promise.all(props.symbols.map(fetchDataForSymbol));
      const labels = stockDataList[0].dates;
  
      const datasets = stockDataList.map((stock, i) => ({
        label: `${stock.symbol} Close`,
        data: stock.closePrices,
        borderColor: `hsl(${(i * 60) % 360}, 70%, 50%)`,
        backgroundColor: `hsla(${(i * 60) % 360}, 70%, 50%, 0.2)`,
        fill: true,
        tension: 0.3,
      }));
  
      await nextTick(); // Ensure the DOM is ready
      createChart(labels, datasets);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };
  
  const createChart = (labels, datasets) => {
    if (!chartRef.value) {
      console.error('Chart ref is not available');
      return;
    }
  
    if (chartInstance) {
      chartInstance.destroy();
    }
  
    chartInstance = new Chart(chartRef.value, {
      type: 'line',
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: {
              maxTicksLimit: 10,
              maxRotation: 45,
              minRotation: 45,
            },
          },
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  };
  
  onMounted(() => {
    fetchAllData();
  });
  
  onUnmounted(() => {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  });
  
  // Watch for changes in the symbols prop
  watch(
    () => props.symbols,
    (newSymbols) => {
      if (newSymbols.length > 0) {
        fetchAllData();
      }
    },
    { deep: true }
  );
  </script>
  
  <style scoped>
  .chart-container {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
  
  canvas {
    width: 100%;
    height: 400px;
  }
  </style>