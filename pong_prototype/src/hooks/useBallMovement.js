import { useState, useEffect } from "react";

function useBallMovement(initialPosition, initialVelocity, screenSize, paddleTop) {
    const [ballPosition, setBallPosition] = useState(initialPosition);
    const [ballVelocity, setBallVelocity] = useState(initialVelocity);

    
}