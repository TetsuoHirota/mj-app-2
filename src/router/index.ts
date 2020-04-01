import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '@/firebase'
import store from '../store'

import Home from '../views/Home.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'
import Nav from '@/components/Home/Nav.vue'
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
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/',
        redirect: '/home'
      },
      {
        path: '/home',
        name: 'Home',
        component: Nav
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
    beforeEnter: (to: any, from: any, next: any) => {
      if ( store.getters["User/user"].isLogin) {
        next({ name: 'Home'})
      } else {
        next()
      }
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    beforeEnter: (to: any, from: any, next: any) => {
      const mid = store.getters["User/user"].mid
      if ( mid && mid === "") {
        next()
      } else {
        next({ name: 'Home'})
      }
    }
  },
  {
    path: '/scoreboard',
    name: 'ScoreBoard',
    component: ScoreBoard,
    meta: {
      requiresAuth: true
    },
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const user = store.getters["User/user"]

    //storeがログイン状態でないとき、ログイン処理をする
    if (user.isLogin) {

      // プロフィール未登録の場合、Profileに移動
      if (user.mid && user.mid === "") {
        next({
          path: '/profile',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    } else {
      auth.onAuthStateChanged(user => {
  
        //firebaseでログイン状態でないときはログインしない
        if (user) {
  
          // ゲストの場合ログインしない
          if (user.isAnonymous) {
            next()
          } else {
            store.dispatch('User/login', user).then(() => {
              next()
            })
          }
        } else {
          next()
        }
      })
    }
  } else {
    next()
  }
})

export default router
