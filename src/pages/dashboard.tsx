import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth} from "../lib/firebaseConfig";
import {doc,getDocs,getDoc, where, query, arrayUnion, updateDoc, collection} from "firebase/firestore";
import {db} from  "../lib/firebaseConfig";

export default function dashboard() {

    const [successBool,setSuccessBool] = useState<boolean>(false);
    const [alreadyThereBool,setAlreadyThereBool] = useState<boolean>(false);
    const router = useRouter();
    const [userLatitude, setUserLatitude] = useState<Number>();
    const [userLongitude, setUserLongitude] = useState<Number>();
    const [searchItem, setSearchItem] = useState('');
    const [visitedResorts, setVisitedResorts] = useState<String[]>([]);
    
    
    useEffect(()=>{
      navigator.geolocation.getCurrentPosition((position) => { 
          setUserLatitude(position.coords.latitude);
          setUserLongitude(position.coords.longitude);
      });
  },[])


  function alreadyThereMessage() {
    if (!alreadyThereBool) {
      setAlreadyThereBool(true);
    }
  }
  useEffect(() => {
    if (alreadyThereBool === true){
      setTimeout(() => {
      setAlreadyThereBool(false);
      }, 3000);
    }
  }, [alreadyThereBool]);




  function successMessage() {
    if (!successBool) {
      setSuccessBool(true);
    }
  }
  useEffect(() => {
    if (successBool === true){
      setTimeout(() => {
      setSuccessBool(false);
      }, 3000);
    }
  }, [successBool]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // User is not authenticated, skip running the code that relies on authentication
        return;
      }
      getAllEntries();
    });

    // Return a cleanup function to unsubscribe when the component unmounts
    return () => unsubscribe();
  }, []);

    async function addResort(place:String){
      if (!visitedResorts.includes(place) && auth.currentUser){
        setVisitedResorts([place, ...visitedResorts]);
        const userInformation = doc(db, "userInfo", auth.currentUser.uid );
        await updateDoc(userInformation, {
          resorts: arrayUnion(place)
      });
        successMessage();
    } else {
      alreadyThereMessage();
    }
      
    }

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user) {
          router.push('/signup');
        }
      });
      return unsubscribe;
    }, []);

    function logout(){
        auth.signOut();
        router.push('/login');

    }

    async function addResortChecked(value:String){
      const resortsref = collection(db, "resorts");
      const q = query(resortsref, where("resort_name", "==", value));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
      if (Math.abs(Number(userLatitude) - doc.data().lat) < 1111){
        if (Math.abs(Number(userLongitude) - doc.data().lon) < 1111){
          addResort(value); 
        }  
      }

    });

    }

    async function getAllEntries() {
      if (auth.currentUser) {const docRef = doc(db, "userInfo", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      const visitedData: string[] = docSnap.data()?.resorts ?? [];
      setVisitedResorts(visitedData);}
    }

    return (
      <div>
        <button onClick={logout}>Log Out</button>
        <input type="text" value={searchItem} onChange={e => setSearchItem(e.target.value)}></input>
        <button onClick={e=>addResortChecked(searchItem)}>Add</button>
        {visitedResorts?.map((resort,index) => (
        <h1 key={index}>{resort}</h1>))}
        {successBool && <p>Added to visited list</p>}
        {alreadyThereBool && <p>Already visited</p>}
      </div>
    )
  }