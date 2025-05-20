<template>
  <div class="commodities-page">
    <h2>Major Commodities (Latest)</h2>
    <button @click="loadAll" :disabled="loading">
      {{ loading ? "Loading…" : "Fetch All Commodities" }}
    </button>

    <ul v-if="Object.keys(results).length">
      <li v-for="item in commodityList" :key="item.func">
        <strong>{{ item.label }}</strong>  
        <span v-if="results[item.func] && results[item.func].close !== null">
          {{ results[item.func].close.toFixed(2) }}  
          ({{ results[item.func].date }})
        </span>
        <span v-else>— {{ loading ? 'Loading…' : 'failed to load' }}</span>
      </li>
    </ul>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Commodities",
  data() {
    
    return {
      commodityList: [
        { func: "WTI",             label: "Crude Oil (WTI)"        },
        { func: "BRENT",           label: "Crude Oil (Brent)"      },
        { func: "NATURAL_GAS",     label: "Henry Hub Natural Gas"  },
        { func: "COPPER",          label: "Global Copper Price"    },
        { func: "ALUMINUM",        label: "Global Aluminum Price"  },
        { func: "WHEAT",           label: "Global Wheat Price"     },
        { func: "CORN",            label: "Global Corn Price"      },
        { func: "COTTON",          label: "Global Cotton Price"    },
        { func: "SUGAR",           label: "Global Sugar Price"     },
        { func: "COFFEE",          label: "Global Coffee Price"    },
        { func: "ALL_COMMODITIES", label: "All Commodities Index"  }
      ],
      results: {},     // will hold { [func]: { date, close } }
      loading: false,
      error: null,
      pauseMs: 12_000, // 12 seconds between calls
    };
  },
  methods: {
    sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    },
    async fetchOne(func, interval = "monthly") {
      const key = process.env.VUE_APP_ALPHA_VANTAGE_API_KEY;
      const url =
        `https://www.alphavantage.co/query?function=${func}` +
        `&interval=${interval}&datatype=json&apikey=${key}`;

      const resp = await axios.get(url);
      console.log(`🔶 raw payload for ${func}:`, resp.data);

      if (resp.data.Note) {
        throw new Error(`Rate limit: ${resp.data.Note}`);
      }
      if (resp.data["Error Message"]) {
        throw new Error(`API error: ${resp.data["Error Message"]}`);
      }

      // find the time-series key
      const tsKey = Object.keys(resp.data)
        .find((k) => /Time Series/.test(k) || k === "Data");
      const series = resp.data[tsKey];
      if (!series) {
        throw new Error("No time-series data block");
      }

      // latest entry
      const latestDate = Object.keys(series)[0];
      const dataPoint  = series[latestDate];
      const close = parseFloat(
        (dataPoint["4. close"] ?? dataPoint["4 Close"] ?? dataPoint)  
      );
      if (isNaN(close)) {
        throw new Error("Could not parse close price");
      }

      return { date: latestDate, close };
    },

    async loadAll() {
      this.loading = true;
      this.error   = null;
      this.results = {};

      for (let i = 0; i < this.commodityList.length; i++) {
        const { func } = this.commodityList[i];
        try {
          const info = await this.fetchOne(func);
          // << just assign, Vue3 will track it >>
          this.results[func] = info;
        } catch (err) {
          console.warn(`❌ ${func} failed:`, err.message);
          this.results[func] = { date: null, close: null };
          if (err.message.startsWith("Rate limit")) {
            this.error = err.message;
            break;
          }
        }
        if (i < this.commodityList.length - 1) {
          await this.sleep(this.pauseMs);
        }
      }

      this.loading = false;
    },
  },
};
</script>

<style scoped>
.commodities-page {
  padding: 1rem;
}
button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
