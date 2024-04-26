import { useState, useEffect } from 'react';

const useKeyPress = (targetKeys) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = ({ key }) => {
    if (targetKeys.includes(key)) {
      setKeyPressed(true);
    }
  };

  const upHandler = ({ key }) => {
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
  }, [targetKeys]);
  return keyPressed;
};

export default useKeyPress;