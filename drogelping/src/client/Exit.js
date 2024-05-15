import React from 'react';

function Exit({ navigateToLobby }) {
    const exitStyle = {
        position: 'fixed',
        zIndex: '999', // On top of other elements

        top: '10px',
        left: '10px',
        width: '150px',
        height: '100px',
        
        backgroundImage: 'url(/drogelping.png)',
        backgroundSize: 'cover',
        cursor: 'pointer',

        color: '#ff7f00',
        fontSize: '15pt',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center'
    };
    return (
        <button style={exitStyle} onClick={navigateToLobby}>BACK TO LOBBY</button>
    );
}

export default Exit;
