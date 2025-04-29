<template>
  <div class="chart-wrapper">
    <canvas
      v-if="hasData"
      ref="transactionChart"
      id="transaction-line-chart"
    ></canvas>
    <div v-else class="no-data-message">
      <p>No transaction data available to display.</p>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  name: "TransactionLine",
  props: {
    transactions: {
      type: Array,
      required: true,
    },
    showForecast: { type: Boolean, default: false }
  },
  data() {
    return {
      chart: null,
      hasData: false,
      chartInitialized: false,
      chartReady: false,
      mountTimer: null,
      // resizeTimer: null,
      activatedTimer: null,
      chartId: "transaction-line-chart",
      retryCount: 0,
      maxRetries: 3,
      watchTimer: null,
    };
  },
  methods: {
    // Thêm phương thức để reset component hoàn toàn
    resetComponent() {
      this.destroyChart();
      this.retryCount = 0;
      this.hasData = this.transactions && this.transactions.length > 0;

      // Đợi DOM cập nhật sau khi thay đổi key
      this.$nextTick(() => {
        if (this.hasData) {
          setTimeout(() => {
            this.generateChart();
          }, 300);
        }
      });
    },

    generateChart() {
  if (!this.transactions || this.transactions.length === 0) {
    this.hasData = false;
    return;
  }

  this.hasData = true;

  this.$nextTick(() => {
    const canvas = this.$refs.transactionChart;
    if (!canvas) {
      console.warn("Canvas not found, skipping chart generation.");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.warn("Canvas context not available.");
      return;
    }

    this.destroyChart(); // Clean up any existing chart

    const sortedTransactions = [...this.transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Prepare chart data
    const formatted = sortedTransactions.map(tx => ({
      type: tx.amount > 0 ? "Expense" : "Income",
      amount: Math.abs(tx.amount),
      date: tx.date,
      description: tx.name || tx.description || tx.merchant_name || "Transaction"
    }));

    let balance = 0;
    const labels = [], data = [], pointColors = [];

    const timePoints = [];
    const balancePoints = [];

    formatted.forEach((tx, i) => {
      const label = new Date(tx.date).toLocaleDateString();
      labels.push(label);
      balance += tx.type === "Income" ? tx.amount : -tx.amount;

      data.push({ x: label, y: balance, ...tx });
      pointColors.push(
        tx.type === "Income" ? "rgba(0,255,0,0.5)" : "rgba(255,0,0,0.5)"
      );

      timePoints.push(i);
      balancePoints.push(balance);
    });

    // Linear forecast for next 90 days (if enabled)
    let forecastDataset = [];
    if (this.showForecast && timePoints.length >= 2) {
      const n = timePoints.length;
      const meanX = timePoints.reduce((sum, x) => sum + x, 0) / n;
      const meanY = balancePoints.reduce((sum, y) => sum + y, 0) / n;
      const numerator = timePoints.reduce((sum, x, i) => sum + (x - meanX) * (balancePoints[i] - meanY), 0);
      const denominator = timePoints.reduce((sum, x) => sum + Math.pow(x - meanX, 2), 0);
      const slope = numerator / denominator;
      const intercept = meanY - slope * meanX;

      for (let i = 1; i <= 90; i++) {
        const futureIndex = timePoints.length + i;
        const futureDate = new Date(new Date(sortedTransactions[sortedTransactions.length - 1].date).getTime() + i * 86400000);
        const futureLabel = futureDate.toLocaleDateString();
        labels.push(futureLabel);
        forecastDataset.push({ x: futureLabel, y: slope * futureIndex + intercept });
      }

      forecastDataset = forecastDataset.filter(pt => pt.x && typeof pt.y === "number" && !isNaN(pt.y));

    }

    const config = {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Balance Change",
          data,
          borderColor: "rgba(0, 123, 255, 0.6)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          pointBackgroundColor: pointColors,
          pointBorderColor: pointColors,
        },
        ...(this.showForecast ? [{
          label: "Forecast (Linear)",
          data: forecastDataset,
          borderColor: "rgba(0, 123, 255, 0.6)",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        }] : [])
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "DAILY TRANSACTION OVERVIEW" },
          tooltip: {
            callbacks: {
              title: ctx => ctx[0].label,
              label: ctx => {
                const tx = ctx.raw;
                return [
                  `Transaction Type: ${tx.type || 'Forecast'}`,
                  `Change Amount: ${tx.amount ? (tx.type === "Expense" ? "-" : "+") + "$" + tx.amount : ""}`,
                  `Description: ${tx.description || ""}`,
                  `Account Balance: $${tx.y?.toFixed(2) ?? ""}`
                ];
              }
            }
          }
        },
        scales: {
          x: { title: { display: true, text: "Date" } },
          y: { title: { display: true, text: "Account Balance ($)" }, beginAtZero: true }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  });
},


    // Destroy chart method
    destroyChart() {
      try {
        // Check if there's a chart instance
        if (this.chart) {
          this.chart.destroy();
          this.chart = null;
        }

        // Also check using Chart.js utility for any chart in the canvas
        const canvas = this.$refs.transactionChart;
        if (canvas) {
          const existingChart = Chart.getChart(canvas);
          if (existingChart) {
            existingChart.destroy();
          }
        }
      } catch (error) {
        console.error("Error destroying chart:", error);
      }

      this.chartInitialized = false;
    },

    // Thêm phương thức để khởi tạo lại chart khi cần thiết
    reinitializeChart() {
      if (this.watchTimer) clearTimeout(this.watchTimer);
      this.watchTimer = setTimeout(() => {
        this.destroyChart();
        this.generateChart();
      }, 300); // debounce to avoid rapid-fire re-renders
    },

    // Xử lý resize với debounce để tránh gọi quá nhiều lần
    // handleResize() {
    //   if (this.resizeTimer) {
    //     clearTimeout(this.resizeTimer);
    //   }
    //   this.resizeTimer = setTimeout(() => {
    //     this.reinitializeChart();
    //   }, 300);
    // },

    // Tách method riêng để dễ tái sử dụng
    cleanupResources() {
      // Hủy tất cả timers
      if (this.mountTimer) {
        clearTimeout(this.mountTimer);
        this.mountTimer = null;
      }

      // if (this.resizeTimer) {
      //   clearTimeout(this.resizeTimer);
      //   this.resizeTimer = null;
      // }

      if (this.activatedTimer) {
        clearTimeout(this.activatedTimer);
        this.activatedTimer = null;
      }

      if (this.watchTimer) {
        clearTimeout(this.watchTimer);
        this.watchTimer = null;
      }

      // Reset retry count
      this.retryCount = 0;

      // Hủy event listener
      // window.removeEventListener("resize", this.handleResize);

      // Hủy chart
      this.destroyChart();
    },
  },
  watch: {
    transactions: {
      immediate: true,
      deep: true,
      handler(newTransactions, oldTransactions) {
        const newStr = JSON.stringify(newTransactions);
        const oldStr = JSON.stringify(oldTransactions);

        if (newStr !== oldStr) {
          console.log("Valid transactions received, drawing chart...");
          this.hasData = true;
          this.reinitializeChart();
        } else {
          console.log("Transactions unchanged, skipping chart redraw");
        }
      }
    },
    showForecast() {
      this.reinitializeChart();
    }
  },

  mounted() {
    // window.addEventListener("resize", this.handleResize);
  },

  activated() {
    if (!this.chart && this.transactions.length > 0) {
      this.$nextTick(() => {
        this.activatedTimer = setTimeout(() => {
          this.reinitializeChart();
        }, 300);
      });
    }
  },

  deactivated() {
    // Khi component bị deactivate, hủy chart để tránh memory leak
    this.cleanupResources();
  },
  beforeDestroy() {
    // Đảm bảo dọn dẹp tài nguyên khi component bị hủy
    this.cleanupResources();
  },
};
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 300px; /* Chiều cao cố định để đảm bảo biểu đồ hiển thị đúng */
  margin: 0 auto;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}

.no-data-message {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  color: #666;
  font-size: 16px;
  text-align: center;
}
</style>