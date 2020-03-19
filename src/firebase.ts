import * as firebase from "firebase/app"
import * as firebaseui from "firebaseui-ja"
import "firebase/auth"
import "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAtKaNsfOgd_zKHaQyWtLUBaLMgN8ReKSE",
  authDomain: "mj-app-2.firebaseapp.com",
  databaseURL: "https://mj-app-2.firebaseio.com",
  projectId: "mj-app-2",
  storageBucket: "mj-app-2.appspot.com",
  messagingSenderId: "821187412631",
  appId: "1:821187412631:web:7e96dcf71b80a2a05c9fd2",
  measurementId: "G-S6CKY20RF7"
}

const firebaseApp = firebase.initializeApp(firebaseConfig)

export const db = firebaseApp.firestore()
export const auth = firebaseApp.auth()
export const ui = new firebaseui.auth.AuthUI(firebase.auth())