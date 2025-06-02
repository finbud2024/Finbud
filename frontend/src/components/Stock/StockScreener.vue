<template>
    <div class="stock-screener">
      <h3>All filters</h3>
      <div class="filter">
        <label for="eps">Earnings Per Share (EPS)</label>
        <div class="silderContainer">
          <input class="stockScreenerInput" v-model="filters.eps[0]" type="number" :min="0" :max="filters.eps[1]" :step="1"/>
          <Vue3Slider @change="applyFilters" id="eps" v-model="filters.eps" :min="0" :max="500" style="width:76%" />
          <input class="stockScreenerInput" v-model="filters.eps[1]" type="number" :min="filters.eps[0]" :max="500" :step="1"/>
        </div>
      </div>
      <div class="filter">
        <label for="pe">Price To Earnings Ratio (P/E)</label>
        <div class="silderContainer">
          <input class="stockScreenerInput" v-model="filters.pe[0]" type="number" :min="0" :max="filters.pe[1]" :step="1"/>
          <Vue3Slider @change="applyFilters" id="pe" v-model="filters.pe" :min="0" :max="50" style="width:76%" />
          <input class="stockScreenerInput" v-model="filters.pe[1]" type="number" :min="filters.pe[0]" :max="50" :step="1"/>
        </div>
      </div>
      <div class="filter">
        <label for="pbr">Price to Book Ratio</label>
        <div class="silderContainer">
          <input class="stockScreenerInput" v-model="filters.pbr[0]" type="number" :min="0" :max="filters.pbr[1]" :step="1"/>
          <Vue3Slider @change="applyFilters" id="pbr" v-model="filters.pbr" :min="0" :max="4" style="width:76%" />
          <input class="stockScreenerInput" v-model="filters.pbr[1]" type="number" :min="filters.pbr[0]" :max="4" :step="1"/>
        </div>
      </div>
      <div class="filter">
        <label for="beta">Beta</label>
        <div class="silderContainer">
          <input class="stockScreenerInput" v-model="filters.beta[0]" type="number" :min="0" :max="filters.beta[1]" :step="1"/>
          <Vue3Slider @change="applyFilters" id="beta" v-model="filters.beta" :min="0" :max="2" style="width:76%" />
          <input class="stockScreenerInput" v-model="filters.beta[1]" type="number" :min="filters.beta[0]" :max="2" :step="1"/>
        </div>
      </div>
      <div class="filter">
        <label for="regular-price">Regular Price</label>
        <div class="silderContainer">
          <input class="stockScreenerInput" v-model="filters.regularPrice[0]" type="number" :min="0" :max="filters.regularPrice[1]" :step="1"/>
          <Vue3Slider @change="applyFilters" id="regular-price" v-model="filters.regularPrice" :min="0" :max="700" style="width:76%" />
          <input class="stockScreenerInput" v-model="filters.regularPrice[1]" type="number" :min="filters.regularPrice[0]" :max="700" :step="1"/>
        </div>
      </div>
      <div class="filter">
        <label for="price-sales">Price to Sales</label>
        <div class="silderContainer">
          <input class="stockScreenerInput" v-model="filters.priceSales[0]" type="number" :min="0" :max="filters.priceSales[1]" :step="1"/>
          <Vue3Slider @change="applyFilters" id="price-sales" v-model="filters.priceSales" :min="0" :max="100" style="width:76%" />
          <input class="stockScreenerInput" v-model="filters.priceSales[1]" type="number" :min="filters.priceSales[0]" :max="100" :step="1"/>
        </div>
      </div>
      <div class="buttonsContainer">
        <button @click="resetFilter" class="filter-btn">Reset</button>
      </div>
    </div>
  </template>
  
  <script>
  import Vue3Slider from 'vue-3-slider-component';
  import debounce from 'lodash/debounce';

  export default {
    name: 'StockScreener',
    components:{
      Vue3Slider
    },
    data() {
      return {
        filters: {
          eps: [0, 500],
          pe: [0, 50],
          pbr: [0, 4],
          beta: [0, 2],
          regularPrice: [0, 700],
          priceSales: [0, 100] 
        }
      };
    },
    methods: {
      applyFilters: debounce(function() {
        //data return to parent through appy Filter Event
        this.$emit('applyFilter',{
          eps: this.filters.eps,
          pe: this.filters.pe,
          pbr: this.filters.pbr,
          beta: this.filters.beta,
          regularPrice: this.filters.regularPrice,
          priceSales: this.filters.priceSales,
        })
      }, 300),
      resetFilter(){
        this.filters.eps =  [0, 500]
        this.filters.pe = [0, 50]
        this.filters.pbr =  [0, 4]
        this.filters.beta =  [0, 2]
        this.filters.regularPrice = [0, 700]
        this.filters.priceSales = [0, 100] 
        this.$emit('applyFilter',{
          eps: this.filters.eps,
          pe: this.filters.pe,
          pbr: this.filters.pbr,
          beta: this.filters.beta,
          regularPrice: this.filters.regularPrice,
          priceSales: this.filters.priceSales,
        })
      }
    }
  };
  </script>
  
  <style scoped>
  .stockScreenerInput{
    width: 12%
  }

  .buttonsContainer{
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .buttonsContainer .filter-btn {
    margin: 0 5px;
  }

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
    color: #000000;
    font-weight: bold;
    text-align: center;
  }
  
  .filter {
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-bottom: 15px;
  }
  
  .filter label {
    flex: 1;
    margin-right: 10px;
  }

  .silderContainer{
    display: flex;
    flex-direction: row;
    gap: 20px;
    width: 63%
  }
    
  .filter-btn {
    padding: 10px 20px;
    background-color: #000000;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: block;
    margin: 20px auto;
    transition: background-color 0.3s;
  }
  
  .filter-btn:hover {
    background-color: #000000;
  }
  </style>
  