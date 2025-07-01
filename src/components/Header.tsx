import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { auth } from '../lib/firebaseConfig';

export default function Header() {
  const router = useRouter();
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  const logout = () => {
    auth.signOut();
    router.push('/login');
  };

  // Determine which buttons to show based on route
  const renderRightButtons = () => {
    const path = router.pathname;

    if (userLoggedIn) {
      if (path.startsWith('/resorts')) {
        return (
          <>
            <p className="resortname">{router.query.id}</p>
            <button className="logoutbutton button" onClick={logout}>
              Log Out
            </button>
          </>
        );
      }
      return (
        <>
          <button className="logoutbutton button" onClick={logout}>
            Log Out
          </button>
        </>
      );
    }

    // Not logged in
    if (path === '/'){
      <button onClick={() => router.push('/dashboard')} className="homebutton">
      Dashboard
    </button>}

    if (path === '/signup') {
      return (
        <button className="loginbutton" onClick={() => router.push('/login')}>
          Log in
        </button>
      );
    }
    return (
      <>
        <button className="secondary button" onClick={() => router.push('/signup')}>
          Sign Up
        </button>
        <button className="loginbutton button" onClick={() => router.push('/login')}>
          Log In
        </button>
      </>
    );
  };

  const renderLeftButton = () => {
    if (router.pathname === '/' && userLoggedIn) {
      return (
        <button className="homebutton" onClick={() => router.push('/dashboard')}>
          Dashboard
        </button>
      );
    }

    if (router.pathname.startsWith('/resorts')) {
      return (
        <button onClick={() => router.push('/dashboard')} className="homebutton">
          Dashboard
        </button>
      );
    }
    return (
      <button onClick={() => router.push('/')} className="homebutton">
        Home
      </button>
    );
  };

  return (
    <header className="dashHeader">
      {renderLeftButton()}
      <div className="header-content">{renderRightButtons()}</div>
    </header>
  );
}