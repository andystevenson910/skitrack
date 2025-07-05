"use client"


import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import { onAuthStateChanged } from "firebase/auth"
import { ref, uploadBytes, listAll, getDownloadURL, deleteObject } from "firebase/storage"
import { auth, storage } from "../../lib/firebaseConfig"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Input } from "../../components/ui/input"
import { Mountain, Trash2, ArrowLeft, Camera, LogOut } from "lucide-react"

export default function ResortUpload() {
  const router = useRouter()
  const { id } = router.query
  const [file, setFile] = useState<File | null>(null)
  const [paths, setFilePaths] = useState<string[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [successBool, setSuccessBool] = useState<boolean>(false)
  const [errBool, setErrBool] = useState<boolean>(false)
  const [errmsg, seterrmsg] = useState<string>("err")
  const [uploading, setUploading] = useState<boolean>(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
    }
  }

  useEffect(() => {
    if (errBool === true) {
      setTimeout(() => {
        setErrBool(false)
      }, 3000)
    }
  }, [errBool])

  function senderrmsg(errstring: string) {
    seterrmsg(errstring)
    setErrBool(true)
  }

  function deleteImage(path: string) {
    const desertRef = ref(storage, path)
    deleteObject(desertRef)
      .then(() => {
        // Remove from local state
        const index = paths.indexOf(path)
        if (index > -1) {
          const newPaths = [...paths]
          const newUrls = [...imageUrls]
          newPaths.splice(index, 1)
          newUrls.splice(index, 1)
          setFilePaths(newPaths)
          setImageUrls(newUrls)
        }
      })
      .catch((error) => {
        senderrmsg("Deletion Failed, see console for details")
        console.error(error)
      })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && auth.currentUser && id) {
        const imagesRef = ref(storage, "images/" + auth.currentUser.uid + "/" + id)
        listAll(imagesRef).then((res) => {
          const promises = res.items.map((item) => {
            return Promise.all([getDownloadURL(item), item.fullPath])
          })
          Promise.all(promises).then((results) => {
            const urls = results.map((result) => result[0])
            const paths = results.map((result) => result[1])
            setImageUrls(urls)
            setFilePaths(paths)
          })
        })
      }
    })

    return unsubscribe
  }, [id])

  const handleUpload = () => {
    if (file && auth.currentUser) {
      setUploading(true)
      const storageRef = ref(storage, "images/" + auth.currentUser.uid + "/" + id + `/${file.name}`)
      uploadBytes(storageRef, file)
        .then(() => {
          successMessage()
          setFile(null)
          // Reset file input
          const fileInput = document.getElementById("file-input") as HTMLInputElement
          if (fileInput) fileInput.value = ""
          // Refresh the images
          router.reload()
        })
        .catch((err) => {
          senderrmsg("Upload Failed, see console for details")
          console.error(err)
        })
        .finally(() => {
          setUploading(false)
        })
    }
  }

  function successMessage() {
    if (!successBool) {
      setSuccessBool(true)
    }
  }

  useEffect(() => {
    if (successBool === true) {
      setTimeout(() => {
        setSuccessBool(false)
      }, 3000)
    }
  }, [successBool])

  function logout() {
    auth.signOut()
    router.push("/login")
  }

  return (
    <div className="bg-gradient-to-br from-[#8ec4f4]/10 to-[#8ec4f4]/20 min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/dashboard")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Mountain className="h-6 w-6 text-[#8ec4f4]" />
              <span className="text-xl font-bold text-gray-900">{id}</span>
            </div>
          </div>
          <Button
            onClick={logout}
            className="bg-[#f72f0c] hover:bg-[#b1220a] text-white flex items-center gap-2 bg-transparent"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mountain className="h-5 w-5 text-green-600" />
              Upload Photos
            </CardTitle>
            <CardDescription>Share your memories from {id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="cursor-pointer"
                />
              </div>
              <Button onClick={handleUpload} disabled={!file || uploading} className="bg-[#6f6f6f] hover:bg-[#5f5f5f]">
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Mountain className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Photos Gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-purple-600" />
              Your Photos from {id}
            </CardTitle>
            <CardDescription>Click on any photo to delete it</CardDescription>
          </CardHeader>
          <CardContent>
            {imageUrls.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No photos yet</p>
                <p>Upload your first photo to start building your memory collection!</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {imageUrls.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                      <div className="relative aspect-square">
                        <Image
                          src={imageUrl || "/placeholder.svg"}
                          alt={`Photo ${index + 1} from ${id}`}
                          fill
                          className="object-cover"
                        />
                        <div
                          className="absolute inset-0 bg-red-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this photo?")) {
                              deleteImage(paths[index])
                            }
                          }}
                        >
                          <div className="bg-red-500/80 text-white p-3 rounded-full hover:bg-red-600/80 transition-colors">
                            <Trash2 className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Success/Error Messages */}
      {successBool && (
        <div className="fixed bottom-4 right-4 max-w-md">
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">Photo uploaded successfully!</AlertDescription>
          </Alert>
        </div>
      )}

      {errBool && (
        <div className="fixed bottom-4 right-4 max-w-md">
          <Alert variant="destructive">
            <AlertDescription>{errmsg}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
