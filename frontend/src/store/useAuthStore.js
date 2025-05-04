//in this fle we'll do state management with the help of hooks like setting different states of the webpage.

import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001"   : "/"  ;

export const useAuthStore = create((set, get) => ({

    //below written fields are giving initial states of differnt functions of webpage.For eg., we've made authuser null it means initially user is not authenticated and we have made ischeckingauth true because we're checking whether the user is authenticated or not. 

  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  
//function that will give frontend res to checkauth function.
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");//res from backend here we did't type complete route for checkauth because we've written half of our route at axios insatnce already.

      set({ authUser: res.data });//setting state of auth

      get().connectSocket();
    } 
    catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } 
    
    finally {  //here finally representing that after checking authentication of user , we need to stop this function
      set({ isCheckingAuth: false });
    }
  },


  
  signup: async (data) => {

    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();  //this line shows that when a user signup, we'll connect it to the socket io server.
    } 
    catch (error) {
      toast.error(error.response.data.message);
    } 
    finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket(); 
    } 
    catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } 
    
    catch (error) {
      toast.error(error.response.data.message);//showing error of backend
    }
  },

  updateProfile: async (data) => {

    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } 
    catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    }
     finally {
      set({ isUpdatingProfile: false });
    }
  },



 
 

  


  connectSocket: () => {

    const { authUser } = get();

    if (!authUser || get().socket?.connected) return; // it means if user is not authenticated or not connected socket server, we'll return.

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();//it means user will only disconnect, if it is connected.
  },


  
}


));
