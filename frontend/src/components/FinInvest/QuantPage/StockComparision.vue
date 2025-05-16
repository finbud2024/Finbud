<template>
  
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
      </tr>
    </thead>
    <tbody>


      <!-- Row 1 -->
      <tr>
        <td>Close Value
          <button class="toggle-btn" @click="toggleGraph(0)">
            {{ rows[0].showGraph ? '▲' : '▼' }} 
          </button>
        </td>
        <td></td>
        <td></td>
      </tr>
      <tr v-if="rows[0].showGraph">
        <td colspan="3" class="graph-cell">
          <CompareClosePrice :tickerA="selectedTickers[0]" :tickerB="selectedTickers[1]" />
        </td>
      </tr>


      <!-- Row 2 -->
      <tr>
        <td>Indicator Value
          <button class="toggle-btn" @click="toggleGraph(1)">
            {{ rows[1].showGraph ? '▲' : '▼' }} 
          </button>
        </td>
        <td></td>
        <td></td>
      </tr>
      <tr v-if="rows[1].showGraph">
        <td colspan="3" class="graph-cell">
          <IndicatorGraph :tickerA="selectedTickers[0]" :tickerB="selectedTickers[1]" :indicator="indicator" :period="period" :returnType="returnType"
    />
        </td>
      </tr>


      <!-- Row 3 -->
      <tr>
        <td>Return Value
          <button class="toggle-btn" @click="toggleGraph(2)">
            {{ rows[2].showGraph ? '▲' : '▼' }}
          </button>
        </td>
        <td></td>
        <td></td>
      </tr>
      <tr v-if="rows[2].showGraph">
        <td colspan="3" class="graph-cell">
          <ReturnGraph :tickerA="selectedTickers[0]" :tickerB="selectedTickers[1]" :returnType="returnType" />
        </td>
      </tr>


      <!-- Row 4 -->
      <tr>
        <td> Past trend vs Future Projection
          <button class="toggle-btn" @click="toggleGraph(4)">
            {{ rows[4].showGraph ? '▲' : '▼' }}
          </button>
        </td>
        <td></td>
        <td></td>
      </tr>
      <tr v-if="rows[4].showGraph">
        <td colspan="3" class="graph-cell">
        

        </td>
      </tr>

        <!--Sub Row 1-->
        <template v-if="rows[4].showGraph">
        <tr>
          <td> Close Value
            <button class="toggle-btn" @click="toggleGraph(5)">
              {{ rows[5].showGraph ? '▲' : '▼' }}
            </button>
          </td>
          <td>Data A</td>
          <td>
            Data C
          </td>
        </tr>
        <tr v-if="rows[5].showGraph">
          <td colspan="3" class="graph-cell">
            <GBMGraph :tickerA="selectedTickers[0]" :tickerB="selectedTickers[1]" :indicator="indicator" :returnType="returnType" />
          </td>
        </tr>
        <!--Sub Row 2-->
        <tr>
          <td> Daily Volatility
            <button class="toggle-btn" @click="toggleGraph(6)">
              {{ rows[6].showGraph ? '▲' : '▼' }}
            </button>
          </td>
          <td>Data A</td>
          <td>
            Data C
          </td>
        </tr>
        <tr v-if="rows[6].showGraph">
          <td colspan="3" class="graph-cell">
            <GARCHGraph />
          </td>
        </tr>
        
      </template>



      <!-- Row 5 -->

      <tr>
        <td>Risk Ratio
          <button class="toggle-btn" @click="toggleGraph(7)">
            {{ rows[7].showGraph ? '▲' : '▼' }}
          </button>
        </td>
        <td></td>
        <td></td>
      </tr>
      <tr v-if="rows[7].showGraph">
        <td colspan="3" class="graph-cell">
        </td>
      </tr>
      <template v-if="rows[7].showGraph">
        <tr>
          <td> Alpha(NIFTY 50)

          </td>
          <td>Data A</td>
          <td>
            Data C
          </td>
        </tr>
        <tr v-if="rows[6].showGraph">
          <td colspan="3" class="graph-cell">

          </td>
        </tr>
        
        <tr>
          <td> Beta(NIFTY 50)
          </td>
          <td>Data A</td>
          <td>
            Data C
          </td>
        </tr>
        <tr v-if="rows[6].showGraph">
          <td colspan="3" class="graph-cell">

          </td>
        </tr>

        <tr>
          <td> Sharpe Ratio
          </td>
          <td>Data A</td>
          <td>
            Data C
          </td>
        </tr>
        <tr v-if="rows[6].showGraph">
          <td colspan="3" class="graph-cell">

          </td>
        </tr>
        <tr>
          <td> Sortino Ratio
          </td>
          <td>Data A</td>
          <td>
            Data C
          </td>
        </tr>
        <tr v-if="rows[6].showGraph">
          <td colspan="3" class="graph-cell">

          </td>
        </tr>
        <tr>
          <td> Standard Deviation

          </td>
          <td>Data A</td>
          <td>
            Data C
          </td>
        </tr>
        <tr v-if="rows[6].showGraph">
          <td colspan="3" class="graph-cell">
          </td>
        </tr>
    </template>
      
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

const availableTickers = ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA']; // Example tickers
const selectedTickers = reactive(['AAPL', 'MSFT']); // Default selected tickers for columns A and C
const indicator = 'macd'           // 'ema', 'rsi', 'macd', 'bollinger'
const period = 50                 // e.g., 20, 50, 200
const returnType = 'cumulative'  // or 'daily'
const rows = reactive([
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
  { showGraph: false },
]);

function toggleGraph(index) {
  rows[index].showGraph = !rows[index].showGraph;
}
function updateStock(columnIndex) {
  console.log(`Ticker for column ${columnIndex === 0 ? 'A' : 'C'} updated to:`, selectedTickers[columnIndex]);
}
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
</style>
