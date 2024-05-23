import React, { useState, useRef, useEffect } from 'react';
import './style.css';

const StartScreen = ({ onJoinClick, onCreateClick, onSpectateClick, onDemoClick }) => {
  const [activeTab, setActiveTab] = useState('join');
  const [name, setName] = useState('');
  const [lobbyID, setLobbyID] = useState('');
  const [allowSpectators, setAllowSpectators] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);
  const errorMsg = 'Please input a valid NAME and ID';

  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    }
    function handleEscKey(event) {
        if (event.key === 'Escape') {
          setShowSettings(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscKey);
    };
  }, [settingsRef]);

  const toggleTab = (tabName) => {
    setErrorMessage('');
    setActiveTab(tabName);
    if (tabName === 'settings') {
        setShowSettings(true);
    } else {
        setShowSettings(false);
    }
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
        setErrorMessage(errorMsg);
    }
  };

  const joinLobby = () => {
    if (name && lobbyID) { // check if lobby exists too?
        onJoinClick(name, lobbyID);
    }
    else {
        setErrorMessage(errorMsg);
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
        setErrorMessage('Not yet implemented');
        //onJoinClick(name, lobbyID); // Join directly after creating room?
    }
    else {
        setErrorMessage(errorMsg);
    }
  };
  const demoGame = () => {
    onDemoClick(name, lobbyID);
  };
  const toggleSettingsPopup = () => {
    setShowSettings(!showSettings); // Toggle the visibility of the settings pop-up
  };

  return (
    <div className="start_screen_container">
        <div className="tabs">
            <div className={`tab join ${activeTab === 'join' ? 'active' : ''}`} onClick={() => toggleTab('join')}>Join Lobby</div>
            <div className={`tab create ${activeTab === 'create' ? 'active' : ''}`} onClick={() => toggleTab('create')}>Create Lobby</div>
            <div className={`tab settings ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setShowSettings(true)} hidden>Lobby Settings</div>
        </div>
        <div className="content join" style={{ display: activeTab === 'join' ? 'block' : 'none', height: '200px', overflow: 'auto' }}>
            <div className="input-container">
                <input type="text" placeholder="NAME" name="name" value={name} onChange={handleInputChange} className="name-input" maxLength={9}/>
                <span className="separator">#</span>
                <input type="text" placeholder="ID" name="lobbyID" value={lobbyID} onChange={handleInputChange} className="lobbyID-input" maxLength={4}/>
            </div>
            {/*<button className="button cyan" onClick={spectateLobby}>Spectate</button>*/}
            <button className="button green" onClick={joinLobby}>Enter</button>
            {/*<button className="button red" onClick={demoGame}>DEMO</button>*/} {/* TEMPORARY */}
            {errorMessage && <p style={{ color : 'red' }}>{errorMessage}</p>}
        </div>
        <div className="content create" style={{ display: activeTab === 'create' ? 'block' : 'none', height: '200px', overflow: 'auto' }}>
            <div className="input-container">
                <input type="text" placeholder="NAME" name="name" value={name} onChange={handleInputChange} className="name-input" maxLength={9}/>
                <span className="separator">#</span>
                <input type="text" placeholder="ID" name="lobbyID" value={lobbyID} onChange={handleInputChange} className="lobbyID-input" maxLength={4}/>
            </div>
            <button className="button green" onClick={createLobby}>Create</button>
            <button className="button purple" onClick={toggleSettingsPopup}>Lobby Settings</button>
            {errorMessage && <p style={{ color : 'red' }}>{errorMessage}</p>}
        </div>
        {showSettings && (
        <div className="settings-popup" ref={settingsRef}>
            <div className="settings-popup-container">
                <div className="lobby-settings-header">Lobby Settings</div>
                <div className="settingsText">Allow Spectators</div>
                <input type="checkbox" id="allowSpectators" checked={allowSpectators} onChange={() => setAllowSpectators(!allowSpectators)} className="allowSpectators" />
                <label htmlFor="allowSpectators" className="toggleLabel"></label>
                <div className="settingsText">Max Players</div>
                
                <input type="number" placeholder="2" value={maxPlayers} 
                    onChange={handleMaxPlayersInputChange} onBlur={handleMaxPlayersInputBlur} className="maxplayers" 
                />
            </div>
            <button className="button light-grey" onClick={() => toggleTab('create')}>Back</button>
        </div> 
        )}
    </div>
  );
};

export default StartScreen;