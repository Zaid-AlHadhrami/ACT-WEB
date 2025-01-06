<template>
    <div class="dashboard">
        <Sidebar/> 
        <div class="main-content">

            <div v-if="manager" class="summary">
        <h2>Dashboard Summary</h2>
        <p><strong>Manager Name:</strong> {{ manager.name }}</p>
        <p><strong>Number of Clients:</strong> {{ clientCount }}</p>
      </div>

        </div>
  
    </div>
  </template>

<script>
import { doc, collection, getCountFromServer, onSnapshot } from "firebase/firestore";
import Sidebar from "@/components/Sidebar.vue";
import { db } from "../FirebaseConfig";

export default {
  data() {
    return {
      manager: null, // Input for manager ID
      clientCount: 0, // Number of clients fetched
    unsub : null, 
    };
  },
  components : {

    Sidebar
  },
  methods: {
    async fetchManagerData() {

        const manager =  doc(db, "managers", localStorage.getItem('userId'))  ;


        this.unsub = onSnapshot(manager, (doc) => {
    console.log("Current data: ", doc.data());
    this.manager = doc.data();
    console.log(this.manager.name)
});

        const coll = collection(manager, "clients");
const snapshot = await getCountFromServer(coll);

console.log(snapshot.data().count)
this.clientCount = snapshot.data().count;


    },
  },
  mounted(){
    this.fetchManagerData();
  }
};
</script>


<style>

body {
    margin: 0; 
  }
  
  .dashboard {
    display: flex;
    margin: 0;

  }

  .sidebar {
  background-color: #202123; 
  overflow-y: auto; /* Scroll if content overflows */
}

.main-content {
    flex-grow: 1;
  padding: 20px; 
  align-items: center;
}


</style>