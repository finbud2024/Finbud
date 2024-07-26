<template>
    <canvas ref="chartCanvas"></canvas>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title } from 'chart.js';
  
  // Register the necessary components
  Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title);
  
  export default {
    name: 'StockChart',
    setup() {
      const chartCanvas = ref(null);
  
      onMounted(() => {
        const ctx = chartCanvas.value.getContext('2d');
        new Chart(ctx, {
          type: 'line',  // Ensure the type is 'line'
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
              label: 'Stock Price',
              data: [65, 59, 80, 81, 56, 55, 40],
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Stock Price Chart'
              }
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: 'Month'
                },
                type: 'category'  // Specify the scale type
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: 'Value'
                }
              }
            }
          }
        });
      });
  
      return {
        chartCanvas
      };
    }
  };
  </script>
  
  <style>
  /* Add your styles here */
  </style>
  