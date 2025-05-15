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
        text: 'Cumulative Return: AAPL vs MSFT'
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Date' },
        ticks: { maxTicksLimit: 10 }
      },
      y: {
        title: { display: true, text: 'Cumulative Return (%)' },
        ticks: {
          callback: value => `${value}%`
        }
      }
    }
  }
  
  // CSV parser helper
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
  
  // Cumulative return calculator
  const computeCumulativeReturn = (prices) => {
    const base = prices[0]
    return prices.map((price, i) =>
      i === 0 ? 0 : ((price - base) / base) * 100
    )
  }
  
  onMounted(async () => {
    const aapl = await parseCSV('/AAPL.csv')
    const msft = await parseCSV('/MSFT.csv')
  
    const dates = aapl.map(entry => entry.date)
    const aaplCloses = aapl.map(entry => entry.close)
    const msftCloses = msft.map(entry => entry.close)
  
    const aaplReturn = computeCumulativeReturn(aaplCloses)
    const msftReturn = computeCumulativeReturn(msftCloses)
  
    chartData.value = {
      labels: dates,
      datasets: [
        {
          label: 'AAPL Return (%)',
          data: aaplReturn,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.3
        },
        {
          label: 'MSFT Return (%)',
          data: msftReturn,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.3
        }
      ]
    }
  })
  </script>
  