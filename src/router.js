import ListPage from "./views/crypto-list.vue"
import LoginPage from "./views/LoginPage.vue";
import SignupPage from "./views/SignupPage.vue";
import HomePage from "./views/HomePage.vue";
import SupportPage from "./views/SupportPage.vue";
import { createWebHistory, createRouter } from "vue-router";
import {auth} from './FirebaseConfig';
import ClientPage from "./views/ClientPage.vue";


const router = createRouter ({

    
    history: createWebHistory(),

    routes: [

        {path: '/',
            redirect: '/login'
        },

        {path: '/login',
            name: 'Login',
            component: LoginPage
    
        },
        {path:'/signUp',
            name: 'SignUp'
            , component : SignupPage
        },
        {path: '/home/:id',
            name: 'Home',
            component: HomePage,
            meta:{
                requiresAuth: true
        }
        },
        {
            path:'/support',
            name: "Support",
            component:SupportPage,
        },

        {path: '/cryptoList/:id',
            name: 'list',
            component: ListPage

        }
        , 
        {path: '/client/:id',
            name: 'client',
            component: ClientPage
        }
        
    ]
    });



   router.beforeEach((to, from, next) => {
        const currentUser =  auth.currentUser;
        const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

        if (requiresAuth && !currentUser) {
            if(to.path !== '/login') {
                next('/login');}
            else {
                next();
            }}
        else if (!requiresAuth && currentUser && to.path === '/login'){
             next(`/home/${currentUser.uid}`);}
        else {
            next();}
      });
      

export default router;