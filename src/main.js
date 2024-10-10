import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {auth} from './FirebaseConfig'



let app = '';

auth.onAuthStateChanged(() => {
    if (!app) {
        app = createApp(App).use(router).mount('#app');
    }
  });

// createApp(App).use(router).mount('#app')