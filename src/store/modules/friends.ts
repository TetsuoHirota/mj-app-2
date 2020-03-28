import { db } from '@/firebase'

const state = {
  friends: []
}

const mutations = {
  changeFriends: (state: any, users: any) => {
    state.friends = users
  }
}

const actions = {
  addFriend: ({ dispatch, rootGetters }: any, user: any) => {
    const me = rootGetters["User/user"]
    db.collection("users").doc(me.uid).collection("friends").doc(user.uid).set({
      uid: user.uid,
      mid: user.mid,
    })
    db.collection("users").doc(user.uid).collection("friends").doc(me.uid).set({
      uid: me.uid,
      mid: me.mid,
    })
    dispatch("getFriends")
  },

  getFriends: ({ commit, rootGetters }: any) => {
    const me = rootGetters["User/user"]
    const users: any[] = [];
    async function getFriendIds() {
      return await db.collection("users").doc(me.uid).collection("friends").get()
    }
    async function getFriendData(querySnapShot: any) {
      return await Promise.all(querySnapShot.docs.map( async (doc: any) => {
        return await db.collection("users").doc(doc.data().uid).get()
      }))
    }
    getFriendIds().then( querySnapShot => {
      getFriendData(querySnapShot).then(data => {
        data.forEach((doc: any) =>{
          users.push(doc.data())
        })
        commit("changeFriends", users)
      })
    })
  }
}

const getters = {
  friends: (state: any) => {
    return state.friends;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}