<template>
    <div class="sidebar">

        <button>Dashboard</button>
        <button @click="NavTo(`/home/${userid}`)">Clients</button>
        <button @click="NavTo('/support')">Support</button>
        <button @click="logout">Logout</button>

    </div>
  </template>
  
  <script>
  import {auth} from "../FirebaseConfig" ;
  

  export default {
    
    props: {
      userid : String 
    },
    // eslint-disable-next-line
    name: "Sidebar",
    methods: {
        logout: function() {
      auth.signOut().then(() => {
        this.$router.replace('login')
      }).catch(error => {
    console.error('Error during sign out:', error);
  });
    },
    NavTo(route){
        this.$router.replace(route)
    }

    }
  };
  </script>
  
  <style scoped>
  .sidebar {
    height: 100vh;
    background-color: #171717;
    color: white;
    width: 8%; /* Set the width of the sidebar */

  }

  button{
    height: 30px;
    background-color: transparent;
    color: white;
    width: 90%;
    border-radius: 5px;
    border: none;
  }
  
  button:hover {
    background-color: red;
  }

  </style>
  