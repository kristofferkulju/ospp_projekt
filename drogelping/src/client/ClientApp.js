import { useState } from 'react';
import Chat from './Chat';
import GameApp from './GameApp';
import socket from './socket';
import './ClientApp.css'

function ClientApp({ username, room }) {
    const [isTextFieldFocused, setIsTextFieldFocused] = useState(false);
    if (username && room) {
        socket.emit("join_room", room);
    }
    return (
    <div className="App background">
        <Chat socket={socket} username={username} room={room} isTextFieldFocused={isTextFieldFocused} setIsTextFieldFocused={setIsTextFieldFocused}/>
        <GameApp room={room} isTextFieldFocused={isTextFieldFocused} />
    </div>
  );
}

export default ClientApp;
