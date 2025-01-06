// stores/userStore.js
import { defineStore } from 'pinia'
import { db } from '../FirebaseConfig'
import { doc, getDoc, getDocs, collection } from 'firebase/firestore'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null, // Firebase user object
    userType: null, // 'admin', 'manager', or 'client'
    userData: null, // Additional user data from Firestore,
    userDocRef : null, 
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.userType === 'admin',
    isManager: (state) => state.userType === 'manager',
    isClient: (state) => state.userType === 'client',
  },

  actions: {
    async setUser(user) {
      this.user = user
      if (user) {
        await this.fetchUserType()
        await this.fetchUserData()
      } else {
console.log('no user')      }
    },

    async fetchUserType() {
        const types = ['admins', 'managers'];
      
        // Check if user is an admin or manager
        for (const type of types) {
          const docRef = doc(db, type, this.user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            this.userType = type.slice(0, -1); // Remove trailing "s"
            this.userDocRef = docRef; // Set userDocRef for later use
            return;
          }
        }
      
        // If not found in admins or managers, check as a client
        this.userType = 'client';
        const managersSnapshot = await getDocs(collection(db, 'managers'));
      
        // Log user ID for debugging
        console.log('Checking for client with UID:', this.user.uid);
      
        for (const managerDoc of managersSnapshot.docs) {
          const clientDocRef = doc(managerDoc.ref, 'clients', this.user.uid); // Reference to client's document
      
          console.log('Checking client document:', clientDocRef.path); // Log the path being checked
      
          const docSnap = await getDoc(clientDocRef);
          if (docSnap.exists()) {
            console.log('success : tick')
            this.userDocRef = clientDocRef; // Set userDocRef for later use
            return;
          }
          console.log('Client document does not exist:', clientDocRef.path); // Log non-existence
        }
      
      },

    async fetchUserData() {
      if (!this.user || !this.userType) return
      const docRef = this.userDocRef
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        this.userData = docSnap.data()
      }
    },

    clearUser() {
      this.user = null
      this.userType = null
      this.userData = null
      this.userDocRef = null
    }
  }
})
