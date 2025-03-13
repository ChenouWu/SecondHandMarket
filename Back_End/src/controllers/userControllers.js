const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../lib/utils');
const cloudinary = require('../lib/cloudinary');

const md5 = require('md5');

const signup = async (req, res) => {
    try {
        const { FullName, Email, Password } = req.body;

        if (Password.length < 6) {
            return res.status(400).json({ message: "Password length must be greater than 6" });
        }

        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 加密密码
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(Password, salt);

        // 生成 Gravatar 默认头像
        const emailHash = md5(Email.trim().toLowerCase());
        const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=identicon&s=150`;

        // 创建新用户
        const newUser = new User({
            FullName,
            Email,
            Password: passwordHash,
            ProfilePic: gravatarUrl // 使用 Gravatar 头像
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            return res.status(201).json({
                message: "User created successfully",
                _id: newUser._id,
                FullName: newUser.FullName,
                Email: newUser.Email,
                ProfilePic: newUser.ProfilePic
            });
        } else {
            return res.status(400).json({ message: "User not created" });
        }
    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const login = async (req, res) => {
    const {Email, Password} = req.body;
  try{
    const existingUser = await User.findOne({
        Email
    }); 
    if(!existingUser){
        return res.status(400).json({
            message: "User does not exist"
        });
    }

    const isPasswordCorrect = await bcrypt.compare(Password, existingUser.Password);

    if(!isPasswordCorrect){
        return res.status(400).json({
            message: "Password Incorrect"
        });
    }
    generateToken(existingUser._id,res);
    
    return res.status(200).json({
        message: "User logged in successfully",
        _id: existingUser._id,
        FullName: existingUser.FullName,
        Email: existingUser.Email,
        ProfilePic: existingUser.ProfilePic
    });
  }catch(err){
    return res.status(500).json({
        message: "Internal Server Error"
    });
  }
}   

const logout = async (req, res) => {
  try{
    res.cookie('jwt', '', {maxAge: 0});
    res.status(200).json({
        message: "User logged out successfully"
    });
  }catch(err){
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { ProfilePic, FullName } = req.body;
        const userId = req.user.id;

        // 创建一个更新对象
        let updateData = {};

        // 如果用户上传了新头像，则更新 ProfilePic
        if (ProfilePic) {
            const upload = await cloudinary.uploader.upload(ProfilePic);
            updateData.ProfilePic = upload.secure_url;
        }

        // 如果用户修改了名字，则更新 FullName
        if (FullName) {
            updateData.FullName = FullName;
        }

        // 如果没有任何数据需要更新
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No changes detected. Please provide new Profile Picture or Full Name."
            });
        }

        // 更新用户信息
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        res.status(200).json({
            message: "Profile updated successfully",
            updatedUser
        });

    } catch (err) {
        console.error("Update Profile Error:", err); // 日志记录错误
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

const checkAuth = async (req, res) => {
    try{
        res.status(200).json(req.user);
}catch(err){
    return res.status(500).json({
        message: "Internal Server Error"
    });
}
}

module.exports = {signup, login, logout,updateProfile,checkAuth};

