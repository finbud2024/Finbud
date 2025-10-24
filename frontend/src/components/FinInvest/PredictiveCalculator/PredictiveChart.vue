<template>
  <div class="predictive-chart">
    <div v-if="hasError" class="chart-error">
      <div class="error-icon">📊</div>
      <p>Unable to render chart</p>
    </div>
    <div v-else-if="!hasValidData" class="chart-empty">
      <div class="empty-icon">📈</div>
      <p>No data available</p>
    </div>
    <div v-else class="chart-wrapper">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from "vue";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  models: {
    type: Array,
    default: () => [],
  },
  confidenceLevel: {
    type: Number,
    default: 0.95,
  },
  modelColors: {
    type: Object,
    default: () => ({
      lr: "#22c55e", // Green for Linear Regression
      rf: "#3b82f6", // Blue for Random Forest
      xgb: "#f59e0b", // Orange for XGBoost
      lstm: "#ef4444", // Red for LSTM
      transformer: "#8b5cf6", // Purple for Transformer
      ensemble: "#06b6d4", // Cyan for Ensemble
    }),
  },
});

const chartCanvas = ref(null);
const chartInstance = ref(null);
const hasError = ref(false);
const isInitializing = ref(false);

const hasValidData = computed(() => {
  return props.data && props.data.length > 0;
});

