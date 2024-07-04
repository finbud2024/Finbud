<template>
  <div class="chart-wrapper">
    <canvas id="transaction-chart"></canvas>
  </div>
</template>


<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'TransactionLine',
  props: {
    transactions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  methods: {
    generateChart() {
      const labels = this.transactions.map(transaction => new Date(transaction.date).toLocaleDateString());
      const amounts = this.transactions.map(transaction => transaction.amount);
      const descriptions = this.transactions.map(transaction => transaction.description);
      const data = this.transactions.map(transaction => transaction.balance);
      const pointColors = this.transactions.map(transaction => transaction.amount > 0 ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)');

      const chartData = {
        labels: labels,
        datasets: [{
          label: 'Change Amount',
          data: data,
          borderColor: 'rgba(40, 42, 42, 0.5)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          pointBackgroundColor: pointColors,
          pointBorderColor: pointColors,
        }]
      };

      const config = {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'DAILY TRANSACTION OVERVIEW'
            },
            tooltip: {
              callbacks: {
                title: function(context) {
                  return context[0].label;
                },
                label: function(context) {
                  const amount = amounts[context.dataIndex];
                  const description = descriptions[context.dataIndex];
                  const balance = data[context.dataIndex];
                  return [
                    `Change Amount: ${amount}`,
                    `Transaction: ${description}`,
                    `Account Balance: ${balance}`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time Series'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Account Balance'
              }
            }
          },
          elements: {
            point: {
              radius: 5,
              hoverRadius: 7,
            }
          }
        }
      };

      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = document.getElementById('transaction-chart').getContext('2d');
      this.chart = new Chart(ctx, config);
    }
  },
  watch: {
    transactions: {
      deep: true,
      handler() {
        this.generateChart();
      }
    }
  },
  mounted() {
    this.generateChart();
  }
};
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 100% !important; 
}
</style>
