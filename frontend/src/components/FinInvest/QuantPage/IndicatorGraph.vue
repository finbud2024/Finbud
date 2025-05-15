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
        text: '20-Day SMA: AAPL vs MSFT'
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Date' },
        ticks: { maxTicksLimit: 10 }
      },
      y: {
        title: { display: true, text: 'SMA Value (USD)' }
      }
    }
  }
  
  // Compute Simple Moving Average
  function computeSMA(dataArray, windowSize) {
    const sma = []
    for (let i = 0; i < dataArray.length; i++) {
      if (i < windowSize - 1) {
        sma.push(null)
      } else {
        const window = dataArray.slice(i - windowSize + 1, i + 1)
        const sum = window.reduce((acc, val) => acc + val, 0)
        sma.push(sum / windowSize)
      }
    }
    return sma
  }
  
  // Helper to parse CSV and return date-aligned data
  const parseCSV = async (url) => {
    const response = await fetch(url)
    const text = await response.text()
  
    return new Promise((resolve) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = []
          for (const row of results.data) {
            if (row.Date && row.Close) {
              data.push({ date: row.Date, close: parseFloat(row.Close) })
            }
          }
          resolve(data.sort((a, b) => new Date(a.date) - new Date(b.date)))
        }
      })
    })
  }
  
  // Load, compute SMA, and chart
  onMounted(async () => {
    const aapl = await parseCSV('/AAPL.csv')
    const msft = await parseCSV('/MSFT.csv')
  
    const dates = aapl.map(entry => entry.date)
    const aaplCloses = aapl.map(entry => entry.close)
    const msftCloses = msft.map(entry => entry.close)
  
    const smaAAPL = computeSMA(aaplCloses, 50)
    const smaMSFT = computeSMA(msftCloses, 50)
  
    chartData.value = {
      labels: dates,
      datasets: [
        {
          label: 'AAPL 20-Day SMA',
          data: smaAAPL,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3
        },
        {
          label: 'MSFT 20-Day SMA',
          data: smaMSFT,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.3
        }
      ]
    }
  })
  </script>
  