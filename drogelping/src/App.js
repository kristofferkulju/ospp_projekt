import React, { useState } from 'react';
import StartScreen from './StartScreen';
import ClientApp from './client/ClientApp';
import Exit from './client/Exit';
import './App.css'
//import Spectate from "..."
//import Create from "..."
//import Join from "..."

var mode = ""

function App() {
    const [currentPage, setCurrentPage] = useState('start');
    const [name, setName] = useState('');
    const [lobbyID, setLobbyID] = useState('');
    const [lobbyProperties, setLobbyProperties] = useState('');

    const joinLobby = (name, lobbyID) => {
        setName(name);
        setLobbyID(lobbyID);
        setCurrentPage('demo');
    }
    const createLobby = (lobbyProperties) => {
        setLobbyProperties(lobbyProperties);
        setCurrentPage('start'); // Dummy
        //setCurrentPage('create'); // TODO: IMPLEMENT
    }
    const spectateLobby = (name, lobbyID) => {
        setName(name);
        setLobbyID(lobbyID);
        setCurrentPage('demo');
        mode = "spectate";
    }
    const demoGame = () => { /* TEMPORARY */
        setName("DEMO");
        setLobbyID("000");
        setCurrentPage('demo');
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
                onDemoClick={demoGame} /* TEMPORARY */
            />}
        {/* 
        {currentPage === 'joinGame' && <Join name={name} lobbyID={lobbyID} />}
        {currentPage === 'createLobby' && <Create lobbyProperties={lobbyProperties} />}
        {currentPage === 'spectateGame' && <Spectate name={name} lobbyID={lobbyID} />}
        */}
        {currentPage === 'demo' && 
            <div>
                <Exit navigateToLobby={navigateToLobby}/>
                <ClientApp username={name} room={lobbyID} mode={mode} />
            </div>
        }
    </div>
  );
}

export default App;
