import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyAP9i2BRZsSieiXrb7N0O28QPTPLjLuXRA",
  authDomain: "toqsallll.firebaseapp.com",
  databaseURL: "https://toqsallll-default-rtdb.firebaseio.com",
  projectId: "toqsallll",
  storageBucket: "toqsallll.firebasestorage.app",
  messagingSenderId: "713233113931",
  appId: "1:713233113931:web:3b3c4b56cb49dba5497ece",
  measurementId: "G-5D0Z4S7N60"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