const initChart = async () => {
  if (!chartCanvas.value || !hasValidData.value) return;

  try {
    console.log("Starting chart initialization...", {
      hasCanvas: !!chartCanvas.value,
      dataLength: props.data?.length,
      modelsLength: props.models?.length,
      models: props.models,
    });
    hasError.value = false;

    await nextTick();

    // Additional check after nextTick
    if (!chartCanvas.value) {
      return;
    }

    // Destroy existing chart with better cleanup
    if (chartInstance.value) {
      try {
        // Stop any ongoing animations before destroying
        chartInstance.value.stop();
        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for stop to complete
        chartInstance.value.destroy();
      } catch (destroyError) {
        console.warn("Error destroying chart:", destroyError);
      } finally {
        chartInstance.value = null;
      }
    }

    // Wait longer after destruction to ensure cleanup
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Validate canvas element and context again
    if (!chartCanvas.value) {
      throw new Error("Canvas element not available");
    }

    const ctx = chartCanvas.value.getContext("2d");
    if (!ctx) {
      throw new Error("Unable to get 2D context from canvas");
    }

    // Verify context is still valid
    try {
      ctx.save();
      ctx.restore();
    } catch (contextError) {
      throw new Error("Canvas context is invalid");
    }

    // Prepare data for Chart.js with validation
    const historicalData = props.data.filter(
      (item) =>
        item &&
        item.type === "historical" &&
        item.datetime &&
        typeof item.close === "number"
    );
    const predictionData = props.data.filter(
      (item) => item && item.type === "prediction" && item.datetime
    );

    console.log("Data processing:", {
      totalData: props.data.length,
      historicalCount: historicalData.length,
      predictionCount: predictionData.length,
      samplePrediction: predictionData[0],
      models: props.models,
    });

    const datasets = [];

    // Historical data
    if (historicalData.length > 0) {
      datasets.push({
        label: "Historical Price",
        data: historicalData.map((item) => ({
          x: new Date(item.datetime),
          y: item.close,
        })),
        borderColor: "#1f2937", // Dark gray for Historical Price
        backgroundColor: "#1f2937", // Dark gray for Historical Price
        borderWidth: 2,
        fill: false,
        pointRadius: 1,
        pointHoverRadius: 5,
        tension: 0.1,
        order: 1,
      });
    }

    // Prediction data for each model
    if (props.models && props.models.length > 0) {
      console.log("Processing models:", props.models);
      props.models.forEach((model, index) => {
        console.log(`Processing model: ${model}`);

        const modelPredictions = predictionData.filter(
          (item) =>
            item[model] !== undefined &&
            typeof item[model] === "number" &&
            !isNaN(item[model]) &&
            isFinite(item[model])
        );

        console.log(`Model ${model} predictions:`, {
          totalPredictionData: predictionData.length,
          modelPredictions: modelPredictions.length,
          sampleData: modelPredictions.slice(0, 3),
          hasModelKey: predictionData.some((item) =>
            item.hasOwnProperty(model)
          ),
        });

        if (modelPredictions.length > 0) {
          // Additional validation for ensemble model
          const validData = modelPredictions
            .map((item) => ({
              x: new Date(item.datetime),
              y: item[model],
            }))
            .filter(
              (point) =>
                point.x instanceof Date &&
                !isNaN(point.x.getTime()) &&
                typeof point.y === "number" &&
                !isNaN(point.y) &&
                isFinite(point.y)
            );

          console.log(`Valid data for ${model}:`, validData.length);

          if (validData.length > 0) {
            const dataset = {
              label: getModelName(model),
              data: validData,
              borderColor:
                props.modelColors[model] || `hsl(${index * 60}, 70%, 50%)`,
              backgroundColor:
                props.modelColors[model] || `hsl(${index * 60}, 70%, 50%)`,
              borderWidth: 2.5,
              fill: false,
              pointRadius: 0,
              pointHoverRadius: 6,
              tension: 0.1,
              borderDash: [8, 4],
              order: 2 + index,
              parsing: false, // Disable parsing for better performance
              normalized: true, // Enable normalization
            };

            console.log(`Adding dataset for ${model}:`, dataset);
            datasets.push(dataset);
          }
        }
      });
    } else {
      console.log("No models provided or models array is empty");
    }

    if (datasets.length === 0) {
      throw new Error("No valid datasets to display");
    }

    console.log("Final datasets for chart:", {
      count: datasets.length,
      labels: datasets.map((d) => d.label),
      datasets: datasets,
    });

    // Create chart with additional validation
    const chartConfig = {
      type: "line",
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        backgroundColor: "white",
        devicePixelRatio: window.devicePixelRatio || 1,
        interaction: {
          intersect: false,
          mode: "index",
        },
        animation: {
          duration: 0, // Disable animations to prevent context issues during rapid clicks
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
                family: "Inter, system-ui, sans-serif",
              },
              color: "#374151",
              boxWidth: 12,
              boxHeight: 12,
            },
          },
          tooltip: {
            backgroundColor: "rgba(255, 255, 255, 0.96)",
            titleColor: "#1f2937",
            bodyColor: "#1f2937",
            borderColor: "#e5e7eb",
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            bodyFont: {
              family: "Inter, system-ui, sans-serif",
              size: 13,
            },
            titleFont: {
              family: "Inter, system-ui, sans-serif",
              size: 14,
              weight: 600,
            },
            callbacks: {
              title: function (tooltipItems) {
                if (tooltipItems && tooltipItems[0]) {
                  return new Date(tooltipItems[0].parsed.x).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  );
                }
                return "";
              },
              label: function (context) {
                const value = context.parsed.y;
                if (typeof value === "number" && !isNaN(value)) {
                  return `${context.dataset.label}: $${value.toFixed(2)}`;
                }
                return `${context.dataset.label}: N/A`;
              },
            },
          },
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
              displayFormats: {
                day: "MMM dd",
                week: "MMM dd",
                month: "MMM yyyy",
              },
            },
            grid: {
              color: "#f3f4f6",
              drawBorder: false,
              drawOnChartArea: true,
            },
            ticks: {
              font: {
                family: "Inter, system-ui, sans-serif",
                size: 11,
              },
              color: "#6b7280",
              maxTicksLimit: 8,
            },
            title: {
              display: true,
              text: "Date",
              font: {
                family: "Inter, system-ui, sans-serif",
                size: 12,
                weight: 600,
              },
              color: "#374151",
            },
          },
          y: {
            beginAtZero: false,
            grid: {
              color: "#f3f4f6",
              drawBorder: false,
              drawOnChartArea: true,
            },
            ticks: {
              font: {
                family: "Inter, system-ui, sans-serif",
                size: 11,
              },
              color: "#6b7280",
              callback: function (value) {
                if (typeof value === "number" && !isNaN(value)) {
                  return "$" + value.toFixed(2);
                }
                return value;
              },
              maxTicksLimit: 8,
            },
            title: {
              display: true,
              text: "Price (USD)",
              font: {
                family: "Inter, system-ui, sans-serif",
                size: 12,
                weight: 600,
              },
              color: "#374151",
            },
          },
        },
        elements: {
          line: {
            borderJoinStyle: "round",
            borderCapStyle: "round",
          },
          point: {
            hoverBorderWidth: 3,
          },
        },
      },
    };

    // Create the chart instance with error handling
    try {
      // Final validation before chart creation - we should be initializing at this point
      if (!chartCanvas.value) {
        throw new Error("Canvas element not available during chart creation");
      }

      // Re-validate context one more time
      const finalCtx = chartCanvas.value.getContext("2d");
      if (!finalCtx || finalCtx !== ctx) {
        throw new Error("Context changed during initialization");
      }

      chartInstance.value = new Chart(ctx, chartConfig);

      // Validate chart was created successfully
      if (!chartInstance.value || !chartInstance.value.canvas) {
        throw new Error("Failed to create chart instance");
      }

      // Additional validation - ensure the chart context is the same
      const chartCtx = chartInstance.value.canvas.getContext("2d");
      if (!chartCtx || chartCtx !== ctx) {
        throw new Error("Chart context mismatch");
      }

      console.log("Chart created successfully!");
      hasError.value = false;
    } catch (chartError) {
      console.error("Chart creation error:", chartError);
      if (chartInstance.value) {
        try {
          chartInstance.value.stop();
          chartInstance.value.destroy();
        } catch (e) {
          console.warn("Error destroying failed chart:", e);
        }
        chartInstance.value = null;
      }
      throw chartError;
    }
  } catch (error) {
    console.error("Error initializing chart:", error);
    hasError.value = true;
  }
};

