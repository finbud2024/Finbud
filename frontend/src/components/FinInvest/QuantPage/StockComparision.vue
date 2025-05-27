<template>

  <h1 class="page-header">Stock Comparison</h1>
  <div class="controls">
    
    <label>
      <span class="label-text">Indicator</span>
      <select v-model="indicator" @change="loadRiskMetrics">
        <option value="ema">EMA</option>
        <option value="rsi">RSI</option>
        <option value="macd">MACD</option>
        <option value="bollinger">Bollinger</option>
      </select>
    </label>
  
    <label>
      <span class="label-text">Period</span>
      <select v-model="period" @change="loadRiskMetrics">
        <option :value="20">20</option>
        <option :value="50">50</option>
        <option :value="200">200</option>
      </select>
    </label>
  
    <label>
      <span class="label-text">Returns</span>
      <select v-model="returnType" @change="loadRiskMetrics">
        <option value="cumulative">Cumulative</option>
        <option value="daily">Daily</option>
      </select>
    </label>
  </div>
  
    <table class="custom-table">
      <thead>
        <tr>
          <th class="sticky-header"></th>
          <th class="sticky-header">
            <select v-model="selectedTickers[0]" @change="updateStock(0)">
              <option v-for="ticker in availableTickers" :key="ticker" :value="ticker">
                {{ ticker }}
              </option>
            </select>
          </th>
          <th class="sticky-header">
            <select v-model="selectedTickers[1]" @change="updateStock(1)">
              <option v-for="ticker in availableTickers" :key="ticker" :value="ticker">
                {{ ticker }}
              </option>
            </select>
          </th>
          <th class="sticky-header">
            <select v-model="selectedTickers[2]" @change="updateStock(2)">
              <option v-for="ticker in availableTickers" :key="ticker" :value="ticker">
                {{ ticker }}
              </option>
            </select>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Risk Ratio
            <button class="toggle-btn" @click="toggleGraph(7)">
              {{ rows[7].showGraph ? '▲' : '▼' }}
            </button>
          </td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr v-if="rows[7].showGraph">
          <td colspan="4" class="graph-cell">
          </td>
        </tr>
        <template v-if="rows[7].showGraph">
          <tr>
            <td> Alpha(NIFTY 50)
  
            </td>
            <td>{{ metrics.alpha.A }}</td>
            <td>{{ metrics.alpha.C }}</td>
            <td>{{ metrics.alpha.B }}</td>
          </tr>
          <tr v-if="rows[6].showGraph">
            <td colspan="4" class="graph-cell">
  
            </td>
          </tr>
          
          <tr>
            <td> Beta(NIFTY 50)
            </td>
            <td>{{ metrics.beta.A }}</td>
            <td>{{ metrics.beta.C }}</td>
            <td>{{ metrics.beta.B }}</td>
          </tr>
          <tr v-if="rows[6].showGraph">
            <td colspan="4" class="graph-cell">
  
            </td>
          </tr>
  
          <tr>
            <td> Sharpe Ratio
            </td>
            <td>{{ metrics.sharpe.A }}</td>
            <td>{{ metrics.sharpe.C }}</td>
            <td>{{ metrics.sharpe.B }}</td>
          </tr>
          <tr v-if="rows[6].showGraph">
            <td colspan="4" class="graph-cell">
  
            </td>
          </tr>
          <tr>
            <td> Sortino Ratio
            </td>
            <td>{{ metrics.sortino.A }}</td>
            <td>{{ metrics.sortino.C }}</td>
            <td>{{ metrics.sortino.B }}</td>
          </tr>
          <tr v-if="rows[6].showGraph">
            <td colspan="4" class="graph-cell">
  
            </td>
          </tr>
          <tr>
            <td> Standard Deviation
  
            </td>
            <td>{{ metrics.stdDev.A }}</td>
            <td>{{ metrics.stdDev.C }}</td>
            <td>{{ metrics.stdDev.B }}</td>
          </tr>
          <tr v-if="rows[6].showGraph">
            <td colspan="4" class="graph-cell">
            </td>
          </tr>
          
      </template>
        <tr>
          <td> Past trend vs Future Projection
            <button class="toggle-btn" @click="toggleGraph(4)">
              {{ rows[4].showGraph ? '▲' : '▼' }}
            </button>
          </td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr v-if="rows[4].showGraph">
          <td colspan="4" class="graph-cell">
          
          </td>
        </tr>
  
          <!--Sub Row 1-->

        <template v-if="rows[4].showGraph">
          <tr>
            <td> Simulation
              <button class="toggle-btn" @click="toggleGraph(5)">
                {{ rows[5].showGraph ? '▲' : '▼' }}
              </button>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr v-if="rows[5].showGraph">
            <td colspan="4" class="graph-cell">
              <div class="graph-row">
              <GBMGraph :tickerA="selectedTickers[0]" :tickerB="selectedTickers[1]" :tickerC="selectedTickers[2]" :indicator="indicator" :returnType="returnType" />
              <GARCHGraph
              :tickerA="selectedTickers[0]"
              :tickerB="selectedTickers[1]"
              :tickerC="selectedTickers[2]"
              :indicator="indicator"
              :returnType="returnType"
          />
             
             </div>
            </td>
          </tr>
          <!--Sub Row 2-->
  
          
        </template>
        
  
  
        <!-- Row 2 -->
        <tr>
          <td>Close Value
            <button class="toggle-btn" @click="toggleGraph(0)">
              {{ rows[0].showGraph ? '▲' : '▼' }} 
            </button>
          </td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr v-if="rows[0].showGraph">
          <td colspan="4" class="graph-cell">
            <CompareClosePrice :tickerA="selectedTickers[0]" :tickerB="selectedTickers[1]" :tickerC="selectedTickers[2]" :duration="2" />
          </td>
        </tr>
  
  
        <!-- Row 3 -->
        <tr>
          <td>Indicator Value
            <button class="toggle-btn" @click="toggleGraph(1)">
              {{ rows[1].showGraph ? '▲' : '▼' }} 
            </button>
          </td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr v-if="rows[1].showGraph">
          <td colspan="4" class="graph-cell">
            <div class="graph-row">
            <IndicatorGraph :tickerA="selectedTickers[0]" :tickerB="selectedTickers[1]" :tickerC="selectedTickers[2]" :indicator="indicator" :period="period" :returnType="returnType"/>
            <ReturnGraph :tickerA="selectedTickers[0]" :tickerB="selectedTickers[1]" :tickerC="selectedTickers[2]" :returnType="returnType" :duration="2" />
          
          </div>
          </td>
        </tr>
  
  
        <!-- Row 4 -->
        <!--<tr>
          <td>Return Value
            <button class="toggle-btn" @click="toggleGraph(2)">
              {{ rows[2].showGraph ? '▲' : '▼' }}
            </button>
          </td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr v-if="rows[2].showGraph">
          <td colspan="4" class="graph-cell">
            <ReturnGraph :tickerA="selectedTickers[0]" :tickerB="selectedTickers[1]" :tickerC="selectedTickers[2]" :returnType="returnType" :duration="2" />
          </td>
        </tr>-->

      </tbody>
    </table>
  </template>
  
  <script setup>
  import { reactive } from 'vue';
  import CompareClosePrice from './CompareClosePrice.vue';
  import IndicatorGraph from './IndicatorGraph.vue';
  import GARCHGraph from './GARCHGraph.vue';
  import GBMGraph from './GBMGraph.vue';
  import ReturnGraph from './ReturnGraph.vue';
  import {
    calculateAlphaBeta,
    calculateSharpeRatio,
    calculateSortinoRatio,
    calculateStandardDeviation
  } from './backend/functions/quantRiskRatio.js';
  import Papa from 'papaparse';
