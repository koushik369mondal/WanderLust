const Notification = require("../models/Notification");

let io;

const initializeSocket = (socketIO) => {
    io = socketIO;

    io.on("connection", (socket) => {
        console.log(`✅ User connected: ${socket.id}`);

        // Join user's personal room
        socket.on("join", (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined their room`);
        });

        // Real-time chat
        socket.on("send-message", async (data) => {
            io.to(data.recipientId).emit("new-message", data);
        });

        // Typing indicator
        socket.on("typing", (data) => {
            socket.to(data.chatId).emit("user-typing", data);
        });

        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });
};

const sendNotification = (userId, notification) => {
    if (io) {
        io.to(userId.toString()).emit("new-notification", notification);
    }
};

const broadcastUpdate = (event, data) => {
    if (io) {
        io.emit(event, data);
    }
};

module.exports = { initializeSocket, sendNotification, broadcastUpdate };
