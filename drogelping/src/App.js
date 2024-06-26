import React, { useState } from 'react';
import StartScreen from './StartScreen';
import ClientApp from './client/ClientApp';

var mode = ""

function App() {
    const [currentPage, setCurrentPage] = useState('start');
    const [name, setName] = useState('');
    const [lobbyID, setLobbyID] = useState('');
    const [lobbyProperties, setLobbyProperties] = useState('');

    const joinLobby = (name, lobbyID) => {
        setName(name);
        setLobbyID(lobbyID);
        setCurrentPage('game');
    }
    const createLobby = (lobbyProperties) => {
        setLobbyProperties(lobbyProperties);
        setCurrentPage('start'); // Dummy
        //setCurrentPage('create'); // TODO: IMPLEMENT
    }
    const spectateLobby = (name, lobbyID) => {
        setName(name);
        setLobbyID(lobbyID);
        mode = "spectate";
        setCurrentPage('game');
    }
    const navigateToLobby = () => {
        setCurrentPage('start');
    }

    return (
    <div>
        {currentPage === 'start' && 
            <StartScreen 
                onJoinClick={(name, lobbyID) => joinLobby(name, lobbyID)} 
                onCreateClick={(lobbyProperties) => createLobby(lobbyProperties)} 
                onSpectateClick={(name, lobbyID) => spectateLobby(name, lobbyID)} 
            />}
        {currentPage === 'game' && 
            <div>
                <ClientApp username={name} room={lobbyID} mode={mode} navigateToLobby={navigateToLobby} />
            </div>
        }
    </div>
  );
}

export default App;
