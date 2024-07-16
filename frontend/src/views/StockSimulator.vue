<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <CompanyCard :companyName="bannerDisplayStock" :width='`80%`' />
    </header>
    <div class="main-content">
      <section class="key-statistics">
        <h3>Key Statistics</h3>
        <div class="stats-grid">
          <div class="stat">
            <span class="label">Open:</span>
            <span class="value">12345</span>
          </div>
          <div class="stat">
            <span class="label">Close:</span>
            <span class="value">12345</span>
          </div>
          <div class="stat">
            <span class="label">52 Week High:</span>
            <span class="value">12345</span>
          </div>
          <div class="stat">
            <span class="label">52 Week Low:</span>
            <span class="value">12345</span>
          </div>
          <div class="stat">
            <span class="label">Market Cap:</span>
            <span class="value">12345</span>
          </div>
          <div class="stat">
            <span class="label">Volume:</span>
            <span class="value">12345</span>
          </div>
        </div>
      </section>
      <section class="actions">
        <h3>Actions</h3>
        <div class="action-form">
          <input v-model="stockSymbol" type="text" placeholder="Enter stock symbol" />
          <input v-model="quantity" type="number" placeholder="Quantity" />
          <div class="buttons">
            <button class="clear-btn">CLEAR</button>
            <button class="preview-btn" @click="showModal = true">{{ previewButtonText }}</button>
          </div>
        </div>
      </section>
    </div>
    <section class="account-info">
      <h3>Your account:</h3>
      <div class="account-stats">
        <div class="account-stat">
          <span class="label">ACCOUNT VALUE</span>
          <span class="value">99860.35</span>
        </div>
        <div class="account-stat">
          <span class="label">BUYING POWER</span>
          <span class="value">99770.35</span>
        </div>
        <div class="account-stat">
          <span class="label">CASH</span>
          <span class="value">99680.4</span>
        </div>
      </div>
    </section>
    <stockScreener @applyFilter="stockFilterHandler"/>
    <div class="stockDisplayContainer" v-if="count">
      <CompanyCard v-for="(item,idx) in displayStock" :key="idx" :companyName="item.ticker" :width="`80%`" />
    </div>
    <PreviewOrderModal 
      v-if="showModal" 
      :stockSymbol="stockSymbol" :quantity="quantity" :estimatedPrice="estimatedPrice" 
      :commissionPrice="commissionPrice" 
      :estimatedTotal="estimatedTotal" 
      @close="showModal = false"  @clear-order="clearOrder"  @submit-order="submitOrder" />
  </div>
</template>

<script>
import StockScreener from '../components/StockScreener.vue'
import CompanyCard from '@/components/CompanyCard.vue'
import stockData from './hardcodeData/StockData.js'
import PreviewOrderModal from '../components/StockSimulatorPage/PreviewOrderModal.vue'
export default {
  name: 'StockDashboard',
  components: {
    StockScreener,
    CompanyCard,
    PreviewOrderModal
  },
  data(){
    return {
      bannerDisplayStock: "AAPL",
      displayStock: [],
      count: 1,
      stockSymbol: '', // pre-fill from chat command
      quantity: '', // pre-fill from chat command
      showModal: false,
      //temp: hard coded data for preview order 
      estimatedPrice: 0, 
      commissionPrice: 19.95, 
      estimatedTotal: 0 
    };
  },
  methods:{
    async stockFilterHandler(screenerFilter){
      const appliedFilter = stockData
      .filter((data) => data.eps && data.eps <= screenerFilter.eps[1] && data.eps >= screenerFilter.eps[0])
      .filter((data) => data.pe && data.pe <= screenerFilter.pe[1] && data.pe >= screenerFilter.pe[0])
      .filter((data) => data.pbr && data.pbr <= screenerFilter.pbr[1] && data.pbr >= screenerFilter.pbr[0])
      .filter((data) => data.beta && data.beta <= screenerFilter.beta[1] && data.beta >= screenerFilter.beta[0])
      .filter((data) => data.regularPrice && data.regularPrice <= screenerFilter.regularPrice[1] && data.regularPrice >= screenerFilter.regularPrice[0])
      .filter((data) => data.priceSales && data.priceSales <= screenerFilter.priceSales[1] && data.priceSales >= screenerFilter.priceSales[0])
      this.displayStock = [];
      await new Promise(r => setTimeout(r, 500));
      if(appliedFilter.length > 10){
        let temp = appliedFilter.slice().sort(()=>0.5-Math.random());
        this.displayStock = temp.slice(0,10)
      }else{
        this.displayStock = appliedFilter
      }
      this.count++;
    }
  },
  computed: {
    previewButtonText() {
      if (this.quantity === '' || this.quantity === 0) {
        return 'PREVIEW ORDER';
      } else if (this.quantity > 0) {
        return 'PREVIEW BUY ORDER';
      } else if (this.quantity < 0) {
        return 'PREVIEW SELL ORDER';
      }
    }
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler(newQuery) {
        this.stockSymbol = newQuery.symbol || '';
        this.quantity = newQuery.quantity || '';
        this.bannerDisplayStock = newQuery.symbol || "AAPL";
      }
    },
    displayStock(newVal){
      console.log(newVal)
    }
  },
  mounted(){
    //make a copy of stockData and randomly sort then pick the first 10 elements
    const shuffledStock = stockData.slice().sort(()=>0.5-Math.random());
    this.displayStock = shuffledStock.slice(0,10);

    //if statement to see if going direct or through chat command
    if(this.$route.query.symbol && this.$route.query.quantity){
      this.bannerDisplayStock = this.$route.query.symbol 
    }else{
      alert("direct")
    }
  }
};
</script>

<style scoped>
.stockDisplayContainer{
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dashboard {
  font-family: 'Space Grotesk', sans-serif;
  color: #333;
}

.dashboard-header {
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.market {
  font-size: 0.8rem;
  color: #00aaff;
}

.stock-prices {
  margin-top: 10px;
  font-size: 1.2rem;
}

.stock-info {
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
  font-size: 0.9rem;
}

.main-content {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  flex-wrap: wrap;
}

.key-statistics, .actions {
  width: 48%;
}

.key-statistics h3, .actions h3, .account-info h3 {
  margin-bottom: 20px;
  color: #007bff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.stat {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
}

.stat .label {
  font-weight: bold;
}

.actions .action-form {
  display: flex;
  flex-direction: column;
}

.actions input {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ced4da;
}

.buttons {
  display: flex;
  justify-content: space-between;
}

.clear-btn, .preview-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.clear-btn {
  background-color: #6c757d;
  color: white;
}

.clear-btn:hover {
  background-color: #5a6268;
}

.preview-btn {
  background-color: #007bff;
  color: white;
}

.preview-btn:hover {
  background-color: #0056b3;
}

.account-info {
  padding: 20px;
}

.account-stats {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.account-stat {
  text-align: center;
  flex: 1;
  margin: 10px;
}

.account-stat .label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

/* Media queries for responsiveness */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    align-items: center;
  }

  .key-statistics, .actions {
    width: 100%;
    margin-bottom: 20px;
  }

  .stock-info {
    flex-direction: column;
    align-items: center;
  }

  .account-stats {
    flex-direction: column;
    align-items: center;
  }

  .account-stat {
    margin: 5px 0;
  }
}
</style>
