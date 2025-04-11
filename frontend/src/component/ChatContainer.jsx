import React from "react";
import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./Skeleton/MessageSkeleton";
import { formatMessageTime } from "../lib/utils.js";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessageLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    isFriend,
    friendRequestSent,
    friendRequestReceived,
    setIsFriend,
    setFriendRequestSent,
    setFriendReqReceived,
    addFriend,
    acceptFriendRequest,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  useEffect(() => {
    // get history messages
    getMessages(selectedUser._id);
    // listen to socket
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);
  useEffect(()=>{
    if(authUser && selectedUser){
        setIsFriend(authUser.friends.includes(selectedUser._id))
        setFriendReqReceived(authUser.friendRequests.includes(selectedUser._id))
        setFriendRequestSent(authUser.friendRequests.includes(authUser._id))
    }
  },[
    setIsFriend,
    setFriendReqReceived,
    setFriendRequestSent,
    authUser,
    selectedUser,
  ])
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);
  const handleAddFriend = () => {
    addFriend(selectedUser._id);
    setFriendRequestSent(true);
  };

  const handleAcceptFriend = () => {
    acceptFriendRequest(selectedUser._id)
    setIsFriend(true)
    setFriendReqReceived(true)
    getMessages(selectedUser._id )

  };

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageInput />
        <MessageSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.webp"
                      : selectedUser.profilePic || "/avatar.webp"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
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
      {!isFriend && !friendRequestSent && !friendRequestReceived && (
        <div className="p-4 text-center text-red-500">
          You must be friend with this user to send messages.
          <button className="btn btn-sm mt-2" onClick={handleAddFriend}>
            Add Friend
          </button>
        </div>
      )}
      {!isFriend && friendRequestSent && !friendRequestReceived && (
        <div className="p-4 text-center text-yellow-500">
          Friend request sent Waiting for acceptance.
        </div>
      )}
      {!isFriend && !friendRequestSent && friendRequestReceived && (
        <div className="p-4 text-center text-green-500">
          You must be friend with this user to send messages.
          <button className="btn btn-sm mt-2" onClick={handleAcceptFriend}>Accent friend request</button>
        </div>
      )}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
