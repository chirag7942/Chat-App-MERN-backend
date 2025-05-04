import React from 'react'
import Navbar from './components/Navbar'
import { Routes } from 'react-router-dom'
import { Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Toaster } from 'react-hot-toast'

import { useAuthStore } from "./store/useAuthStore";

import { useThemeStore } from "./store/useThemeStore";

import {Loader} from "lucide-react"


//daisy ui is a library that provide built-in tailwind css components.

//We use Axios primarily to make HTTP requests to external APIs or servers, it is much better than fetch method.

//Zustand is a small, fast, and scalable state-management library for React apps. It's a great alternative to Redux, Context API, or even useState/useReducer in larger apps.

const App = () => {

  const { authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore(); //getting states of the users.

  const {theme} = useThemeStore();



  //this useeffect hook will make sure that whenever our app starts or refreshes, first authentication of user will be checked.
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });


  //in below wriiten code we'll retying to show loading icon coming from lucide-react library when checking of authentication of user is taking place.
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

    <>
    <Toaster toastOptions={{ debug: false }} />
  </>

  return (

    //setting the theme to this div will apply the selcted theme in the whole ui.
    <div data-theme={theme}>

    <Navbar/>

    <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />}/>
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />}  />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />}  />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster


      />

      {/**A toaster (or "toast notification") is a small message box that "pops up" on the screen — usually at the corner — to provide brief, unobtrusive feedback to the user. */}



    </div>
  )
}

export default App
