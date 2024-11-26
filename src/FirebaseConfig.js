import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyCPrgikK1S2QagHvVeUmCI2BITpS4jcQZQ",

  authDomain: "act-app-fb78b.firebaseapp.com",

  projectId: "act-app-fb78b",

  storageBucket: "act-app-fb78b.firebasestorage.app",

  messagingSenderId: "498602383742",

  appId: "1:498602383742:web:77cf5ec41f04a29788bb2f",

  measurementId: "G-711MT8MFFD"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export{auth, db};


