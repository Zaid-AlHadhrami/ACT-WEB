import LoginPage from "./views/LoginPage.vue";
import SignupPage from "./views/SignupPage.vue";
import HomePage from "./views/HomePage.vue";
import { createWebHistory, createRouter } from "vue-router"


const router = createRouter ({

    
    history: createWebHistory(),

    routes: [

          {
            path: "/",
            redirect: '/login',

          },

        {path: '/login',
            name: 'Login',
            component: LoginPage
    
        },
        {path:'/signUp',
            name: 'SignUp'
            , component : SignupPage
        },
        {path: '/home',
            name: 'Home',
            component: HomePage
        }
        
    ]
    });


export default router;