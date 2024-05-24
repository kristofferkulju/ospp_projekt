/* #  Current limitations
 * ## Can only join 1 room per socket.id (must refresh to join new room)
 * ## Upon disconnect
 *    > Pause game
 *    > Change ready/joined status of disconnected player
 *    > Remove player from PlayerList or SpectatorList
 * ## Create room with properties "socket.on("create_room", () => {});"
 *    > RoomID = "000"
 *    > SpectatorList = ["Hp4euh9V6z7Og-rIAAAC", "luXKPGeFhvEe8mb1AAAD"] 
 *    > PlayerList = [{socketID: Hp4euh9V6z7Og-rIAAAC, name: "John", ready: true}, {...}]
 *    > MaxPlayers = 2
 * ## Ball is still lagging / score can fall behind (global gamestate?) 
 * ## Double connections (worked around atm)
 * ## "Ready" before someone joins leads to "Not ready" on their screen, but works in practice.
 * ## Goals upon opponent grants the opponent goal
*/
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

let players = []; 
let spectators = [];
const MAXPLAYERS = 2;

function send_receive(socket, data, message) {
    socket.to(`${data.room}`).emit("receive_message", {author: `Server`, room: `${data.room}`, message: `${message}`});
    socket.emit("receive_message", {author: `Server`, room: `${data.room}`, message: `${message}`});
}

function join_helper(socket, data) {
    let message = (data.mode === "spectate") ? `is now spectating room ${data.room}` : `has joined room ${data.room}`;
    let list = (data.mode === "spectate") ? spectators : players;
    if (!list.find(entry => entry.socketID === socket.id)) {
        if (!data.mode && players.length >= MAXPLAYERS) {
            data.mode = "spectate";
            join_helper(socket, data);
        }
        else {
            list.push({socketID: socket.id, name: data.name, ready: false});
            send_receive(socket, data, `${data.name} ${message}`); // Send in chat
        }
    }
}

function ready(socket, data) {
    let player = players.find(entry => entry.socketID === socket.id);
    if (player) { player.ready = data.ready; }
    socket.to(`${data.room}`).emit("opponent_joined", {name: data.name, room: data.room, ready: data.ready});
}

io.on("connection", (socket) => {
    console.log(`[CONNECTED](${socket.id})`);

    socket.on("disconnect", () => {
        console.log(`[DISCONNECTED](${socket.id})`);
    });

    socket.on("join_room", (data) => {
        socket.join(`${data.room}`);
        join_helper(socket, data);
        if (players.length === MAXPLAYERS) {
            socket.to(`${data.room}`).emit("both_joined", { name: data.name, room: data.room, players_0: players[0].name, players_1: players[1].name }); // Updates for last player, Opponent "joined status".
            socket.emit("both_joined", { name: data.name, room: data.room, players_0: players[0].name, players_1: players[1].name }); // Updates for last player, the Opponent "joined status".
        }
        const isLeft = data.name === players[0].name ? true : (data.name === players[1].name ? false : "none");
        socket.emit("set_side", {name: data.name, room: data.room, leftside: isLeft});

        if (data.name === players[0].name) {
        } else if (data.name === players[1].name) {
            socket.emit("set_side", {name: data.name, room: data.room, leftside: false});
        }
    });

    socket.on("confirm_ready", (data) => {
        ready(socket, data);
    });

    socket.on("ready_waiting", (data) => {
        if (players.length === MAXPLAYERS) {
            socket.emit("both_joined", {name: data.name, room: data.room});
            if (players[0].ready && players[1].ready) {
                socket.emit("countdown", data);
                socket.to(`${data.room}`).emit("countdown", data);
            }
        }
    });

    socket.on("send_message", (data) => {
        socket.to(`${data.room}`).emit("receive_message", data);
    });

    socket.on("update_position", (data) => {
        socket.to(`${data.room}`).emit("update_position", data);
    });

    socket.on("sync_ball", (data) => {
        socket.to(`${data.room}`).emit("sync_ball", data);
    });

    socket.on("left_paddle", (data) => {
        socket.to(`${data.room}`).emit("left_paddle", {paddlePositionPlayer: data.paddlePositionPlayer});
    });

    socket.on("right_paddle", (data) => {
        socket.to(`${data.room}`).emit("right_paddle", {paddlePositionOpponent: data.paddlePositionOpponent});
    });

    socket.on("update_score", (data) => {
        socket.to(`${data.room}`).emit("sync_score", data);
    });

    socket.on("score", (data) => {
        socket.to(`${data.room}`).emit("receive_message", {author: "Server", room: data.room, message: data.scoring_player + " scored a goal!"});
        socket.emit("receive_message", {author: "Server", room: data.room, message: data.scoring_player + " scored a goal!"});
    })
});

server.listen(2001, () => {
    console.log("SERVER IS RUNNING")
});