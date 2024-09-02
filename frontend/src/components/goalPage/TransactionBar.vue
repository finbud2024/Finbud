<template>
  <div class="chart-wrapper">
    <canvas id="transaction-bar-chart"></canvas>
    <div v-if="showPopup" class="popup-overlay" @click="closePopup">
      <div class="popup-content" @click.stop>
        <button @click="closePopup">Close</button>
        <h3>Transaction Details for {{ selectedDate }}</h3>
        <ul class="transaction-list">
          <li v-for="(transaction, index) in selectedTransactions" :key="index" class="transaction-item">
            <div class="transaction-block">
              <strong>Date:</strong> {{ new Date(transaction.date).toLocaleString() }}<br>
              <strong>Description:</strong> {{ transaction.description }}<br>
              <strong>Amount:</strong> {{ transaction.amount }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
Chart.register(...registerables, annotationPlugin);

export default {
  name: 'TransactionBar',
  props: {
    transactions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      showPopup: false,
      selectedTransactions: [],
      selectedDate: ''
    };
  },
  methods: {
    generateChart() {
      if (!this.transactions.length) {
        return;
      }

      // Get the initial balance
      const initialBalance = this.transactions[0]?.balance || 0;

      // Get the data by date
      const groupedTransactions = this.transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
      }, {});

      const labels = Object.keys(groupedTransactions);

      // Receiving data
      const receivingData = labels.map(date =>
        groupedTransactions[date]
          .filter(transaction => transaction.type === 'Income')
          .reduce((sum, transaction) => sum + transaction.amount, 0)
      );

      // Spending data
      const spendingData = labels.map(date =>
        groupedTransactions[date]
          .filter(transaction => transaction.type === 'Expense')
          .reduce((sum, transaction) => sum - transaction.amount, 0)
      );

      let previousBalance = 0;  // Initial balance, can be set to a specific value if needed
      const totalChangeData = labels.map(date => {
        const dailyTransactions = groupedTransactions[date];

        // Calculate daily net total by treating Income as positive and Expense as negative
        const dailyNetTotal = dailyTransactions.reduce((sum, transaction) => {
          if (transaction.type === 'Income') {
            return sum + transaction.amount;
          } else if (transaction.type === 'Expense') {
            return sum - transaction.amount;
          }
          return sum; // in case other transaction types exist
        }, 0);

        // Update the running balance with the daily net total
        previousBalance += dailyNetTotal;

        // Return the updated balance for the chart data
        return previousBalance;
      });

      const chartData = {
        labels: labels,
        datasets: [
          {
            label: 'Income',
            data: receivingData,
            backgroundColor: 'rgba(0, 255, 0, 0.5)',
            borderColor: 'rgba(0, 255, 0, 1)',
            borderWidth: 1
          },
          {
            label: 'Expense',
            data: spendingData,
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 1
          },
          {
            label: 'Balance Change',
            data: totalChangeData,
            backgroundColor: 'rgba(171, 171, 171, 0.8)',
            borderColor: 'rgba(171, 171, 171, 1)',
            borderWidth: 1
          }
        ]
      };

      const config = {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            },
            title: {
              display: true,
              text: 'DAILY TRANSACTION OVERVIEW'
            },
            tooltip: {
              callbacks: {
                title: function (context) {
                  return context[0].label;
                },
                label: function (context) {
                  const datasetIndex = context.datasetIndex;
                  const dataIndex = context.dataIndex;
                  const value = context.dataset.data[dataIndex];
                  return `${context.dataset.label}: ${value}`;
                }
              }
            },
            annotation: {
              annotations: {
                line1: {
                  type: 'line',
                  yMin: initialBalance,
                  yMax: initialBalance,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                  label: {
                    content: 'Initial Balance',
                    enabled: true,
                    position: 'end',
                  }
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
                text: 'Amount'
              }
            }
          },
          onClick: this.handleChartClick
        }
      };

      const ctx = document.getElementById('transaction-bar-chart');
      if (ctx) {
        const context = ctx.getContext('2d');
        if (this.chart) {
          this.chart.destroy();
        }
        this.chart = new Chart(context, config);
      }
    },
    handleChartClick(event, elements) {
      if (elements.length > 0) {
        const chart = elements[0].element.$context.chart;
        const datasetIndex = elements[0].datasetIndex;
        const index = elements[0].index;
        const label = chart.data.labels[index];
        this.selectedDate = label;

        if (datasetIndex === 0) { // Receiving column
          this.selectedTransactions = this.transactions.filter(transaction =>
            new Date(transaction.date).toLocaleDateString() === label && transaction.type === 'Income'
          );
        } else if (datasetIndex === 1) { // Spending column
          this.selectedTransactions = this.transactions.filter(transaction =>
            new Date(transaction.date).toLocaleDateString() === label && transaction.type === 'Expense'
          );
        } else { // Total change column
          this.selectedTransactions = this.transactions.filter(transaction =>
            new Date(transaction.date).toLocaleDateString() === label
          );
        }

        this.showPopup = true;
      }
    },
    closePopup() {
      this.showPopup = false;
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
    this.$nextTick(() => {
      this.generateChart();
    });
  }
};
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 100% !important;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.popup-content {
  background: #ffffff;
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  max-height: 80%;
  overflow-y: auto;
  text-align: left;
}

.transaction-list {
  list-style-type: none;
  padding: 0;
}

.transaction-item {
  margin-bottom: 10px;
}

.transaction-block {
  background-color: #99bfe9;
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.popup-content button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.popup-content button:hover {
  background-color: #005bb5;
}
</style>