<template>
    <div class="crypto-market">
      <h2 class="crypto-title">CRYPTOCURRENCY</h2>
      <div class="crypto-grid">
        <div v-for="crypto in cryptocurrencies" :key="crypto.name" class="crypto-item">
          <div class="crypto-info">
            <div class="crypto-name">{{ crypto.name }}</div>
            <div class="crypto-price">{{ crypto.price }}</div>
            <div :class="{'change-positive': crypto.change > 0, 'change-negative': crypto.change < 0}">
              {{ crypto.change }}% ({{ crypto.changeValue }})
            </div>
          </div>
          <div class="crypto-chart">
            <img :src="crypto.chart" alt="Chart" />
          </div>
        </div>
      </div>
      <button class="show-more">Show More</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CryptoMarket',
    data() {
      return {
        cryptocurrencies: [
          {
            name: 'BTCUSD',
            price: '$67,699',
            change: -0.98,
            changeValue: -670,
            chart: 'https://via.placeholder.com/150x50', // Placeholder for chart image
          },
          {
            name: 'ETHUSD',
            price: '$3,769.53',
            change: -1.54,
            changeValue: -58.78,
            chart: 'https://via.placeholder.com/150x50', // Placeholder for chart image
          },
          {
            name: 'XRPUSD',
            price: '$0.5288',
            change: 0.46,
            changeValue: 0.0024,
            chart: 'https://via.placeholder.com/150x50', // Placeholder for chart image
          },
          {
            name: 'BCHUSD',
            price: '$466.17',
            change: -0.37,
            changeValue: -1.73,
            chart: 'https://via.placeholder.com/150x50', // Placeholder for chart image
          },
          {
            name: 'LTCUSD',
            price: '$83.29',
            change: 0.35,
            changeValue: 0.29,
            chart: 'https://via.placeholder.com/150x50', // Placeholder for chart image
          },
          {
            name: 'XMRUSD',
            price: '$142.22',
            change: 0.27,
            changeValue: 0.38,
            chart: 'https://via.placeholder.com/150x50', // Placeholder for chart image
          }
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  .crypto-market {
    padding: 1rem;
  }

  .crypto-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  .crypto-item {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    border: 1px solid #ddd;
  }
  .crypto-info {
    flex: 1;
  }
  .crypto-name {
    font-weight: bold;
  }
  .crypto-price {
    margin: 0.5rem 0;
  }
  .change-positive {
    color: green;
  }
  .change-negative {
    color: red;
  }
  .crypto-chart img {
    max-width: 100%;
    height: auto;
  }
  .show-more {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }
  .show-more:hover {
    background-color: #0056b3;
  }
  </style>
  