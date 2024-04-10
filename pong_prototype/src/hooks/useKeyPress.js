import { useState, useEffect } from "react";

function useKeyPress(targetKeys) {
    const [keyPressed, setKeyPressed] = useState(false);

    function downHandler({ swkey }) {
        if (targetKeys.includes(key)) {
            setKeyPressed(true);
        }
    }z

    function upHandler({ key }) {
        if (targetKeys.includes(key)) {
            setKeyPressed(false);
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []);
    return keyPressed;
};

export default useKeyPress;