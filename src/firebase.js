import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCp3f-8y2DwZDH85kqkgaNAqDiOmFERFSc",
  authDomain: "codebenders-chat.firebaseapp.com",
  projectId: "codebenders-chat",
  storageBucket: "codebenders-chat.appspot.com",
  messagingSenderId: "647004566534",
  appId: "1:647004566534:web:251a5a0ae2811d019ebf87"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();