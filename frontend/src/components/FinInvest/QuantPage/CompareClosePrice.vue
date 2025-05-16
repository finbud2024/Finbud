<script setup>
import { ref, onMounted, watch, toRefs } from 'vue';
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

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const props = defineProps({
  tickerA: { type: String, required: true },
  tickerB: { type: String, required: true }
});

// Debug: Log props when they change
watch(() => [props.tickerA, props.tickerB], (newVal) => {
  console.log('Props changed:', newVal);
}, { immediate: true });

const { tickerA, tickerB } = toRefs(props);

const chartData = ref({
  labels: [],
  datasets: []
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    title: {
      display: true,
      text: 'Loading...'
    }
  },
  scales: {
    x: {
      title: { display: true, text: 'Date' },
      ticks: { maxTicksLimit: 10 }
    },
    y: {
      title: { display: true, text: 'Price (USD)' }
    }
  }
});

const parseCSV = async (ticker) => {
  try {
    console.log(`Fetching data for ${ticker}`);
    const response = await fetch(`/${ticker}.csv`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = {};
          for (const row of results.data) {
            if (row.Date && row.Close) {
              parsed[row.Date] = parseFloat(row.Close);
            }
          }
          console.log(`Parsed ${Object.keys(parsed).length} entries for ${ticker}`);
          resolve(parsed);
        },
        error: (error) => {
          console.error(`Error parsing CSV for ${ticker}:`, error);
          resolve({});
        }
      });
    });
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error);
    return {};
  }
};

const loadChartData = async () => {
  if (!tickerA.value || !tickerB.value) {
    console.warn('Missing ticker values:', { tickerA: tickerA.value, tickerB: tickerB.value });
    return;
  }

  try {
    console.log(`Loading data for ${tickerA.value} and ${tickerB.value}`);
    
    const [tickerAData, tickerBData] = await Promise.all([
      parseCSV(tickerA.value),
      parseCSV(tickerB.value)
    ]);

    const dates = Array.from(
      new Set([...Object.keys(tickerAData), ...Object.keys(tickerBData)])
    ).sort((a, b) => new Date(a) - new Date(b));

    console.log(`Found ${dates.length} common dates`);

    chartData.value = {
      labels: dates,
      datasets: [
        {
          label: tickerA.value,
          data: dates.map(date => tickerAData[date] ?? null),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3,
          fill: false
        },
        {
          label: tickerB.value,
          data: dates.map(date => tickerBData[date] ?? null),
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.3,
          fill: false
        }
      ]
    };

    chartOptions.value.plugins.title.text = `${tickerA.value} vs ${tickerB.value} Close Prices`;
    console.log('Chart data loaded successfully');
  } catch (error) {
    console.error('Error loading chart data:', error);
    chartOptions.value.plugins.title.text = 'Error loading data';
  }
};

// Watch for prop changes
watch([tickerA, tickerB], () => {
  console.log('Tickers changed - reloading data');
  loadChartData();
}, { immediate: true });

onMounted(() => {
  console.log('Component mounted');
});
</script>

<template>
  <div class="chart-container">
    <Line
      v-if="chartData.labels.length > 0"
      :data="chartData"
      :options="chartOptions"
    />
    <div v-else class="loading-message">
      Loading chart data...
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}

.loading-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  font-size: 1.2rem;
}
</style>