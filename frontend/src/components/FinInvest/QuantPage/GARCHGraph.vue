<template>
    <div class="p-4 space-y-4">
      <div class="flex flex-wrap gap-4">
        <select v-model="selectedRange">
          <option value="0.5">6 Months</option>
          <option value="1">1 Year</option>
          <option value="3">3 Years</option>
          <option value="5">5 Years</option>
        </select>
  
        <select v-model="returnType">
          <option value="price">Price</option>
          <option value="daily">Daily Return (%)</option>
          <option value="cumulative">Cumulative Return (%)</option>
        </select>
  
        <select v-model="indicator">
          <option value="none">None</option>
          <option value="sma">SMA</option>
          <option value="ema">EMA</option>
          <option value="bollinger">Bollinger Bands</option>
        </select>
  
        <button @click="simulate">Simulate</button>
      </div>
  
      <Line v-if="chartData" :data="chartData" :options="chartOptions" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
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
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)
  
  const selectedRange = ref('1') // 1 year by default
  const returnType = ref('price')
  const indicator = ref('none')
  const chartData = ref(null)
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'GBM Stock Simulation' }
    },
    scales: {
      x: { title: { display: true, text: 'Days' } },
      y: { title: { display: true, text: 'Value' } }
    }
  }
  
  // GBM Simulation
  function generateGBM(S0, mu, sigma, T, steps) {
    const dt = T / steps
    const prices = [S0]
    for (let i = 1; i <= steps; i++) {
      const epsilon = Math.random() * 2 - 1
      const prev = prices[i - 1]
      const newPrice = prev * Math.exp((mu - 0.5 * sigma ** 2) * dt + sigma * Math.sqrt(dt) * epsilon)
      prices.push(newPrice)
    }
    return prices
  }
  
  // SMA
  function SMA(data, period) {
    return data.map((_, i) =>
      i < period ? null : data.slice(i - period, i).reduce((sum, val) => sum + val, 0) / period
    )
  }
  
  // EMA
  function EMA(data, period) {
    const ema = []
    const k = 2 / (period + 1)
    ema[0] = data[0]
    for (let i = 1; i < data.length; i++) {
      ema[i] = data[i] * k + ema[i - 1] * (1 - k)
    }
    return ema
  }
  
  // Bollinger Bands
  function BollingerBands(data, period = 20, numStd = 2) {
    const sma = SMA(data, period)
    const upper = []
    const lower = []
  
    for (let i = 0; i < data.length; i++) {
      if (i < period) {
        upper.push(null)
        lower.push(null)
        continue
      }
      const slice = data.slice(i - period, i)
      const mean = sma[i]
      const std = Math.sqrt(slice.reduce((sum, x) => sum + (x - mean) ** 2, 0) / period)
      upper.push(mean + numStd * std)
      lower.push(mean - numStd * std)
    }
    return { sma, upper, lower }
  }
  
  // Return Calculations
  function computeReturns(prices, type) {
    if (type === 'daily') {
      return prices.map((p, i) => (i === 0 ? 0 : ((p - prices[i - 1]) / prices[i - 1]) * 100))
    }
    if (type === 'cumulative') {
      const base = prices[0]
      return prices.map(p => ((p - base) / base) * 100)
    }
    return prices
  }
  
  // Main simulation
  function simulate() {
    const T = parseFloat(selectedRange.value)
    const steps = T * 252
    const S0 = 100
    const mu = 0.1
    const sigma = 0.2
  
    const prices = generateGBM(S0, mu, sigma, T, steps)
    const labels = Array.from({ length: steps + 1 }, (_, i) => `Day ${i}`)
  
    let dataset = {
      label: 'Simulated Price',
      data: computeReturns(prices, returnType.value),
      borderColor: 'blue',
      tension: 0.3
    }
  
    let datasets = [dataset]
  
    if (indicator.value === 'sma') {
      datasets.push({
        label: 'SMA(20)',
        data: SMA(prices, 20),
        borderColor: 'green',
        tension: 0.2
      })
    }
  
    if (indicator.value === 'ema') {
      datasets.push({
        label: 'EMA(20)',
        data: EMA(prices, 20),
        borderColor: 'orange',
        tension: 0.2
      })
    }
  
    if (indicator.value === 'bollinger') {
      const { sma, upper, lower } = BollingerBands(prices)
      datasets.push({
        label: 'SMA (Bollinger)',
        data: sma,
        borderColor: 'gray',
        tension: 0.2
      })
      datasets.push({
        label: 'Upper Band',
        data: upper,
        borderColor: 'red',
        borderDash: [5, 5],
        tension: 0.2
      })
      datasets.push({
        label: 'Lower Band',
        data: lower,
        borderColor: 'red',
        borderDash: [5, 5],
        tension: 0.2
      })
    }
  
    chartData.value = {
      labels,
      datasets
    }
  }
  </script>
  