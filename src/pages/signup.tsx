import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../lib/firebaseConfig";
import { collection, setDoc , doc, getDocs} from "firebase/firestore"; 
import {db} from '../lib/firebaseConfig';


export default function signUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errBool, setErrBool] = useState<boolean>(false);
    const [errmsg, seterrmsg] =useState<string>('err');
    const router = useRouter();


    
    useEffect(() => {
      if (errBool === true){
        setTimeout(() => {
        setErrBool(false);
        }, 3000);
      }
    }, [errBool]);


    async function signUp() {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async ({user}) => {
          signInWithEmailAndPassword(auth, email, password);
          const docRef = await setDoc(doc(db, "userInfo",user.uid), {
            resorts: []
          });
        })
        .catch(error => {
          const errorTitle = error.code.replace("auth/", "");
          if (errorTitle == 'email-already-in-use'){
            senderrmsg('This email is already associated with an account');
          } else if (errorTitle == 'weak-password'){
            senderrmsg('Password is too weak');
          }else if (errorTitle == 'invalid-email'){
            senderrmsg('This email is invalid');
          } else {
            senderrmsg('An error occured, see console log for more info: '+errorTitle as string);
            console.error(error);
          }
        });
    }
    function senderrmsg(errstring:string){
      seterrmsg(errstring);
      setErrBool(true);
    }
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          router.push('/dashboard');
        }
      });
      return unsubscribe;
    }, []);



    return (
      <>
      <header className="dashHeader"><button onClick={e=>router.push('/')} className="homebutton">Home</button><button className='loginbutton' onClick={e=>router.push('/login')}>Log in</button></header>
      
      <div className="container">
        <div className="login">
          <div>Signup</div>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"/>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"/>
          <div className="login-controls">
            <button id="fullbutton" className="secondary" onClick={signUp}>Create Account</button>
          </div>
        </div>
      </div>
      {errBool && <div className="Alert softerrormessage"><p>{errmsg}</p></div>}</>
    )
  }