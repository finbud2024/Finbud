<template>
    <div class="top-series-container">
      <div class="section-header">
        <h4>{{ title }}</h4>
        <span class="more">More &gt;</span>
      </div>
      <div class="crypto-table-wrapper">
        <div class="crypto-table">
          <div class="crypto-row" v-for="crypto in cryptos" :key="crypto.symbol">
            <div class="crypto-item" @click="openPopup(crypto)">
              <!-- <img :src="crypto.image" alt="crypto icon" class="crypto-icon"> -->
              <div class="crypto-info">
                <div class="crypto-symbol">
                  <h3>{{ crypto.symbol }}</h3>
                </div>
                <div class="crypto-price">
                  <p class="price">${{ crypto.price.toFixed(5) }}</p>
                </div>
                <div class="crypto-change" :class="{ 'positive': crypto.change > 0, 'negative': crypto.change < 0 }">
                  {{ crypto.change.toFixed(2) }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TopSeries',
    props: {
      title: {
        type: String,
        required: true,
      },
      cryptos: {
        type: Array,
        required: true,
      },
      openPopup: {
        type: Function,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .top-series-container {
    background-color: #1f1f1f;
    padding: 20px;
    border-radius: 10px;
    width: 23%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .section-header h4 {
    color: white;
    margin: 0;
  }
  
  .section-header .more {
    color: #ff4c4c;
    font-size: 0.85em;
    cursor: pointer;
  }
  
  .crypto-table-wrapper {
    overflow-x: hidden;
    overflow-y: hidden; 
    white-space: nowrap; 
  }
  
  .crypto-table {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    gap: 10px;
  }
  
  .crypto-row {
    display: flex;
    width: 100%;
  }
  
  .crypto-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s;
  }
  
  .crypto-item:hover {
    cursor: pointer;
    background-color: #464444;
    border-radius: 10px;
    transform: scale(1.0);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  .crypto-icon {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
  
  .crypto-info {
    margin-left: 5px;
    margin-right: 5px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    width: 100%;
    /* padding-left: 10px; */
  }
  
  .crypto-symbol {
    /* flex: 1; */
    text-align: left;
    font-size: 0.8em;
  }
  
  .crypto-symbol h3 {
    margin: 0;
    color: #fff;
  }
  
  .crypto-price {
    /* flex-shrink: 0; */
    color: #fff;
    text-align: flex-end;
    margin-right: 10px;
    margin-left: 5px;
    font-size: 0.8em;
  }
  
  .crypto-change {
    flex: 1;
    font-size: 0.8em;
    font-weight: bold;
    color: white;
    /* align-items: flex-end; */
    text-align: right;
  }
  
  .crypto-change.positive {
    color: #4caf50;
  }
  
  .crypto-change.negative {
    color: #ff5252;
  }
  
  /* Responsive Design */
  @media (max-width: 992px) {
    .top-series-container {
      width: 48%;
      margin-bottom: 20px;
    }
  }
  
  @media (max-width: 768px) {
    .top-series-container {
      width: 100%;
      margin-bottom: 20px;
    }
  }
  </style>
  