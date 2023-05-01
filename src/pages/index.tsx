import { useRouter } from "next/router";



export default function index(){
  const router= useRouter();
    return (<>
      <header className="dashHeader"><button className="homebutton">Home</button> <div>
      <button className={'secondary button'} onClick={e=>router.push('/signup')}>Sign Up</button>
      <button className={'loginbutton button'} onClick={e=>router.push('/login')}>Log In</button></div></header>
      <br></br>
          <div>
            <h1>Welcome to Ski Resort Tracker</h1>
            <p>
              Ski Resort Tracker is an app that helps you keep track of all the ski resorts you've visited across America. With our easy-to-use interface and geolocation data, you'll never forget where you've been.
            </p>
            <h2>Features</h2>
            <ul>
              <li>Track your progress visiting ski resorts across America</li>
              <li>Verify your visits with geolocation data</li>
              <li>Save images from each place</li>
            </ul>
            <h2>How to Use</h2>
            <ol>
              <li>Sign up for an account</li>
              <li>Visit ski resorts across America</li>
              <li>Use our app to verify your visits and save images</li>
              <li>Track your progress</li>
            </ol>
            <h2>Get Started</h2>
            <p>
              Sign up today and start tracking your ski resort visits!
            </p>
          </div></>)  
}