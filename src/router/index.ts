import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth, db } from '@/firebase'
import store from '../store'

import Home from '../views/Home.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'
import HomeNav from '@/views/HomeNav.vue'
import Friends from '@/views/Friends.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '/',
        name: 'Home',
        component: HomeNav
      },
      {
        path: '/friends',
        name: 'Friends',
        component: Friends
      }
    ]
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
    }
  })
})


export default router
