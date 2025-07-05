"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { auth } from "../lib/firebaseConfig"
import { doc, getDocs, getDoc, where, query, arrayUnion, updateDoc, collection } from "firebase/firestore"
import { db } from "../lib/firebaseConfig"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Badge } from "../components/ui/badge"
import { Mountain, Plus, MapPin, LogOut, Search } from "lucide-react"

export default function Dashboard() {
  const [successBool, setSuccessBool] = useState<boolean>(false)
  const [alreadyThereBool, setAlreadyThereBool] = useState<boolean>(false)
  const router = useRouter()
  const [userLatitude, setUserLatitude] = useState<number>()
  const [userLongitude, setUserLongitude] = useState<number>()
  const [searchItem, setSearchItem] = useState("")
  const [visitedResorts, setVisitedResorts] = useState<string[]>([])
  const [notInRangeBool, setNotInRangeBool] = useState<boolean>(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login")
      } else {
        getAllEntries()
      }
    })
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLatitude(position.coords.latitude)
      setUserLongitude(position.coords.longitude)
    })
    return unsubscribe
  }, [])

  function alreadyThereMessage() {
    if (!alreadyThereBool) {
      setAlreadyThereBool(true)
    }
  }
  useEffect(() => {
    if (alreadyThereBool === true) {
      setTimeout(() => {
        setAlreadyThereBool(false)
      }, 3000)
    }
  }, [alreadyThereBool])

  function notInRangeMessage() {
    if (!notInRangeBool) {
      setNotInRangeBool(true)
    }
  }
  useEffect(() => {
    if (notInRangeBool === true) {
      setTimeout(() => {
        setNotInRangeBool(false)
      }, 3000)
    }
  }, [notInRangeBool])

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

  async function addResort(place: string) {
    if (!visitedResorts.includes(place) && auth.currentUser) {
      setVisitedResorts([place, ...visitedResorts])
      const userInformation = doc(db, "userInfo", auth.currentUser.uid)
      await updateDoc(userInformation, {
        resorts: arrayUnion(place),
      })
      successMessage()
    } else {
      alreadyThereMessage()
    }
  }

  function logout() {
    auth.signOut()
    router.push("/login")
  }

  function gotoresortpage(place: string) {
    router.push("/resorts/" + place)
  }

  async function addResortChecked(value: string) {
    const resortsref = collection(db, "resorts")
    const q = query(resortsref, where("resort_name", "==", value))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      if (Math.abs(Number(userLatitude) - doc.data().lat) < 1) {
        if (Math.abs(Number(userLongitude) - doc.data().lon) < 1) {
          addResort(value)
        }
      } else {
        notInRangeMessage()
      }
    })
  }

  async function getAllEntries() {
    if (auth.currentUser) {
      const docRef = doc(db, "userInfo", auth.currentUser.uid)
      const docSnap = await getDoc(docRef)
      const visitedData: string[] = docSnap.data()?.resorts ?? []
      setVisitedResorts(visitedData)
    }
  }

  return (
    <div className="bg-gradient-to-br from-[#8ec4f4]/10 to-[#8ec4f4]/20">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Mountain className="h-8 w-8 text-[#8ec4f4]" />
            <span className="text-xl font-bold text-gray-900">Dashboard</span>
          </div>
          <Button onClick={logout} className="bg-[#f72f0c] hover:bg-[#b1220a] text-white">
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mountain className="h-5 w-5 text-[#8ec4f4]" />
              Your Ski Journey
            </CardTitle>
            <CardDescription>Track your progress across America's ski resorts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {visitedResorts.length} Resorts Visited
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Add Resort Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              Add New Resort
            </CardTitle>
            <CardDescription>
              Search for a resort and add it to your visited list (location verification required)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter resort name..."
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => addResortChecked(searchItem)} className="bg-[#6f6f6f] hover:bg-[#5f5f5f]">
                <Plus className="h-4 w-4 mr-2" />
                Add Resort
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visited Resorts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              Your Visited Resorts
            </CardTitle>
            <CardDescription>Click on any resort to view and manage your photos</CardDescription>
          </CardHeader>
          <CardContent>
            {visitedResorts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Mountain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No resorts visited yet</p>
                <p>Start your ski adventure by adding your first resort!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visitedResorts.map((resort, index) => (
                  <div
                    key={index}
                    className="cursor-pointer bg-[#8ec4f4] hover:bg-[#7cacd5] text-white rounded transition-all duration-200 p-8 text-center font-medium"
                    onClick={() => gotoresortpage(resort)}
                  >
                    {resort}
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
            <AlertDescription className="text-green-800">Resort added successfully!</AlertDescription>
          </Alert>
        </div>
      )}

      {alreadyThereBool && (
        <div className="fixed bottom-4 right-4 max-w-md">
          <Alert variant="destructive">
            <AlertDescription>You've already visited this resort</AlertDescription>
          </Alert>
        </div>
      )}

      {notInRangeBool && (
        <div className="fixed bottom-4 right-4 max-w-md">
          <Alert variant="destructive">
            <AlertDescription>You must be at the resort location to add it</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
