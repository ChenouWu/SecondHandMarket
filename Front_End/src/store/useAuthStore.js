import { create } from "zustand";
import axiosInstance from "../libs/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "https://secondhandmarket.onrender.com";

export const useAuthStore = create((set,get) => ({
    authUser: null, // Current User Infor
    isSigningUp: false, 
    isLoggingIn: false,
    isUpdatingProfile: false,
    ischeckingAuth:true,
    onlineUsers: [],
    socket:null,

    checkAuth :async()=>{
        try{
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data});

            get().connectSocket();
        }catch(err){
            console.log(err);
    }finally{
            set({ischeckingAuth:false})
    }
    },

    signup: async(data)=>{
        set({isSigningUp:true});
        try{
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser: res.data});
            toast.success(res.data.message);
            get().connectSocket(); 
            
        }catch(err){
            console.error("Signup Error:", err.response?.data || err.message); // Log full error
            toast.error(err.response?.data?.message || "Signup failed");
        }
    },

    login: async(data)=>{
        set({isLoggingIn:true});
        try{
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser: res.data});
            toast.success(res.data.message);

            get().connectSocket(); 
        }catch(err){
            console.error("Login Error:", err.response?.data || err.message); // Log full error
            toast.error(err.response?.data?.message || "Login failed");
        }finally {
            set({ isLoggingIn: false });
        }
    },

    Logout:async()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logout successful");
            get().disconnectSocket();
        }catch(err){
            console.error("Logout Error:", err.response?.data || err.message); // Log full error
            toast.error(err.response?.data?.message || "Logout failed");
        }
    },

    updatetingProfile: async(data)=>{
        set({isUpdatingProfile:true});
        
        try{
            const res = await axiosInstance.put("/auth/updateProfile",data);
            set({authUser: res.data});
            toast.success(res.data.message);
        }catch(err){
            const erroMessage = err.response?.data?.message ;
            console.error("Update Profile Error:", err.response?.data || err.message); // Log full error
            toast.error(erroMessage);
        }
    },

    connectSocket: async () => {
        const { authUser } = get();
    
        if (!authUser || get().socket?.connected) return;
    
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            }
        });
    
        socket.connect();
        set({ socket });
    
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },
    disconnectSocket: () => {
        get().socket?.disconnect();
        set({ socket: null }); 
    }
}

))
;
