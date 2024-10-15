<template>
    <div class="Home">

      <Sidebar/> 
      <div class="main-content">

        <h1>Client Management</h1>
      
      <div class="client-list">
        <div id="top-bar" class="flexD">      
           <h2>All Clients</h2>
           <input placeholder="Search">
            <button @click="addClient" id="addbutton"> <img :src="'https://img.icons8.com/?size=100&id=62888&format=png&color=666666'"> New client</button></div>
        <div id="clientRow" class="client-card flexD">
          <p>ClientID</p>
          <p>Client Name</p>
          <p>Email</p>
          <p>Phone Number</p>
          <p>Actions</p>
        </div>
        <div class="client-card flexD" v-for="client in clients" :key="client.email">
          <p>{{ client.id }}</p>
          <p>{{ client.name }}</p>
          <p>{{ client.email }}</p>
          <p>{{ client.phoneNumber }}</p>
          <button> manage </button>
        </div>
      </div>
  
      <div  class="clientForm " v-if="newClientVisible">
        <h2>Add New Client</h2>
        <input type="text" v-model="newClient.name" placeholder="Client Name" />
        <input type="email" v-model="newClient.email" placeholder="Client Email" />
        <input type="phone" v-model="newClient.phoneNumber" placeholder="Client Number" />
        <button @click="saveData">Save Client</button>
        <button @click="newClientVisible = false">Cancel</button>
      </div>
      

      </div>


    </div>
  </template>
  
  <script>
  import { auth, db } from "../FirebaseConfig";
import {  addDoc, collection, getDocs } from "firebase/firestore";
  import Sidebar from "@/components/Sidebar.vue";
  
  export default {
    data() {
      return {
        clients: [],
        newClientVisible: false,
        newClient: {
          id: '',
          name: '',
          email: '',
          phoneNumber: ''
        }
      };
    },
    components: {
      Sidebar
    }, mounted() {

      this.fetchData()
    },

    methods: {
      generateID(){
        var clientsNum = this.clients.length;
        console.log(clientsNum);
        var id = "#0" + (clientsNum+1);
console.log(id);
        return id;

      },
      addClient() {
        this.newClientVisible = true;
        this.newClient = { id:this.generateID(), name: '', email: '', phoneNumber:'' }; // Reset new client form
      },
      saveClient() {
        if (this.newClient.name && this.newClient.email && this.newClient.phoneNumber ) {
          this.clients.push({ ...this.newClient });
          this.newClientVisible = false; // Hide the form after saving
        } else {
          alert('Please fill in all fields.');
        }
      },
      
      async saveData() {
        try {
    const docRef = await addDoc(collection(db, "clients"), {
     id: this.generateID(),
     name : this.newClient.name,
     email : this.newClient.email,
     phoneNumber : this.newClient.phoneNumber

    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }    }
      ,
      logout() {
        auth.signOut().then(() => {
          this.$router.replace('login');
        }).catch(error => {
          console.error('Error during sign out:', error);
        });
      },
      async fetchData() {
      const querySnapshot = await getDocs(collection(db, "clients")); // Fetch data from the "clients" collection
      this.clients = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })); // Map and assign the data to the clients array
      console.log(this.clients)
    },

    }
  };
  </script>
  
  <style scoped>
  body {
    margin: 0; /* Remove default margin */
  }
  
  .Home {
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
  
  .client-list {
    margin-top: 100px;
    border-radius: 5px;
    background-color: white;
    width: 50%; /* Set a fixed width for the list */
    margin: 0 auto; /* Center the list horizontally */
    display: flex;
    flex-direction: column; /* Stacks cards vertically */
    color: #000;
    height: 550px;
    padding: 10px;
  }
  
#addbutton {
    display: flex;
    width: 100px;
    height: 30px;
    justify-content: space-between;
    padding: auto;
}

img {
    width: 14px;
    height: 14px;
    margin-right: 0.5px;
}

.flexD {
  display: flex;
  justify-content: space-between; /* Aligns items within the card */
}

  .client-card {
    height: 30px;
    align-items: center; /* Vertically centers items */
    border-bottom: 1px solid #ddd;
    padding: 16px;
  }
  
  #clientRow {
    margin-top: 10px;

  }

  #top-bar {
    padding: 10px;
    height: 20px;
  }

  button{
    padding: 10px;
    align-items: center;
    background-color: #F5F5F5;
    color: #666666;
    border: none ;
    border-radius: 4px;
  }

  .clientForm{
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
    margin: 0 auto;
    margin-top: 3%;
    padding: 10px;
  }
  
  .client-name,
  .client-email,
  .client-phone {
    margin-right: 0; /* Space between items */
  }
  </style>
  