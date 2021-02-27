import { db } from "@/firebase";
import { UserInfo } from "@/models/user";
import firebase from "firebase/app";

interface State {
  friends: UserInfo[];
}

const state = (): State => ({
  friends: []
});

const mutations = {
  changeFriends: (state: State, users: UserInfo[]) => {
    state.friends = users;
  }
};

const actions = {
  getFriends: ({ commit, rootGetters }: any) => {
    return new Promise((resolve, reject) => {
      const me: UserInfo = rootGetters["user/user"];
      const friendIds = me.friendIds || [];
      const friends: UserInfo[] = [];
      Promise.all(
        friendIds.map(id => {
          return db.collection("users").doc(id).get();
        })
      )
        .then(values => {
          values.forEach(v => {
            const d = v.data();
            if (!d) {
              return;
            }
            friends.push({
              email: d.email,
              friendIds: d.friendIds,
              mid: d.mid,
              name: d.name,
              scoreBoardIds: d.scoreBoardIds,
              uid: d.uid
            });
          });
          resolve(friends);
          commit("changeFriends", friends);
        })
        .catch(error => reject(error));
    });
  },

  addFriend: ({ dispatch, rootGetters }: any, user: any) => {
    const me = rootGetters["User/user"];
    db.collection("users").doc(me.uid).collection("friends").doc(user.uid).set({
      uid: user.uid,
      mid: user.mid
    });
    db.collection("users").doc(user.uid).collection("friends").doc(me.uid).set({
      uid: me.uid,
      mid: me.mid
    });
    dispatch("getFriends");
  },

  deleteFriend: ({ dispatch, rootGetters }: any, uid: string) => {
    return new Promise((resolve, reject) => {
      const me = rootGetters["user/user"];
      Promise.all([
        db
          .collection("users")
          .doc(me.uid)
          .update({
            friendIds: firebase.firestore.FieldValue.arrayRemove(uid)
          }),
        db
          .collection("users")
          .doc(uid)
          .update({
            friendIds: firebase.firestore.FieldValue.arrayRemove(me.uid)
          })
      ])
        .then(() => {
          dispatch("getFriends");
          resolve("");
        })
        .catch(err => reject(err));
    });
  },

  search: async ({ rootGetters }: any, mid: string) => {
    const me = rootGetters["user/user"];
    return db
      .collection("users")
      .where("mid", "==", mid)
      .get()
      .then(querySnapshot => {
        const results: UserInfo[] = [];
        querySnapshot.forEach(doc => {
          const d = doc.data();
          if (!d) {
            return;
          }
          if (d.uid === me.uid) {
            return;
          }
          results.push({
            email: d.email,
            friendIds: d.friendIds,
            mid: d.mid,
            name: d.name,
            scoreBoardIds: d.scoreBoardIds,
            uid: d.uid
          });
        });
        if (results.length > 1) {
          throw new Error("mid重複");
        }
        return results.length === 1 ? results[0] : null;
      })
      .catch(err => {
        throw new Error(err);
      });
  }
};

const getters = {
  friends: (state: State) => {
    return state.friends;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
