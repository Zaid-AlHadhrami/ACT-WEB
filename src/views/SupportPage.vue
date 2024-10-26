<template>

<div class="Support">
<Sidebar :userid=this.idddd />

<div class="main-content">

    <div  class="Help-Form ">
        <h2>Get in touch</h2>
        <input class="name-in" type="text" placeholder="First Name"  />
        <input class ="name-in" type="text" placeholder="Last Name"/>
        <br>
        <input type="email" placeholder="Your Email">
        <br>
        <textarea type="text" placeholder="Your message..." id="message" />
        <br>
        <button >Send your request</button>
      </div>

</div>
</div>

</template>

<script>
import Sidebar from '@/components/Sidebar.vue';

export default {

    name : 'SupportPage',
    data(){
        return {
            idddd: '5YTJHAfiIDOSggPAygACSSn70T13',

        }
    }, 

    components: {
        Sidebar
    }

}

</script>

<style>

body {
    margin: 0; /* Remove default margin */
  }
  
  .Support {
    display: flex;
    margin: 0;

  }

  .sidebar {
  background-color: #202123; /* Just an example background color */
  overflow-y: auto; /* Scroll if content overflows */
}

.main-content {
    flex-grow: 1;
  padding: 20px; /* Optional padding */
  align-items: center;
}


.Help-Form {
    margin: 0 auto;
    margin-top: 8%;
    padding: 10px;
    background-color: #FFFFFF;
    width: 600px;
    height: 450px;
    border-radius: 5px;
}

.Help-Form input {
    width: 60%;
}

.Help-Form .name-in {
    width: 29%;
}

#message {
    width: 60%;
    height: 100px;
    resize: none;
}

.Help-Form button{
    margin-top: 3.5%;
    width: 40%;
    padding: 10px;
    align-items: center;
    background-color: #F5F5F5;
    color: #666666;
    border: none ;
    border-radius: 4px;
  }
</style>