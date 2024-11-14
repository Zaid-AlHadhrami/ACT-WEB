<template>
  <div class="crypto-dashboard">

    <Sidebar/>

    <div class="main-content" >

      <div class="left-section">
        <PriceChart :selectedCoin="selectedCoin" class="chart" />
      <div class="crypto-list">
        <div class="client-card header flexD">
          <p>Name</p> <p>Price</p> <p>24H change</p>
        </div>
        <div 
          v-for="(data, name) in cryptoData" 
          :key="name" 
          class="client-card flexD" 
          @click="selectCoin(name)"
        >
          <p>{{ capitalizeFirstLetter(name) }}</p>
          <p>${{ data.usd.toFixed(2) }}</p>
          <p :style="{ color: data.usd_24h_change >= 0 ? 'green' : 'red' }">
            {{ data.usd_24h_change.toFixed(2) }}%
          </p>
        </div>
      </div>
    </div>
    <div class="right-section">
      <div class="trade-panel">
        <h2>Trade {{ capitalizeFirstLetter(selectedCoin) }}</h2>
        <div class="trade-form">
          <div class="trade-type-toggle">
            <span :class="{ active: tradeType === 'buy' }" @click="tradeType = 'buy'">Buy</span>
            <span :class="{ active: tradeType === 'sell' }" @click="tradeType = 'sell'">Sell</span>
          </div>
          <div class="form-group">
            <label for="amount">Amount ({{ selectedCoin.toUpperCase() }}):</label>
            <input type="number" id="amount" v-model="tradeAmount" placeholder="Enter amount">
          </div>
          <div class="form-group">
            <label>Current Price (USD):</label>
            <div class="current-price">${{ getCurrentPrice() }}</div>
          </div>
          <div class="trade-total">
            Total: ${{ calculateTotal().toFixed(2) }}
          </div>
          <button 
            @click="placeOrder" 
            :class="['trade-btn', tradeType]"
            :disabled="!canPlaceOrder"
          >
            {{ tradeType === 'buy' ? 'Buy' : 'Sell' }} {{ selectedCoin.toUpperCase() }}
          </button>
        </div>
      </div>
    </div>

    </div>

  </div>
</template>

<script>
import axios from 'axios';
import PriceChart from '@/components/PriceChart.vue';
import Sidebar from '@/components/Sidebar.vue';

export default {
  components: { PriceChart, Sidebar },
  data() {
    return {
      cryptoData: {},
      selectedCoin: 'bitcoin',
      tradeAmount: null,
      tradePrice: null,
      tradeType: 'buy',
    };
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    async fetchCryptoData() {
      const options = {
        method: "GET",
        url: "https://api.coingecko.com/api/v3/simple/price",
        params: {
          ids: "bitcoin,ethereum,cardano,dogecoin,polkadot,ripple",
          vs_currencies: "usd",
          include_24hr_change: "true"
        },
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": "CG-ov57GBLi5Z12RAY4D3VM28gY"
        }
      };
      try {
        const response = await axios.request(options);
        this.cryptoData = response.data;
      }
      catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    },
    selectCoin(coinName) {
      this.selectedCoin = coinName;
      this.tradePrice = this.getCurrentPrice();
    },

    placeBuyOrder() {
      // Implement buy order logic here
      console.log(`Placing buy order for ${this.tradeAmount} ${this.selectedCoin} at $${this.tradePrice}`);
    },
    placeSellOrder() {
      // Implement sell order logic here
      console.log(`Placing sell order for ${this.tradeAmount} ${this.selectedCoin} at $${this.tradePrice}`);
    },

    getCurrentPrice() {
      return this.cryptoData[this.selectedCoin]?.usd.toFixed(2) || '0.00';
    },
    calculateTotal() {
      const currentPrice = parseFloat(this.getCurrentPrice());
      return this.tradeAmount * currentPrice || 0;
    },
    placeOrder() {
      if (this.canPlaceOrder) {
        const totalAmount = this.calculateTotal();
        if (this.tradeType === 'buy') {
          if (this.walletBalance.usd >= totalAmount) {
            this.walletBalance.usd -= totalAmount;
            this.walletBalance[this.selectedCoin] += parseFloat(this.tradeAmount);
            this.addToOrderHistory('buy');
          } else {
            alert("Insufficient USD balance");
          }
        } else { // sell
          if (this.walletBalance[this.selectedCoin] >= this.tradeAmount) {
            this.walletBalance.usd += totalAmount;
            this.walletBalance[this.selectedCoin] -= parseFloat(this.tradeAmount);
            this.addToOrderHistory('sell');
          } else {
            alert(`Insufficient ${this.selectedCoin.toUpperCase()} balance`);
          }
        }
        this.tradeAmount = null; // Reset amount after order
      }
    },
    addToOrderHistory(type) {
      this.orderHistory.unshift({
        type: type,
        coin: this.selectedCoin,
        amount: this.tradeAmount,
        price: this.getCurrentPrice()
      });
    }

  },
  mounted() {
    this.fetchCryptoData();
  }
}
</script>


<style scoped>
.crypto-dashboard {
  display: flex;
  gap: 20px;
  margin: 0;
}
body {
    margin: 0; /* Remove default margin */
  }
  

  .sidebar {
  background-color: #202123; /* Just an example background color */
  overflow-y: auto; /* Scroll if content overflows */
}

.main-content {
  display: flex;
  flex-grow: 1; /* Main content takes up the remaining space */
  padding: 20px; /* Optional padding */
  align-items: center;
}
  

.left-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-section {
  flex: 1;
}

.crypto-list, .trade-panel {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 15px;
}

.client-card {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
}

.client-card.header {
  font-weight: bold;
}

.client-card p {
  flex: 1;
}

/* Styles for the trade panel */
.trade-panel h2 {
  margin-bottom: 15px;
}

.trade-form {
  align-items: center;
  display: flex;
  flex-direction: column;
}

.trade-type-toggle {
  display: flex;
  background-color: black;
  justify-content: space-between;
  border-radius: 10px; /* Rounded corners */
  padding: 8px;
  width: 100%;

}

.trade-type-toggle span {
  flex-grow: 1; /* Allow spans to grow equally */
  text-align: center;
  padding: 10px; 
  cursor: pointer; 
  border-radius: 10px; /* Rounded corners */
  width: 20px;
  
 /* Background color and transition */
 transition: background-color .3s, color .3s; 
}

.trade-type-toggle span.active {
 background-color: #007bff; /* Active color for the selected option */
 color: white; /* Text color when active */
}

.form-group {
 display: flex; 
 flex-direction: column; 
 margin-top:10px
}

.form-group label {
 font-weight: bold; 
 color:#555
}

.form-group input { 
 padding:8px; 
 border-radius:4px; 
 border:none; 
 box-shadow:-1px -1px #fff inset,1px -1px #fff inset, -1px -1px #fff inset, -1px -1px #fff inset; /* Subtle shadow effect */  
}

.current-price { 
 padding:8px; 
 background-color:#f9f9f9; 
 border-radius:4px; 
 font-weight:bold
}

.trade-total { 
 font-weight:bold; 
 text-align:right
}

.trade-btn { 
 padding:10px; 
 border:none; 
 border-radius:4px; 
 cursor:pointer; 
 font-weight:bold; 
 color:white; 
 transition:.3s ease
}

.trade-btn.buy { background-color:#4CAF50 } /* Green for buy */
.trade-btn.sell { background-color:#f44336 } /* Red for sell */

.trade-btn[disabled] { opacity:.5; cursor:not-allowed }
</style>