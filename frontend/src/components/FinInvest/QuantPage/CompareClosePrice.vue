<template>
  <div>
    <Line v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import Papa from 'papaparse'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const chartData = ref(null)

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true },
    title: {
      display: true,
      text: 'AAPL vs MSFT Close Prices'
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
}

// Helper to parse CSV text
const parseCSV = async (url) => {
  const response = await fetch(url)
  const text = await response.text()

  return new Promise((resolve) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = {}
        for (const row of results.data) {
          if (row.Date && row.Close) {
            parsed[row.Date] = parseFloat(row.Close)
          }
        }
        resolve(parsed)
      }
    })
  })
}

// Load both datasets and build chart
onMounted(async () => {
  const aaplData = await parseCSV('/AAPL.csv')
  const msftData = await parseCSV('/MSFT.csv')

  // Merge dates and align
  const dates = Array.from(new Set([...Object.keys(aaplData), ...Object.keys(msftData)]))
    .sort((a, b) => new Date(a) - new Date(b))

  const aaplPrices = dates.map(date => aaplData[date] ?? null)
  const msftPrices = dates.map(date => msftData[date] ?? null)

  chartData.value = {
    labels: dates,
    datasets: [
      {
        label: 'AAPL',
        data: aaplPrices,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3
      },
      {
        label: 'MSFT',
        data: msftPrices,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.3
      }
    ]
  }
})
</script>
