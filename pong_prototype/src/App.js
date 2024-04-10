import { useState, useEffect } from 'react';
import './App.css';
import useScreenSize from './hooks/useScreenSize';
import useKeyPress from './hooks/useKeyPress';
import Paddle from './components/Paddle';
import Ball from './components/Ball';

function App() {
  const screenSize = useScreenSize();
  const [paddlePosition, setPaddlePosition] = useState({ top: 0, left: 10 });
  const [ballPosition, setBallPosition] = useState({ top: 0, left: 0});
  const [ballVelocity, setBallVelocity] = useState({ x: 1, y: 1});
  const moveUp = useKeyPress(['w', 'ArrowUp']);
  const moveDown = useKeyPress(['s', 'ArrowDown']);

  useEffect(() => {
    const interval = setInterval(() => {
      if (moveUp) {
        //Tar det största värdet av 0 och prevTop-3, vilket innebär att det aldrig kan bli negativt.
          setPaddlePosition((prevPos) => ({
            ...prevPos,
            top: Math.max(0, prevPos.top - 3)
          }));        
      } else if (moveDown) {
        setPaddlePosition((prevPos) => ({
          ...prevPos,
          top: Math.max(0, prevPos.top + 3)
        })); 
      }
      
      setBallPosition((prevPos) => {
        const nextPosition = {
          top: prevPos.top + ballVelocity.y,
          left: prevPos.left + ballVelocity.x
        };

        //Om bollen krockar med "taket" eller "golvet".
        if (nextPosition.top <= 0 || nextPosition.top >= screenSize.height - 100) {
          const newBallVelocity = {x: ballVelocity.x, y: -ballVelocity.y};
          setBallVelocity(newBallVelocity);
        }

        //Om bollen krockar med paddeln.
        if (nextPosition.left <= paddlePosition.left + 40 && nextPosition.top >= paddlePosition.top && nextPosition.top <= paddlePosition.top + 100) {
          const newBallVelocity = { x: -ballVelocity.x, y: ballVelocity.y };
          setBallVelocity(newBallVelocity);
        }
        if (nextPosition.left <= 0 || nextPosition.left >= screenSize.width) {
          setBallPosition({ top: screenSize.height / 2, left: screenSize.width / 2 });
          setBallVelocity({ x: -ballVelocity.x, y: 1 });
        }
        return nextPosition ;
      });

    }, 4);
    return () => clearInterval(interval);
  }, [moveUp, moveDown, paddlePosition, screenSize.width, screenSize.height, ballVelocity.y]);



  return (
    <div style={{ width: screenSize.width, height: screenSize.height }}>
      <Paddle top = {paddlePosition.top} left = {paddlePosition.left} /> 
      <Ball top = {ballPosition.top} left = {ballPosition.left} />
    </div>
  );
}

export default App;
