<template>
    <div class="sidebar">



        <button>Dashboard</button>
        <button>Clients</button>
        <button>Support</button>
        <button>Logout</button>

    </div>
  </template>
  
  <script>
  import {auth} from "../FirebaseConfig" ;

  export default {
    
    // eslint-disable-next-line
    name: "Sidebar",
    methods: {
        logout: function() {
      auth.signOut().then(() => {
        this.$router.replace('login')
      }).catch(error => {
    console.error('Error during sign out:', error);
  });
    }

    }
  };
  </script>
  
  <style scoped>
  .sidebar {
    height: 100vh;
    background-color: #171717;
    color: white;
    width: 12%; /* Set the width of the sidebar */

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
  