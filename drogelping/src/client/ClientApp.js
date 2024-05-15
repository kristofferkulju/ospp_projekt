import { useState } from 'react';
import Chat from './Chat';
import GameApp from './GameApp';
import socket from './socket';
import './ClientApp.css'

function ClientApp({ username, room, mode }) {
    const [isTextFieldFocused, setIsTextFieldFocused] = useState(false);
    return (
    <div className="App background">
        <Chat socket={socket} username={username} room={room} isTextFieldFocused={isTextFieldFocused} setIsTextFieldFocused={setIsTextFieldFocused}/>
        <GameApp room={room} isTextFieldFocused={isTextFieldFocused} name={username} mode = {mode} />
    </div>
  );
}

export default ClientApp;
