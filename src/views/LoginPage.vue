
<template>
    <div class = "login">
    <h3> Sign in </h3>
    <input type="text" v-model="email" placeholder="Email"> <br>
    <input type="password" v-model="password" placeholder="Password"> <br>
    <button @click="login">Login</button> <br>
    <p>
                <a href="#" @click.prevent="forgotPassword">Forgot Password?</a>
            </p>
    <p>You don't have an account ?  <RouterLink to="/signUp"> You can create one here </RouterLink></p>        </div>
    </template>
    
    <script>

import {auth} from "../FirebaseConfig" ;

import {signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";

import { useUserStore } from "@/stores/userStore";

export default {
        /* eslint-disable no-unused-vars */
      // eslint-disable-next-line vue/multi-word-component-names
    name : 'Login',
    data(){
        return {}
    }, 
    methods: {
      async login() {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
    // Signed in
    const user = userCredential.user;
    const userStore = useUserStore();

    // Await the completion of user setting
    await userStore.setUser(user);

    console.log(userStore.userType);
    localStorage.setItem('userType', userStore.userType); // Persist user type
    localStorage.setItem('userId', userStore.userData.uid);
    console.log(userStore.userData.uid);

    if (userStore.userType === 'admin' || userStore.userType === 'client') {
      this.$router.replace(`/client/${user.uid}`);
    } else {
      this.$router.replace(`/home/${user.uid}`);
    }
  } catch (error) {
    console.error('Login failed:', error);
    // Handle errors (e.g., wrong credentials)
  }
}
,

    forgotPassword(){
        sendPasswordResetEmail(auth, this.email)
  .then(() => {
    // Password reset email sent!
    // ..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
    }

    }
}

</script>
    
<style scoped>
.login {
  margin: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

input {
  margin: 10px 0;
  width: 90%;
  max-width: 300px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

button {
  width: 90%;
  max-width: 300px;
  margin-top: 15px;
  padding: 12px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
}

p {
  font-size: 14px;
  margin-top: 30px;
  text-align: center;
}

p a {
  text-decoration: underline;
  cursor: pointer;
  color: #007bff;
}

@media (min-width: 768px) {
  input, button {
    width: 300px;
  }
}
</style>
