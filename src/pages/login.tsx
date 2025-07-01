import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../lib/firebaseConfig";
import Header from '../components/Header'



export default function login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [errmsg, seterrmsg] =useState<string>('err');
    const [errBool, setErrBool] = useState<boolean>(false);

    useEffect(() => {
      if (errBool === true){
        setTimeout(() => {
        setErrBool(false);
        }, 3000);
      }
    }, [errBool]);


    
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          router.push('/dashboard');
        }
      });
      return unsubscribe;
    }, []);

    function senderrmsg(errstring:string){
      seterrmsg(errstring);
      setErrBool(true);
    }

    function logIn() {
      signInWithEmailAndPassword(auth, email, password)
        .then(({user}) => {
          router.push('/dashboard');
        })
        .catch(error => {
          const errorTitle = error.code.replace("auth/", "");
          console.log(errorTitle);
          if (errorTitle == 'user-not-found'){
            senderrmsg('Account not found');
          } else if (errorTitle == 'wrong-password'){
            senderrmsg('Password is incorrect');
          } else if (errorTitle == 'missing-password'){
            senderrmsg('Missing password');
          }
          else if (errorTitle == 'invalid-email'){
            senderrmsg('This email is invalid');
          } else {
            senderrmsg('An error occured, see console log for more info: '+errorTitle as string);
            console.error(error);
          }
        });
        
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
      </div>{errBool && <div className="Alert softerrormessage"><p>{errmsg}</p></div>}
      <Header></Header>
      </>
    )
  }