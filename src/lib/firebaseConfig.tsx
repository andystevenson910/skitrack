// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import {getAuth} from "firebase/auth";

import {getFirestore} from "firebase/firestore";

import { getStorage } from "firebase/storage";

 
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyAZh5_uoI6kjneZa0AkQmI_amei_9o0KoY",

  authDomain: "skitrack-fa8e8.firebaseapp.com",

  projectId: "skitrack-fa8e8",

  storageBucket: "skitrack-fa8e8.appspot.com",

  messagingSenderId: "793416471456",

  appId: "1:793416471456:web:b42aabf8d44c774aba4ac5",

  measurementId: "G-4PZ33NNZ1C"


};


// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const auth  = getAuth(app);
export const db = getFirestore(app);

// Initialize Firebase



// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
