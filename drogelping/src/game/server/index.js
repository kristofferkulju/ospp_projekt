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
    } else { 
        //console.log(`${socket.id} is already in room ${data.room}`); 
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
        console.log(`[DISCONNECTED](${socket.id})`)
    });

    socket.on("join_room", (data) => { // TODO: Double "Joined" message (workaround atm)
        socket.join(`${data.room}`);
        join_helper(socket, data);
        if (players.length === MAXPLAYERS) {
            socket.to(`${data.room}`).emit("both_joined", {name: data.name, room: data.room}); // Updates for last player, Opponent "joined status".
            socket.emit("both_joined", {name: data.name, room: data.room}); // Updates for last player, the Opponent "joined status".
        }
        //console.log(`[JOIN_ROOM](${socket.id})`);
    });

    socket.on("confirm_ready", (data) => {
        ready(socket, data);
        //console.log(`[CONFIRM_READY](${socket.id})`);
    });

    socket.on("ready_waiting", (data) => {
        if (players.length === MAXPLAYERS) {
            socket.emit("both_joined", {name: data.name, room: data.room});
            if (players[0].ready && players[1].ready) {
                socket.emit("countdown", data);
                socket.to(`${data.room}`).emit("countdown", data);
            }
        }
        //console.log(`[READY_WAITING](${socket.id})`);
    });

    socket.on("countdown_complete", (data) => {
        //console.log(`[COUNTDOWN_COMPLETE](${socket.id}): ${data.name}(${data.room})`);
    });

    socket.on("send_message", (data) => {
        socket.to(`${data.room}`).emit("receive_message", data);
        //console.log(`[SEND_MESSAGE](${socket.id}): ${data.author}(${data.room}) - "${data.message}"`);
    });

    socket.on("update_position", (data) => { // SocketGame (paddle position)
        socket.to(`${data.room}`).emit("update_position", data);
        //console.log(`[UPDATE_POSITION](${socket.id}): *${data}*`);
    });

    socket.on("sync_ball", (data) => {
        socket.to(`${data.room}`).emit("sync_ball", data);
        //console.log(`[SYNC_BALL](${socket.id})`);
    });

    socket.on("sync_paddle", (data) => {
        let player = data.name === players[0].name ? "P1" : "P2";
        socket.to(`${data.room}`).emit("sync_paddle", {paddlePositionP1: data.paddlePositionP1, paddlePositionP2: data.paddlePositionP2, player: player});
        //console.log(`[SYNC_PADDLE](${socket.id}): *${data.name}*`);
    });

    socket.on("update_score", (data) => {
        socket.to(`${data.room}`).emit("sync_score", data);
        //console.log(`[UPDATE_SCORE](${socket.id}): (${data.scoreP1}-${data.scoreP2})`);
    });
});

server.listen(2001, () => {
    console.log("SERVER IS RUNNING")
});