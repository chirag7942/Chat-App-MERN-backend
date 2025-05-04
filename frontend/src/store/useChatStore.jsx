//here we're prepending use word in these store files, because we're trying to build custom hooks.

import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) => ({

    //writing intial states below for chat related stuff.
  messages: [],
  users: [],
  selectedUser: null,
  areUsersLoading: false,
  areMessagesLoading: false,
  
  getUsers: async () => {

    set({ areUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } 

    catch (error) {
      toast.error(error.response.data.message);
    } 

    finally {
      set({ areUsersLoading: false });
    }
  },

  getMessages: async (userId) => {//here we're sending userid of the suer with which we want to get chat history.

    set({ areMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } 

    catch (error) {
      toast.error(error.response.data.message);
    }

     finally {
      set({ areMessagesLoading: false });
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  sendMessage: async (messageData) => {

    const { selectedUser, messages } = get();
    
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

      set({ messages: [...messages, res.data] });//this means we're appending this request's message daa along with already existing data.

    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  
 //the subscribeToMessages function will save the messages coming in real-time.
     subscribeToMessages: () => {

    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  
}));