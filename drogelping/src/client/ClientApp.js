import './ChatApp'
import Chat from './Chat';
import GameApp from './GameApp';
import socket from './socket';

function ClientApp({ username, room }) {
    socket.emit("join_room", room);
    return (
    <div className="App">
        <Chat socket={socket} username={username} room={room} />
        <GameApp room={room} /> 
        {/*<GameApp room={room} socket={socket} /> */} 
    </div>
  );
}

export default ClientApp;
