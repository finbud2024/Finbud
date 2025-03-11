<template>
    <section class="chart-section">
      <header>
        <h1>Toggle Chart Type (Candlestick / Line)</h1>
      </header>
  
      <!-- Toggle Button -->
      <div class="toggle-buttons">
        <button @click="showCandlestick">Candlestick</button>
        <button @click="showLine">Line</button>
      </div>
  
      <!-- Chart Container -->
      <div ref="chartContainer" class="chart-container"></div>
    </section>
  </template>
  
  <script>
  import { createChart } from "lightweight-charts";
  
  export default {
    name: "StockChartToggle",
    
    data() {
      return {
        chart: null,
        candlestickSeries: null,
        lineSeries: null,
        // Example mock data (10 days of data for demonstration)
        // time is 'YYYY-MM-DD', open/high/low/close are numeric
        candlestickData: [
          { time: '2023-03-01', open: 100.0, high: 105.0, low: 98.0, close: 102.0 },
          { time: '2023-03-02', open: 102.0, high: 108.0, low: 101.0, close: 107.0 },
          { time: '2023-03-03', open: 107.0, high: 109.0, low: 105.0, close: 108.5 },
          { time: '2023-03-04', open: 108.5, high: 110.0, low: 106.0, close: 109.0 },
          { time: '2023-03-05', open: 109.0, high: 113.0, low: 108.0, close: 112.0 },
          { time: '2023-03-06', open: 112.0, high: 115.0, low: 111.0, close: 114.5 },
          { time: '2023-03-07', open: 114.5, high: 115.5, low: 113.0, close: 114.0 },
          { time: '2023-03-08', open: 114.0, high: 116.0, low: 112.5, close: 115.0 },
          { time: '2023-03-09', open: 115.0, high: 117.0, low: 114.0, close: 116.0 },
          { time: '2023-03-10', open: 116.0, high: 119.0, low: 115.0, close: 118.5 },
        ],
      };
    },
  
    computed: {

      lineData() {
        // Returns array of objects { time, value }
        return this.candlestickData.map(item => ({
          time: item.time,
          value: item.close,
        }));
      }
    },
  
    mounted() {
      this.initChart();
      this.createCandlestickSeries();
      this.createLineSeries();
      this.candlestickSeries.setData(this.candlestickData);
      this.lineSeries.setData(this.lineData);
      this.showCandlestick();
      window.addEventListener("resize", this.handleResize);
    },
  
    beforeUnmount() {
      window.removeEventListener("resize", this.handleResize);
    },
  
    methods: {
 
      initChart() {
        const container = this.$refs.chartContainer;
  
        this.chart = createChart(container, {
          width: container.clientWidth, 
          height: 400,
          layout: {
            background: { type: 'solid', color: '#FFFFFF' },
            textColor: '#000000',
          },
          grid: {
            vertLines: { visible: true },
            horzLines: { visible: true },
          },
          crosshair: {
            mode: 1, // Normal crosshair mode
          },
          rightPriceScale: {
            visible: true,
            borderVisible: false,
          },
          timeScale: {
            borderVisible: false,
            timeVisible: true,
            secondsVisible: false,
          },
        });
      },
  
      /**
       * Create our candlestick series and store reference.
       */
      createCandlestickSeries() {
        this.candlestickSeries = this.chart.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
          borderVisible: false,
        });
      },
  
      /**
       * Create a line series and store reference.
       */
      createLineSeries() {
        this.lineSeries = this.chart.addLineSeries({
          // We'll let the library pick default line color, or you can specify one
          lineWidth: 2,
        });
      },
  
      /**
       * Show candlestick chart, hide line chart
       */
      showCandlestick() {
        if (this.candlestickSeries) {
          // Make candlestick visible
          this.candlestickSeries.applyOptions({ visible: true });
        }
        if (this.lineSeries) {
          // Hide line
          this.lineSeries.applyOptions({ visible: false });
        }
      },
  
      /**
       * Show line chart, hide candlestick chart
       */
      showLine() {
        if (this.candlestickSeries) {
 
          this.candlestickSeries.applyOptions({ visible: false });
        }
        if (this.lineSeries) {
     
          this.lineSeries.applyOptions({ visible: true });
        }
      },

      handleResize() {
        const container = this.$refs.chartContainer;
        if (this.chart && container) {
          this.chart.applyOptions({ width: container.clientWidth });
        }
      },
    }
  };
  </script>
  
  <style scoped>
  .chart-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2rem auto;
    max-width: 800px;
  }
  
  .toggle-buttons {
    margin: 1rem 0;
  }
  
  .toggle-buttons button {
    margin-right: 1rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  
  .chart-container {
    width: 100%;
    min-height: 400px; 
    background: #f9f9f9;
    border: 1px solid #ccc;
    position: relative;
  }
  </style>
  