<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { fetchCompanies, fetchOwnershipHistory } from '@/services/investorService';
import CustomChart from '../CustomChart/CustomChart.vue'; 
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  LineController,
  BarController
} from 'chart.js';
import './Companies.css';

ChartJS.register(LineController, BarController, Title, Tooltip, Legend, LineElement, BarElement, PointElement, LinearScale, CategoryScale);

const props = defineProps({
  investorId: String
});

const companies = ref([]);
const selectedCusip = ref(null);
const ownershipHistory = ref([]);

const companyTitle = computed(() => {
  const company = companies.value.find(c => c.cusip === selectedCusip.value);
  return company ? company.companyName : 'Select a Company';
});

const loadCompanies = async () => {
  try {
    companies.value = await fetchCompanies(props.investorId);
    if (companies.value.length > 0) {
      selectedCusip.value = companies.value[0].cusip;
      loadOwnershipHistory();
    }
  } catch (error) {
    console.error("Error loading companies:", error);
  }
};

const loadOwnershipHistory = async () => {
  if (!selectedCusip.value) return;
  try {
    const portfolio = await fetchOwnershipHistory(props.investorId, selectedCusip.value);
    ownershipHistory.value = Object.entries(portfolio.ownershipHistory).map(([quarter, percentage]) => ({
      quarter,
      percentage_of_portfolio: parseFloat(percentage)
    }));
  } catch (error) {
    console.error("Error fetching ownership history:", error);
  }
};

watch(selectedCusip, loadOwnershipHistory);

const chartData = computed(() => ({
  labels: ownershipHistory.value.map(item => item.quarter),
  datasets: [
    {
      type: 'line',
      label: `Portfolio % - ${companyTitle.value} (Line)`,
      data: ownershipHistory.value.map(item => item.percentage_of_portfolio),
      borderColor: '#15803d',
      backgroundColor: 'rgba(21, 128, 61, 0.2)',
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: '#15803d',
      yAxisID: 'y'
    },
    {
      type: 'bar',
      label: `Portfolio % - ${companyTitle.value} (Bar)`,
      data: ownershipHistory.value.map(item => item.percentage_of_portfolio),
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1,
      yAxisID: 'y'
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: '#111827',
        font: { 
          size: 14,
          weight: '500'
        }
      }
    }
  },
  scales: {
    x: {
      ticks: { 
        color: '#374151',
        font: {
          size: 12
        }
      },
      grid: { 
        color: '#e5e7eb',
        drawBorder: false
      }
    },
    y: {
      ticks: {
        color: '#374151',
        font: {
          size: 12
        },
        callback: (value) => `${value}%`
      },
      grid: { 
        color: '#e5e7eb',
        drawBorder: false
      },
      position: 'left'
    }
  }
};

onMounted(loadCompanies);
</script>

<template>
  <div class="companies-container">
    <h2>{{ companyTitle }}</h2>

    <!-- Dropdown to select company -->
    <select v-model="selectedCusip" class="company-dropdown">
      <option v-for="company in companies" :key="company.cusip" :value="company.cusip">
        {{ company.companyName }}
      </option>
    </select>

    <!-- Combined Chart (Line + Bar) -->
    <div class="chart-container">
      <CustomChart :chartData="chartData" :chartOptions="chartOptions" class="chart" /> 
    </div>
  </div>
</template>

<style scoped src="./Companies.css"></style>