const getModelName = (modelKey) => {
  const names = {
    lr: "Linear Regression",
    rf: "Random Forest",
    xgb: "XGBoost",
    lstm: "LSTM",
    transformer: "Transformer",
    ensemble: "Ensemble",
  };
  return names[modelKey] || modelKey.toUpperCase();
};

// Handle window resize
const handleResize = () => {
  if (chartInstance.value && chartInstance.value.canvas) {
    try {
      // Validate context before resizing
      const ctx = chartInstance.value.canvas.getContext("2d");
      if (ctx) {
        ctx.save();
        ctx.restore();
        chartInstance.value.resize();
      }
    } catch (error) {
      console.warn("Error resizing chart:", error);
      // If resize fails due to context issues, reinitialize
      hasError.value = true;
      debouncedInitChart();
    }
  }
};

// Debounce function to prevent rapid re-initialization
let initTimeout = null;
const debouncedInitChart = () => {
  // Clear any pending initialization
  if (initTimeout) {
    clearTimeout(initTimeout);
    initTimeout = null;
  }

  // Prevent multiple simultaneous initializations
  if (isInitializing.value) {
    console.log("Skipping initialization - already in progress");
    return;
  }

  initTimeout = setTimeout(async () => {
    if (hasValidData.value && !isInitializing.value) {
      isInitializing.value = true;
      try {
        await initChart();
      } catch (error) {
        console.error("Chart initialization failed:", error);
        hasError.value = true;
      } finally {
        isInitializing.value = false;
        initTimeout = null;
      }
    }
  }, 500); // Increased timeout to 500ms for better debouncing
};

// Watch for data changes
watch(
  () => props.data,
  () => {
    debouncedInitChart();
  },
  { deep: true }
);

watch(
  () => props.models,
  () => {
    debouncedInitChart();
  },
  { deep: true }
);

onMounted(async () => {
  window.addEventListener("resize", handleResize);
  // Wait for DOM to be fully rendered before initializing chart
  await nextTick();
  if (hasValidData.value) {
    debouncedInitChart();
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);

  // Clear any pending initialization
  if (initTimeout) {
    clearTimeout(initTimeout);
    initTimeout = null;
  }

  // Destroy chart instance
  if (chartInstance.value) {
    try {
      chartInstance.value.destroy();
    } catch (error) {
      console.warn("Error destroying chart on unmount:", error);
    } finally {
      chartInstance.value = null;
    }
  }
});
</script>

<style scoped>
.predictive-chart {
  width: 100%;
  height: 450px;
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 20px white;
  border: 1px solid #e5e7eb;
}

.chart-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  background: white;
}

.chart-loading,
.chart-error,
.chart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #000000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-icon,
.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #000000;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: #000000;
  transform: translateY(-1px);
}

canvas {
  max-width: 100%;
  max-height: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .predictive-chart {
    height: 350px;
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .predictive-chart {
    height: 300px;
    padding: 0.5rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .predictive-chart {
    background: white;
    border-color: whitesmoke;
  }

  .chart-loading,
  .chart-error,
  .chart-empty {
    color: #cbd5e1;
  }
}

.section-divider {
  border-top: 3px solid #000000;
  margin: 0 0 2rem 0;
}

.filter-btn {
  background: #000000;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: #333333;
}
</style>
