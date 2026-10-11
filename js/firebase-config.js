
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCBkiQ3jSVGm6jv954W9Py7HdRgXDRQLMc",
  authDomain: "flymateai.firebaseapp.com",
  projectId: "flymateai",
  storageBucket: "flymateai.firebasestorage.app",
  messagingSenderId: "497034441745",
  appId: "1:497034441745:web:e3741693ad9f0b63de6db0"
};

/* Initialize Firebase */

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

/* Make Firebase available to other JavaScript files */

window.aeroFirebase = {
  app,
  auth,
  db
};

window.aeroAuth = {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile
};

console.log("AeroEase Firebase initialized!");
