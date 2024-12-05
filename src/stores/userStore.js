// stores/userStore.js
import { defineStore } from 'pinia'
import { db } from '../FirebaseConfig'
import { doc, getDoc } from 'firebase/firestore'

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
      const types = ['admins', 'managers']
      for (const type of types) {
        const docRef = doc(db, type, this.user.uid)
        this.userDocRef = docRef ;
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          this.userType = type.slice(0, -1) // Remove the trailing "s" to get singular form
          return
        }
      }
      // Default to client if no document is found
      this.userType = 'client'
    },

    async fetchUserData() {
      if (!this.user || !this.userType) return
      const docRef = doc(db, `${this.userType}s`, this.user.uid)
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
