import React, { useState } from 'react';
import StartScreen from './StartScreen';
import GameApp from './client/GameApp';
import ChatApp from './client/ChatApp';
//import Spectate from "..."
//import Create from "..."
//import Join from "..."

function App() {
    const [currentPage, setCurrentPage] = useState('start'); // 'start or 'none'
    const [name, setName] = useState('');
    const [lobbyID, setLobbyID] = useState('');
    const [lobbyProperties, setLobbyProperties] = useState('');
    
    // Temporary functions, TODO: remove upon release
    const launch_chat = () => { setCurrentPage('chat'); }
    const launch_game = () => { setCurrentPage('game'); }
    // ----------------------------------------

    const joinLobby = (name, lobbyID) => {
        setName(name);
        setLobbyID(lobbyID);
        setCurrentPage('join');
    }
    const createLobby = (lobbyProperties) => {
        setLobbyProperties(lobbyProperties);
        setCurrentPage('create');
    }
    const spectateLobby = (name, lobbyID) => {
        setName(name);
        setLobbyID(lobbyID);
        setCurrentPage('spectate');
    }
    return (
    <div>
        {currentPage === 'start' && <StartScreen onJoinClick={(name, lobbyID) => joinLobby(name, lobbyID)} onCreateClick={(lobbyProperties) => createLobby(lobbyProperties)} onSpectateClick={(name, lobbyID) => spectateLobby(name, lobbyID)} onChatClick={launch_chat} onGameClick={launch_game}/>}
        {/* 
        {currentPage === 'joinGame' && <Join name={name} lobbyID={lobbyID} />}
        {currentPage === 'createLobby' && <Create lobbyProperties={lobbyProperties} />}
        {currentPage === 'spectateGame' && <Spectate name={name} lobbyID={lobbyID} />}
        */}

        {/* Temporary pages, TODO: remove upon release*/}
        {currentPage === 'game' && <GameApp name={name} lobbyID={lobbyID} />}
        {currentPage === 'chat' && <ChatApp />}
        {/* ----------------------------------- */}
    </div>
  );
}

export default App;
