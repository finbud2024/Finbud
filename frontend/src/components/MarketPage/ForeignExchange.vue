<template>
  <div class="fx-page">
    <h1>{{ $t("foreignExchange") }}</h1>
    <table v-if="rates.length">
      <tr><th>Pair</th><th>Rate</th><th>Last Refreshed</th></tr>
      <tr v-for="r in rates" :key="r.fromCurrency + r.toCurrency">
        <td>{{ r.fromCurrency }}→{{ r.toCurrency }}</td>
        <td>{{ r.rate }}</td>
        <td>{{ new Date(r.lastRefreshed).toLocaleString() }}</td>
      </tr>
    </table>
    <p v-else>Loading…</p>
  </div>
</template>

<script>
import getAllFxRates from "@/services/fxService.js";

export default {
  name: "ForeignExchange",
  data() {
    return { rates: [] };
  },
  async mounted() {
    this.rates = await getAllFxRates();
  },
};
</script>

<style scoped>
.fx-page {
  padding: 1rem;
}
</style>