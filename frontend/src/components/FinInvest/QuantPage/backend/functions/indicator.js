// utils/indicators.js

export function computeSMA(data, period) {
    const sma = []
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        sma.push(null)
      } else {
        const window = data.slice(i - period + 1, i + 1)
        const sum = window.reduce((acc, val) => acc + val, 0)
        sma.push(sum / period)
      }
    }
    return sma
}
  
export function computeEMA(data, period) {
    const ema = []
    const k = 2 / (period + 1)
    let prev = data[0]
    ema.push(prev)
  
    for (let i = 1; i < data.length; i++) {
      const next = data[i] * k + prev * (1 - k)
      ema.push(next)
      prev = next
    }
    return Array(period - 1).fill(null).concat(ema.slice(period - 1))
}
  
export function computeRSI(data, period = 14) {
    const rsi = []
    let gains = 0, losses = 0
  
    for (let i = 1; i <= period; i++) {
      const diff = data[i] - data[i - 1]
      if (diff >= 0) gains += diff
      else losses -= diff
    }
  
    let avgGain = gains / period
    let avgLoss = losses / period
    rsi.push(100 - (100 / (1 + avgGain / avgLoss)))
  
    for (let i = period + 1; i < data.length; i++) {
      const diff = data[i] - data[i - 1]
      if (diff >= 0) {
        avgGain = (avgGain * (period - 1) + diff) / period
        avgLoss = (avgLoss * (period - 1)) / period
      } else {
        avgGain = (avgGain * (period - 1)) / period
        avgLoss = (avgLoss * (period - 1) - diff) / period
      }
  
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
      rsi.push(100 - (100 / (1 + rs)))
    }
  
    return Array(period).fill(null).concat(rsi)
}
  
export function computeMACD(prices) {
  const ema12 = computeEMA(prices, 12);
  const ema26 = computeEMA(prices, 26);
  const macd = ema12.map((val, index) => val - ema26[index]);
  const signalLine = computeEMA(macd, 9);
  return { macd, signalLine };
}

export function computeBollingerBands(prices, period) {
  const sma = computeSMA(prices, period);
  const stdDev = prices.map((_, i) => {
    if (i < period - 1) return null;
    const slice = prices.slice(i - period + 1, i + 1);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    return Math.sqrt(slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period);
  });

  return {
    middleBand: sma,
    upperBand: sma.map((val, i) => (val !== null ? val + 2 * stdDev[i] : null)),
    lowerBand: sma.map((val, i) => (val !== null ? val - 2 * stdDev[i] : null)),
  };
}