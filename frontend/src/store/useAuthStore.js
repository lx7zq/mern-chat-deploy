import { create } from "zustand";
import toast from "react-hot-toast";
import api from "../service/api";
import { io } from "socket.io-client";
import { useChatStore } from "./useChatStore";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  socket: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  onLineUsers:[],

  checkAuth: async () => {
    try {
      const res = await api.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in CheckAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await api.post("/auth/signup", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Account created Successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Sign Up Failed");
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await api.post("/auth/signin", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success(" Logged in Successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Log in Failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await api.post("/auth/signout");
      set({ authUser: null });
      get().disconnectSocket();
      toast.success("Logged out Successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Log out Failed");
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await api.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Update Profile Failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;
    const socketURL = import.meta.env.VITE_SOCKET_URL;
    const newSocket = io(socketURL ,{
      query: {
        userId: authUser._id,
      },
    });
    newSocket.connect();
    set({ socket: newSocket });
    //listen for online users
    newSocket.on("getOnlineUsers", (userId)=>{
        set({onLineUsers: userId})
    })
    
    newSocket.on("friendRequestReceived", (friendId) =>{
      const selectedUser = useChatStore.getState().selectedUser;
      if(friendId === selectedUser._id){
        useChatStore.getState().setFriendReqReceived(true)
      }
    })
    newSocket.on("friendRequestSent", (friendId) =>{
      const selectedUser = useChatStore.getState().selectedUser;
      if(friendId === selectedUser._id){
        useChatStore.getState().setFriendReqReceived(false)
      }
    })
    newSocket.on("friendRequestAccepted", (friendId) =>{
      const selectedUser = useChatStore.getState().selectedUser;
      if(friendId === selectedUser._id){
        useChatStore.getState().setFriendReqReceived(false)
        useChatStore.getState().setFriendRequestSent(false)
        useChatStore.getState().setIsFriend(true)
      }
    })
  },
  disconnectSocket : () =>{
    if(get().socket?.connected){
        get().socket.disconnect()
    }
  }
}));
