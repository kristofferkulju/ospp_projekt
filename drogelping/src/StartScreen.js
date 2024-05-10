import React, { useState } from 'react';
import './style.css';

const StartScreen = ({onJoinClick, onCreateClick, onSpectateClick, onDemoClick}) => {
  const [activeTab, setActiveTab] = useState('join');
  const [name, setName] = useState('');
  const [lobbyID, setLobbyID] = useState('');
  const [allowSpectators, setAllowSpectators] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleTab = (tabName) => {
    setErrorMessage('');
    setActiveTab(tabName);
  };

  const handleInputChange = (event) => {
    setErrorMessage('');
    const { name, value } = event.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'lobbyID') {
      setLobbyID(value);
    }
  };

  const handleMaxPlayersInputChange = (e) => {
    const value = parseInt(e.target.value, 10);

    if (!isNaN(value)) {
      if (value < 2) {
        setMaxPlayers(2);
      } else if (value > 8) {
        setMaxPlayers(8);
      } else {
        setMaxPlayers(value);
      }
    }
  };

  const handleMaxPlayersInputBlur = (e) => {
    let value = maxPlayers;

    if (isNaN(value) || value < 2) {
      value = 2;
    } else if (value > 8) {
      value = 8;
    }
    setMaxPlayers(value);
  }

  const spectateLobby = () => {
    if (name && lobbyID) { // check if lobby exists too?
        onSpectateClick(name, lobbyID);
    }
    else {
        setErrorMessage('Please input a valid name and Lobby ID');
    }
  };

  const joinLobby = () => {
    if (name && lobbyID) { // check if lobby exists too?
        onJoinClick(name, lobbyID);
    }
    else {
        setErrorMessage('Please input a valid name and Lobby ID');
    }
  };

  const createLobby = () => {
    const lobbyProperties = {
      creator: name,
      lobbyID: lobbyID,
      allowSpectators: allowSpectators,
      maxPlayers: maxPlayers,
    };
    if (name && lobbyID) { // check if lobby exists too?
        onCreateClick(lobbyProperties);
        //onJoinClick(name, lobbyID); // Join directly after creating room?
    }
    else {
        setErrorMessage('Please input a valid name and Lobby ID');
    }
  };
  const demoGame = () => {
    onDemoClick(name, lobbyID);
  };

  return (
    <div className="container">
        <div className="tabs">
            <div className={`tab join ${activeTab === 'join' ? 'active' : ''}`} onClick={() => toggleTab('join')}>Join Lobby</div>
            <div className={`tab create ${activeTab === 'create' ? 'active' : ''}`} onClick={() => toggleTab('create')}>Create Lobby</div>
            <div className={`tab settings ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => toggleTab('settings')} hidden>Lobby Settings</div>
        </div>
        <div className={`content join ${activeTab === 'join' ? 'active' : ''}`}>
            <div className="input-container">
                <input type="text" placeholder="Enter Name" name="name" value={name} onChange={handleInputChange} className="name-input" />
            </div>
            <div className="input-container">
                <input type="text" placeholder="Enter Lobby ID" name="lobbyID" value={lobbyID} onChange={handleInputChange} className="lobbyID-input" />
            </div>
            <button className="button cyan" onClick={spectateLobby}>Spectate</button>
            <button className="button green" onClick={joinLobby}>Enter</button>
            {errorMessage && <p style={{ color : 'red' }}>{errorMessage}</p>}
        </div>
        <div className={`content create ${activeTab === 'create' ? 'active' : ''}`}>
            <div className="input-container">
                <input type="text" placeholder="Enter Name" name="name" value={name} onChange={handleInputChange} className="name-input" />
            </div>
            <div className="input-container">
                <input type="text" placeholder="Enter Lobby ID" name="lobbyID" value={lobbyID} onChange={handleInputChange} className="lobbyID-input" />
            </div>
            <button className="button purple" onClick={() => toggleTab('settings')}>Lobby Settings</button>
            <button className="button green" onClick={createLobby}>Create</button>
            {errorMessage && <p style={{ color : 'red' }}>{errorMessage}</p>}
        </div>
        <div className={`content settings ${activeTab === 'settings' ? 'active' : ''}` }>
            <div className="input-container">
                <div className="settingsText">Allow Spectators</div>
                <input type="checkbox" id="allowSpectators" checked={allowSpectators} onChange={() => setAllowSpectators(!allowSpectators)} className="allowSpectators" />
                <label htmlFor="allowSpectators" className="toggleLabel"></label>
                <div className="settingsText">Max Players</div>
                
                <input type="number" placeholder="2" value={maxPlayers} 
                    onChange={handleMaxPlayersInputChange} onBlur={handleMaxPlayersInputBlur} className="maxplayers" 
                />
            </div>
            <button className="button light-grey" onClick={() => toggleTab('create')}>Back</button>
            {/* -------------------------------------- */}
        </div> 
    </div>
  );
};

export default StartScreen;