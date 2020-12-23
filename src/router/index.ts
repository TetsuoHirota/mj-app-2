import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

import Home from '../views/Home.vue';

const Login = () => import('../views/Login.vue');

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isLoggedIn = store.getters["user/isLoggedIn"];
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    if (!isLoggedIn) {
      store.dispatch('app/isLoading', true);
      store.dispatch('user/login')
        .then(() => {
          next();
          store.dispatch('app/isLoading', false);
        })
        .catch(err => {
          store.dispatch('app/error', err);
          next({ name: 'login' })
          store.dispatch('app/isLoading', false);
        })
    } else {
      next()
    }
  } else {
    next() // next() を常に呼び出すようにしてください!
  }
})

export default router;
