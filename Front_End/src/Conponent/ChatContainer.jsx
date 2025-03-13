import { useChatStore } from '../store/useChatStore'
import React, { useEffect, useRef } from 'react'
import ChatHeader from '../Conponent/ChatHeader';
import MessageInput from '../Conponent/MessageInput';
import MessageSkeleton from '../Conponent/Skeleton/MessageSkeleton'
import { useAuthStore } from '../store/useAuthStore';

function ChatContainer() {
    const {messages,getMessages,isMessagesLoading,selectedUser,subcribeToMessages
        ,unsubcribeFromMessages
    } = useChatStore();
    const {authUser} = useAuthStore()
    const messageEndRef = useRef(null);

    
    useEffect(()=>{
        getMessages(selectedUser._id);

        subcribeToMessages();

        return ()=> unsubcribeFromMessages();

    },[selectedUser._id,getMessages,subcribeToMessages,unsubcribeFromMessages])

    useEffect(() => {
        if (messageEndRef.current && messages) {
          messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [messages]);

    if(isMessagesLoading) return (<div>
        <ChatHeader/>
        <MessageSkeleton/>
        <MessageInput/>
    </div>
    )

  return (
    <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader/>
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
            {messages.map((message)=> (
                <div
                    key={message._id}
                    className={`chat ${message.senderId === authUser._id ? "chat-end":"chat-start"}`}
                    ref={messageEndRef}
                    >
                        <div className='chat-image avatar'>
                            <div className='size-10 rounded-full border'>
                                <img 
                                src={message.senderId === authUser._id ? authUser.ProfilePic: 
                                selectedUser.ProfilePic
                                } 
                                alt='profile
                                '/>
                                </div>
                            </div>
                            <div className='chat-header mb-1'>
                                <time className='text-xs opacity-50 ml-1'>
                                    {message.createdAt}
                                </time>
                            </div>
                            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
                    </div>
            ))} 
        </div>
        <MessageInput/>
    </div>
  ) 
}

export default ChatContainer
