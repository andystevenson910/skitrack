"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../lib/firebaseConfig"
import { setDoc, doc } from "firebase/firestore"
import { db } from "../lib/firebaseConfig"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Mountain, ArrowLeft } from "lucide-react"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errBool, setErrBool] = useState<boolean>(false)
  const [errmsg, seterrmsg] = useState<string>("err")
  const router = useRouter()

  useEffect(() => {
    if (errBool === true) {
      setTimeout(() => {
        setErrBool(false)
      }, 3000)
    }
  }, [errBool])

  async function signUp() {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        signInWithEmailAndPassword(auth, email, password)
        const docRef = await setDoc(doc(db, "userInfo", user.uid), {
          resorts: [],
        })
      })
      .catch((error) => {
        const errorTitle = error.code.replace("auth/", "")
        if (errorTitle == "email-already-in-use") {
          senderrmsg("This email is already associated with an account")
        } else if (errorTitle == "weak-password") {
          senderrmsg("Password is too weak")
        } else if (errorTitle == "invalid-email") {
          senderrmsg("This email is invalid")
        } else {
          senderrmsg(("An error occured, see console log for more info: " + errorTitle) as string)
          console.error(error)
        }
      })
  }

  function senderrmsg(errstring: string) {
    seterrmsg(errstring)
    setErrBool(true)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard")
      }
    })
    return unsubscribe
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8ec4f4]/10 to-[#8ec4f4]/20">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Button>
          <div className="flex items-center gap-2">
            <Mountain className="h-6 w-6 text-blue-600" />
            <span className="font-semibold text-gray-900">Ski Resort Tracker</span>
          </div>
          <Button className="bg-[#007bff] hover:bg-[#0069d9] text-white" onClick={() => router.push("/login")}>
            Log In
          </Button>
        </div>
      </header>

      {/* Signup Form */}
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Join thousands of skiers tracking their resort adventures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={signUp} className="w-full bg-[#3db73b] hover:bg-[#28a327]">
              Create Account
            </Button>
            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal text-[#007bff]"
                onClick={() => router.push("/login")}
              >
                Log in here
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
