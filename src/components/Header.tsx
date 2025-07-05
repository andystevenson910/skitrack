"use client";
import { useRouter } from "next/router";
import { useState } from "react";
import { auth } from "../lib/firebaseConfig";
import { Button } from "./ui/button";
import { Mountain, ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "../context/auth-context";

export default function Header() {
  const router = useRouter();
  const { user } = useAuth();
  const userLoggedIn = !!user;

  const logout = () => {
    auth.signOut();
    router.push("/login");
  };

  const renderRightButtons = () => {
    const path = router.pathname;

    if (userLoggedIn) {
      if (path.startsWith("/resorts")) {
        return (
          <>
            <div className="flex items-center gap-2">
              <Mountain className="h-5 w-5 text-[#8ec4f4]" />
              <span className="font-semibold text-gray-900">{router.query.id}</span>
            </div>
            <Button
              onClick={logout}
              className="bg-[#f72f0c] hover:bg-[#b1220a] text-white flex items-center gap-2 bg-transparent"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </>
        );
      }
      return (
        <Button
          onClick={logout}
          className="bg-[#f72f0c] hover:bg-[#b1220a] text-white flex items-center gap-2 bg-transparent"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      );
    }

    if (path === "/signup") {
      return (
        <Button onClick={() => router.push("/login")} className="bg-[#007bff] hover:bg-[#0069d9] text-white">
          Log In
        </Button>
      );
    }
    return (
      <div className="flex gap-2">
        <Button onClick={() => router.push("/signup")} className="bg-[#3db73b] hover:bg-[#28a327] text-white">
          Sign Up
        </Button>
        <Button onClick={() => router.push("/login")} className="bg-[#007bff] hover:bg-[#0069d9] text-white">
          Log In
        </Button>
      </div>
    );
  };

  const renderLeftButton = () => {
    if (router.pathname === "/" && userLoggedIn) {
      return (
        <Button onClick={() => router.push("/dashboard")} variant="ghost">
          Dashboard
        </Button>
      );
    }

    if (router.pathname.startsWith("/resorts")) {
      return (
        <Button onClick={() => router.push("/dashboard")} variant="ghost" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Button>
      );
    }
    return (
      <Button onClick={() => router.push("/")} variant="ghost" className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Home
      </Button>
    );
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {renderLeftButton()}
        <div className="flex items-center gap-2">
          <Mountain className="h-6 w-6 text-[#8ec4f4]" />
          <span className="font-semibold text-gray-900">Ski Resort Tracker</span>
        </div>
        <div className="flex items-center gap-4">{renderRightButtons()}</div>
      </div>
    </header>
  );
}