import { useEffect, useState, useRef } from "react";
import Ball from "../game/components/Ball";
import Field from "../game/components/Field";
import Paddle from "../game/components/Paddle"
import useKeyPress from "../game/hooks/useKeyPress";
import socket from './socket';
import GameStatus from './GameStatus';
import './GameApp.css';

let lock = false;
let gameActive = false;

function GameApp({ room, isTextFieldFocused, name, mode }) {
  const [playerStatus, setPlayerStatus] = useState({
    name: "none",
    hasJoined: false,
    isReady: false,
    side: "none"
  });
  const [opponentStatus, setOpponentStatus] = useState({
    name: "none",
    hasJoined: false,
    isReady: false,
    side: "none"
  });
  const handleToggleJoinPlayer = () => {
    setPlayerStatus({ ...playerStatus, hasJoined: !playerStatus.hasJoined, name: name });
  };
  const handleToggleReadyPlayer = () => {
    setPlayerStatus({ ...playerStatus, isReady: !playerStatus.isReady });
    lock = playerStatus.isReady;
  };

  function startCountdown(seconds, callback) {
    let count = seconds;

    function countdown() {
      if (count >= 0) {
        document.getElementById("message-container").innerText = count;
        setTimeout(countdown, 1000);
        count--;
      } else { 
        document.getElementById("message-container").innerText = "";
        callback(); 
      }
    }
    countdown();
  }

  // Sends a confirmation to the server that a player has joined
  if (!playerStatus.hasJoined) {
    socket.emit("join_room", {room: room, name: name, mode: mode});
    handleToggleJoinPlayer(); // TODO: Toggle back to false if player leaves
  }
  
  const goalScoredRef = useRef(false); // Är mutable mellan renders!
  
  const ballSize = 24;
  const [upPlayer, setUpPlayer] = useState("ArrowUp");
  const [downPlayer, setDownPlayer] = useState("ArrowDown");
  const [upOpponent, setUpOpponent] = useState("w");
  const [downOpponent, setDownOpponent] = useState("s");
  const [scorePlayer, setScorePlayer] = useState(0);
  const [scoreOpponent, setScoreOpponent] = useState(0);
  
  const moveUpPlayer = useKeyPress([upPlayer]);
  const moveDownPlayer = useKeyPress([downPlayer]);
  const moveUpOpponent = useKeyPress([upOpponent]);
  const moveDownOpponent = useKeyPress([downOpponent]);

  // Spectators are not able to move any paddles
  useEffect(() => {
    if (mode === "spectate") {
      setUpPlayer("");
      setDownPlayer("");
    }
    
  }, [mode]);
  
  const fieldWidth = 1000;
  const fieldHeight = 500;
  const paddleWidth = 20;
  const paddleHeight = 100;
  const [paddlePositionLeft, setPaddlePositionLeft] = useState(fieldHeight / 2 - paddleHeight / 2);
  const [paddlePositionRight, setPaddlePositionRight] = useState(fieldHeight / 2 - paddleHeight / 2);
  const [paddlePositionPlayer, setPaddlePositionPlayer] = useState(fieldHeight / 2 - paddleHeight / 2);
  const [paddlePositionOpponent, setPaddlePositionOpponent] = useState(fieldHeight / 2 - paddleHeight / 2);
  const [ballPosition, setBallPosition] = useState({ top: fieldHeight / 2, left: fieldWidth / 2 - 10 });
  const [ballVelocity, setBallVelocity] = useState({ x: 2, y: 2 });
  const [state, setState] = useState(0);
  
  useEffect(() => {
    setState(state + 1);
    goalScoredRef.current = false;
    
    if (playerStatus.isReady && !lock) {
      socket.emit("confirm_ready", {room: room, name: name, ready: true});
      lock = true;
      socket.emit("ready_waiting", {room: room, name: name});
    }
    else if (!playerStatus.isReady && lock) {
      socket.emit("confirm_ready", {room: room, name: name, ready: false});
      lock = false;
    }
    
    const interval = setInterval(() => {
      const top = 0;
      const bottom = fieldHeight - paddleHeight;
      if (!playerStatus.isReady || !opponentStatus.isReady){
        gameActive = false;
      }
      
      if (!isTextFieldFocused && playerStatus.isReady && gameActive) { // Prevent movement while in chat
        if (moveUpPlayer && !moveDownPlayer && paddlePositionPlayer > top) {
          const newPos = prevPos => Math.max(top, prevPos - 3);
          if (playerStatus.side === "left") {
            setPaddlePositionPlayer(newPos);
            socket.emit("left_paddle", {name: name, paddlePositionPlayer: paddlePositionPlayer, room: room});
          } else if (playerStatus.side === "right") {
            setPaddlePositionOpponent(newPos);
            socket.emit("right_paddle", {name: name, paddlePositionOpponent: paddlePositionOpponent, room: room});
          }
        }
        else if (moveDownPlayer && !moveUpPlayer && paddlePositionPlayer < bottom) {
          const newPos = prevPos => Math.min(bottom, prevPos + 3);
          if (playerStatus.side === "left") {
            setPaddlePositionPlayer(newPos);
            socket.emit("left_paddle", {name: name, paddlePositionPlayer: paddlePositionPlayer, room: room});
          } else if (playerStatus.side === "right") {
            setPaddlePositionOpponent(newPos);
            socket.emit("right_paddle", {name: name, paddlePositionOpponent: paddlePositionOpponent, room: room});
          }
        }
      }

      setBallPosition((prevPos) => {
        var nextPosition = {
          top: prevPos.top,
          left: prevPos.left
        };

        if (playerStatus.isReady && gameActive) {
          nextPosition.top += ballVelocity.y;
          nextPosition.left += ballVelocity.x;
        }

        //Ball hits roof or floor
        if (nextPosition.top <= 0 || nextPosition.top + ballSize >= fieldHeight) {
          const newBallVelocity = { x: ballVelocity.x, y: -ballVelocity.y };
          setBallVelocity(newBallVelocity);
        }
        
        //Ball hits side of paddle
        if (nextPosition.left <= 15 + paddleWidth && nextPosition.top >= paddlePositionPlayer && nextPosition.top <= paddlePositionPlayer + paddleHeight) {
          if (ballVelocity.x < 0) {
            const newBallVelocity = { x: -ballVelocity.x, y: ballVelocity.y };
            setBallVelocity(newBallVelocity);
          }
        }

        if (nextPosition.left + ballSize >= fieldWidth - 15 - paddleWidth && nextPosition.top >= paddlePositionOpponent && nextPosition.top <= paddlePositionOpponent + paddleHeight) {
          if (ballVelocity.x > 0) {
            const newBallVelocity = { x: -ballVelocity.x, y: ballVelocity.y };
            setBallVelocity(newBallVelocity);
          }
        }
        
        if (nextPosition.left <= 0 || nextPosition.left + ballSize >= fieldWidth) {
          if (nextPosition.left <= 0) { // Right player gains a point
            setScoreOpponent(scoreOpponent+1);
            if (playerStatus.side === "right" && !goalScoredRef.current) {
              socket.emit("score", {scoring_player: name, room: room});
            }
            goalScoredRef.current = true
        }
          
          else if (nextPosition.left + ballSize >= fieldWidth) { // Left player gains a point
            setScorePlayer(scorePlayer+1);
            if (playerStatus.side === "left" && !goalScoredRef.current) {
              socket.emit("score", {scoring_player: name, room: room});
            }
            goalScoredRef.current = true
        }
          const newBallPosition = { top: fieldHeight / 2, left: fieldWidth / 2 - (ballSize / 2) };
          setBallPosition(newBallPosition);
        }
        if (mode !== "spectate") {
          if (state % 500 === 0) {
            socket.emit("sync_ball", {nextPosition: nextPosition, ballVelocity: ballVelocity, room: room});
          }
        }
        return nextPosition;
      });
      
    }, 10);
    return () => clearInterval(interval);
  }, [moveUpPlayer, moveDownPlayer, ballVelocity, paddlePositionPlayer, paddlePositionOpponent, ballPosition, isTextFieldFocused]);
  
  useEffect(() => {
    console.log("Use effect triggered.");
    socket.on("both_joined", (data) => {
        opponentStatus.hasJoined = true;
        if (name === data.players_0) {
            opponentStatus.name = data.players_1;
        } else if (name === data.players_1) {
            opponentStatus.name = data.players_0;
        }
    });
    socket.on("opponent_joined", (data) => {
        setOpponentStatus({ ...opponentStatus, isReady: data.ready });
    });
    socket.on("set_side", (data) => {
        const playerSide = data.leftside === true ? "left" : (data.leftside === false ? "right" : "none");
        const opponentSide = data.leftside === false ? "left" : (data.leftside === true ? "right" : "none");
        setPlayerStatus({ ...playerStatus, side: playerSide });
        setOpponentStatus({ ...opponentStatus, side: opponentSide });
    });
    socket.on("countdown", () => {
        gameActive = false;
        startCountdown(3, () => {
            gameActive = true;
        });
    });

    socket.on("sync_ball", (data) => { 
      setBallPosition(data.nextPosition);
      setBallVelocity(data.ballVelocity);
    });

    socket.on("left_paddle", (data) => {
      setPaddlePositionPlayer(data.paddlePositionPlayer);
    });
    
    socket.on("right_paddle", (data) => {
      setPaddlePositionOpponent(data.paddlePositionOpponent);
    });

    return () => {
        socket.off("both_joined");
        socket.off("opponent_joined");
        socket.off("set_side");
        socket.off("countdown");
        socket.off("update_position");
        socket.off("sync_ball");
        socket.off("sync_paddle");
        socket.off("sync_score");
    };
  }, [mode, name, opponentStatus]);

  return (
    <>
      <GameStatus playerStatus={playerStatus} opponentStatus={opponentStatus} handleToggleReadyPlayer={handleToggleReadyPlayer}/>
      <div className="field">
      <Field width={fieldWidth} height={fieldHeight} scorePlayer={scorePlayer} scoreOpponent={scoreOpponent}>
        <Paddle isLeftPaddle={true} width={paddleWidth} height={paddleHeight} top={paddlePositionPlayer} isPlayer={playerStatus.side === "left"}></Paddle>
        <Paddle isLeftPaddle={false} width={paddleWidth} height={paddleHeight} top={paddlePositionOpponent} isPlayer={playerStatus.side === "right"}></Paddle>
        <Ball top={ballPosition.top} left={ballPosition.left} ballSize={ballSize}> </Ball>
      </Field>
      </div>
    </>
  );
}

export default GameApp;