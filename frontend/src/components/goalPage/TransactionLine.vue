<template>
  <div class="chart-wrapper">
    <canvas
      ref="transactionChart"
      id="transaction-line-chart"
      v-if="hasData"
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
  },
  data() {
    return {
      chart: null,
      hasData: false,
      chartInitialized: false,
      chartReady: false,
      mountTimer: null,
      resizeTimer: null,
      activatedTimer: null,
      chartId: "transaction-line-chart",
      retryCount: 0,
      maxRetries: 3,
      watchTimer: null,
    };
  },
  methods: {
    generateChart() {
      // Kiểm tra xem có dữ liệu giao dịch không
      if (!this.transactions || this.transactions.length === 0) {
        console.log("No transaction data available, skipping chart generation");
        this.hasData = false;
        this.retryCount = 0; // Reset retry count
        return;
      }

      // Set hasData trước để đảm bảo template cập nhật và tạo canvas
      this.hasData = true;

      // Đợi cho DOM cập nhật và tạo canvas
      this.$nextTick(() => {
        // Kiểm tra số lần thử lại
        if (this.retryCount >= this.maxRetries) {
          console.warn(
            `Maximum retry attempts (${this.maxRetries}) reached for chart generation. Giving up.`
          );
          this.retryCount = 0; // Reset for next time
          return;
        }

        // Tăng số lần đã thử
        this.retryCount++;

        // Xóa chart cũ trước khi khởi tạo bất kỳ thứ gì mới
        this.destroyChart();

        // Đảm bảo canvas element tồn tại
        const canvas = document.getElementById(this.chartId);
        if (!canvas) {
          console.error(
            `Canvas element reference not found (attempt ${this.retryCount}/${this.maxRetries})`
          );
          if (this.retryCount < this.maxRetries) {
            setTimeout(() => this.generateChart(), 300);
          } else {
            // Nếu đã thử hết số lần, set hasData về false để hiển thị "No data" message
            this.hasData = false;
            this.retryCount = 0;
          }
          return;
        }

        // Nếu đã tìm thấy canvas, reset retry count
        this.retryCount = 0;

        // Transform API transactions to our format
        const formattedTransactions = this.transactions.map((tx) => ({
          type: tx.amount > 0 ? "Expense" : "Income",
          amount: Math.abs(tx.amount), // Use absolute value and determine type based on sign
          date: tx.date, // Use the date field from API
          description:
            tx.name || tx.description || tx.merchant_name || "Transaction",
        }));

        // Find the initial balance (assuming no initial balance in API, start from 0)
        let initialBalance = 0;
        let cumulativeBalance = initialBalance;

        // Create arrays for labels and data
        const labels = [];
        const data = [];
        const pointColors = [];

        // Process each transaction to update the cumulative balance
        formattedTransactions.forEach((transaction) => {
          // Format the date for the x-axis labels
          const dateLabel = new Date(transaction.date).toLocaleDateString();
          labels.push(dateLabel);

          // Update cumulative balance based on transaction type
          if (transaction.type === "Income") {
            cumulativeBalance += transaction.amount;
          } else if (transaction.type === "Expense") {
            cumulativeBalance -= transaction.amount;
          }

          // Push the data point including the cumulative balance
          data.push({
            x: dateLabel,
            y: cumulativeBalance, // Use cumulative balance for y value
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
          });

          // Determine point colors based on transaction type
          pointColors.push(
            transaction.type === "Income"
              ? "rgba(0, 255, 0, 0.5)"
              : "rgba(255, 0, 0, 0.5)"
          );
        });

        const chartData = {
          labels: labels,
          datasets: [
            {
              label: "Balance Change",
              data: data, // Data now holds cumulative balance
              borderColor: "rgba(40, 42, 42, 0.5)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              pointBackgroundColor: pointColors,
              pointBorderColor: pointColors,
            },
            title: {
              display: true,
              text: "DAILY BALANCE CHANGE",
            },
            tooltip: {
              callbacks: {
                title: function (context) {
                  return context[0].label;
                },
                label: function (context) {
                  const transaction = context.raw;
                  const type = transaction.type || "N/A";
                  const amount = transaction.amount || "N/A";
                  const description = transaction.description || "N/A";
                  const balance = transaction.y; // Y value represents cumulative balance

        const config = {
          type: "line",
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "DAILY TRANSACTION OVERVIEW",
              },
              tooltip: {
                callbacks: {
                  title: function (context) {
                    return context[0].label;
                  },
                  label: function (context) {
                    const transaction = context.raw;
                    const type = transaction.type || "N/A";
                    const amount = transaction.amount || "N/A";
                    const description = transaction.description || "N/A";
                    const balance = transaction.y; // Y value represents cumulative balance

                    // Format the amount with a minus sign for expenses
                    const formattedAmount =
                      type === "Expense" ? `-${amount}` : `+${amount}`;
                    const typeLabel =
                      type === "Income"
                        ? "Income"
                        : type === "Expense"
                        ? "Expense"
                        : type;

                    return [
                      `Transaction Type: ${typeLabel}`,
                      `Change Amount: $${formattedAmount}`,
                      `Description: ${description}`,
                      `Account Balance: $${balance.toFixed(2)}`,
                    ];
                  },
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Date",
              },
            },
            y: {
              title: {
                display: true,
                text: "Account Balance ($)",
              },
              beginAtZero: true,
            },
          },
          elements: {
            point: {
              radius: 5,
              hoverRadius: 5,
            },
          },
          animation: {
            onComplete: () => {
              this.chartReady = true;
            },
          },
        };

        try {
          // Dùng setTimeout để đảm bảo DOM đã render xong và canvas đã sẵn sàng
          setTimeout(() => {
            // Double check - đảm bảo canvas vẫn tồn tại
            const canvas = document.getElementById(this.chartId);
            if (!canvas) {
              console.error("Canvas element not found by ID");
              return;
            }

            // Kiểm tra kích thước canvas
            const width = canvas.offsetWidth;
            const height = canvas.offsetHeight;

            if (width === 0 || height === 0) {
              console.error(
                "Canvas has zero width or height, cannot render chart"
              );
              return;
            }

            // Sử dụng requestAnimationFrame để đảm bảo canvas đã render trước khi lấy context
            requestAnimationFrame(() => {
              try {
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                  console.error("Could not get canvas context");
                  return;
                }

                // Tạo chart mới
                if (Chart.getChart(canvas)) {
                  Chart.getChart(canvas).destroy();
                }

                this.chart = new Chart(ctx, config);
                this.chartInitialized = true;
              } catch (error) {
                console.error(
                  "Error creating chart inside animation frame:",
                  error
                );
              }
            });
          }, 100);
        } catch (error) {
          console.error("Error in chart generation process:", error);
          this.chartInitialized = false;
        }
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
        const canvas = document.getElementById(this.chartId);
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
      // Reset retry count khi gọi lại
      this.retryCount = 0;

      // Trước khi tạo chart mới, hủy chart cũ
      this.destroyChart();

      // Đợi một chút rồi tạo chart mới
      setTimeout(() => {
        if (this.transactions && this.transactions.length > 0) {
          this.generateChart();
        }
      }, 300);
    },

    // Xử lý resize với debounce để tránh gọi quá nhiều lần
    handleResize() {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      this.resizeTimer = setTimeout(() => {
        this.reinitializeChart();
      }, 300);
    },

    // Tách method riêng để dễ tái sử dụng
    cleanupResources() {
      // Hủy tất cả timers
      if (this.mountTimer) {
        clearTimeout(this.mountTimer);
        this.mountTimer = null;
      }

      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = null;
      }

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
      window.removeEventListener("resize", this.handleResize);

      // Hủy chart
      this.destroyChart();
    },
  },
  watch: {
    transactions: {
      immediate: true,
      deep: true,
      handler(newTransactions) {
        if (newTransactions && newTransactions.length > 0) {
          this.hasData = true;
          this.retryCount = 0; // Reset retry counter

          // Timeout để đảm bảo DOM đã cập nhật
          if (this.watchTimer) {
            clearTimeout(this.watchTimer);
            this.watchTimer = null;
          }

          this.watchTimer = setTimeout(() => {
            this.reinitializeChart();
          }, 300);
        } else {
          this.hasData = false;
          // Xử lý trường hợp không có dữ liệu
          this.destroyChart();
          console.log("No transaction data to display in chart");
        }
      },
    },
  },
  mounted() {
    // Đảm bảo DOM đã render hoàn tất trước khi tạo chart
    this.$nextTick(() => {
      // Đợi một chút để đảm bảo DOM đã hiển thị hoàn toàn
      this.mountTimer = setTimeout(() => {
        if (this.transactions && this.transactions.length > 0) {
          this.generateChart();
        }
      }, 300); // Tăng thời gian chờ lên 300ms

      // Đăng ký sự kiện resize để vẽ lại chart khi kích thước thay đổi
      window.addEventListener("resize", this.handleResize);
    });
  },
  activated() {
    // Khi component được kích hoạt lại (với keep-alive), kiểm tra và vẽ lại chart nếu cần
    if (this.transactions && this.transactions.length > 0) {
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
