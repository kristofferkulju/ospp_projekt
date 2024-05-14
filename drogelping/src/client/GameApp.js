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

function GameApp({ room, isTextFieldFocused, name, mode}) {

  const [playerStatus, setPlayerStatus] = useState({
    hasJoined: false,
    isReady: false
  });
  const [opponentStatus, setOpponentStatus] = useState({
    hasJoined: false,
    isReady: false
  });
  const handleToggleJoinPlayer = () => {
    setPlayerStatus({ ...playerStatus, hasJoined: !playerStatus.hasJoined });
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
  const [upP1, setUpP1] = useState("ArrowUp");
  const [downP1, setDownP1] = useState("ArrowDown");
  const [scoreP1, setScoreP1] = useState(0);
  const [scoreP2, setScoreP2] = useState(0);
  
  const moveUpP1 = useKeyPress([upP1]);
  const moveDownP1 = useKeyPress([downP1]);
  

  // Gör så att man endast kan röra sin egen paddel med w och s efter att man angett vilken spelare man är
  // TODO: Gör att detta har att göra med vilken spelare man är
  useEffect(() => {
    if (mode === "spectate") {
      setUpP1("");
      setDownP1("");
    }
    
  }, [mode]);
  
  
  const fieldWidth = 1000;
  const fieldHeight = 500;
  const paddleWidth = 20;
  const paddleHeight = 100;
  
  const [paddlePositionP1, setPaddlePositionP1] = useState(fieldHeight / 2 - paddleHeight / 2);
  const [paddlePositionP2, setPaddlePositionP2] = useState(fieldHeight / 2 - paddleHeight / 2);
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
      
      if (!isTextFieldFocused && playerStatus.isReady && gameActive) { // Prevent movement while in chat
        if (moveUpP1 && !moveDownP1 && paddlePositionP1 > top) {
          setPaddlePositionP1(prevPos => Math.max(top, prevPos - 3));
          //socket.emit("update_position", {room : room, paddlePosition : [paddlePositionP1, paddlePositionP2]});
          socket.emit("sync_paddle", {name: name, paddlePositionP1: paddlePositionP1, paddlePositionP2: paddlePositionP2, room: room});
          
        }
        else if (moveDownP1 && !moveUpP1 && paddlePositionP1 < bottom) {
          setPaddlePositionP1(prevPos => Math.min(bottom, prevPos + 3));
          //socket.emit("update_position", { room: room, paddlePosition: [paddlePositionP1, paddlePositionP2] });
          socket.emit("sync_paddle", {name: name, paddlePositionP1: paddlePositionP1, paddlePositionP2: paddlePositionP2, room: room});

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
        else {/* do nothing*/}

        //TODO: Namnge konstanter något vettigt
        //Om bollen träffar taket eller golvet
        if (nextPosition.top <= 0 || nextPosition.top + ballSize >= fieldHeight) {
          const newBallVelocity = { x: ballVelocity.x, y: -ballVelocity.y };
          setBallVelocity(newBallVelocity);
        }
        
        //Om bollen träffar sidan av paddeln
        if (nextPosition.left <= 15 + paddleWidth && nextPosition.top >= paddlePositionP1 && nextPosition.top <= paddlePositionP1 + paddleHeight) {
          const newBallVelocity = { x: -ballVelocity.x, y: ballVelocity.y };
          setBallVelocity(newBallVelocity);
        }

        if (nextPosition.left + ballSize >= fieldWidth - 15 - paddleWidth && nextPosition.top >= paddlePositionP2 && nextPosition.top <= paddlePositionP2 + paddleHeight) {
          const newBallVelocity = { x: -ballVelocity.x, y: ballVelocity.y };
          setBallVelocity(newBallVelocity);
        }
        
        if (nextPosition.left <= 0 || nextPosition.left + ballSize >= fieldWidth) {
          if (nextPosition.left <= 0) {
            setScoreP2(scoreP2 + 1);
            console.log("Scored by player 2");
            socket.emit("update_score", {scoreP1: scoreP1, scoreP2: scoreP2, room: room});
            if (!goalScoredRef.current && mode !== "spectate") {
              socket.emit("send_message", {author: "Server", room: room, message: name + " scored a goal!"});
              goalScoredRef.current = true;
            }
          }
          
          else if (nextPosition.left + ballSize >= fieldWidth) {
            setScoreP1(scoreP1 + 1);
            console.log("Scored by player 1");
            socket.emit("update_score", {scoreP1: scoreP1, scoreP2: scoreP2, room: room});
            if (!goalScoredRef.current && mode !== "spectate") {
              socket.emit("send_message", {author: "Server", room: room, message: name + " scored a goal!",});
              goalScoredRef.current = true;
            }
          }

          const newBallPosition = { top: fieldHeight / 2, left: fieldWidth / 2 - (ballSize / 2) };
          setBallPosition(newBallPosition);
        }
        if (mode !== "spectate") {
          if (state % 100 === 0) {
            socket.emit("sync_ball", {nextPosition: nextPosition, ballVelocity: ballVelocity, room: room});
          }
        }
        
        return nextPosition;
        
      });
      
    }, 10);
    return () => clearInterval(interval);
  }, [moveUpP1, moveDownP1, ballVelocity, paddlePositionP1, paddlePositionP2, ballPosition, isTextFieldFocused]);
  
  useEffect(() => {
    console.log("Use effect triggered.");
    socket.on("both_joined", () => {
        opponentStatus.hasJoined = true;
    });
    socket.on("opponent_joined", (data) => {
        setOpponentStatus({ ...opponentStatus, isReady: data.ready });
    });
    socket.on("countdown", (data) => {
        startCountdown(3, () => {
            socket.emit("countdown_complete", {name: name, room: data.room});
            gameActive = true;
        });
    });

    socket.on("update_position", () => {
      if (mode !== "spectate") {
        //socket.to(`${data[3]}`).emit("sync_paddle", [data[1], data[2], () => ((data[0] === player1) ? "P1" : "P2")]);setPaddlePositionP2(data.paddlePosition[0]);
      }
    });

    socket.on("sync_ball", (data) => { 
      setBallPosition(data.nextPosition);
      setBallVelocity(data.ballVelocity);
    });

    socket.on("sync_paddle", (data) => {
      if (mode === "spectate") {
        if (data.player === "P1") {
          setPaddlePositionP1(data.paddlePositionP1); // 0
          setPaddlePositionP2(data.paddlePositionP2); // 1
        }
        else if (data.player === "P2") {
          setPaddlePositionP2(data.paddlePositionP1); // 0
          setPaddlePositionP1(data.paddlePositionP2); // 1
        }
      } else {
        setPaddlePositionP2(data.paddlePositionP1);
      }
    });

    socket.on("sync_score", (data) => {
      setScoreP1(data.scoreP1);
      setScoreP2(data.scoreP2);
    })

    return () => {
        socket.off("both_joined");
        socket.off("opponent_joined");
        socket.off("countdown");
        socket.off("update_position");
        socket.off("sync_ball");
        socket.off("sync_paddle");
        socket.off("sync_score");
    };
  }, [mode, name, opponentStatus]);

  return (
    <>
      <h1>
        #{room}
      </h1>
      <div id="message-container">
        <div class="innerText">
            <button onClick={handleToggleReadyPlayer}>{playerStatus.isReady ? 'Unready' : 'Ready'}</button>
        </div>
        <GameStatus playerStatus={playerStatus} opponentStatus={opponentStatus}/>
      </div>

      <div className="field">
        <Field width={fieldWidth} height={fieldHeight} scoreP1 = {scoreP1} scoreP2 = {scoreP2}>
          <Paddle width={paddleWidth} left={15} top={paddlePositionP1}></Paddle>
          <Paddle width={paddleWidth} left={fieldWidth - 15 - paddleWidth} top={paddlePositionP2}></Paddle>
          <Ball top={ballPosition.top} left={ballPosition.left} ballSize={ballSize}> </Ball>
        </Field>
      </div>
    </>
  );
}

export default GameApp;