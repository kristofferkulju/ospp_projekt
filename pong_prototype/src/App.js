import { useEffect, useState } from "react";
import Ball from "./components/Ball";
import Field from "./components/Field";
import Paddle from "./components/Paddle";
import useScreenSize from "./hooks/useScreenSize";
import useKeyPress from "./hooks/useKeyPress";
import './App.css';

import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001");

function App() {

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("123");
  const [showGame, setShowGame] = useState(false);

  const screenSize = useScreenSize();

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowGame(true);
    }
  }

  var upP1 = "w";
  var downP1 = "s";
  var upP2 = "ArrowUp";
  var downP2 = "ArrowDown";

  const fieldWidth = 1000;
  const fieldHeight = 500;
  const paddleWidth = 20;
  const paddleHeight = 100;
  
  const [paddlePositionP1, setPaddlePositionP1] = useState(fieldHeight / 2 - paddleHeight / 2);
  const [paddlePositionP2, setPaddlePositionP2] = useState(fieldHeight / 2 - paddleHeight / 2);
  const [ballPosition, setBallPosition] = useState({top: fieldHeight / 2, left: fieldWidth / 2 - 10 });
  const [ballVelocity, setBallVelocity] = useState({x: 2, y: 2  });
  
  const moveUpP1 = useKeyPress([upP1]);
  const moveDownP1 = useKeyPress([downP1]);
  const moveUpP2 = useKeyPress([upP2]);
  const moveDownP2 = useKeyPress([downP2]);


  //  useEffect(() => {
  //   const newSocket = io.connect(socket); // Connect to the server
  //   setSocket(newSocket);

  //   return () => {
  //     newSocket.disconnect(); // Clean up the socket connection when component unmounts
  //   };
  // }, []); // Run only once when component mounts
  useEffect(() => {
    
    updateOtherPaddlePositions();
  }, [socket])

  useEffect(() => {

    const interval = setInterval(() => {
      updateMyPaddlePositions();

      setBallPosition((prevPos) => {
        const nextPosition = {
          top: prevPos.top + ballVelocity.y,
          left: prevPos.left + ballVelocity.x,
        };

        //Om bollen träffar taket eller golvet
        if (nextPosition.top <= 0 || nextPosition.top + 20 >= fieldHeight) {
          const newBallVelocity = {x: ballVelocity.x, y: -ballVelocity.y};
          setBallVelocity(newBallVelocity);
        }

        //Om bollen träffar sidan av paddeln
        if (nextPosition.left <= 15 + paddleWidth && nextPosition.top >= paddlePositionP1 && nextPosition.top <= paddlePositionP1 + paddleHeight) {
          const newBallVelocity = {x: -ballVelocity.x, y: ballVelocity.y};
          setBallVelocity(newBallVelocity);
        }

        if (nextPosition.left + 20 >= fieldWidth - 15 - paddleWidth && nextPosition.top >= paddlePositionP2 && nextPosition.top <= paddlePositionP2 + paddleHeight) {
          const newBallVelocity = {x: -ballVelocity.x, y: ballVelocity.y};
          setBallVelocity(newBallVelocity);
        }

        if (nextPosition.left <= 0 || nextPosition.left + 20 >= fieldWidth) {
          const newBallPosition = {top: fieldHeight / 2, left: fieldWidth / 2 - 10};
          setBallPosition(newBallPosition);  
        }

        return nextPosition;

      });

    }, 30);
    return () => clearInterval(interval);
  }, [moveUpP1, moveDownP1, moveUpP2, moveDownP2, screenSize, ballVelocity, paddlePositionP1, paddlePositionP2, ballPosition]);
  
  async function updateMyPaddlePositions() {
    
    if (moveUpP1) { 
      setPaddlePositionP1((prevPos) => Math.max(0, (prevPos - 3))); 
      // Skicka till server
      socket.emit("update_position", "up")
    }
    if (moveDownP1) {
      setPaddlePositionP1((prevPos) => Math.min((fieldHeight - paddleHeight), (prevPos + 3)));
      // Skicka till server¨
      console.log("Tjooo")
      
      
      socket.emit("update_position", "down")
    }
  }
  
  async function updateOtherPaddlePositions(interval) {
    console.log("Hej");
    socket.on("update_position", (data) => {
    if (data === "up") {
      setPaddlePositionP2((prevPos) => Math.max(0, (prevPos - 3)));
    }
    else if (data === "down") {
      setPaddlePositionP2((prevPos) => Math.min(fieldHeight - paddleHeight, (prevPos + 3)));
    }
  });
  }
  
  return (
    <>
      <h1>DROGELPING</h1>
      
      <input type="text"
        placeholder="1 or 2"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        onKeyDown={(event) => { 
          if (event.key === "Enter") { 
              joinRoom();} 
          }}  
      ></input>

      <div className="field"> 
        <Field width={fieldWidth} height={fieldHeight}>
          <Paddle width={paddleWidth} left={15} top={paddlePositionP1}></Paddle>
          <Paddle width={paddleWidth} left={1000 - 15 - paddleWidth} top={paddlePositionP2}></Paddle>
          <Ball top = {ballPosition.top} left = {ballPosition.left}> </Ball>
        </Field>
      </div>
    </> 
  );
}

export default App;
