import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDy37MiO50C5JPAvX_zio3UWosQx2TESzI",
    authDomain: "act-web-2f515.firebaseapp.com",
    projectId: "act-web-2f515",
    storageBucket: "act-web-2f515.appspot.com",
    messagingSenderId: "954688377674",
    appId: "1:954688377674:web:3a06ec79460f0a2e1427b3",
    measurementId: "G-4DGGNWSDZZ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export{auth, db};


