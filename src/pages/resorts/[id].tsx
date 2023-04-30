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
          if (user) {
            // User is authenticated, get a list of all files in their "images/{their user id}/" folder
            const imagesRef = ref(storage, `images/${user.uid}`);
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
      }, []);

    const handleUpload = () => {
      if (file && auth.currentUser) {
        const storageRef = ref(storage, 'images/'+auth.currentUser.uid+ `/${file.name}`);
        uploadBytes(storageRef, file).then(() => {
          console.log("File uploaded successfully!");
          successMessage();
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
      
    return (
      <>
        <p>{id}</p>
        <input type="file" onChange={handleChange} />
        <button onClick={handleUpload}>Upload</button>
        {successBool && <p>Added to visited list</p>}
        <div>
      {imageUrls.map((imageUrl, index) => (
        <Image onClick={e=>{deleteImage(paths[index])}} key={index} src={imageUrl} alt={`Image ${index}`} width={400} height={400}/>
      ))}
    </div>
      </>
    );
  }
