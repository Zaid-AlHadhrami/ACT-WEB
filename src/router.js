import ListPage from "./views/crypto-list.vue"
import LoginPage from "./views/LoginPage.vue";
import SignupPage from "./views/SignupPage.vue";
import HomePage from "./views/HomePage.vue";
import SupportPage from "./views/SupportPage.vue";
import { createWebHistory, createRouter } from "vue-router";
import {auth} from './FirebaseConfig';
import ClientPage from "./views/ClientPage.vue";
import DashBoard from "./views/DashBoard.vue";
import LandingPage from "./views/LandingPage.vue";
import { useUserStore } from "./stores/userStore";
import NotificationsPage from "./views/notificationsPage.vue";


const router = createRouter ({

    
    history: createWebHistory(),

    routes: [

        {path: '/dashboard',
            component: DashBoard,
            name:'Dashboard'
        },
        {path: '/',
            component: LandingPage,
            name: 'Landing Page'
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
        },
        {path: '/notifications',
            component: NotificationsPage
        },


        
    ]
    });



   router.beforeEach((to, from, next) => {
        const currentUser =  auth.currentUser;
        const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

        const userStore = useUserStore();

        if (currentUser && !userStore.user) {
            // If Firebase has a user but Pinia doesn't, update Pinia
            userStore.setUser(currentUser);
        }

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