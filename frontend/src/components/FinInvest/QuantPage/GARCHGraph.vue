<template>
  <div class="garch-graph">
    <h2>GARCH Simulation: {{ tickerA }} vs {{ tickerB }}</h2>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend } from 'chart.js'
import Papa from 'papaparse'
import axios from 'axios'
import seedrandom from 'seedrandom'

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend)

const props = defineProps({
  tickerA: String,
  tickerB: String,
  indicator: String,
  returnType: String
})

const chartCanvas = ref(null)
let chartInstance = null

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

// Simple GARCH(1,1) model with fixed alpha, beta, omega
function simulateGARCH(S0, returns, T = 1, steps = 252, seed = 'default') {
  const omega = 0.000001
  const alpha = 0.05
  const beta = 0.94
  const dt = T / steps
  const path = [S0]
  const rng = seedrandom(seed)

  // Use historical volatility as starting point
  let sigma2 = returns.reduce((sum, r) => sum + r * r, 0) / returns.length

  for (let i = 1; i <= steps; i++) {
    const rand = rng()
    const Z = Math.sqrt(-2.0 * Math.log(rand)) * Math.cos(2.0 * Math.PI * rand)

    // Update variance using GARCH(1,1)
    const lastReturn = Math.log(path[i - 1] / path[i - 2] || 1)
    sigma2 = omega + alpha * (lastReturn ** 2) + beta * sigma2
    const sigma = Math.sqrt(sigma2)

    const next = path[i - 1] * Math.exp(-0.5 * sigma ** 2 * dt + sigma * Math.sqrt(dt) * Z)
    path.push(next)
  }

  return path
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
          borderColor: 'red',
          borderWidth: 2,
          fill: false
        },
        {
          label: props.tickerB,
          data: pathB,
          borderColor: 'orange',
          borderWidth: 2,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'GARCH Simulated Stock Prices'
        },
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Price ($)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Time Steps'
          }
        }
      }
    }
  })
}

async function loadAndSimulate() {
  if (!props.tickerA || !props.tickerB) return

  const dataA = await fetchCSVData(props.tickerA)
  const dataB = await fetchCSVData(props.tickerB)

  const returnsA = calculateReturns(dataA)
  const returnsB = calculateReturns(dataB)

  const S0A = parseFloat(dataA.at(-1)['Close'])
  const S0B = parseFloat(dataB.at(-1)['Close'])

  const pathA = simulateGARCH(S0A, returnsA, 1, 252, props.tickerA)
  const pathB = simulateGARCH(S0B, returnsB, 1, 252, props.tickerB)

  renderChart(pathA, pathB)
}

watch(() => [props.tickerA, props.tickerB], loadAndSimulate, { immediate: true })
</script>

<style scoped>
.garch-graph {
  max-width: 1000px;
  margin: 2rem auto;
}
</style>
