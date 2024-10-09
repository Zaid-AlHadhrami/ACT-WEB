<template>
    <div class="Home">

        <h2> Welcome to the home page!</h2> <br>
        <button @click="logout"> Logout </button>

    </div>
</template>


<script>
import {auth} from "../FirebaseConfig" ;

export default {
  
  // eslint-disable-next-line
  name: "Home",
  methods: {
      logout(){
    auth.signOut().then(() => {
      this.$router.replace('login')
    }).catch(error => {
  console.error('Error during sign out:', error);
});
  }

  }
};
</script>