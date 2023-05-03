// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

// import { GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkpYzSLG5iClKieLhmv2H18_PUgvKLaQw",
  authDomain: "nyt1-815c4.firebaseapp.com",
  projectId: "nyt1-815c4",
  storageBucket: "nyt1-815c4.appspot.com",
  messagingSenderId: "334363334418",
  appId: "1:334363334418:web:b1469b377c0edfc29105cb",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
