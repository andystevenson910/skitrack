import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../lib/firebaseConfig";




export default function login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

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
    

    function logIn() {
      signInWithEmailAndPassword(auth, email, password)
        .then(({user}) => {
          console.log(user);
        })
        router.push('/');
    }

  
    return (
      <div className="container">
        <div className="login">
          <div>Login</div>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"/>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"/>
          <div className="login-controls">
            <button className="secondary" onClick={logIn}>Create Account</button>
          </div>
        </div>
      </div>
    )
  }