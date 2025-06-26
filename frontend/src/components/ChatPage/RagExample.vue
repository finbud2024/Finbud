<template>
  <div class="rag-example">
    <h3>RAG Result Example</h3>
    
    <!-- Example of how to use RagResult component -->
    <RagResult
      :status="ragStatus"
      :formatted-answer="sampleFormattedAnswer"
      :error-message="errorMessage"
    />
    
    <!-- Controls for demonstration -->
    <div class="controls">
      <button @click="setStatus('loading')" :class="{ active: ragStatus === 'loading' }">
        Loading
      </button>
      <button @click="setStatus('success')" :class="{ active: ragStatus === 'success' }">
        Success
      </button>
      <button @click="setStatus('error')" :class="{ active: ragStatus === 'error' }">
        Error
      </button>
    </div>
  </div>
</template>

<script>
import RagResult from './RagResult.vue'

export default {
  name: 'RagExample',
  components: {
    RagResult
  },
  data() {
    return {
      ragStatus: 'success',
      errorMessage: '',
      sampleFormattedAnswer: `
# Financial Market Analysis

The current market conditions show significant volatility in technology stocks. According to recent data, the NASDAQ has experienced a 15% increase in trading volume over the past quarter[^1].

## Key Factors Contributing to Volatility

Key factors contributing to this volatility include:

- **Federal Reserve policy changes** affecting interest rates[^2]
- Earnings season performance exceeding expectations
- Geopolitical tensions impacting global supply chains

## Investment Recommendations

Based on the current market analysis, investors should consider:

1. Diversifying portfolios across different sectors
2. Maintaining a balanced approach to risk management[^3]
3. Regular portfolio rebalancing to align with market conditions

> "Market volatility presents both challenges and opportunities for informed investors."

The \`risk-adjusted return\` formula remains a crucial metric for evaluating investment performance in these market conditions.

## Technical Analysis

| Metric | Current Value | Previous Quarter |
|--------|---------------|------------------|
| P/E Ratio | 25.4 | 23.1 |
| Volatility Index | 18.2 | 15.8 |
| Trading Volume | +15% | +8% |

[^1]: https://finance.yahoo.com/quote/^IXIC
[^2]: https://www.federalreserve.gov/monetarypolicy.htm
[^3]: https://www.investopedia.com/risk-management
      `
    }
  },
  methods: {
    setStatus(status) {
      this.ragStatus = status;
      if (status === 'error') {
        this.errorMessage = 'Unable to retrieve relevant financial information at this time.';
      } else {
        this.errorMessage = '';
      }
    }
  }
}
</script>

<style scoped>
.rag-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.controls {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.controls button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.controls button:hover {
  background: #f0f0f0;
}

.controls button.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}
</style> 