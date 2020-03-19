// import * as firebase from 'firebase/app';
import { auth } from '@/firebase'

const state = {
  isLogin: false,
  uid: "",
  mid: "",
  email: "",
  name: "",
}

const mutations = {
  login: (state: any) => {
    state.isLogin = true
  },
  
  logout: (state: any) => {
    state.isLogin = false
    state.uid = ""
    state.mid = ""
    state.email = ""
    state.name = ""
  },
  
  changeProfile: (state: any, user: any) => {
    state.uid = user.uid
    state.mid = user.mid
    state.email = user.email
    state.name = user.name
  },


  // removeUser: (state: any) => {
  //   state.id = ""
  //   state.email = ""
  //   state.name = ""
  //   state.nameEng = ""
  //   state.nickName = ""
  // }
}

const actions = {
  login: ({commit}: any, user: any) => {
    commit("login")
    commit("changeProfile", user)
  },

  logout: ({commit}: any) => {
    commit("logout")
    auth.signOut()
  },

  changeProfile: ({commit}: any, user: any) => {
    commit("changeProfile", user)
  }

  // login: ({commit}: any, user: any ) => {
  //   return new Promise((resolve, reject) => {
  //     auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  //         .then(() => {
  //           return auth.loginWithEmailAndPassword(user.email, user.password).then(
  //             user => {
  //               db.collection("users").doc(user.user!.uid).get().then(doc => {
  //                 let profile = doc.data();
  //                 profile!.id = user.user!.uid;
  //                 commit('setUser', profile);
  //               });
  //               resolve("");
  //             },
  //             err => {
  //               let msg = "";
  //               switch (err.code) {
  //                 case "auth/invalid-email":
  //                   msg = "メールアドレスが有効ではありません"
  //                   break;
  //                 case "auth/user-not-found":
  //                   msg = "ユーザーが見つかりません"
  //                   break;
  //                 case "auth/wrong-password":
  //                   msg = "パスワードが間違っています"
  //                   break;
  //                 default:
  //                   msg = err.message;
  //               }
  //               reject(msg);
  //             }
  //           )
  //         })
  //         .catch((error) => {
  //           alert(error.message);
  //           reject()
  //         });
  //   })
  // },

  // signOut: ({commit}: any) => {
  //   return new Promise((resolve, reject) => {
  //     auth.signOut().then(() => {
  //       commit('removeUser')
  //       resolve();
  //     })
  //   })
  // }
}

const getters = {
  user: (state: any) => {
    return state
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}