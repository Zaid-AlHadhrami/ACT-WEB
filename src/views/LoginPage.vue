
<template>
    <div class = "login">
    <h3> Sign in </h3>
    <input type="text" v-model="email" placeholder="Email"> <br>
    <input type="password" v-model="password" placeholder="Password"> <br>
    <button @click="login">Login</button> <br>
    <p>You don't have an account ?  <RouterLink to="/signUp"> You can create one here </RouterLink></p>        </div>
    </template>
    
    <script>

import {auth} from "../FirebaseConfig" ;

import {signInWithEmailAndPassword} from "firebase/auth";

export default {
        /* eslint-disable no-unused-vars */
      // eslint-disable-next-line vue/multi-word-component-names
    name : 'Login',
    data(){
        return {}
    }, 
    methods: {
        login() {

            signInWithEmailAndPassword(auth, this.email, this.password)
  .then((userCredential) => {
    // Signed in 
    this.$router.replace('home')
    const user = userCredential.user;
 
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
            
        }

    }
}

</script>
    
    <style>
    
    .login{
        margin: 0;
        padding: 20px;
    }
    
    input{
        margin: 5px;
        width: 20%;
        padding: 10px;
    }
    
    button{
        width: 10%;
        margin-top: 10px;
        cursor: pointer;
    }
    
    p{
        font-size: 14px;
        margin-top: 40px;
    }
    
    p a {
        text-decoration: underline;
        cursor: pointer;
    }
    
    
    
    </style>