<template>
  <div class="crypto-dashboard">

    <Sidebar/>

    <div class="main-content" >

      <div class="left-section">
        <PriceChart :mode="'crypto'" :selectedSymbol="selectedCoin" class="chart" />

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

      <div class="wallet">
        <h3> {{ client.name }}'s wallet</h3>
        <p><strong>Balance:</strong> ${{ client.wallet?.balance.toFixed(2) }}</p>
        <p v-if="tradeType== 'sell'"> {{ capitalizeFirstLetter(selectedCoin) }} Amount: {{ client.wallet.assets?.[selectedCoin]?.amount ?? 0 }} </p>
      </div>
      <div class="trade-panel">
        <h2>Trade {{ capitalizeFirstLetter(selectedCoin) }}</h2>
        <div class="trade-form">
          <div class="trade-type-toggle">
            <span :class="{ active: tradeType === 'buy' }" @click="tradeType = 'buy'">Buy</span>
            <span :class="{ active: tradeType === 'sell' }" @click="tradeType = 'sell'">Sell</span>
          </div>
          <div class="form-group">
            <label for="amount">Amount :</label>
            <input type="number" @input="validateOrder" id="amount" v-model="tradeAmount" placeholder="0.000$">
            <p> {{ message }}</p>
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
 import { db } from "../FirebaseConfig";
 import { doc, getDoc, setDoc} from "firebase/firestore";
import axios from 'axios';
import PriceChart from '@/components/PriceChart.vue';
import Sidebar from '@/components/Sidebar.vue';

