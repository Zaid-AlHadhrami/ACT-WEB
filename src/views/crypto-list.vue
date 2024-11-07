<template>

    <div class="assets-page"></div>
    <div id="crypto-container">

        <div class="client-card flexD">
            <p>Name</p> <p> Price</p> <p>24H change</p>
        </div>
      <div v-for="(data, name) in cryptoData" :key="name" class="client-card flexD">
        <p>{{ capitalizeFirstLetter(name) }}</p>
        <p>${{ data.usd.toFixed(2) }}</p>
        <p :style="{ color: data.usd_24h_change >= 0 ? 'green' : 'red' }">
    {{ data.usd_24h_change.toFixed(2) }}%
  </p>      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        cryptoData: {}
      }
    },
    methods: {
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      async fetchCryptoData() {
        const options = {
          method: 'GET',
          url: 'https://api.coingecko.com/api/v3/simple/price',
          params: {
            ids: 'bitcoin,ethereum,cardano,dogecoin,polkadot,ripple',
            vs_currencies: 'usd',
            include_24hr_change: 'true'
          },
          headers: {
            accept: 'application/json',
            'x-cg-demo-api-key': 'CG-ov57GBLi5Z12RAY4D3VM28gY'
          }
        };
  
        try {
          const response = await axios.request(options);
          this.cryptoData = response.data;
        } catch (error) {
          console.error('Error fetching crypto data:', error);
        }
      }
    },
    mounted() {
      this.fetchCryptoData();
    }
  }
  </script>


<style scoped>


.assets-page {
    margin: 0;
    display: flex;
}

#crypto-container {
    background-color: white;
    width: 60%;
    display: flex;
    flex-direction: column;
    margin: 0 auto; /* Center the list horizontally */

}

</style>