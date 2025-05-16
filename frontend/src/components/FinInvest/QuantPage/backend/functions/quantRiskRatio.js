// Example: metrics.js

export function calculateAlphaBeta(stockReturns, marketReturns, riskFreeRate = 0) {
  const n = stockReturns.length;
  const stockMean = stockReturns.reduce((a, b) => a + b, 0) / n;
  const marketMean = marketReturns.reduce((a, b) => a + b, 0) / n;

  let cov = 0;
  let varMarket = 0;
  for (let i = 0; i < n; i++) {
    cov += (stockReturns[i] - stockMean) * (marketReturns[i] - marketMean);
    varMarket += Math.pow(marketReturns[i] - marketMean, 2);
  }

  const beta = cov / varMarket;
  const alpha = stockMean - (riskFreeRate + beta * (marketMean - riskFreeRate));
  return { alpha, beta };
}

export function calculateSharpeRatio(returns, riskFreeRate = 0) {
  const n = returns.length;
  const mean = returns.reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n);
  return (mean - riskFreeRate) / std;
}

export function calculateSortinoRatio(returns, riskFreeRate = 0) {
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const downsideReturns = returns.filter(r => r < riskFreeRate);
  const downsideDev = Math.sqrt(
    downsideReturns.reduce((a, b) => a + Math.pow(b - riskFreeRate, 2), 0) / (downsideReturns.length || 1)
  );
  return (mean - riskFreeRate) / downsideDev;
}

export function calculateStandardDeviation(returns) {
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  return Math.sqrt(returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length);
}
