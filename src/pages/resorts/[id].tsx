import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import {onAuthStateChanged} from 'firebase/auth'
import { ref, uploadBytes, getStorage, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import {auth, storage} from '../../lib/firebaseConfig';


export default function Upload() {
    const router = useRouter();
    const { id } = router.query;
    const [file, setFile] = useState<File | null>(null);
    const [paths, setFilePaths] = useState<string[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [successBool,setSuccessBool] = useState<boolean>(false);
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        setFile(event.target.files[0]);
      }
    };


    function deleteImage(path:string){
        const desertRef = ref(storage, path);

        // Delete the file
        deleteObject(desertRef).then(() => {
          // File deleted successfully
        }).catch((error) => {
          // Uh-oh, an error occurred!
        });
    }
    
    useEffect(() => {
        // Wait for the user to be authenticated
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user && auth.currentUser && id) {
            // User is authenticated, get a list of all files in their "images/{their user id}/" folder
            const imagesRef = ref(storage, "images/" + auth.currentUser.uid+ '/' +id)
            listAll(imagesRef).then((res) => {
              // Loop through each file and get its download URL and path
              const promises = res.items.map((item) => {
                return Promise.all([getDownloadURL(item), item.fullPath]);
              });
              Promise.all(promises).then((results) => {
                // Extract the download URLs and paths from the results
                const urls = results.map((result) => result[0]);
                const paths = results.map((result) => result[1]);
                // Set the state variables
                setImageUrls(urls);
                setFilePaths(paths);
              });
            });
          }
        });
    
        return unsubscribe;
      }, [id]);

      const handleUpload = () => {
        if (file && auth.currentUser) {
          const storageRef = ref(
            storage,
            "images/" + auth.currentUser.uid +'/'+ id +`/${file.name}`
          );
          const fileUrl = URL.createObjectURL(file);
          //setImageUrls((prevUrls) => [...prevUrls, fileUrl]); // Add the image to the list of URLs to display it on the page
          uploadBytes(storageRef, file).then(() => {
            successMessage();
            router.reload();
          });
        }
      };
      

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

      function logout(){
        auth.signOut();
        router.push('/login')
    }
    return (
      <>
      <header className="dashHeader"><button onClick={e=>router.push('/')} className="homebutton">Home</button> <p className="resortname">{id}</p><button className={'logoutbutton button'} onClick={logout}>Log Out</button></header>
        
        
        <div>
      {imageUrls.map((imageUrl, index) => (
        <div key={index} className="image-container">
          
          <Image
        
        className="imgDel"
        hidden={false}

        src={imageUrl}
        alt={`Image ${index}`}
        width={400}
        height={400}
        
      /> 
      <div onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        (e.currentTarget.parentNode as HTMLElement).setAttribute('hidden', 'true');
        deleteImage(paths[index]);
  
}}

        className="overlay"></div>
      </div>
    
    
      
              ))}

    </div>
    <div className="uploader">
    <input className="fileinput" type="file" onChange={handleChange} /> <button className="button submitbutton" onClick={handleUpload}>Upload</button>
       </div> {successBool && <div className="Alert successmessage"><p>Added to visited list</p></div>}
      </>
    );
  }
