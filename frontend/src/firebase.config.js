// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAv-mxRXelSmdTlbiiLQEMAPO_YPTkO34c",
    authDomain: "cims-auth.firebaseapp.com",
    projectId: "cims-auth",
    storageBucket: "cims-auth.appspot.com",
    messagingSenderId: "333992809191",
    appId: "1:333992809191:web:0455927825551c35d94842",
    measurementId: "G-LHW0ME165D"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
