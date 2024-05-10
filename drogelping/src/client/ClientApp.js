import './ChatApp'
import Chat from './Chat';
import GameApp from './GameApp';
import socket from './socket';
import './ClientApp.css'

function ClientApp({ username, room }) {
    socket.emit("join_room", {room: `${room}`, author: `${username}`, message: `*has joined room ${room}*`});
    return (
    <div className="App background">
        <Chat socket={socket} username={username} room={room} />
        <GameApp room={room} />
    </div>
  );
}

export default ClientApp;
