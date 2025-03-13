const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./src/Routes/authRoutes');
const messageRoutes = require('./src/Routes/messageRoutes');
const friendsRoutes = require('./src/Routes/friendsRoutes');
const PostingRoutes = require('./src/Routes/PostingRoutes')
const CommentRoutes = require('./src/Routes/commentsRoutes');
const dotenv = require('dotenv');
const {app,server} = require('./src/lib/socket');
dotenv.config();

const cookieParser = require('cookie-parser');


// 
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


// 
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));


// 
app.options("*", cors());
app.use(cookieParser());

// 
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/friend', friendsRoutes);
app.use('/api/posting', PostingRoutes);
app.use('/api/comments', CommentRoutes);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB Successfully");

        const PORT = 5001;
        server.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        });
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    }); 
