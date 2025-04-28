<template>
    <div class="calendar-container">
  
      <b-table :items="earningItems" :fields="fields" bordered striped small hover>
        <template #cell(reportDate)="data">
          {{ formatDate(data.item.reportDate) }}
        </template>
        <template #cell(fiscalDateEnding)="data">
          {{ formatDate(data.item.fiscalDateEnding) }}
        </template>
      </b-table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { BTable } from 'bootstrap-vue-3';
  import { getEarningCalendars } from '@/services/finDataService';
  
  const earningItems = ref([]);
  
  const fields = [
    { key: 'symbol', label: 'Ticker' },
    { key: 'name', label: 'Company Name' },
    { key: 'reportDate', label: 'Report Date' },
    { key: 'fiscalDateEnding', label: 'Fiscal Period Ending' },
    { key: 'estimate', label: 'Estimate' },
    { key: 'currency', label: 'Currency' },
  ];
  
  onMounted(async () => {
    try {
      const data = await getEarningCalendars();
      earningItems.value = data || [];
    } catch (error) {
      console.error('Error loading earning calendar', error);
    }
  });
  
  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
  
  .company-summary-container {
    width: 100%;
    padding: 2rem;
    background-color: #fafafa;
    border-radius: 0.75rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  
  .table th,
  .table td {
    vertical-align: middle;
  }
  </style>
  