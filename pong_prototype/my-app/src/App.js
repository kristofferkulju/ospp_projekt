import { useEffect, useState } from "react";
import Ball from "./components/Ball";
import Field from "./components/Field";
import Paddle from "./components/Paddle";
import useScreenSize from "./hooks/useScreenSize";
import useKeyPress from "./hooks/useKeyPress";
import './App.css';

function App_pong() {
  const screenSize = useScreenSize();

  const fieldWidth = 1000;
  const fieldHeight = 500;
  const paddleWidth = 20;
  const paddleHeight = 100;
  
  const [paddlePositionP1, setPaddlePositionP1] = useState(fieldHeight / 2 - paddleHeight / 2);
  const [paddlePositionP2, setPaddlePositionP2] = useState(fieldHeight / 2 - paddleHeight / 2);
  const [ballPosition, setBallPosition] = useState({top: fieldHeight / 2, left: fieldWidth / 2 - 10 });
  const [ballVelocity, setBallVelocity] = useState({x: 2, y: 2  });
  
  const moveUpP1 = useKeyPress(['w']);
  const moveDownP1 = useKeyPress(['s']);
  const moveUpP2 = useKeyPress(['ArrowUp']);
  const moveDownP2 = useKeyPress(['ArrowDown']);

  useEffect(() => {
    const interval = setInterval(() => {
      if (moveUpP1) { 
        setPaddlePositionP1((prevPos) => Math.max(0, (prevPos - 3))); 
      } 
      if (moveDownP1) {
        setPaddlePositionP1((prevPos) => Math.min((fieldHeight - paddleHeight), (prevPos + 3)));
      } 
      if (moveUpP2) {
        setPaddlePositionP2((prevPos) => Math.max(0, (prevPos - 3)));
      } 
      if (moveDownP2) {
        setPaddlePositionP2((prevPos) => Math.min(fieldHeight - paddleHeight, (prevPos + 3)));
      }

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

    }, 5);
    return () => clearInterval(interval);
  }, [moveUpP1, moveDownP1, moveUpP2, moveDownP2, screenSize, ballVelocity, paddlePositionP1, paddlePositionP2, ballPosition]);
  

  
  return (
    <>
      <h1>DROGELPING</h1>
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

export default App_pong;
