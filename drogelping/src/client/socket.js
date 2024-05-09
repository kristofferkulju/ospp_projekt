import { io } from "socket.io-client";

const socket = io.connect("http://localhost:2001");

socket.on("connect_error", (error) => {
    console.error("There was a connection error, please refresh the page.", error);
});

export default socket;