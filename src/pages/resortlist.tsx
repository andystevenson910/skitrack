// import { db } from "../lib/firebaseConfig";
// import React, { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";

// type Resort = {
//     id: number;
//     resort_name: string;
//     state: string;
//     summit: number;
//     base: number;
//     vertical: number;
//     lifts: number;
//     runs: number;
//     acres: number;
//     green_percent: number;
//     green_acres: number;
//     blue_percent: number;
//     blue_acres: number;
//     black_percent: number;
//     black_acres: number;
//     lat: number;
//     lon: number;
//   }

// export default function ResortList() {
//     const [resorts, setResorts] = useState<Resort[]>([]);


//   useEffect(() => {
//     getAllEntries();
//   }, []);

//   async function getAllEntries() {
//     const querySnapshot = await getDocs(collection(db, "resorts"));
//     const resortsData:Resort[] =  querySnapshot.docs.map((doc) => ({
//       ...doc.data(),
//     }));
//     setResorts(resortsData);
//   }

//   return (
//     <div>
//       {resorts.map((resort) => (
//         <div><h1>{resort.resort_name}</h1></div>
//       ))}
//     </div>
//   );
// }

//<p key={resort.id}>{resort.lat}</p>
