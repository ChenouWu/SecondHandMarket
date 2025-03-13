const { Server } = require("socket.io");
const http = require("http");
const app = require("../../server");  // ✅ **直接引入 server.js 里的 app**

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://secondhandmarket.onrender.com"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

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

module.exports = { io, server, getRecevierSocketId };
