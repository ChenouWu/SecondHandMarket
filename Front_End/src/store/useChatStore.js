import {create} from 'zustand';
import toast from 'react-hot-toast';
import axiosInstance from '../libs/axios';
import { useAuthStore } from './useAuthStore';
import axios from 'axios';
export const useChatStore = create((set,get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessageLoading: false,


    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get('friend/getFriends');
          console.log(res)
          set({ users: res.data.friends || []});
        } catch (error) {
          toast.error(error.response.data);
        } finally {
          set({ isUsersLoading: false });
        }
      },

    getMessages: async (userId) => {
        set({isMessageLoading:true});

        try{
            const res = await axiosInstance.get(`message/${userId}`);
            set({messages: res.data });

        }catch(err){
            console.error('Get Message Error:', err.response?.data || err.messages);
            toast.error(err.response?.data?.messages || 'Get Message failed');
        }finally{
            set({isMessageLoading:false});
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
          const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
          set({ messages: [...messages, res.data] });
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },

    subcribeToMessages :()=>{
      const {selectedUser} = get()
      if(!selectedUser)return;
      
      const socket= useAuthStore.getState().socket;
      socket.on("newMessage",(newMessage)=>{
        const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
        if (!isMessageSentFromSelectedUser) return;
        set({
          messages:[...get().messages,newMessage],
        })
      })
    },

    unsubcribeFromMessages:()=>{
      const socket = useAuthStore.getState().socket;
      socket.off("newMessage");
     },

    setSelectedUser : (selectedUser) => set({selectedUser})
}));
