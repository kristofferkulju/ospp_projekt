import React, { useState } from 'react';
import StartScreen from './StartScreen';
import ClientApp from './client/ClientApp';
//import Spectate from "..."
//import Create from "..."
//import Join from "..."

function App() {
    const [currentPage, setCurrentPage] = useState('start'); // 'start or 'none'
    const [name, setName] = useState('');
    const [lobbyID, setLobbyID] = useState('');
    const [lobbyProperties, setLobbyProperties] = useState('');

    const joinLobby = (name, lobbyID) => {
        setName(name);
        setLobbyID(lobbyID);
        setCurrentPage('gameplay');
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
        {currentPage === 'start' && 
            <StartScreen 
                onJoinClick={(name, lobbyID) => joinLobby(name, lobbyID)} 
                onCreateClick={(lobbyProperties) => createLobby(lobbyProperties)} 
                onSpectateClick={(name, lobbyID) => spectateLobby(name, lobbyID)} 
            />}
        {/* 
        {currentPage === 'joinGame' && <Join name={name} lobbyID={lobbyID} />}
        {currentPage === 'createLobby' && <Create lobbyProperties={lobbyProperties} />}
        {currentPage === 'spectateGame' && <Spectate name={name} lobbyID={lobbyID} />}
        */}
        {currentPage === 'gameplay' && <ClientApp username={name} room={lobbyID}/>}
    </div>
  );
}

export default App;