import {watch, ref } from 'vue';

  const availableTickers = ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA']; // Example tickers
  const selectedTickers = reactive(['', '', '']); // Default selected tickers for columns A and C
  // or 'daily'
  const indicator = ref('ema');           // Default indicator
  const period = ref(50);                 // Default period
  const returnType = ref('cumulative');  // Default returnType
  const rows = reactive([
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
    { showGraph: true },
  ]);
  
  function toggleGraph(index) {
    rows[index].showGraph = !rows[index].showGraph;
  }
  function updateStock(columnIndex) {
    console.log(`Ticker for column ${columnIndex === 0 ? 'A' : 'C'} updated to:`, selectedTickers[columnIndex]);
  }



  const metrics = ref({
  alpha: { A: null, B: null, C: null },
  beta: { A: null, B: null, C: null },
  sharpe: { A: null, B: null, C: null },
  sortino: { A: null, B: null, C: null },
  stdDev: { A: null, B: null, C: null },
});

async function parseClosePrices(ticker) {
  const response = await fetch(`/${ticker}.csv`);
  const text = await response.text();

  return new Promise((resolve) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const closePrices = results.data
          .filter(r => r.Date && r.Close)
          .map(r => parseFloat(r.Close));
        resolve(closePrices);
      }
    });
  });
}

