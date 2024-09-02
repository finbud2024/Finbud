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
      let cumulativeBalance = 0;  // Initialize cumulative balance

      // Create arrays for labels and data
      const labels = [];
      const data = [];
      const pointColors = [];

      this.transactions.forEach(transaction => {
        // Format the date for the x-axis labels
        const dateLabel = new Date(transaction.date).toLocaleDateString();
        labels.push(dateLabel);

        // Update cumulative balance based on transaction type
        if (transaction.type === 'Income') {
          cumulativeBalance += transaction.amount;
        } else if (transaction.type === 'Expense') {
          cumulativeBalance -= transaction.amount;
        }

        // Push the data point including the cumulative balance
        data.push({
          x: dateLabel,
          y: cumulativeBalance,  // Use cumulative balance for y value
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description
        });

        // Determine point colors based on transaction type
        pointColors.push(transaction.type === 'Income' ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)');
      });

      const chartData = {
        labels: labels,
        datasets: [{
          label: 'Balance Change',
          data: data,  // Data now holds cumulative balance
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
                title: function (context) {
                  return context[0].label;
                },
                label: function (context) {
                  const transaction = context.raw;
                  const type = transaction.type || 'N/A';
                  const amount = transaction.amount || 'N/A';
                  const description = transaction.description || 'N/A';
                  const balance = transaction.y; // Y value represents cumulative balance

                  // Format the amount with a minus sign for expenses
                  const formattedAmount = type === 'Expense' ? `-${amount}` : amount;
                  const typeLabel = type === 'Income' ? 'Income' : type === 'Expense' ? 'Expense' : type;

                  return [
                    `Transaction Type: ${typeLabel}`,
                    `Change Amount: ${formattedAmount}`,
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
