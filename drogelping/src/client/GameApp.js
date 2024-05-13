import { useEffect, useState, useRef } from "react";
import Ball from "../game/components/Ball";
import Field from "../game/components/Field";
import Paddle from "../game/components/Paddle"
import useKeyPress from "../game/hooks/useKeyPress";
import socket from './socket';
import './GameApp.css';

var isInRoom = false;
var isReady = false;
var isOpponentReady = false;

//function GameApp({ socket, room }) {
function GameApp({ room, isTextFieldFocused, name, mode}) {

  var game_mode = mode

  // Sends a confirmation to the server that a player has joined
  if (isInRoom === false) {
    socket.emit("join_room", [room, game_mode, name]);
    isInRoom = true;
  }
  
  const goalScoredRef = useRef(false); // Är mutable mellan renders!
  
  const [username, setUsername] = useState(name);
  const ballSize = 24;
  const [upP1, setUpP1] = useState("ArrowUp");
  const [downP1, setDownP1] = useState("ArrowDown");
  const [scoreP1, setScoreP1] = useState(0);
  const [scoreP2, setScoreP2] = useState(0);
  const [enter, setReady] = useState("Enter");
  
  const moveUpP1 = useKeyPress([upP1]);
  const moveDownP1 = useKeyPress([downP1]);
  
  const confirmReady = useKeyPress([enter]);

  // Gör så att man endast kan röra sin egen paddel med w och s efter att man angett vilken spelare man är
  // TODO: Gör att detta har att göra med vilken spelare man är
  useEffect(() => {
    if (game_mode === "spectate") {
      setUpP1("");
      setDownP1("");
    }
    
  }, [username]);
  
  
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
    
    if (confirmReady) {
      socket.emit("confirm_ready", [username]);
      isReady = true;
    }
    socket.emit("check_opponent_ready", [username]);
    
    const interval = setInterval(() => {
      const top = 0;
      const bottom = fieldHeight - paddleHeight;
      
      if (!isTextFieldFocused && isReady && isOpponentReady) { // Prevent movement while in chat
        if (moveUpP1 && !moveDownP1 && paddlePositionP1 > top) {
          setPaddlePositionP1(prevPos => Math.max(top, prevPos - 3));
          //socket.emit("update_position", {room : room, paddlePosition : [paddlePositionP1, paddlePositionP2]});
          socket.emit("sync_paddle", [username, paddlePositionP1, paddlePositionP2, room]);
          
        }
        else if (moveDownP1 && !moveUpP1 && paddlePositionP1 < bottom) {
          setPaddlePositionP1(prevPos => Math.min(bottom, prevPos + 3));
          //socket.emit("update_position", { room: room, paddlePosition: [paddlePositionP1, paddlePositionP2] });
          socket.emit("sync_paddle", [username, paddlePositionP1, paddlePositionP2, room]);

        }
      }

      setBallPosition((prevPos) => {
        var nextPosition = {
          top: prevPos.top,
          left: prevPos.left
        };

        if (isReady && isOpponentReady) {
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
            socket.emit("update_score", [scoreP2, scoreP1, room]);
            if (!goalScoredRef.current && game_mode !== "spectate") {
              socket.emit("send_message", {room: room, author: "Server", message: username + " scored a goal!"});
              goalScoredRef.current = true;
            }
          }
          
          else if (nextPosition.left + ballSize >= fieldWidth) {
            setScoreP1(scoreP1 + 1);
            console.log("Scored by player 1");
            socket.emit("update_score", [scoreP2, scoreP1]);
            if (!goalScoredRef.current && game_mode !== "spectate") {
              socket.emit("send_message", {room: room, author: "Server", message: username + " scored a goal!",});
              goalScoredRef.current = true;
            }
          }

          const newBallPosition = { top: fieldHeight / 2, left: fieldWidth / 2 - (ballSize / 2) };
          setBallPosition(newBallPosition);
        }
        if (game_mode !== "spectate") {
          if (state % 100 === 0) {
            socket.emit("sync_ball", [nextPosition, ballVelocity, room]);
          }
        }
        
        return nextPosition;
        
      });
      
    }, 10);
    return () => clearInterval(interval);
  }, [moveUpP1, moveDownP1, ballVelocity, paddlePositionP1, paddlePositionP2, ballPosition, isTextFieldFocused]);
  
  useEffect(() => {
    console.log("Use effect triggered.");
    
    socket.on("is_ready", (data) => {
      if (data) {
        isOpponentReady = true;
      }
      
    });

    socket.on("update_position", data => {
      if (game_mode !== "spectate") {
        //socket.to(`${data[3]}`).emit("sync_paddle", [data[1], data[2], () => ((data[0] === player1) ? "P1" : "P2")]);setPaddlePositionP2(data.paddlePosition[0]);
      }
    });

    socket.on("sync_ball", (data) => { 
      setBallPosition(data[0]);
      setBallVelocity(data[1]);
    });

    socket.on("sync_paddle", (data) => {
      if (game_mode === "spectate") {
        if (data[2] === "P1") {
          setPaddlePositionP1(data[0]);
          setPaddlePositionP2(data[1]);
        }
        else {
          setPaddlePositionP2(data[0]);
          setPaddlePositionP1(data[1]);
        }
      } else {
        setPaddlePositionP2(data[0]);
      }
    });

    socket.on("update_score", (data) => {
      setScoreP1(data[0]);
      setScoreP2(data[1]);
    })

    return () => {
        socket.off("update_position");
        socket.off("sync_ball");
        socket.off("sync_paddle");
        socket.off("sync_score");
        socket.off("is_ready");
    };
  }, [socket]);

  return (
    <>
      <h1>
        #{room}
      </h1>

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