import { createApp } from 'vue'
import { createPinia } from 'pinia'  // Import Pinia
import App from './App.vue'
import router from './router'
import { auth } from './FirebaseConfig'

let app = '';

auth.onAuthStateChanged(() => {
    if (!app) {
        const pinia = createPinia()  // Create Pinia instance
        app = createApp(App)
        .use(pinia)  // Use Pinia

            .use(router)
            .mount('#app');
    }
});
