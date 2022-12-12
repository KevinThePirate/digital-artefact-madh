import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXyoqd-7i07q4D4jDznPkcYGjboAhKYXc",
  authDomain: "digital-artifact-d878d.firebaseapp.com",
  projectId: "digital-artifact-d878d",
  storageBucket: "digital-artifact-d878d.appspot.com",
  messagingSenderId: "929459644742",
  appId: "1:929459644742:web:08bb23e8cd7ea9a43ddd47",
  measurementId: "G-0LTQS6QJKW",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const authentication = getAuth(app);
export { db, authentication };
