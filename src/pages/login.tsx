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
          router.push('/dashboard');
        }
      });
      return unsubscribe;
    }, []);
    

    function logIn() {
      signInWithEmailAndPassword(auth, email, password)
        .then(({user}) => {
          router.push('/dashboard');
        })
        
    }

  
    return (
      <>
      <header className="dashHeader"><button onClick={e=>router.push('/')} className="homebutton">Home</button><button className='secondary' onClick={e=>router.push('/signup')}>Sign up</button></header>
      
      <div className="container">
        <div className="login">
          <div>Login</div>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"/>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"/>
          <div className="login-controls">
            <button id="fullbutton" className="loginbutton button" onClick={logIn}>Log in</button>
          </div>
        </div>
      </div></>
    )
  }