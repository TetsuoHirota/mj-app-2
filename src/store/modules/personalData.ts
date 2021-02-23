import { db } from "@/firebase";

let unsubscribe: any = null;

const state = {
  scoreBoards: []
};

const mutations = {
  changeScoreBoards: (state: any, scoreBoards: any) => {
    state.scoreBoards = scoreBoards;
  }
};

const actions = {
  startListener: ({ commit, rootGetters }: any) => {
    const me = rootGetters["User/user"];
    const scoreBoards: any = [];
    unsubscribe = db
      .collection("users")
      .doc(me.uid)
      .onSnapshot(async (doc: any) => {
        await Promise.all(
          doc.data().scoreBoards.map(async (id: string) => {
            return await db.collection("scores").doc(id).get();
          })
        ).then(values => {
          values.forEach((value: any) => {
            if (value.data() && Object.keys(value.data().scores).length !== 0)
              scoreBoards.push(value.data());
          });
          commit("changeScoreBoards", scoreBoards);
        });
      });
  },

  stopListener: () => {
    unsubscribe();
  }
};

const getters = {
  scoreBoards: (state: any) => {
    return state.scoreBoards;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
