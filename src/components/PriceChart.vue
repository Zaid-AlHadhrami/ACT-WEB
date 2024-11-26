<template>
    <div>
      <canvas ref="cryptoChart"></canvas>
    </div>
  </template>

  
  <script>
  import axios from 'axios';
  import { Chart, registerables } from 'chart.js';
  Chart.register(...registerables);
  
  export default {
    props: ['selectedSymbol', 'mode'], // 'mode' is now a prop
    data() {
      return {
        chart: null
      };
    },
    watch: {
      selectedSymbol: {
        handler: 'fetchData',
        immediate: true
      },

    },
    methods: {
      async fetchData() {
        if (this.mode === 'crypto') {
          this.fetchCryptoData();
        } else if (this.mode === 'stock') {
          this.fetchStockData();
        }
      },
      async fetchCryptoData() {
        const url = `https://api.coingecko.com/api/v3/coins/${this.selectedSymbol}/market_chart`;
        const params = {
          vs_currency: 'usd',
          days: '7',
          interval: 'daily'
        };
  
        try {
          const response = await axios.get(url, { 
            params,
            headers: {
              accept: "application/json",
              "x-cg-demo-api-key": "CG-ov57GBLi5Z12RAY4D3VM28gY"
            }
          });
          this.updateChart(response.data.prices);
        } catch (error) {
          console.error("Error fetching crypto data:", error);
        }
      },
      async fetchStockData() {
        const API_KEY = 'ct2b3l1r01qiurr3qp20ct2b3l1r01qiurr3qp2g'; // Replace with your actual API key
        const url = `https://finnhub.io/api/v1/stock/candle`;
        const params = {
          symbol: this.selectedSymbol,
          resolution: 'D',
          from: Math.floor(Date.now() / 1000) - 7 * 86400,
          to: Math.floor(Date.now() / 1000),
          token: API_KEY
        };
        try {
          const response = await axios.get(url, { params });
          this.updateChart(response.data.t.map(ts => [ts * 1000, response.data.c[response.data.t.indexOf(ts)]]));
        } catch (error) {
          console.error("Error fetching stock data:", error);
        }
      },
      formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  return `${day}. ${month}`;
},
    updateChart(priceData) {
      const ctx = this.$refs.cryptoChart.getContext('2d');
      const labels = priceData.map(data => this.formatDate(data[0]));
      const data = priceData.map(data => data[1]);
  
        if (this.chart) {
          this.chart.destroy();
        }
  
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: `${this.selectedSymbol.toUpperCase()} Price (USD)`,
              data: data,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                labels: {
                  color: '#fff'
                }
              },
              tooltip: {
                titleColor: '#fff',
                bodyColor: '#fff'
              }
            },
            scales: {
              x: {
                grid: {
                  color: '#444'
                },
                ticks: {
                  color: '#fff'
                }
              },
              y: {
                grid: {
                  color: '#444'
                },
                ticks: {
                  color: '#fff'
                }
              }
            },
            elements: {
              line: {
                borderWidth: 2
              }
            }
          }
        });
      }
    }
  };
  </script>
  

  <style scoped>
  canvas {
    background-color: #222;
  }
  </style>
  