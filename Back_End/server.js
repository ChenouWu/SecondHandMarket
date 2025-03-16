const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require("socket.io");

// Create Express app
const app = express();
// Create HTTP server using the Express app
const server = http.createServer(app);

// Set up Socket.io
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://secondhandmarket.onrender.com"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// Socket.io logic
const userSocketMap = {}; // { userId: socketId }

const getRecevierSocketId = (userId) => {
    return userSocketMap[userId];
};

io.on("connection", (socket) => {
    console.log("A User connected", socket.id);

    const userId = socket.handshake.query.userId;

    if (userId) userSocketMap[userId] = socket.id;

    // Send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// Express middleware
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

// Routes
const AuthRoutes = require('./src/Routes/authRoutes');
const MessageRoutes = require('./src/Routes/messageRoutes');
const FriendsRoutes = require('./src/Routes/friendsRoutes');
const PostingRoutes = require('./src/Routes/PostingRoutes');
const CommentRoutes = require('./src/Routes/commentsRoutes');

app.use('/api/auth', AuthRoutes);
app.use('/api/message', MessageRoutes);
app.use('/api/friend', FriendsRoutes);
app.use('/api/posting', PostingRoutes);
app.use('/api/comments', CommentRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB Successfully");
        const PORT = process.env.PORT || 10000;
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });

// Export what's needed for other files
module.exports = { app, io, getRecevierSocketId };