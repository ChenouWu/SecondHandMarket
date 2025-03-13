const User = require("../models/User");
const Message = require('../models/Message');
const cloudinary = require('../lib/cloudinary');
const { getRecevierSocketId,io } = require("../lib/socket");


const getUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // 找到当前用户，并且populate他的Friends
        const user = await User.findById(loggedInUserId)
            .populate('Friends', 'FullName ProfilePic Email');   // 只拿3个字段

        if (!user) {
            return res.status(404).json({ message: "用户不存在" });
        }

        res.status(200).json({
            message: "好友列表获取成功",
            friends: user.Friends  // 这里已经是好友的完整信息
        });

    } catch (err) {
        console.error("获取好友列表失败:", err);
        res.status(500).json({ message: "服务器错误" });
    }
}

const getMessages = async (req, res) => {
    try{

        const {id: userToChatId} = req.params;
        
        const senderId = req.user._id;

        const messages = await Message.find({
            $or:[{
                senderId:senderId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:senderId}
            ]
        })
        res.status(200).json(messages);
    }catch(err){
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

const sendMessages = async (req, res) => {
    try{
        const {text , image} = req.body;
        const { id: receiverId} =req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });

        await newMessage.save();
        // todo : realtime functionality goes here  => socket.io
        const receiverSocketId = getRecevierSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(201).json(newMessage);
    }catch(err){
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {getUsers, getMessages,sendMessages};