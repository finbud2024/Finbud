// src/components/FinInvest/QuantPage/backend/functions/quantRiskRatio.js

export function calculateAlphaBeta(stockReturns, benchmarkReturns) {
    const n = Math.min(stockReturns.length, benchmarkReturns.length);
    if (n === 0) return { alpha: 0, beta: 0 };
  
    const meanStock = stockReturns.reduce((a, b) => a + b, 0) / n;
    const meanBenchmark = benchmarkReturns.reduce((a, b) => a + b, 0) / n;
  
    let covariance = 0;
    let variance = 0;
  
    for (let i = 0; i < n; i++) {
      const stockDiff = stockReturns[i] - meanStock;
      const benchDiff = benchmarkReturns[i] - meanBenchmark;
      covariance += stockDiff * benchDiff;
      variance += benchDiff ** 2;
    }
  
    const beta = variance === 0 ? 0 : covariance / variance;
    const alpha = meanStock - beta * meanBenchmark;
  
    return { alpha, beta };
  }
  
  export function calculateSharpeRatio(returns, riskFreeRate = 0.01) {
    if (!returns.length) return 0;
  
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const excessReturns = returns.map(r => r - riskFreeRate / 252);
    const stdDev = Math.sqrt(excessReturns.reduce((sum, r) => sum + r ** 2, 0) / returns.length);
  
    return stdDev === 0 ? 0 : mean / stdDev;
  }
  
  export function calculateSortinoRatio(returns, riskFreeRate = 0.01) {
    if (!returns.length) return 0;
  
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const excessReturns = returns.map(r => r - riskFreeRate / 252);
    const negativeReturns = excessReturns.filter(r => r < 0);
    const downsideDeviation = Math.sqrt(
      negativeReturns.reduce((sum, r) => sum + r ** 2, 0) / (negativeReturns.length || 1)
    );
  
    return downsideDeviation === 0 ? 0 : mean / downsideDeviation;
  }
  
  export function calculateStandardDeviation(returns) {
    if (!returns.length) return 0;
  
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / returns.length;
  
    return Math.sqrt(variance);
  }
  