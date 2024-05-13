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

var player1 = "";
var player2 = "";
var player1Ready = false;
var player2Ready = false;

io.on("connection", (socket) => {

    console.log(`[CONNECTION_ESTABLISHED](${socket.id})`); // SocketChat, SocketGame

    socket.on("join_room", (data) => { // SocketChat
        socket.join(`${data[0]}`);
        socket.emit("receive_message", data);
        console.log(`[JOIN_ROOM](${socket.id}): (${data})`);

        // Håller reda på vänster och höger spelare för spectators
        if (data[1] !== "spectate") {
            if (player1 === "") {
                player1 = data[2];
            } else if (player2 === "") {
                player2 = data[2];
            }
        }

    });

    socket.on("confirm_ready", (data) => {
        socket.to(`${data.room}`).emit("receive_message", `${data} is ready`);
        if (data === player1) {
            player1Ready = true;
        }
        if (data === player2) {
            player2Ready = true;
        }
        console.log(`Player (${socket.id}) is ready`);
    });

    socket.on("check_opponent_ready", (data) => {
        if (data === player1) {
            socket.emit("is_ready", [player2Ready]);
        }
        if (data === player2) {
            socket.emit("is_ready", [player1Ready]);
        }
    })

    socket.on("send_message", (data) => { // SocketChat (messages), SocketGame (goals)
        socket.to(`${data.room}`).emit("receive_message", data);
        console.log(`[SEND_MESSAGE](${socket.id}): ${data.author}(${data.room}) - "${data.message}"`);
    });

    socket.on("update_position", (data) => { // SocketGame (paddle position)
        //socket.join(`${data.room}`);
        socket.to(`${data.room}`).emit("update_position", data);
        console.log(`[UPDATE_POSITION]: *${data}*`);
    });

    socket.on("sync_ball", (data) => {
        socket.to(`${data[2]}`).emit("sync_ball", data);
        console.log(`[SYNC_BALL]`);
    });

    socket.on("sync_paddle", (data) => {
        if (data[0] === player1) {
            socket.to(`${data[3]}`).emit("sync_paddle", [data[1], data[2], "P1"]);
        }
        else {
            socket.to(`${data[3]}`).emit("sync_paddle", [data[1], data[2], "P2"]);
        }
        console.log(`[SYNC_PADDLE]: *${data[0]}*`);
    });

    socket.on("update_score", (data) => {
        socket.to(`${data[2]}`).emit("sync_score", data);
        console.log(`[UPDATE_SCORE]: *${data}*`);
    });
});

server.listen(2001, () => {
    console.log("SERVER IS RUNNING")
});