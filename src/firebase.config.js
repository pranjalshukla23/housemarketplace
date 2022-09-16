// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyAcQhQMWZ8hlgugrP8kP5j-F8yCcV2EvCM",
  authDomain: "house-marketplace-app-47032.firebaseapp.com",
  projectId: "house-marketplace-app-47032",
  storageBucket: "house-marketplace-app-47032.appspot.com",
  messagingSenderId: "767734204175",
  appId: "1:767734204175:web:bd74ba00da8be5a00ba07a",
  measurementId: "G-YSJ6HTWN0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore()
