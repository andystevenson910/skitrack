"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { Mountain, Plus, MapPin, LogOut, Search } from "lucide-react";
import { useAuth } from "../context/auth-context";
import dynamic from "next/dynamic";

const LazyResortList = dynamic(() => import("../components/LazyResortList"), {
  ssr: false,
  loading: () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-24" />
      ))}
    </div>
  )
});

export default function Dashboard() {
  const [alert, setAlert] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const router = useRouter();
  const [userLatitude, setUserLatitude] = useState<number>();
  const [userLongitude, setUserLongitude] = useState<number>();
  const [searchItem, setSearchItem] = useState("");
  const [visitedResorts, setVisitedResorts] = useState<string[]>([]);
  const { user, loading: authLoading } = useAuth();

  const getLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLatitude(position.coords.latitude);
        setUserLongitude(position.coords.longitude);
      },
      (error) => console.error("Geolocation error:", error)
    );
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    
    const getAllEntries = async () => {
      const docRef = doc(db, "userInfo", user.uid);
      const docSnap = await getDoc(docRef);
      const visitedData: string[] = docSnap.data()?.resorts ?? [];
      setVisitedResorts(visitedData);
    };

    setTimeout(() => getAllEntries(), 0);
  }, [user]);

  const addResort = useCallback(async (place: string) => {
    if (!user) return;
    
    if (visitedResorts.includes(place)) {
      setAlert({type: 'error', message: "You've already visited this resort"});
      return;
    }

    const { arrayUnion } = await import("firebase/firestore");
    
    setVisitedResorts([place, ...visitedResorts]);
    const userInformation = doc(db, "userInfo", user.uid);
    await updateDoc(userInformation, { resorts: arrayUnion(place) });
    setAlert({type: 'success', message: "Resort added successfully!"});
  }, [user, visitedResorts]);

  const addResortChecked = useCallback(async (value: string) => {
    if (!userLatitude || !userLongitude) {
      getLocation();
      return;
    }

    const { collection, query, where, getDocs } = await import("firebase/firestore");
    
    const resortsref = collection(db, "resorts");
    const q = query(resortsref, where("resort_name", "==", value));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      setAlert({type: 'error', message: "Resort not found"});
      return;
    }

    let resortFound = false;
    querySnapshot.forEach((doc) => {
      resortFound = true;
      const resortData = doc.data();
      if (Math.abs(userLatitude - resortData.lat) > 1 || 
          Math.abs(userLongitude - resortData.lon) > 1) {
        setAlert({type: 'error', message: "You must be at the resort location to add it"});
      } else {
        addResort(value);
      }
    });

    if (!resortFound) {
      setAlert({type: 'error', message: "Resort not found"});
    }
  }, [userLatitude, userLongitude, getLocation, addResort]);

  function logout() {
    auth.signOut();
    router.push("/login");
  }

  function gotoresortpage(place: string) {
    router.push("/resorts/" + place);
  }

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-[#8ec4f4]/10 to-[#8ec4f4]/20">
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
              <LazyResortList resorts={visitedResorts} onResortClick={gotoresortpage} />
            )}
          </CardContent>
        </Card>
      </div>

      {alert && (
        <div className="fixed bottom-4 right-4 max-w-md">
          <Alert variant={alert.type === 'success' ? 'default' : 'destructive'}>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}