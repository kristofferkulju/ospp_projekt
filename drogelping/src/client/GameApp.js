import { useEffect, useState } from "react";
import Ball from "../game/components/Ball";
import Field from "../game/components/Field";
import Paddle from "../game/components/Paddle"
import useScreenSize from "../game/hooks/useScreenSize";
import useKeyPress from "../game/hooks/useKeyPress";
import './GameApp.css';
import io from 'socket.io-client';


const socket = io.connect("http://localhost:2001");

socket.on("connect", () => {
  console.log("Connected to server");
});
socket.on("connect_error", (error) => {
  console.error("Knas", error);
});

function App_game() {

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(123);
  const [showGame, setShowGame] = useState(false);

  const ballSize = 24;

  const joinRoom = () => {
    if (username && room) {
      socket.emit("join_room", room);
      setShowGame(true);
    }
  }

  const [upP1, setUpP1] = useState("w");
  const [downP1, setDownP1] = useState("s");
  const [upP2, setUpP2] = useState("ArrowUp");
  const [downP2, setDownP2] = useState("ArrowDown");
  const [scoreP1, setScoreP1] = useState(0);
  const [scoreP2, setScoreP2] = useState(0);

  const moveUpP1 = useKeyPress([upP1]);
  const moveDownP1 = useKeyPress([downP1]);
  const moveUpP2 = useKeyPress([upP2]);
  const moveDownP2 = useKeyPress([downP2]);


  // Gör så att man endast kan röra sin egen paddel med w och s efter att man angett vilken spelare man är
  // TODO: Gör att detta har att göra med vilken spelare man är
  useEffect(() => {
    if (username === "1") {
      setUpP1("w");
      setDownP1("s");
      setUpP2("");
      setDownP2("");
    }

    else if (username === "2") {
      setUpP1("");
      setDownP1("");
      setUpP2("w");
      setDownP2("s");
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

    const interval = setInterval(() => {
      const top = 0; 
      const bottom = fieldHeight - paddleHeight;

      if (moveUpP1 && !moveDownP1 && paddlePositionP1 > top) {
        setPaddlePositionP1(prevPos => Math.max(top, prevPos - 3));
        socket.emit("update_position", "up");
      }
      else if (moveDownP1 && !moveUpP1 && paddlePositionP1 < bottom) {
        setPaddlePositionP1(prevPos => Math.min(bottom, prevPos + 3));
        socket.emit("update_position", "down");
      }
      //Local Controls
      if (moveUpP2) {
        setPaddlePositionP2(prevPos => Math.max(0, prevPos - 3));
      }
      if (moveDownP2) {
        setPaddlePositionP2(prevPos => Math.min(fieldHeight - paddleHeight, prevPos + 3));
      }

      setBallPosition((prevPos) => {
        const nextPosition = {
          top: prevPos.top + ballVelocity.y,
          left: prevPos.left + ballVelocity.x,
        };

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
            socket.emit("update_score", [scoreP2, scoreP1]);
            socket.emit("send_message", {room: 123, author: "Server", message: "P2_GOAL"});
          }
          
          if (nextPosition.left + ballSize >= fieldWidth) {
            setScoreP1(scoreP1 + 1);
            socket.emit("update_score", [scoreP2, scoreP1]);
            socket.emit("send_message", {room: 123, author: "Server", message: "P1_GOAL",});
          }

          const newBallPosition = { top: fieldHeight / 2, left: fieldWidth / 2 - (ballSize / 2) };
          setBallPosition(newBallPosition);
        }

        if (state % 500 === 0) {
          socket.emit("sync_ball", [nextPosition, ballVelocity]);
          socket.emit("sync_paddle", [username, paddlePositionP1, paddlePositionP2]);
        }

        return nextPosition;

      });

    }, 10);
    return () => clearInterval(interval);
  }, [moveUpP1, moveDownP1, moveUpP2, moveDownP2, ballVelocity, paddlePositionP1, paddlePositionP2, ballPosition]);

  useEffect(() => {
    console.log("Use effect triggered.");
    socket.on("update_position", data => {
      if (data === "up") {
        setPaddlePositionP2(prevPos => Math.max(0, prevPos - 3));
      } else if (data === "down") {
        setPaddlePositionP2(prevPos => Math.min(fieldHeight - paddleHeight, prevPos + 3));
      }
    });

    socket.on("sync_ball", (data) => { 
      setBallPosition(data[0]);
      setBallVelocity(data[1]);
    });

    socket.on("sync_paddle", (data) => {
      if (data[0] === "1") {
        setPaddlePositionP2(data[2]);
      }

    });

    socket.on("update_score", (data) => {
      setScoreP1(data[0]);
      setScoreP2(data[1]);
    })

    return () => {
      socket.off("update_position");
    };
  }, [socket]);

  return (
    <>
      <h1>DROGELPING</h1>

      <input type="text"
        placeholder="1 or 2"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            joinRoom();
          }
        }}
      ></input>

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

export default App_game;