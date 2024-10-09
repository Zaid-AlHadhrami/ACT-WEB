/* eslint-disable vue/multi-word-component-names */

<template>
<div class = "SignUp">
<h3> Sign Up </h3>
<input type="text" v-model="username" placeholder="Username"> <br>
<input type="text" v-model="name" placeholder="Name"> <br>
<input type="text" v-model="email" placeholder="Email"> <br>
<input type="password" v-model="password" placeholder="Password"> <br>

<button @click="signUp">Sign Up</button>

</div>
</template>
<script>


export default {
    /* eslint-disable no-unused-vars */
    // eslint-disable-next-line vue/multi-word-component-names
    name : 'SignUp',
    data(){
        return {email:'',password:'', username:''}
    }, 
    methods: {
 signUp() {
    console.log('Sign up button clicked'); // Debugging line to check if the method is triggered
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