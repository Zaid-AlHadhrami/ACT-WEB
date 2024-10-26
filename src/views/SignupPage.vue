/* eslint-disable vue/multi-word-component-names */

<template>
<div class = "SignUp">
<h3> Sign Up </h3>
<input type="text" v-model="username" placeholder="Username"> <br>
<input type="text" v-model="name" placeholder="Name"> <br>
<input type="text" v-model="email" placeholder="Email"> <br>
<input type="password" v-model="password" placeholder="Password"> <br>

<button @click="signUp">Sign Up</button> <br>
<p> <RouterLink to="/login"> back to login.</RouterLink>  </p></div>
</template>


<script>


import {auth, db } from "../FirebaseConfig" ;
import {doc, setDoc} from 'firebase/firestore'
import {createUserWithEmailAndPassword } from "firebase/auth";
export default {
    /* eslint-disable no-unused-vars */
    // eslint-disable-next-line vue/multi-word-component-names
    name : 'SignUp',
    data(){
        return {email:'',password:'', username:'', 


        }
    }, 
    methods: {
      signUp() {

   createUserWithEmailAndPassword(auth, this.email, this.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        this.$router.replace(`/home/${user.uid}`)
        // calling the method to store the managers data 
        this.storeCreatedUserData(user);
        alert("usear is created!");
        console.log('User signed up:', this.email, user);  // Debugging line to confirm the user was signed up
      })
      .catch((error) => {
        console.error('Error during sign up:', error.code, error.message);  // Debugging line for error handling
        alert("Opps! " + error.message);
      });
  },

  async storeCreatedUserData(user){
                        // Store user info in Firestore under the "restaurants" collection
                const userDocRef = doc(db, "managers", user.uid); // Using user UID as the document identifier
                await setDoc(userDocRef, {
                    uid: user.uid,
                    name: this.name,
                    email: this.email
                    // Add other user details here as needed
                });
  }

},
}

</script>

<style scoped>

.SignUp{
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



</style>p