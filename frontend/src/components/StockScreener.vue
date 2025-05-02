<template>
  <div class="stock-screener">
    <h3>Stock Screener</h3>
    <div class="filter">
      <label for="sector">Sector</label>
      <input v-model="filters.sector" id="sector" type="text" />
    </div>
    <div class="filter">
      <label for="marketCapMoreThan">Min Market Cap</label>
      <input v-model="filters.marketCapMoreThan" id="marketCapMoreThan" type="number" />
    </div>
    <div class="filter">
      <label for="priceMoreThan">Min Price</label>
      <input v-model="filters.priceMoreThan" id="priceMoreThan" type="number" />
    </div>
    <div class="filter">
      <label for="priceLessThan">Max Price</label>
      <input v-model="filters.priceLessThan" id="priceLessThan" type="number" />
    </div>
    <div class="filter">
      <label for="dividendMoreThan">Min Dividend Yield</label>
      <input v-model="filters.dividendMoreThan" id="dividendMoreThan" type="number" />
    </div>
    <button @click="applyFilters">Run Screener</button>

    <table v-if="results.length" class="results-table">
      <thead>
        <tr>
          <th>Ticker</th>
          <th>Company</th>
          <th>Sector</th>
          <th>Price</th>
          <th>Market Cap</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stock in results" :key="stock.symbol">
          <td>{{ stock.symbol }}</td>
          <td>{{ stock.name }}</td>
          <td>{{ stock.sector }}</td>
          <td>{{ stock.price }}</td>
          <td>{{ stock.marketCap }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
<script>
import debounce from "lodash/debounce";

export default {
  name: "StockScreener",
  data() {
    return {
      filters: {
        sector: "",
        marketCapMoreThan: "",
        priceMoreThan: "",
        priceLessThan: "",
        dividendMoreThan: "",
      },
      results: [],
    };
  },
  methods: {
    applyFilters: debounce(async function () {
      try {
        const query = new URLSearchParams(this.filters).toString();
        const response = await fetch(`/stock-simulator/api/screener?${query}`);
        const data = await response.json();
        this.results = data;
      } catch (error) {
        console.error("Error applying filters:", error);
      }
    }, 300),
  },
};
</script>
  
  <style scoped>
  .stock-screener {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 20px auto;
  }
  
  .filter {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .filter label {
    flex: 1;
    margin-right: 10px;
  }

  .results-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  .results-table th,
  .results-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  .results-table th {
    background-color: #f4f4f4;
  }
  </style>
