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
       socket.to(data.room).emit("receive_message", data);
   });

   socket.on("update_postion", (data) => {
    socket.join(data);
    socket.to("123").emit("update_position", data);
    console.log("Updated position");
});

});

server.listen(3001, () => {
   console.log("SERVER IS RUNNING")
});