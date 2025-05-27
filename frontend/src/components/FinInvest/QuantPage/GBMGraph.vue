<template>
  <div class="gbm-graph">
    <h2>GBM Simulation: {{ tickerA || 'None' }} vs {{ tickerB || 'None' }} vs {{ tickerC || 'None' }}</h2>
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
  tickerA: { type: String, required: false },
  tickerB: { type: String, required: false },
  tickerC: { type: String, required: false },
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
  const datasets = []
  const labels = Array.from({ length: 252 }, (_, i) => i)
  const steps = 252
  const T = 1

  if (!props.tickerA && !props.tickerB && !props.tickerC) {
    renderBlankChart()
    return
  }

  if (props.tickerA) {
    const dataA = await fetchCSVData(props.tickerA)
    const returnsA = calculateReturns(dataA)
    const { mu, sigma } = calculateMeanAndStd(returnsA)
    const S0 = parseFloat(dataA.at(-1)['Close'])
    const pathA = simulateGBM(S0, mu, sigma, T, steps)

    datasets.push({
      label: props.tickerA,
      data: pathA,
      borderColor: 'blue',
      borderWidth: 2,
      fill: false,
    })
  }

  if (props.tickerB) {
    const dataB = await fetchCSVData(props.tickerB)
    const returnsB = calculateReturns(dataB)
    const { mu, sigma } = calculateMeanAndStd(returnsB)
    const S0 = parseFloat(dataB.at(-1)['Close'])
    const pathB = simulateGBM(S0, mu, sigma, T, steps)

    datasets.push({
      label: props.tickerB,
      data: pathB,
      borderColor: 'green',
      borderWidth: 2,
      fill: false,
    })
  }
    if (props.tickerC) {
    const dataC = await fetchCSVData(props.tickerC)
    const returnsC = calculateReturns(dataC)
    const { mu, sigma } = calculateMeanAndStd(returnsC)
    const S0 = parseFloat(dataC.at(-1)['Close'])
    const pathC = simulateGBM(S0, mu, sigma, T, steps)

    datasets.push({
      label: props.tickerC,
      data: pathC,
      borderColor: 'red',
      borderWidth: 2,
      fill: false,
    })
  }

  renderChart(labels, datasets)
}

function renderChart(labels, datasets) {
  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels,
      datasets,
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

function renderBlankChart() {
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: Array.from({ length: 252 }, (_, i) => i),
      datasets: [],
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




onMounted(() => {
  renderBlankChart()
})

watch(() => [props.tickerA, props.tickerB, props.tickerC], loadAndSimulate, { immediate: true })
</script>

<style scoped>
.gbm-graph {
  max-width: 1000px;
  margin: 2rem auto;
}
</style>
