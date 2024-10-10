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
        <button @click="saveClient">Save Client</button>
        <button @click="newClientVisible = false">Cancel</button>
      </div>
      

      </div>


    </div>
  </template>
  
  <script>
  import { auth } from "../FirebaseConfig";
  import Sidebar from "@/components/Sidebar.vue";
  
  export default {
    data() {
      return {
        clients: [
          { id:'#01', name: 'John Doe', email: 'john.doe@example.com', phoneNumber: '(123) 456-7890' },
          { id:'#02',name: 'Jane Smith', email: 'jane.smith@example.com', phoneNumber: '(987) 654-3210' },
          { id:'#03', name: 'Alice Johnson', email: 'alice.j@example.com', phoneNumber: '(555) 123-4567' },
          { id:'#04',name: 'Bob Brown', email: 'bob.brown@example.com', phoneNumber: '(444) 987-6543' },
          { id:'#05',name: 'Charlie White', email: 'charlie.w@example.com', phoneNumber: '(222) 333-4444' }
        ],
        newClientVisible: false,
        newClient: {
          name: '',
          email: '',
          phoneNumber: ''
        }
      };
    },
    components: {
      Sidebar
    },
    methods: {
      addClient() {
        this.newClientVisible = true;
        this.newClient = { name: '', email: '', phoneNumber:'' }; // Reset new client form
      },
      saveClient() {
        if (this.newClient.name && this.newClient.email && this.newClient.phoneNumber ) {
          this.clients.push({ ...this.newClient });
          this.newClientVisible = false; // Hide the form after saving
        } else {
          alert('Please fill in all fields.');
        }
      },
      logout() {
        auth.signOut().then(() => {
          this.$router.replace('login');
        }).catch(error => {
          console.error('Error during sign out:', error);
        });
      }
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
  