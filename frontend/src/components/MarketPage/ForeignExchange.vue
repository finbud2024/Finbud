<template>
  <div class="fx-page">
    <h2>FX Rates to VND</h2>
    <button @click="loadAllRates" :disabled="loading">
      {{ loading ? "Loading…" : "Fetch All Rates" }}
    </button>
    <ul v-if="Object.keys(rates).length">
      <li v-for="cur in currencyList" :key="cur">
        1 {{ cur }} → VND = {{ rates[cur]?.rate?.toFixed(2) || "—" }}
        <small>({{ rates[cur]?.lastRefreshed || "n/a" }})</small>
      </li>
    </ul>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ForeignExchange",
  data() {
    return {
      // currencyList: ["USD","EUR","JPY","KRW","GBP"],
      currencyList: ["USD"],
      rates: {},      // will hold { USD: { rate, lastRefreshed }, … }
      loading: false,
      error: null,
    };
  },
  methods: {
    // handy pause util
    sleep(ms) {
      return new Promise(res => setTimeout(res, ms));
    },

    // fetch a single pair
    async fetchPair(from, to = "VND") {
      const key = process.env.VUE_APP_ALPHA_VANTAGE_API_KEY;
      const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE`
                + `&from_currency=${from}&to_currency=${to}&apikey=${key}`;
      const resp = await axios.get(url);
      console.log(`Resp: ${resp.data}`);
      const data = resp.data["Realtime Currency Exchange Rate"];
      if (!data) throw new Error("bad FX payload");
      return {
        rate: parseFloat(data["5. Exchange Rate"]),
        lastRefreshed: data["6. Last Refreshed"]
      };
    },

    // loop through your list, staggered to <5/min
    async loadAllRates() {
      this.loading = true;
      this.error = null;
      this.rates = {};
      try {
        for (let i = 0; i < this.currencyList.length; i++) {
          const cur = this.currencyList[i];
          try {
            const fx = await this.fetchPair(cur);
            this.rates[cur] = fx;
          } catch (e) {
            console.warn(`Failed to fetch ${cur}:`, e.message);
            this.rates[cur] = { rate: null, lastRefreshed: null };
          }
          // pause 12s (60s / 5 calls = 12s) before next
          if (i < this.currencyList.length - 1) {
            await this.sleep(12_000);
          }
        }
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.fx-page { padding: 1rem; }
.error { color: red; margin-top: .5rem; }
button[disabled] { opacity: .6; cursor: not-allowed; }
</style>
