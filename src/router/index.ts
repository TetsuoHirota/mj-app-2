import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth, db } from '@/firebase'
import store from '../store'

import Home from '../views/Home.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.afterEach(() => {
  auth.onAuthStateChanged(user => {
    if (user) {
      // dbからユーザー情報を取得
      db.collection("users").doc(user.uid).get().then(doc => {
        if (doc.exists) {
          store.dispatch("User/login", doc.data())
          if (!store.getters["User/user"].mid) {
            router.push({ path: '/profile'}, () => {})
          } 
        }
      })
    } else {
      store.dispatch("User/logout")
    }
  })
})


export default router
