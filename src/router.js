import LoginPage from "./views/LoginPage.vue";
import SignupPage from "./views/SignupPage.vue";
import HomePage from "./views/HomePage.vue";
import { createWebHistory, createRouter } from "vue-router"
import {auth} from './FirebaseConfig'


const router = createRouter ({

    
    history: createWebHistory(),

    routes: [


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
            component: HomePage,
            meta:{
                requiresAuth: true
        }
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
             next('/home');}
        else {
            next();}
      });
      

export default router;