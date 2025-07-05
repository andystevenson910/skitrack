"use client"


import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../lib/firebaseConfig"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Mountain, ArrowLeft } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const [errmsg, seterrmsg] = useState<string>("err")
  const [errBool, setErrBool] = useState<boolean>(false)

  useEffect(() => {
    if (errBool === true) {
      setTimeout(() => {
        setErrBool(false)
      }, 3000)
    }
  }, [errBool])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard")
      }
    })
    return unsubscribe
  }, [])

  function senderrmsg(errstring: string) {
    seterrmsg(errstring)
    setErrBool(true)
  }

  function logIn() {
    signInWithEmailAndPassword(auth, email, password)
      .then(({ user }) => {
        router.push("/dashboard")
      })
      .catch((error) => {
        const errorTitle = error.code.replace("auth/", "")
        console.log(errorTitle)
        if (errorTitle == "user-not-found") {
          senderrmsg("Account not found")
        } else if (errorTitle == "wrong-password") {
          senderrmsg("Password is incorrect")
        } else if (errorTitle == "missing-password") {
          senderrmsg("Missing password")
        } else if (errorTitle == "invalid-email") {
          senderrmsg("This email is invalid")
        } else {
          senderrmsg(("An error occured, see console log for more info: " + errorTitle) as string)
          console.error(error)
        }
      })
  }

  return (
    <div className="bg-gradient-to-br from-[#8ec4f4]/10 to-[#8ec4f4]/20 min-h-screen">
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
          <Button className="bg-[#3db73b] hover:bg-[#28a327] text-white">Sign Up</Button>
        </div>
      </header>

      {/* Login Form */}
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue tracking your ski adventures</CardDescription>
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
            <Button onClick={logIn} className="w-full bg-[#007bff] hover:bg-[#0069d9]">
              Log In
            </Button>
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 h-auto font-normal text-[#007bff]"
                onClick={() => router.push("/signup")}
              >
                Sign up here
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
