const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello from the server!");
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {

    console.log(`[CONNECTION_ESTABLISHED](${socket.id})`); // SocketChat, SocketGame

    socket.on("join_room", (data) => { // SocketChat
        socket.join(data.room);
        socket.emit("receive_message", data);
        console.log(`[JOIN_ROOM](${socket.id}): (${data.author})`);
    });

    socket.on("send_message", (data) => { // SocketChat (messages), SocketGame (goals)
        socket.to(`${data.room}`).emit("receive_message", data);
        console.log(`[SEND_MESSAGE](${socket.id}): ${data.author}(${data.room}) - "${data.message}"`);
    });

    socket.on("update_position", (data) => { // SocketGame (paddle position)
        socket.join("123");
        socket.to("123").emit("update_position", data);
        console.log(`[UPDATE_POSITION]: *${data}*`);
    });

    socket.on("sync_ball", (data) => {
        socket.to("123").emit("sync_ball", data);
        console.log(`[SYNC_BALL]`);
    });

    socket.on("sync_paddle", (data) => {
        socket.to("123").emit("sync_paddle", data);
        console.log(`[SYNC_PADDLE]: *${data}*`);
    });

    socket.on("update_score", (data) => {
        socket.to("123").emit("sync_score", data);
        console.log(`[UPDATE_SCORE]: *${data}*`);
    });
});

server.listen(2001, () => {
    console.log("SERVER IS RUNNING")
});