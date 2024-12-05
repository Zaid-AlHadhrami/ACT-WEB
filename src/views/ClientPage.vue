<template>
    <div class="Client-Page">
      <Sidebar />
      <div class="main-content">
        <h1>{{ isAdmin ? 'Your Information' : 'Client Information' }}</h1>        <div class="client-details">
          <h2>{{ client.name }}</h2>
          <p><strong>Email:</strong> {{ client.email }}</p>
          <p><strong>Phone:</strong> {{ client.phoneNumber }}</p>
  
          <h3>Wallet Information</h3>
          <p><strong>Balance:</strong> ${{ client.wallet?.balance.toFixed(2) }}</p>
          
          <h4>Transactions:</h4>
          <ul v-if="client.wallet?.transactions.length > 0">
            <li v-for="transaction in client.wallet.transactions" :key="transaction.id">
              <strong>{{ transaction.type }}:</strong> ${{ transaction.amount.toFixed(2) }} on {{ new Date(transaction.date).toLocaleString() }} - {{ transaction.description }}
            </li>
          </ul>
          <p v-else>No transactions available.</p>

          <h4>Assets:</h4>
          
          <ul v-if="client.wallet?.assets && !isEmpty(client.wallet.assets)">
            <li v-for="asset in client.wallet.assets" :key="asset.id">
              <strong>{{ asset }} </strong>
            </li>
          </ul>
          <p v-else>No assets available.</p>
        </div>
                <!-- Form to Add Funds -->
                <input type="number" v-model="fundsToAdd" placeholder="Amount to add" />
        <button @click="addFunds">Add Funds</button>

        <br>

        <button @click="navToOrderPage" > Trade </button>
      </div>
    </div>
  </template>
  
  <script>
  import { auth, db } from "../FirebaseConfig";
  import { doc, getDoc, setDoc} from "firebase/firestore";
  import Sidebar from "@/components/Sidebar.vue";
import { useUserStore } from "@/stores/userStore";
import { computed } from 'vue'



  export default {

    data() {
      return {
        store : useUserStore(),
        client: {},
        passingid: null,
        managerRef: null,
        isAdmin : false
      };
    },
    components: {
      Sidebar
    },

    mounted() {

      

  this.passingid = this.$route.params.id;

  const userType = localStorage.getItem('userType');

  console.log(userType)


  if (this.passingid) {
      if (this.store.isAdmin) {
        this.isAdmin = true
        this.client = this.store.userData;
      } else {
        this.managerRef = doc(db, "managers", localStorage.getItem('userId'));
        this.fetchData();
      }
    }
  }

,
  
    methods: {



      navToOrderPage(){
      this.$router.replace(`/cryptolist/${this.passingid}`);

    },
      isEmpty(obj) {
      return Object.keys(obj).length === 0;
    },
      logout() {
        auth.signOut()
          .then(() => {
            this.$router.replace('login');
          })
          .catch(error => {
            console.error('Error during sign out:', error);
          });
      },
  
      async fetchData() {
        const docRef = doc(this.managerRef, "clients", this.passingid);
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

      async addFunds() {
      if (!this.fundsToAdd || this.fundsToAdd <= 0) {
        alert("Please enter a valid amount.");
        return;
      }

      // Update balance
      this.client.wallet.balance += parseFloat(this.fundsToAdd);

      // Create a new transaction record
      const transaction = {
        id: this.generateTransactionId(),
        type: 'credit',
        amount: parseFloat(this.fundsToAdd),
        date: new Date().toISOString(),
        description: `Added funds: $${this.fundsToAdd}`
      };

      // Add transaction to the client's wallet
      this.client.wallet.transactions.push(transaction);

      // Save updated client data back to Firestore
      await this.updateClientData();

      // Reset input field
      this.fundsToAdd = null;
    },
    async updateClientData() {


      const clientRef = this.store.isAdmin ? this.store.userDocRef : doc(this.managerRef, 'clients', this.client.id);

      // const clientRef = doc(this.managerRef, 'clients', this.client.id);
      
      try {
        await setDoc(clientRef, { wallet: this.client.wallet }, { merge: true });
        console.log("Client data updated successfully.");
      } catch (error) {
        console.error("Error updating client data:", error);
      }
    },

    generateTransactionId() {
      return 'txn_' + Date.now(); // Simple unique ID generation based on timestamp
    }
    }
  };
  </script>
  
  <style scoped>

body {
    margin: 0; /* Remove default margin */
  }
  
  .Client-Page {
    display: flex;
    margin: 0;

  }

  .sidebar {
  background-color: #202123; /* Just an example background color */
  overflow-y: auto; /* Scroll if content overflows */
}

.main-content {
  flex-grow: 1; /* Main content takes up the remaining space */
  padding: 20px; /* Optional padding */
  align-items: center;
}
  .client-details {
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  h1, h2, h3, h4 {
    color: #333;
  }
  
  p {
    font-size: 16px;
  }
  
  ul {
    list-style-type: none;
    padding-left: 0;
  }
  
  li {
    margin-bottom: 10px;
  }
  </style>