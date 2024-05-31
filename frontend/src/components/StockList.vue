<template>
    <div class="stock-list">
      <div class="stock-item" v-for="item in stocks" :key="item.symbol">
        <h2>{{ item.symbol }}</h2>
        <p>Price: {{ getPrice(item.data) }}</p>
        <p>Change: {{ getChange(item.data) }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StockList',
    props: {
      stocks: {
        type: Array,
        required: true
      }
    },
    methods: {
      getPrice(data) {
        const latestTime = Object.keys(data['Time Series (5min)'])[0];
        return data['Time Series (5min)'][latestTime]['1. open'];
      },
      getChange(data) {
        const times = Object.keys(data['Time Series (5min)']);
        const latestTime = times[0];
        const previousTime = times[1];
        const latestPrice = data['Time Series (5min)'][latestTime]['1. open'];
        const previousPrice = data['Time Series (5min)'][previousTime]['1. open'];
        return (latestPrice - previousPrice).toFixed(2);
      }
    }
  };
  </script>
  
  <style scoped>
  .stock-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .stock-item {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    width: 200px;
    box-shadow: 2px 2px 12px #aaa;
  }
  </style>
  