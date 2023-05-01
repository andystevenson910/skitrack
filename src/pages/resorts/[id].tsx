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
    const [errBool, setErrBool] = useState<boolean>(false);
    const [errmsg, seterrmsg] =useState<string>('err');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        setFile(event.target.files[0]);
      }
    };
 useEffect(() => {
      if (errBool === true){
        setTimeout(() => {
        setErrBool(false);
        }, 3000);
      }
    }, [errBool]);
    function senderrmsg(errstring:string){
      seterrmsg(errstring);
      setErrBool(true);
    }
    function deleteImage(path:string){
        const desertRef = ref(storage, path);
        deleteObject(desertRef).then(() => {
        }).catch((error) => {
          senderrmsg("Deletion Failed, see console for details");
          console.error(error);
        });
    }
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user && auth.currentUser && id) {
            const imagesRef = ref(storage, "images/" + auth.currentUser.uid+ '/' +id)
            listAll(imagesRef).then((res) => {
              const promises = res.items.map((item) => {
                return Promise.all([getDownloadURL(item), item.fullPath]);
              });
              Promise.all(promises).then((results) => {
                const urls = results.map((result) => result[0]);
                const paths = results.map((result) => result[1]);
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
          uploadBytes(storageRef, file)
          .then(() => {
            successMessage();
            router.reload();
          })
          .catch(err=>{
            senderrmsg("Upload Failed, see console for details");
            console.error(err);
            const subElement = document.getElementById("sub");
            if (subElement) {
              subElement.innerHTML = "Failed";
            }
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
        <br></br>
        
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
    <br></br>
    <div className="uploader">
    <input className="fileinput" type="file" onChange={handleChange} /> <button id="sub" className="button submitbutton" onClick={e=>{handleUpload();e.currentTarget.innerHTML="Loading...";}}>Upload</button>
       </div> {successBool && <div className="Alert successmessage"><p>Added to visited list</p></div>}
       {errBool && <div className="Alert softerrormessage"><p>{errmsg}</p></div>}
      </>
    );
  }
