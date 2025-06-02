<template>
  <div class="garch-graph">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, watch, ref, nextTick } from 'vue'
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend } from 'chart.js'
import Papa from 'papaparse'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
const { t } = useI18n() // Initialize the translation function
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

function simulateGARCH(S0, returns, steps = 252, T = 1, alpha = 0.1, beta = 0.85, omega = 0.000001) {
  const dt = T / steps
  const path = [S0]
  let sigma2 = returns.reduce((sum, r) => sum + r ** 2, 0) / returns.length

  for (let i = 1; i <= steps; i++) {
    const rand = Math.random()
    const Z = Math.sqrt(-2.0 * Math.log(rand)) * Math.cos(2.0 * Math.PI * rand)
    sigma2 = omega + alpha * (returns.at(-1) ** 2) + beta * sigma2
    const sigma = Math.sqrt(sigma2)
    const next = path[i - 1] * Math.exp(-0.5 * sigma ** 2 * dt + sigma * Math.sqrt(dt) * Z)
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

async function loadAndSimulate() {
  if (!chartCanvas.value) return

  const datasets = []
  const labels = Array.from({ length: 252 }, (_, i) => i)
  const steps = 252

  if (!props.tickerA && !props.tickerB && !props.tickerB) {
    renderBlankChart()
    return
  }

  if (props.tickerA) {
    const dataA = await fetchCSVData(props.tickerA)
    const returnsA = calculateReturns(dataA)
    const S0 = parseFloat(dataA.at(-1)['Close'])
    const pathA = simulateGARCH(S0, returnsA, steps)

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
    const S0 = parseFloat(dataB.at(-1)['Close'])
    const pathB = simulateGARCH(S0, returnsB, steps)

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
    const S0 = parseFloat(dataC.at(-1)['Close'])
    const pathC = simulateGARCH(S0, returnsC, steps)

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
  if (!chartCanvas.value) return
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
          text: t('quantPage.GARCHSimulation'),
        },
        legend: {
          position: 'top',
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: t('quantPage.GraphPrice'),
          },
        },
        x: {
          title: {
            display: true,
            text: t('quantPage.TimeStep'),
          },
        },
      },
    },
  })
}

function renderBlankChart() {
  if (!chartCanvas.value) return
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
          text: t('quantPage.GARCHSimulation'),
        },
        legend: {
          position: 'top',
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: t('quantPage.GraphPrice'),
          },
        },
        x: {
          title: {
            display: true,
            text: t('quantPage.TimeStep'),
          },
        },
      },
    },
  })
}

onMounted(async () => {
  await nextTick()
  renderBlankChart()
})

watch(
  () => [props.tickerA, props.tickerB, props.tickerC],
  async () => {
    await nextTick()
    loadAndSimulate()
  },
  { immediate: true }
)
</script>

<style scoped>
.garch-graph {
  max-width: 1000px;
  margin: 2rem auto;
}
</style>
