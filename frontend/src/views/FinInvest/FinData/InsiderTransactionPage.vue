<template>
  <div class="insider-container">
    <b-table 
    :items="paginatedItems"
    :fields="fields"
      fixed
      hover 
      small 
      @row-clicked="toggleExpand"
      select-mode="single"
      class="w-full rounded-lg border"
    >
      <template #cell(name)="data">
        <div>
          <div class="font-bold">{{ data.item.name }}</div>
          <div class="text-gray-500 text-sm">Filed: {{ formatDate(data.item.filingDate) }}</div>
        </div>
      </template>
      <template #row-details="{ item }">
        <b-table-simple fixed class="w-full border-0 m-0">
          <b-tbody>
      <b-tr v-for="(tran, idx) in item.transactions" :key="idx">
        <b-td class="border-0"> Transaction {{ idx + 1 }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </b-td>
        <b-td class="border-0">
          <div class="flex flex-col">
            <div class="font-semibold">{{ transactionMap[tran.code] || 'Other' }}</div>
            <div class="text-gray-400 text-sm">Code: {{ tran.code }}</div>
          </div>
        </b-td>
        <b-td class="border-0"></b-td>
        <b-td class="border-0" :class="tran.code === 'S' || tran.code === 'F' ? 'text-danger' : 'text-success'">
          {{ tran.shares.toLocaleString() }}</b-td>
        <b-td class="border-0 text-center" :class="tran.code === 'S' || tran.code === 'F' ? 'text-danger' : 'text-success'">{{ formatValue(tran.value) }}</b-td>
        <b-td class="border-0"></b-td>
      </b-tr>
    </b-tbody>
        </b-table-simple>
</template>

    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="transactions.length"
      :per-page="perPage"
      align="center"
      class="mt-4"
    />
  </div>
</template>



<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { BTable, BTableSimple, BPagination} from 'bootstrap-vue-3';
import { getProcessForm4 } from '@/services/finDataService';
import axios from 'axios';

const route = useRoute();
const ticker = route.params.ticker;
const transactions = ref([]);

const fields = [
  { key: 'name', label: 'Insider' },
  { key: 'summary', label: 'Transaction Summary', formatter: (val, key, item) => summarizeTransaction(item) },
  { key: 'shares', label: 'Shares', formatter: (val, key, item) => totalShares(item).toLocaleString() },
  {key: 'details', label: 'Details'},
  { key: 'filingDate', label: 'Date', formatter: (val) => formatDate(val) }
];

const transactionMap = {
  A: 'Grant/Award',
  F: 'Tax/Exercise Payment',
  G: 'Gift',
  S: 'Sale',
  M: 'Share Receipt (Held)',
  P: 'Purchase'
};
const currentPage = ref(1);
const perPage = ref(10); 

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return transactions.value.slice(start, end);
});

onMounted(async () => {
  try {
    await getProcessForm4(ticker);
    await new Promise(resolve => setTimeout(resolve, 5000));
    const res = await axios.get(`/.netlify/functions/server/transactions-db/${ticker}`);
    transactions.value = res.data.transactions.map(item => ({
      ...item,
      transactions: (item.transactionType || []).map((code, idx) => ({
        code,
        shares: item.numberShares?.[idx] || 0,
        value: item.values?.[idx] || 0,
        filingDate: item.filingDate || null,

      })),
      _showDetails: false 
    }));
  } catch (error) {
    console.error('Error loading insider transactions', error);
  }
});

function summarizeTransaction(item) {
  const grouped = {};

  for (const tran of item.transactions || []) {
    const code = tran.code;
    if (!grouped[code]) {
      grouped[code] = 0;
    }
    grouped[code] += tran.shares || 0;
  }

  const summaryParts = [];

  for (const code in grouped) {
    const shares = grouped[code];
    const formattedShares = Math.abs(shares).toLocaleString();
    const action = code === 'S'
      ? `Sold ${formattedShares} shares`
      : code === 'A'
      ? `Awarded ${formattedShares} shares`
      : code === 'F'
      ? `Tax payment of ${formattedShares} shares`
      : code === 'P'
      ? `Purchased ${formattedShares} shares`
      : code === 'G'
      ? `Gifted ${formattedShares} shares`
      : code === 'M' ? `Excercised ${formattedShares} shares`
      : `Transaction of ${formattedShares} shares`;

    summaryParts.push(action);
  }

  return summaryParts.join(' and ');
}
function toggleExpand(item) {
  item._showDetails = !item._showDetails;
}
function totalShares(item) {
  return (item.transactions || []).reduce((acc, t) => {
    const shares = t.shares || 0;
    if (t.code === 'F' || t.code === 'S') {
      return acc - shares; 
    } else {
      return acc + shares; 
    }
  }, 0);
}


function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
}
function formatValue(value) {

  const absVal = Math.abs(value);  
  return `${(absVal / 1_000_000).toFixed(2)}M`;
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

.insider-container {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  padding: 1rem 4rem;
}
.insider-container :hover {
  cursor: pointer;
}

</style>
