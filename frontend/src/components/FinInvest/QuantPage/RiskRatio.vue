<template>
    <div class="risk-metrics">
      <table class="w-full text-left border-t border-b border-gray-300">
        <thead>
          <tr>
            <th>Metric</th>
            <th>{{ tickerA }}</th>
            <th>{{ tickerB }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="metric in metrics" :key="metric.name">
            <td>{{ metric.name }}</td>
            <td>{{ metric.a }}</td>
            <td>{{ metric.b }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { calculateAlphaBeta, sharpeRatio, sortinoRatio, standardDeviation, dailyReturns } from '@/utils/metrics'
  
  const props = defineProps({
    tickerA: String,
    tickerB: String,
    benchmarkData: Array,   // NIFTY 50 daily prices
    tickerAData: Array,     // daily prices for tickerA
    tickerBData: Array,     // daily prices for tickerB
    riskFreeRate: Number    // e.g., 0.04 (4%)
  })
  
  // Compute all metrics
  const metrics = computed(() => {
    const benchReturns = dailyReturns(props.benchmarkData)
    const aReturns = dailyReturns(props.tickerAData)
    const bReturns = dailyReturns(props.tickerBData)
  
    const { alpha: alphaA, beta: betaA } = calculateAlphaBeta(aReturns, benchReturns, props.riskFreeRate)
    const { alpha: alphaB, beta: betaB } = calculateAlphaBeta(bReturns, benchReturns, props.riskFreeRate)
  
    return [
      { name: 'Alpha (NIFTY 50)', a: alphaA.toFixed(4), b: alphaB.toFixed(4) },
      { name: 'Beta (NIFTY 50)', a: betaA.toFixed(4), b: betaB.toFixed(4) },
      { name: 'Sharpe Ratio', a: sharpeRatio(aReturns, props.riskFreeRate).toFixed(4), b: sharpeRatio(bReturns, props.riskFreeRate).toFixed(4) },
      { name: 'Sortino Ratio', a: sortinoRatio(aReturns, props.riskFreeRate).toFixed(4), b: sortinoRatio(bReturns, props.riskFreeRate).toFixed(4) },
      { name: 'Standard Deviation', a: standardDeviation(aReturns).toFixed(4), b: standardDeviation(bReturns).toFixed(4) }
    ]
  })
  </script>
  