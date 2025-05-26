// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBI08hKiXJFT8oMCqXlXUMh0BAP69hJjiQ",
  authDomain: "thinkflix-e6fcb.firebaseapp.com",
  projectId: "thinkflix-e6fcb",
  storageBucket: "thinkflix-e6fcb.firebasestorage.app",
  messagingSenderId: "269369054232",
  appId: "1:269369054232:web:bfa892b39dedfea1d59f6d",
  measurementId: "G-EL1PP75KCN",
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);

