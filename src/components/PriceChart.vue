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
          console.log(response);
          this.updateChart(response.data.prices);
        } catch (error) {
          console.error("Error fetching crypto data:", error);
        }
      },
      fetchStockData() {
      const params = {
        symbol: this.selectedSymbol,  // Example: Google's stock symbol
        period: '5d',
        interval: '1d'
      };

      axios.get('http://localhost:8000/fetch-stock-data', { params })
        .then(response => {
          this.updateChart(response.data);  // Assuming you have a method to update the chart
        })
        .catch(error => {
          console.error('Error fetching stock data:', error);
        });
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
  