export default {
  components: { PriceChart, Sidebar },
  data() {
    return {

      message : "Enter value here",
      cryptoData: {},
      selectedCoin: 'bitcoin',
      tradeAmount: null,
      tradePrice: null,
      tradeType: 'buy',
      client: {},
      passingid: null,
      orderHistory: [],
      symbols: ['AAPL', 'GOOGL', 'MSFT'], // Array of stock symbols
      prices: {}
    };
  },
  methods: {

    fetchPrices() {
      this.prices = {}; // Reset prices
      const API_KEY = 'ct2b3l1r01qiurr3qp20ct2b3l1r01qiurr3qp2g'; // Replace with your Finnhub API key
      
      this.symbols.forEach(symbol => {
        const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
        axios.get(url)
          .then(response => {
            this.prices[symbol] = response.data; // 'c' is the current price
            console.log(response.data);
                      })
          .catch(error => {
            console.error('Error fetching stock price for', symbol, ':', error);
          });
      });

    },

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


    getCurrentPrice() {
      return this.cryptoData[this.selectedCoin]?.usd.toFixed(2) || '0.00';
    },
    calculateTotal() {
      const currentPrice = parseFloat(this.getCurrentPrice());
      return this.tradeAmount * currentPrice || 0;
    },

    validateOrder() {
  const wallet = this.client.wallet;
  const totalAmount = this.calculateTotal();

  if (totalAmount <= 0) {
    this.message = "You have to enter a value bigger than 0.";
    return false;
  }

  if (this.tradeType === 'buy') {
    if (wallet.balance < totalAmount) {
      this.message = "Insufficient balance";
      return false;
    }
  } else if (this.tradeType === 'sell') {
    if (!wallet.assets || !wallet.assets[this.selectedCoin] || wallet.assets[this.selectedCoin].amount < this.tradeAmount) {
      this.message = `Insufficient ${this.selectedCoin.toUpperCase()} balance`;
      return false;
    }
  }

  this.message = ""; // Clear message if validation passes
  return true;
},

    placeOrder() {
      
      if (!this.validateOrder()) {
    return { success: false, message: this.message };
  }
      const wallet = this.client.wallet;
        const totalAmount = this.calculateTotal();

          // Ensure `assets` exists
  if (!wallet.assets) {
    wallet.assets = {};
  }


  if (this.tradeType === 'buy') {
    wallet.balance -= totalAmount;
    wallet.assets = this.updateAsset(wallet.assets, this.selectedCoin, this.tradeAmount, this.getCurrentPrice(), 'buy');
  } else if (this.tradeType === 'sell') {
    wallet.balance += totalAmount;
    wallet.assets = this.updateAsset(wallet.assets, this.selectedCoin, this.tradeAmount, this.getCurrentPrice(), 'sell');
  }

  // Add transaction to history
  const transaction = {
    id: `tx-${Date.now()}`,
    type: this.tradeType,
    coin: this.selectedCoin,
    amount: this.tradeAmount,
    price: this.getCurrentPrice(),
    date: new Date().toISOString()
  };


  // Update wallet data in the database
   this.updateWalletData( wallet, transaction);
   this.tradeAmount = null; // Reset amount after order

  return { success: true, message: "Order placed successfully" };
      
    },
    
    updateAsset(assets, selectedCoin, tradeAmount, price, tradeType) {
  if (tradeType === 'buy') {
    // If the asset exists, update the amount and average price
    if (assets[selectedCoin]) {
      const currentAsset = assets[selectedCoin];
      const newAmount = currentAsset.amount + tradeAmount;
      const newAveragePrice = ((currentAsset.amount * currentAsset.averagePrice) + (tradeAmount * price)) / newAmount;
      assets[selectedCoin] = {
        amount: newAmount,
        averagePrice: newAveragePrice
      };
    } else {
      // Asset does not exist, create a new entry
      assets[selectedCoin] = {
        amount: tradeAmount,
        averagePrice: price
      };
    }
  } else if (tradeType === 'sell') {
    if (assets[selectedCoin]) {
      assets[selectedCoin].amount -= tradeAmount;
      if (assets[selectedCoin].amount === 0) {
        delete assets[selectedCoin];
      }
    }
  }
  return assets;
}

    ,
    addToOrderHistory(type) {
      this.orderHistory.push({
        type: type,
        coin: this.selectedCoin,
        amount: this.tradeAmount,
        price: this.getCurrentPrice()
      });
    },
    async fetchData() {
        const docRef = doc(db, "managers", localStorage.getItem('userId'), "clients", this.passingid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            this.client = {
              id: docSnap.id,
              ...docSnap.data()
            };
            console.log(this.client);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching client data: ", error);
        }
      },

      async updateWalletData(wallet, transaction) {

        const docRef = doc(db, "managers", localStorage.getItem('userId'), "clients", this.passingid);

  // Ensure transactions array exists
  if (!wallet.transactions) {
    wallet.transactions = [];
  }

  // Add the new transaction to the history
  wallet.transactions.push(transaction);

  // Update the Firestore document
  try {
        await setDoc(docRef, { wallet: this.client.wallet }, { merge: true });
        console.log("Client data updated successfully.");
      } catch (error) {
        console.error("Error updating client data:", error);
      }
}


  },

  mounted() {
    this.passingid = this.$route.params.id;
      this.fetchData();
    this.fetchCryptoData();
    this.fetchPrices();
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

.trade-panel {
  height: 600px;
  margin: 20px;
}
.crypto-list, .trade-panel, .wallet {
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
  display: flex;
  flex-direction: column;
}

.trade-type-toggle {
  display: flex;
  background-color: black;
  justify-content: space-between;
  border-radius: 10px; /* Rounded corners */
  padding: 8px;
  width: 90%;
  align-self: center;

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
  align-self: center;
  width: 30%;
 padding:10px; 
 border:none; 
 border-radius:4px; 
 cursor:pointer; 
 font-weight:bold; 
 color:white; 
 transition:.3s ease
}

.wallet {
  background-color: white;
  margin: 20px;
}

.trade-btn.buy { background-color:#4CAF50 } /* Green for buy */
.trade-btn.sell { background-color:#f44336 } /* Red for sell */

.trade-btn[disabled] { opacity:.5; cursor:not-allowed }

</style>