<script setup>
// import { defineProps } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarController,
  LineController
} from 'chart.js'
import { Chart } from 'vue-chartjs'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarController,
  LineController
)

const props = defineProps({
  chartData: Object,
  chartOptions: Object
});
</script>

<template>
  <Chart type="bar" :data="props.chartData" :options="props.chartOptions" />
</template>