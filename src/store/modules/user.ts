import { auth, db } from '@/firebase';
import { UserInfo } from '@/models/user';

const generateId = (len: number) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const name = []
  for (let i = 0; i < len; i++) {
    const num = Math.floor(chars.length * Math.random())
    name.push(chars[num])
  }
  return name.join('')
}

const state = () => ({
  isLoggedIn: false,
  uid: '',
  email: '',
  mid: '',
  name: ''
})

const mutations = {
  login: (state: any, userInfo: UserInfo) => {
    console.debug("commit login");
    console.debug(userInfo);
    state.isLoggedIn = true;
    state.uid = userInfo.uid;
    state.email = userInfo.email;
    state.mid = userInfo.email;
    state.name = userInfo.name;
    console.debug(state);
  }
}

const actions = {
  signUp: async ({ commit }: any, userInfo: UserInfo) => {
    console.debug("signup");
    const mids: string[] = [];
    await db.collection('users')
      .get()
      .then(querySnapShot => {
        querySnapShot.forEach(doc => {
          mids.push(doc.data().mid)
        })
      });
    console.debug(mids);
    let mid = generateId(8);
    while (mids.includes(mid)) {
      mid = generateId(8);
    }
    console.debug("generate mid: " + mid);
    await db.collection('users').doc(userInfo.uid).set({
      uid: userInfo.uid,
      email: userInfo.email,
      mid: mid,
      name: '名無し'
    } as UserInfo)
    console.debug("sinup finished");
    return;
  },

  login: async ({commit}: any) => {
    console.debug("login!");
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged(user => {
        if (user) {
          console.debug("user exists");
          console.debug(user);
          db.collection('users').doc(user.uid)
            .get()
            .then(doc => {
              if (doc.exists) {
                const data: any = doc.data()
                commit('login', {
                  uid: data.uid,
                  email: data.email,
                  mid: data.mid,
                  name: data.name
                } as UserInfo)
                console.debug("commit");
                resolve();
              } else {
                console.debug("doc doesnt exist");
                reject();
              }
            })
        } else {
          console.debug("user doesnt exist");
          reject();
        }
      })
    })
  }
}

const getters = {
  isLoggedIn: (state: any) => {
    return state.isLoggedIn;
  },
  user: (state: any) => {
    return state
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
