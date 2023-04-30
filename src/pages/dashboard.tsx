import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth} from "../lib/firebaseConfig";
import {doc,getDocs,getDoc, where, query, arrayUnion, updateDoc, collection} from "firebase/firestore";
import {db} from  "../lib/firebaseConfig";
import { PassThrough } from 'stream';

export default function dashboard() {

    const [successBool,setSuccessBool] = useState<boolean>(false);
    const [alreadyThereBool,setAlreadyThereBool] = useState<boolean>(false);
    const router = useRouter();
    const [userLatitude, setUserLatitude] = useState<number>();
    const [userLongitude, setUserLongitude] = useState<number>();
    const [searchItem, setSearchItem] = useState('');
    const [visitedResorts, setVisitedResorts] = useState<string[]>([]);
    const [notInRangeBool, setNotInRangeBool] = useState<boolean>(false);
    
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


  function notInRangeMessage() {
    if (!notInRangeBool) {
      setNotInRangeBool(true);
    }
  }
  useEffect(() => {
    if (notInRangeBool === true){
      setTimeout(() => {
      setNotInRangeBool(false);
      }, 3000);
    }
  }, [notInRangeBool]);



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
        return;
      }
      getAllEntries();
    });
    return () => unsubscribe();
  }, []);

    async function addResort(place:string){
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
          router.push('/');
        }
      });
      return unsubscribe;
    }, []);

    function logout(){
        auth.signOut();
    }
    function gotoresortpage(place:string){
        router.push('/resorts/'+place);
    }


    
    async function addResortChecked(value:string){
      const resortsref = collection(db, "resorts");
      const q = query(resortsref, where("resort_name", "==", value));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
      if (Math.abs(Number(userLatitude) - doc.data().lat) < 1){
        if (Math.abs(Number(userLongitude) - doc.data().lon) < 1){
          addResort(value); 
        }  
      } else {
        notInRangeMessage();
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
        <header><button className={'logoutbutton button'} onClick={logout}>Log Out</button></header>
        <input type="text" value={searchItem} placeholder='Resort Name' onChange={e => setSearchItem(e.target.value)}></input>
        <button className='button submitbutton' onClick={e=>addResortChecked(searchItem)}>Add</button>
        {visitedResorts?.map((resort,index) => (
        <div className='resortDiv' onClick={e=>gotoresortpage(resort)} key={index}><h2>{resort}</h2></div>))}
        {successBool && <div className='successMessage'><p>Success</p></div>}
        {alreadyThereBool && <div className='softErrorMessage'><p>Already visited</p></div>}
        {notInRangeBool && <div className='softErrorMessage'><p>Not in range</p></div>}
      </div>
    )
  }