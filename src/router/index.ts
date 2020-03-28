import Vue from 'vue'
import VueRouter from 'vue-router'
// import { auth, db } from '@/firebase'
// import store from '../store'

import Home from '../views/Home.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'
import HomeNav from '@/views/HomeNav.vue'
import Friends from '@/views/Friends.vue'
import ScoreBoard from '@/views/ScoreBoard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/index.html',
    redirect: '/'
  },
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
  },
  {
    path: '/scoreboard',
    name: 'ScoreBoard',
    component: ScoreBoard
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})

// router.beforeEach((to, from, next) => {
//   let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
//   if (requiresAuth) {
//     auth.onAuthStateChanged(user => {
//       if (user) {
//         // dbからユーザー情報を取得
//         db.collection("users").doc(user.uid).get().then(doc => {
//           if (doc.exists) {
//             store.dispatch("User/login", doc.data())
//             // store.dispatch("Friends/getFriends")     //フレンド取得
//             next()
//             if (!store.getters["User/user"].mid) {
//               // router.push({ path: '/profile'}, () => {})
//               next('/profile')
//             } 
//           }
//         })
//       }
//     })
//   }
// })


export default router
