import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../lib/firebaseConfig";
import { collection, setDoc , doc, getDocs} from "firebase/firestore"; 
import {db} from '../lib/firebaseConfig';

export default function signUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    async function signUp() {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async ({user}) => {
          signInWithEmailAndPassword(auth, email, password);
          const docRef = await setDoc(doc(db, "userInfo",user.uid), {
            resorts: []
          });
        })
    }

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          // User is signed in, redirect to index page
          router.push('/');
        }
      });
    
      // Return a cleanup function to unsubscribe from the listener
      return unsubscribe;
    }, []);



    return (
      <div className="container">
        <div className="login">
          <div>Signup</div>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"/>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"/>
          <div className="login-controls">
            <button className="secondary" onClick={signUp}>Create Account</button>
          </div>
        </div>
      </div>
    )
  }