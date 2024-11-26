<template>
    <div class="landing-page">

      <div class="content">
        <h1>Build Your Generational Wealth</h1>
        <p>Your journey to financial freedom starts here. Take the first step today!</p>
        <button @click="navigateToSignup">Get Started</button>
      </div>

    </div>
  </template>
  
  <script>
  export default {
    name: 'LandingPage',
    methods: {
      navigateToSignup() {
        this.$router.push('/signup'); // Redirect to signup or login page
      },
    },
  };
  </script>
  
  <style scoped>
  .landing-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    text-align: center;
    background: linear-gradient(135deg, #848689, #2c343d);
    color: #fff;
    padding: 1rem;
  }
  
  .content {
    margin:0;
    margin-bottom: 2rem;
    width: 100%;
  }
  
  .content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .content p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
  }
  
  button {
    background-color: #fff;
    color: #131314;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #f0f0f0;
  }
  
  .image-container {
    width: 100%;
    margin: 0;
    background-color: #f0f0f0;
    max-width: 600px;
  }
  
  .image-container img {
    width: 100%;
    height: 30%;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  </style>
  