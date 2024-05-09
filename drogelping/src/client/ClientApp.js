import './ChatApp'
import Chat from './Chat';
import GameApp from './GameApp';
import socket from './socket';

function ClientApp({ username, room }) {
    socket.emit("join_room", {room: `${room}`, author: `${username}`, message: "has joined the lobby"});
    return (
    <div className="App">
        <Chat socket={socket} username={username} room={room} />
        {/*<GameApp room={room} /> */}
        <GameApp room={room} />
    </div>
  );
}

export default ClientApp;
