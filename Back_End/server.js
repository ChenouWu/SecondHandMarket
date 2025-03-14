const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { server } = require('./src/lib/socket');

const app = express();


app.use(cors({
    origin: ["http://localhost:5173", "https://secondhandmarket.onrender.com"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true  
}));
app.options("*", cors());


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());


const authRoutes = require('./src/Routes/authRoutes');
const messageRoutes = require('./src/Routes/messageRoutes');
const friendsRoutes = require('./src/Routes/friendsRoutes');
const PostingRoutes = require('./src/Routes/PostingRoutes');
const CommentRoutes = require('./src/Routes/commentsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/friend', friendsRoutes);
app.use('/api/posting', PostingRoutes);
app.use('/api/comments', CommentRoutes);


mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB Successfully");
        const PORT = process.env.PORT || 5001;
        const HTTP = '0.0.0.0';
        server.listen(5001, HTTP, () => {
            console.log(`Server is running on port${PORT}` );
        });
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });


module.exports = app;
