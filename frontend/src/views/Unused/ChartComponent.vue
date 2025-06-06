<template>
    <div>
      <canvas :id="chartId"></canvas>
    </div>
  </template>
  
  <script>
  import { Line, Bar } from 'vue-chartjs'
  
  export default {
    name: 'ChartComponent',
    props: ['chartData', 'options', 'chartType'],
    data() {
      return {
        chartId: 'chart-' + Math.random().toString(36).substr(2, 9)
      }
    },
    watch: {
      chartData() {
        this.renderChart(this.chartData, this.options)
      }
    },
    mounted() {
      this.renderChart(this.chartData, this.options)
    },
    methods: {
      renderChart(data, options) {
        const ctx = document.getElementById(this.chartId).getContext('2d')
        if (this.chartType === 'line') {
          new Line(ctx, { data, options })
        } else if (this.chartType === 'bar') {
          new Bar(ctx, { data, options })
        } else if (this.chartType === 'candlestick') {
          new Chart(ctx, {
            type: 'candlestick',
            data,
            options
          })
        }
      }
    }
  }
  </script>
  