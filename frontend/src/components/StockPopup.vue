<template>
    <div>
      <GlobalOverlay :show="true" @close="close" />
      <div class="popup-overlay">
        <div class="popup-content">
          <button class="close-button" @click="close">X</button>
          <h3>{{ stock['01. symbol'] }}</h3>
          <div class="stock-details">
            <p>Price: {{ stock['05. price'] }}</p>
            <p>Change: {{ stock['09. change'] }}</p>
            <p>Change Percent: {{ stock['10. change percent'] }}</p>
          </div>
          <div class="chart-container">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Chart } from 'chart.js/auto';
  import GlobalOverlay from './GlobalOverlay.vue';
  
  export default {
    name: 'StockPopup',
    props: {
      stock: Object,
    },
    components: {
      GlobalOverlay,
    },
    data() {
      return {
        chart: null,
      };
    },
    mounted() {
      this.createChart();
    },
    methods: {
      createChart() {
        const ctx = this.$refs.chartCanvas.getContext('2d');
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
              {
                label: `${this.stock['01. symbol']} Price`,
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      },
      close() {
        if (this.chart) {
          this.chart.destroy();
        }
        this.$emit('close');
      },
    },
    beforeDestroy() {
      if (this.chart) {
        this.chart.destroy();
      }
    },
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;700&display=swap');
  
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
  }
  
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
    opacity: 0;
    animation: fadeIn 0.3s forwards;
  }
  
  .popup-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 600px;
    z-index: 1002;
    position: relative;
    transform: scale(0.7);
    animation: popupShow 0.3s forwards;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    color: #333;
    transition: color 0.3s;
  }
  
  .close-button:hover {
    color: #ff0000;
  }
  
  .stock-details {
    margin-bottom: 20px;
  }
  
  .chart-container {
    width: 100%;
    height: 300px;
  }
  
  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
  
  @keyframes popupShow {
    to {
      transform: scale(1);
    }
  }
  </style>
  