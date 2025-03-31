<template>
  <div>
    <h2>Correlation Matrix</h2>
    <table v-if="correlationMatrix.length">
      <tr>
        <th></th>
        <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
      </tr>
      <tr v-for="(row, rowIndex) in correlationMatrix" :key="rowIndex">
        <th>{{ headers[rowIndex] }}</th>
        <td
          v-for="(value, colIndex) in row"
          :key="colIndex"
          :style="{ backgroundColor: getColor(value) }"
        >
          {{ value.toFixed(2) }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import csvData from "./assets/economic_indicators.csv";

export default {
  setup() {
    const data = ref([]);
    const headers = ref([]);

    const correlationMatrix = computed(() => {
      if (data.value.length < 2) return [];

      const matrix = [];
      for (let i = 0; i < headers.value.length; i++) {
        matrix[i] = [];
        for (let j = 0; j < headers.value.length; j++) {
          matrix[i][j] = calculateCorrelation(
            data.value.map((row) => row[i]),
            data.value.map((row) => row[j])
          );
        }
      }
      return matrix;
    });

    function calculateCorrelation(x, y) {
      const n = x.length;
      const sumX = x.reduce((a, b) => a + b, 0);
      const sumY = y.reduce((a, b) => a + b, 0);
      const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
      const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
      const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

      const numerator = n * sumXY - sumX * sumY;
      const denominator = Math.sqrt(
        (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
      );

      return numerator / denominator;
    }

    function getColor(value) {
      const r = value < 0 ? 255 : Math.round(255 * (1 - value));
      const b = value > 0 ? 255 : Math.round(255 * (1 + value));
      return `rgb(${r}, 0, ${b})`;
    }

    onMounted(() => {
      // Process the imported CSV data
      if (Array.isArray(csvData) && csvData.length > 0) {
        // Assuming the first row contains headers
        headers.value = Object.keys(csvData[0]).filter((key) => key !== "date");

        // Extract numeric data, excluding the date
        data.value = csvData.map((row) =>
          headers.value.map((header) => parseFloat(row[header]))
        );
      }
    });

    return {
      headers,
      correlationMatrix,
      getColor,
    };
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}
th,
td {
  border: 1px solid black;
  padding: 5px;
  text-align: center;
}
</style>
