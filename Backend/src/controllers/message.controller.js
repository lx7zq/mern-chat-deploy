import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {

        const loggedInUserId = req.user._id;


        if (!loggedInUserId) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }


        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error getting user info" });
    }
    
};

// Get all messages for a user
export const sendMessage = async (req, res) => {
    try {
        const {id:receiverId} = req.params;
        if(!receiverId){
            return res.status(400).json({message: "Receiver ID is required"});
        }
        const senderId = req.user._id; 
        const {text, image} = req.body;
        let imageURL = "";
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL=uploadResponse.secure_url
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageURL
        })
        await newMessage.save();
        // Real time chat
        const receiverSocketId = getReceiverSocketId(receiverId); 
        if(receiverSocketId){
            // to ระบุว่าส่งให้ใคร
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(200).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json ({ message: "Internal Server Error sending message" });
        
    }
}

export const getMessage = async (req, res) => {
    try {
        const {id:userToChatId} = req.params; // id of user to chat with 
        const myId = req.user._id

        // get all messages between two users
        const messages = await Message.find({
            $or:[
                // messages from user to chat with to me เราส่งให้เขา
                {senderId: myId, receiverId: userToChatId},
                // messages from user to chat with to me ส่งให้เรา
                {senderId: userToChatId, receiverId: myId}
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json ({ message: "Internal Server Error sending message" });
    }
}
