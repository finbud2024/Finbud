<template>
  <div>
    <LineChart :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale);

export default {
  name: 'StockChart',
  components: {
    LineChart: Line
  },
  props: {
    data: Array
  },
  computed: {
    chartData() {
      const showData = this.data.filter(item => item.type === 'show');
      const predictData = this.data.filter(item => item.type === 'predict');

      // Format datetime for both show and predict data
      const showDataFormatted = showData.map(item => ({
        datetime: new Date(item.datetime).toLocaleDateString(),
        close: item.close
      }));

      const filteredPredictData = predictData.map(item => ({
        datetime: new Date(item.datetime).toLocaleDateString(),
        lr: item.lr !== undefined ? item.lr : null,
        rf: item.rf !== undefined ? item.rf : null
      }));

      const actualDataLength = showDataFormatted.length || 1;
      
      const datasets = [
        {
          label: 'Actual Stock Price',
          data: showDataFormatted.map(item => item.close),
          borderColor: '#42A5F5',
          fill: false,
          pointRadius: 4,
          pointBackgroundColor: '#42A5F5',
        },
        ...['lr', 'rf'].map(model => ({
          label: `${model.toUpperCase()} Prediction`,
          data: Array(actualDataLength - 1).fill(null).concat(
        filteredPredictData.map(item => item[model])
          ),
          borderColor: model === 'lr' ? '#FFA500' : '#FF6347',
          fill: false,
          pointRadius: 4,
          pointBackgroundColor: model === 'lr' ? '#FFA500' : '#FF6347',
        }))
      ];
      const labels = showDataFormatted.map(item => item.datetime);
      const predictLabels = filteredPredictData.map(item => item.datetime);
      labels.push(...predictLabels);
      const uniqueLabels = [...new Set(labels)];
      console.log(datasets);
      return {
        labels: uniqueLabels,
        datasets: datasets
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            },
            ticks: {
              maxRotation: 45,  
              minRotation: 30,  
            },
          },
          y: {
            title: {
              display: true,
              text: 'Price ($)'
            },
            ticks: {
              beginAtZero: false,
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                const datasetLabel = tooltipItem.dataset.label || ''; 
                const value = tooltipItem.raw;
                return `${datasetLabel}: $${value}`;
              }
            }
          }
        }
      };
    }
  }
};
</script>

<style scoped>
div {
  width: 100%;
  height: 400px;  
}
</style>
