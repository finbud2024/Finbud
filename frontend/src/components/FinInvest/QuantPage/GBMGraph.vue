<template>
  <div class="gbm-graph">
    <h2>GBM Simulation: {{ tickerA }} vs {{ tickerB }}</h2>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend } from 'chart.js'
import Papa from 'papaparse'
import axios from 'axios'

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend)

const props = defineProps({
  tickerA: String,
  tickerB: String,
  indicator: String,
  returnType: String,
})

const chartCanvas = ref(null)
let chartInstance = null

function simulateGBM(S0, mu, sigma, T, steps) {
  const dt = T / steps
  const path = [S0]
  for (let j = 1; j <= steps; j++) {
    const rand = Math.random()
    const Z = Math.sqrt(-2.0 * Math.log(rand)) * Math.cos(2.0 * Math.PI * rand)
    const next = path[j - 1] * Math.exp((mu - 0.5 * sigma ** 2) * dt + sigma * Math.sqrt(dt) * Z)
    path.push(next)
  }
  return path
}

async function fetchCSVData(ticker) {
  const response = await axios.get(`/${ticker}.csv`)
  return new Promise((resolve, reject) => {
    Papa.parse(response.data, {
      header: true,
      skipEmptyLines: true,
      complete: results => resolve(results.data),
      error: err => reject(err),
    })
  })
}

function calculateReturns(data) {
  const prices = data.map(row => parseFloat(row['Close']))
  const returns = []
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.log(prices[i] / prices[i - 1]))
  }
  return returns
}

function calculateMeanAndStd(returns) {
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / (returns.length - 1)
  return { mu: mean * 252, sigma: Math.sqrt(variance) * Math.sqrt(252) }
}

async function loadAndSimulate() {
  if (!props.tickerA || !props.tickerB) return

  const dataA = await fetchCSVData(props.tickerA)
  const dataB = await fetchCSVData(props.tickerB)

  const returnsA = calculateReturns(dataA)
  const returnsB = calculateReturns(dataB)

  const { mu: muA, sigma: sigmaA } = calculateMeanAndStd(returnsA)
  const { mu: muB, sigma: sigmaB } = calculateMeanAndStd(returnsB)

  const S0A = parseFloat(dataA.at(-1)['Close'])
  const S0B = parseFloat(dataB.at(-1)['Close'])

  const steps = 252
  const T = 1

  const pathA = simulateGBM(S0A, muA, sigmaA, T, steps)
  const pathB = simulateGBM(S0B, muB, sigmaB, T, steps)

  renderChart(pathA, pathB)
}

function renderChart(pathA, pathB) {
  if (chartInstance) chartInstance.destroy()

  const labels = Array.from({ length: pathA.length }, (_, i) => i)

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: props.tickerA,
          data: pathA,
          borderColor: 'blue',
          borderWidth: 2,
          fill: false,
        },
        {
          label: props.tickerB,
          data: pathB,
          borderColor: 'green',
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'GBM Simulated Stock Prices',
        },
        legend: {
          position: 'top',
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Price ($)',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Time Steps',
          },
        },
      },
    },
  })
}

watch(() => [props.tickerA, props.tickerB], loadAndSimulate, { immediate: true })
</script>

<style scoped>
.gbm-graph {
  max-width: 1000px;
  margin: 2rem auto;
}
</style>
