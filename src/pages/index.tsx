"use client";

import { useRouter } from "next/router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Mountain, MapPin, Camera } from "lucide-react";
import { useAuth } from "../context/auth-context";

export default function Index() {
  const router = useRouter();
  const { user } = useAuth();
  const userLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8ec4f4]/10 to-[#8ec4f4]/20">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Mountain className="h-8 w-8 text-[#8ec4f4]" />
            <span className="text-xl font-bold text-gray-900">Ski Resort Tracker</span>
          </div>
          <div className="flex gap-2">
            {userLoggedIn ? (
              <Button onClick={() => router.push("/dashboard")} variant="default">
                Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={() => router.push("/signup")} className="bg-[#3db73b] hover:bg-[#28a327] text-white">
                  Sign Up
                </Button>
                <Button onClick={() => router.push("/login")} variant="default">
                  Log In
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Track Your Adventures
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to Ski Resort Tracker</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Keep track of all the ski resorts you've visited across America. With our easy-to-use interface and
            geolocation verification, you'll never forget where you've been.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/signup")} className="bg-[#8ec4f4] hover:bg-[#7cacd5]">
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/login")} className="bg-[#006E50]">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to track and remember your ski resort adventures
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Mountain className="h-6 w-6 text-[#8ec4f4]" />
              </div>
              <CardTitle>Track Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Keep track of all the ski resorts you've visited across America with our comprehensive tracking system.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Location Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Verify your visits with precise geolocation data to ensure authentic check-ins at each resort.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Save Memories</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Upload and organize photos from each resort visit to create lasting memories of your adventures.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Use</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Get started in just a few simple steps</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#8ec4f4] text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Sign up for an account</h3>
                    <p className="text-gray-600">Create your free account to start tracking your ski resort visits.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#8ec4f4] text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Visit ski resorts</h3>
                    <p className="text-gray-600">
                      Explore amazing ski resorts across America and make unforgettable memories.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#8ec4f4] text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Check in and save photos</h3>
                    <p className="text-gray-600">
                      Use our app to verify your visits with location data and save your favorite photos.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#8ec4f4] text-white rounded-full flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Track your progress</h3>
                    <p className="text-gray-600">
                      View your complete history and see how many resorts you've conquered.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 text-center">
                <Mountain className="h-24 w-24 text-[#8ec4f4] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Start?</h3>
                <p className="text-gray-600 mb-6">Join other skiers tracking their adventures</p>
                <Button onClick={() => router.push("/signup")} className="bg-[#8ec4f4] hover:bg-[#7cacd5]">
                  Sign Up Today
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mountain className="h-6 w-6" />
            <span className="text-lg font-semibold">Ski Resort Tracker</span>
          </div>
          <p className="text-gray-400">Track your ski resort adventures across America</p>
        </div>
      </footer>
    </div>
  );
}