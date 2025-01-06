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

        <br>


      <br>

                <!-- Form to Add Funds -->
                <input type="number" v-model="fundsToAdd" placeholder="Amount to add" />
        <button @click="addFunds">Add Funds</button>

        <br>
              <!-- Export to PDF Button -->
              <button @click="exportToPDF">Export to PDF</button>
        <button @click="navToOrderPage" > Trade </button>
      </div>
    </div>
  </template>
  
  <script>
  import jsPDF from "jspdf";
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



  if (this.passingid) {

    
      if (this.store.isManager) {

        this.managerRef = doc(db, "managers", localStorage.getItem('userId'));
        this.fetchData();
      } 
      else {
        this.client = this.store.userData;
        this.isAdmin = true

      }
    }
  }

,
  
    methods: {

      exportToPDF() {
  const doc = new jsPDF();

  // Formatting constants
  let marginLeft = 10;
  let yPosition = 10;
  const lineHeight = 10;

  // Add Client Information
  doc.setFontSize(14);
  doc.text(`Client Name: ${this.client.name || 'N/A'}`, marginLeft, yPosition);
  yPosition += lineHeight;
  doc.text(`Email: ${this.client.email || 'N/A'}`, marginLeft, yPosition);
  yPosition += lineHeight;
  doc.text(`Phone: ${this.client.phoneNumber || 'N/A'}`, marginLeft, yPosition);
  yPosition += lineHeight;

  // Add Wallet Balance
  if (this.client.wallet?.balance != null) {
    doc.text(`Wallet Balance: $${this.client.wallet.balance.toFixed(2)}`, marginLeft, yPosition);
    yPosition += lineHeight;
  }

  // Add Transactions
  if (this.client.wallet?.transactions?.length > 0) {
    doc.text("Transactions:", marginLeft, yPosition);
    yPosition += lineHeight;
    this.client.wallet.transactions.forEach((transaction) => {
      const date = new Date(transaction.date).toLocaleString();
      const description = transaction.description || "No description provided";
      doc.text(
        `- ${transaction.type.toUpperCase()}: $${transaction.amount.toFixed(2)} on ${date} - ${description}`,
        marginLeft + 5,
        yPosition
      );
      yPosition += lineHeight;
    });
  } else {
    doc.text("No transactions available.", marginLeft, yPosition);
    yPosition += lineHeight;
  }

  // Add Assets
  if (this.client.wallet?.assets && typeof this.client.wallet.assets === "object") {
    const assets = this.client.wallet.assets;

    // Handle assets as an array or object
    if (Array.isArray(assets) && assets.length > 0) {
      doc.text("Assets:", marginLeft, yPosition);
      yPosition += lineHeight;
      assets.forEach((asset) => {
        doc.text(`- ${asset}`, marginLeft + 5, yPosition);
        yPosition += lineHeight;
      });
    } else if (!Array.isArray(assets) && Object.keys(assets).length > 0) {
      doc.text("Assets:", marginLeft, yPosition);
      yPosition += lineHeight;
      Object.entries(assets).forEach(([key, value]) => {
        const formattedValue = typeof value === "object" ? JSON.stringify(value) : value;
        doc.text(`- ${key}: ${formattedValue}`, marginLeft + 5, yPosition);
        yPosition += lineHeight;
      });
    } else {
      doc.text("No assets available.", marginLeft, yPosition);
      yPosition += lineHeight;
    }
  }

  // Save the PDF
  doc.save(`${this.client.name}_details.pdf`);
},



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
  background-color: #202123; 
  overflow-y: auto; /* Scroll if content overflows */
}

.main-content {
  flex-grow: 1; 
  padding: 20px; 
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

  button {
    margin-right: 10px;
  }
  </style>