<script setup>
import { computed, ref } from 'vue';
import './StockHolding.css';

const props = defineProps({
  stocks: Array
});

const currentPage = ref(1);
const itemsPerPage = 15;

// Paginate stocks
const paginatedStocks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return props.stocks.slice(start, start + itemsPerPage);
});

// Calculate total pages
const totalPages = computed(() => Math.ceil(props.stocks.length / itemsPerPage));

// Navigate to a specific page
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
</script>

<template>
  <div class="stocks-container">
    <h2 class="stocks-header">Stock Holdings</h2>

    <div class="stocks-table">
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Company</th>
            <th>Market Value</th>
            <th>Weight</th>
            <th>Shares</th>
            <th>Change</th>
            <th>Change in Shares</th>
            <th>Quarter End Price</th>
            <th>% Owned</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stock in paginatedStocks" :key="stock._id">
            <td>{{ stock.Ticker }}</td>
            <td>{{ stock["Company Name"] }}</td>
            <td>{{ stock["Market Value"] }}</td>
            <td>{{ stock.Weight }}</td>
            <td>{{ stock.Shares }}</td>
            <td>{{ stock.Change }}</td>
            <td>{{ stock["Change in Shares"] }}</td>
            <td>{{ stock["Quarter End Price"] }}</td>
            <td>{{ stock["Percentage Owned"] }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{ active: currentPage === page }">
        {{ page }}
      </button>
    </div>
  </div>
</template>
