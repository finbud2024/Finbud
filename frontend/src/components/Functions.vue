<script>
// Import necessary modules
const yahooFinance = require('yahoo-finance');
const fs = require('fs');
const path = require('path');

export default {
  name: 'YahooFinanceDownloader',
  methods: {
    async N50() {
      const now = new Date();
      const today345pm = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 45, 0, 0);
      
      const benchmarkFile = 'benchmark.csv';
      let beta_r = [];

      try {
        // Check if benchmark file exists
        if (fs.existsSync(benchmarkFile)) {
          // Read existing benchmark data
          beta_r = JSON.parse(fs.readFileSync(benchmarkFile, 'utf8'));

          // Check if data is not empty and update condition meets
          if (beta_r.length > 0) {
            const lastDate = beta_r[beta_r.length - 1].Date;
            if (lastDate !== new Date().toISOString().slice(0, 10) && now > today345pm) {
              // Download new data
              const data = await yahooFinance.historical({
                symbol: '^NSEI',
                from: '2020-01-01',
                to: new Date().toISOString().slice(0, 10)
              });

              // Append new data to existing
              beta_r.push(...data);
              fs.writeFileSync(benchmarkFile, JSON.stringify(beta_r, null, 2));
            }
          } else {
            // Download data if empty
            beta_r = await yahooFinance.historical({
              symbol: '^NSEI',
              from: '2020-01-01',
              to: new Date().toISOString().slice(0, 10)
            });

            fs.writeFileSync(benchmarkFile, JSON.stringify(beta_r, null, 2));
          }
        } else {
          // Download data if file doesn't exist
          beta_r = await yahooFinance.historical({
            symbol: '^NSEI',
            from: '2020-01-01',
            to: new Date().toISOString().slice(0, 10)
          });

          fs.writeFileSync(benchmarkFile, JSON.stringify(beta_r, null, 2));
        }
      } catch (error) {
        console.error('Error:', error);
      }

      return beta_r;
    }
  },
  async mounted() {
    // Call the N50 function on component mount
    const data = await this.N50();
    console.log('Downloaded data:', data);
  }
}
</script>

<style scoped>
/* Your component-specific styles */
</style>