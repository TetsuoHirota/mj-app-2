import { auth, db } from "@/firebase";
import { UserInfo } from "@/models";

const generateId = () => {
  const chars = "abcdefghijkmnopqrstuvwxyz0123456789";
  const name = [];
  for (let i = 0; i < 6; i++) {
    const num = Math.floor(chars.length * Math.random());
    name.push(chars[num]);
  }
  return name.join("");
};

interface State extends UserInfo {
  isLoggedIn: boolean;
}

const state = (): State => ({
  isLoggedIn: false,
  uid: "",
  email: "",
  mid: "",
  name: "",
  scoreBoardIds: [],
  friendIds: []
});

const mutations = {
  changeUserInfo: (state: State, userInfo: UserInfo) => {
    state.uid = userInfo.uid;
    state.email = userInfo.email;
    state.mid = userInfo.mid;
    state.name = userInfo.name;
    state.scoreBoardIds = userInfo.scoreBoardIds;
    state.friendIds = userInfo.friendIds;
  },

  login: (state: State, userInfo: UserInfo) => {
    state.isLoggedIn = true;
    state.uid = userInfo.uid;
    state.email = userInfo.email;
    state.mid = userInfo.mid;
    state.name = userInfo.name;
    state.scoreBoardIds = userInfo.scoreBoardIds;
    state.friendIds = userInfo.friendIds;
  },

  logout: (state: State) => {
    console.log("logout");
    state.isLoggedIn = false;
  }
};

const actions = {
  get: ({ commit }: any) => {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged(user => {
        if (!user) {
          reject("ユーザーがいません");
          return;
        }
        db.collection("users")
          .doc(user.uid)
          .get()
          .then(doc => {
            if (doc.exists) {
              const data = doc.data();
              if (!data) {
                reject("error");
                return;
              }
              commit("changeUserInfo", {
                uid: data.uid,
                email: data.email,
                mid: data.mid,
                name: data.name,
                scoreBoardIds: data.scoreBoardIds,
                friendIds: data.friendIds
              } as UserInfo);
              resolve("");
            } else {
              reject("データベースにユーザーが存在していません");
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    });
  },
  signUp: async ({ commit }: any, userInfo: UserInfo) => {
    const mids: string[] = [];
    await db
      .collection("users")
      .get()
      .then(querySnapShot => {
        querySnapShot.forEach(doc => {
          mids.push(doc.data().mid);
        });
      });
    let mid = generateId();
    while (mids.includes(mid)) {
      mid = generateId();
    }
    await db
      .collection("users")
      .doc(userInfo.uid)
      .set({
        uid: userInfo.uid,
        email: userInfo.email,
        mid: mid,
        name: "名無し",
        scoreBoardIds: []
      } as UserInfo);
    return;
  },

  login: ({ commit }: any) => {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged(user => {
        if (user) {
          db.collection("users")
            .doc(user.uid)
            .get()
            .then(doc => {
              if (doc.exists) {
                const data: any = doc.data();
                commit("login", {
                  uid: data.uid,
                  email: data.email,
                  mid: data.mid,
                  name: data.name,
                  scoreBoardIds: data.scoreBoardIds,
                  friendIds: data.friendIds
                } as UserInfo);
                resolve("");
              } else {
                commit("logout");
                reject("データベースにユーザーが存在していません");
              }
            })
            .catch(err => {
              commit("logout");
              reject(err);
            });
        } else {
          commit("logout");
          reject("ログインしていません");
        }
      });
    });
  },

  logout: ({ commit }: any) => {
    commit("logout");
    return auth.signOut();
  }
};

const getters = {
  isLoggedIn: (state: State) => {
    return state.isLoggedIn;
  },
  user: (state: State) => {
    const user: UserInfo = {
      uid: state.uid,
      mid: state.mid,
      email: state.email,
      name: state.name,
      scoreBoardIds: state.scoreBoardIds,
      friendIds: state.friendIds
    };
    return user;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
