import React, { useState } from 'react';
import './App.css';
import { ServerMessages, WriteMessage } from './modules/Server.js'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello, World!</h1>
        <div>
      <h1>Welcome to my app</h1>
      <MyButton />
      <myText />
    </div>
      </header>
      <ServerMessages />
    </div>
  );
}

function MyButton() {
  const [index, setIndex] = useState(0);
  return (
    <button onClick={() => {setIndex(index + 1);
                            if (index === 20) {
                              window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley", "_blank");
                            }}}>
      I'm a button, you've clicked me {index} times
    </button>
  );
}

export default App;