async function loadRiskMetrics() {
  const [dataA, dataC, dataB, benchmark] = await Promise.all([
    parseClosePrices(selectedTickers[0]),
    parseClosePrices(selectedTickers[1]),
    parseClosePrices(selectedTickers[2]),
    parseClosePrices('NIFTY50') // Assuming this CSV exists
  ]);

  metrics.value.alpha.A = calculateAlphaBeta(dataA, benchmark).alpha.toFixed(4);
  metrics.value.alpha.B = calculateAlphaBeta(dataB, benchmark).alpha.toFixed(4);
  metrics.value.alpha.C = calculateAlphaBeta(dataC, benchmark).alpha.toFixed(4);
  metrics.value.beta.A = calculateAlphaBeta(dataA, benchmark).beta.toFixed(4);
  metrics.value.beta.B = calculateAlphaBeta(dataB, benchmark).beta.toFixed(4);
  metrics.value.beta.C = calculateAlphaBeta(dataC, benchmark).beta.toFixed(4);
  metrics.value.sharpe.A = calculateSharpeRatio(dataA).toFixed(4);
  metrics.value.sharpe.B = calculateSharpeRatio(dataB).toFixed(4);
  metrics.value.sharpe.C = calculateSharpeRatio(dataC).toFixed(4);
  metrics.value.sortino.A = calculateSortinoRatio(dataA).toFixed(4);
  metrics.value.sortino.B = calculateSortinoRatio(dataB).toFixed(4);
  metrics.value.sortino.C = calculateSortinoRatio(dataC).toFixed(4);
  metrics.value.stdDev.A = calculateStandardDeviation(dataA).toFixed(4);
  metrics.value.stdDev.B = calculateStandardDeviation(dataB).toFixed(4);
  metrics.value.stdDev.C = calculateStandardDeviation(dataC).toFixed(4);
}

watch(selectedTickers, loadRiskMetrics, { deep: true, immediate: true });

  </script>
  
  <style scoped>
  .custom-table {
    width: auto;
    border-collapse: collapse;
    margin: 16px 0;
    
  }
  
  .custom-table th,
  .custom-table td {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-left: none;
    border-right: none;
    padding: 8px 16px;
    /*text-align: center;*/
  }
  .custom-table td{
    border:none;
  }
  .sticky-header {
    position: sticky; /* Makes the header row stick */
    top: 0; /* Sticks the header to the top of the table */
    background-color: #f9f9f9; /* Background color for the header */
    z-index: 1; /* Ensures the header stays above other content */
  
  }
  
  .toggle-btn {
    margin-left: 8px;
    padding: 4px 8px;
    font-size: 12px;
    cursor: pointer;
    background: none;
    border: none;
    color: #1d4ed8;
  }
  
  .toggle-btn:hover {
    color: #0c3c91;
  }
  
  .graph-cell {
    width: 50%;
    background-color: #f9f9f9;
    padding: 12px;
    text-align: center;
  }
  
  .fake-graph {
    height: 100px;
    background-color: #dbeafe;
    border-radius: 6px;
    line-height: 100px;
    font-weight: bold;
    color: #1d4ed8;
  }
  .graph-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
  }
  .graph-row > * {
    flex: 1 1 45%;
    max-width: 48%;
  }
  .controls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    width: 100%;
  }
  
  label {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  
  .label-text {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    color:var(--quant-text-color); /* Set a primary color (blue) */
  
  }

  .page-header {
    font-size: 2rem; /* Increase the font size */
    font-weight: bold; /* Make the text bold */
    text-align: center; /* Center the header */
    margin: 1.5rem 0; /* Add spacing above and below */
    color: var(--quant-text-color); /* Set a primary color (blue) */
    text-transform: uppercase; /* Make the text uppercase */
    letter-spacing: 0.1rem; /* Add some spacing between letters */
    border-bottom: 2px solid var(--quant-divider-line-color); /* Add a subtle underline */
    padding-bottom: 0.5rem; /* Add padding below the text */
  }
  
  </style>