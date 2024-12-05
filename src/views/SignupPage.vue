/* eslint-disable vue/multi-word-component-names */

<template>
<div class = "SignUp">
<h3> Sign Up </h3>
<input type="text" v-model="username" placeholder="Username"> <br>
<input type="text" v-model="name" placeholder="Name"> <br>
<input type="text" v-model="email" placeholder="Email"> <br>
<input type="password" v-model="password" placeholder="Password"> <br>

<div class="radio-group">
      <label>
        <input type="radio" v-model="userType" value="manager">
        Manager
      </label>
      <label>
        <input type="radio" v-model="userType" value="admin">
        Admin
      </label>
    </div>

<button @click="signUp">Sign Up</button> <br>
<p> Already have an account? Click <RouterLink to="/login"> here.</RouterLink>  </p></div>
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
        return {email:'',password:'', username:'', userType : ''


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

                        const walletObject = {
          balance: 0,
          transactions: []
        };
        


                        if( this.userType == 'manager'){


                          this.$router.replace(`/home/${user.uid}`)


                const userDocRef = doc(db, "managers", user.uid); // Using user UID as the document identifier
                await setDoc(userDocRef, {
                    uid: user.uid,
                    name: this.name,
                    email: this.email
                });

                        } else {

                          this.$router.replace(`/client/${user.uid}`)

                          const userDocRef = doc(db, "admins", user.uid); // Using user UID as the document identifier
                await setDoc(userDocRef, {
                    uid: user.uid,
                    name: this.name,
                    email: this.email,
                    wallet: walletObject,
                });
                        }

                        const userDocRef = doc(db, "users", user.uid); // Using user UID as the document identifier
                await setDoc(userDocRef, {
                    uid: user.uid,
                    userType : this.userType
                });

  }

},
}

</script>

<style scoped>

.SignUp{
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



</style>p