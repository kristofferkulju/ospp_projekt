const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());



const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {

    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with id: ${socket.id} Joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
        socket.emit("receive_message", data);
    });

    socket.on("update_position", (data) => {
        console.log("Updated position");
        socket.join("123");
        socket.to("123").emit("update_position", data);

    });

    socket.on("sync_ball", (data) => {
        console.log("Synced ball");
        socket.to("123").emit("sync_ball", data);
    });

    socket.on("sync_paddle", (data) => {
        console.log("Synced paddle");
        socket.to("123").emit("sync_paddle", data);
    });
});

server.listen(3001, () => {
    console.log("SERVER IS RUNNING")
});