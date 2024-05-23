import { useState } from 'react';
import Exit from './Exit';
import Chat from './Chat';
import GameApp from './GameApp';
import socket from './socket';
import './ClientApp.css'

function ClientApp({ username, room, mode, navigateToLobby }) {
    const [isTextFieldFocused, setIsTextFieldFocused] = useState(false);
    return (
        <div class="container">
        <div class="Exit">
            <Exit navigateToLobby={navigateToLobby}/>
        </div>
        <div class="ThemeChange"></div>
        <div class="GameField">
          <div class="GameApp">
            <GameApp room={room} isTextFieldFocused={isTextFieldFocused} name={username} mode={mode}/>
          </div>
        </div>
        <div class="ChatApp">
          <div class="RoomName">
            #{room}
          </div>
          <div class="Chat">
            <Chat socket={socket} username={username} room={room} setIsTextFieldFocused={setIsTextFieldFocused}/>
          </div>
        </div>
      </div>
  );
}

export default ClientApp;
