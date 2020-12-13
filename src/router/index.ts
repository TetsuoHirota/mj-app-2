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
      store.dispatch('loading/changeIsLoading', true);
      store.dispatch('user/login')
        .then(() => {
          next();
          store.dispatch('loading/changeIsLoading', false);
        })
        .catch(() => {
          next({ name: 'login' })
          store.dispatch('loading/changeIsLoading', false);
        })
    } else {
      next()
    }
  } else {
    next() // next() を常に呼び出すようにしてください!
  }
})

export default router;
