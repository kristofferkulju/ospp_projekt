
import './ChatApp.css';
import io from 'socket.io-client';
import { useState } from "react";
import Chat from './Chat';
import App_game from './GameApp';

const socket = io.connect("http://localhost:2001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  }


  return (
    <div className="App">
      {!showChat ? (
      <div className="joinChatContainer">
      <h3> Join A Chat</h3>
      <input
        onKeyDown={(event) => { 
        if (event.key === "Enter") { 
            joinRoom();} 
        }}  
        type="text" 
        placeholder="John.." 
        onChange={(event) => 
        {setUsername(event.target.value)
        }}
      />

      <input 
        type="text" 
        placeholder="Room ID.." 
        onChange={(event) => 
          {setRoom(event.target.value)
        }}
        onKeyDown={(event) => { 
          if (event.key === "Enter") { 
            joinRoom();} 
          }} 
        
      />

      <button onClick={joinRoom}> Join A Room</button>
      </div> 
      )
    : (
      <Chat socket ={socket} username = {username} room = {room}/>
    )}
    <App_game room = {room}/> 
    </div>
  );
}

export default App;

