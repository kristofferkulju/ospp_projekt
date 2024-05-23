import React from 'react';
import './GameStatus.css';

function GameStatus({playerStatus, opponentStatus, handleToggleReadyPlayer}) {
    return (
      <div className="game-container">
        <div class="left">
        {/* Player 1 Status Indicator */}
        <div className="player-status">
          {playerStatus.side === "left" && (
            <>
              <div className="YouText">{playerStatus.name}</div>
              <div className={`status-box ${playerStatus.hasJoined ? 'joined' : 'not-joined'}`}>
                {playerStatus.hasJoined ? 'Joined' : 'Not Joined'}
              </div>
              <div className={`status-box ${playerStatus.isReady ? 'ready' : 'not-ready'}`}>
                {playerStatus.isReady ? 'Ready' : 'Not Ready'}
              </div>
            </>
          )}
        </div>
        <div className="opponent-status">
          {opponentStatus.side === "left" && (
            <>
              <div className="OpponentText">{opponentStatus.name}</div>
              <div className={`status-box ${opponentStatus.hasJoined ? 'joined' : 'not-joined'}`}>
                {opponentStatus.hasJoined ? 'Joined' : 'Not Joined'}
              </div>
              <div className={`status-box ${opponentStatus.isReady ? 'ready' : 'not-ready'}`}>
                {opponentStatus.isReady ? 'Ready' : 'Not Ready'}
              </div>
            </>
          )}
        </div>
        </div>
        <button onClick={handleToggleReadyPlayer}>{playerStatus.isReady ? 'Unready' : 'Ready'}</button>
        <div class="right">
        {/* Player 2 Status Indicator */}
        <div className="player-status">
          {playerStatus.side === "right" && (
            <>
              <div className="YouText">{playerStatus.name}</div>
              <div className={`status-box ${playerStatus.hasJoined ? 'joined' : 'not-joined'}`}>
                {playerStatus.hasJoined ? 'Joined' : 'Not Joined'}
              </div>
              <div className={`status-box ${playerStatus.isReady ? 'ready' : 'not-ready'}`}>
                {playerStatus.isReady ? 'Ready' : 'Not Ready'}
              </div>
            </>
          )}
          </div>
          <div className="opponent-status">
          {opponentStatus.side === "right" && (
            <>
              <div className="OpponentText">{opponentStatus.name}</div>
              <div className={`status-box ${opponentStatus.hasJoined ? 'joined' : 'not-joined'}`}>
                {opponentStatus.hasJoined ? 'Joined' : 'Not Joined'}
              </div>
              <div className={`status-box ${opponentStatus.isReady ? 'ready' : 'not-ready'}`}>
                {opponentStatus.isReady ? 'Ready' : 'Not Ready'}
              </div>
            </>
          )}
        </div>
      </div>
      </div>
    );
  }

export default GameStatus;
