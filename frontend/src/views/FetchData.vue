<template>
  <div>
    <h1>{{ symbol }} Stock Data</h1>

    <div class="controls">
      <label for="symbol">Symbol:</label>
      <select v-model="symbol" @change="fetchStockData">
        <option value="AAPL">AAPL</option>
        <option value="GOOGL">GOOGL</option>
        <option value="MSFT">MSFT</option>
        <option value="MSFT">TSLA</option>
        <option value="AMZN">AMZN</option>
      </select>

      <label for="interval">Interval:</label>
      <select v-model="interval" @change="fetchStockData">
        <option value="1d">1 Day</option>
        <option value="1wk">1 Week</option>
        <option value="1mo">1 Month</option>
      </select>

      <label for="range">Range (days):</label>
      <input
        type="range"
        v-model.number="rangeDays"
        min="5"
        max="30"
        @change="fetchStockData"
      />
      <span>{{ rangeDays }} days</span>
    </div>

    <table v-if="stockData.length">
      <thead>
        <tr>
          <th>Date</th>
          <th>Open</th>
          <th>High</th>
          <th>Low</th>
          <th>Close</th>
          <th>Adj Close</th>
          <th>Volume</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in stockData" :key="index">
          <td>{{ data.date }}</td>
          <td>{{ data.open }}</td>
          <td>{{ data.high }}</td>
          <td>{{ data.low }}</td>
          <td>{{ data.close }}</td>
          <td>{{ data.adjClose }}</td>
          <td>{{ data.volume }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Loading data...</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "FetchData",
  data() {
    return {
      symbol: "AAPL",
      interval: "1d",
      rangeDays: 5,
      stockData: [],
    };
  },
  mounted() {
    this.fetchStockData();
  },
  methods: {
    async fetchStockData() {
      try {
        const response = await axios.get(`/v8/finance/chart/${this.symbol}`, {
          params: {
            range: `${this.rangeDays}d`,
            interval: this.interval,
          },
        });

        const result = response.data.chart.result[0];
        const timestamp = result.timestamp;
        const quote = result.indicators.quote[0];
        const adjclose = result.indicators.adjclose[0].adjclose;

        this.stockData = timestamp.map((time, index) => ({
          date: new Date(time * 1000).toISOString().split("T")[0],
          open: quote.open[index].toFixed(2),
          high: quote.high[index].toFixed(2),
          low: quote.low[index].toFixed(2),
          close: quote.close[index].toFixed(2),
          adjClose: adjclose[index].toFixed(2),
          volume: quote.volume[index].toLocaleString(),
        }));
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: right;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

.controls {
  margin-bottom: 20px;
}

.controls label {
  margin-right: 10px;
}

.controls select,
.controls input {
  margin-right: 20px;
}
</style>
