<template>
    <div class="stock-screener">
      <h3>All filters</h3>
      <div class="filter">
        <label for="eps">Earnings Per Share (EPS)</label>
        <input type="range" id="eps" min="0" max="100" v-model="filters.eps">
      </div>
      <div class="filter">
        <label for="pe">Price To Earnings Ratio (P/E)</label>
        <input type="range" id="pe" min="0" max="100" v-model="filters.pe">
      </div>
      <div class="filter">
        <label for="pbr">Price to Book Ratio</label>
        <input type="range" id="pbr" min="0" max="100" v-model="filters.pbr">
      </div>
      <div class="filter">
        <label for="beta">Beta</label>
        <input type="range" id="beta" min="0" max="100" v-model="filters.beta">
      </div>
      <div class="filter">
        <label for="regular-price">Regular Price</label>
        <input type="range" id="regular-price" min="0" max="100" v-model="filters.regularPrice">
      </div>
      <div class="filter">
        <label for="price-sales">Price to Sales</label>
        <input type="range" id="price-sales" min="0" max="100" v-model="filters.priceSales">
      </div>
      <button @click="applyFilters" class="filter-btn">Filter</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StockScreener',
    data() {
      return {
        filters: {
          eps: 50,
          pe: 50,
          pbr: 50,
          beta: 50,
          regularPrice: 50,
          priceSales: 50,
        }
      };
    },
    methods: {
      applyFilters() {
        console.log('Applied filters:', this.filters);
        // Emit an event or call a method to apply the filters in the parent component
      }
    }
  };
  </script>
  
  <style scoped>
  .stock-screener {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 20px auto;
  }
  
  .stock-screener h3 {
    margin-bottom: 20px;
    color: #007bff;
    text-align: center;
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
  
  .filter input[type="range"] {
    flex: 2;
    -webkit-appearance: none;
    width: 100%;
    height: 8px;
    border-radius: 5px;
    background: #ddd;
    outline: none;
    transition: background 0.3s;
  }
  
  .filter input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #007bff;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .filter input[type="range"]::-webkit-slider-thumb:hover {
    background: #0056b3;
  }
  
  .filter-btn {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: block;
    margin: 20px auto;
    transition: background-color 0.3s;
  }
  
  .filter-btn:hover {
    background-color: #0056b3;
  }
  </style>
  