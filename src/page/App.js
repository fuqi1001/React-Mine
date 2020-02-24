import React, { useState } from 'react';
import './App.css';
import Board from './Board/Board';
import Setting from './Setting/Setting';

export const EASY = 'EASY';
export const MID = 'MID';
export const HARD = 'HARD';

function App() {

  const [gameSize, setGameSize] = useState([12, 12]);
  const [gameMode, setGameMode] = useState(EASY);

  return (
    <div className="App">
      <Setting 
        gameSize={gameSize} 
        gameMode={gameMode} 
        setGameSize={(arr) => setGameSize(arr)}
        setGameMode={(mode) => setGameMode(mode)}
      />
      <Board
        key={gameSize[0] * gameSize[0] + gameMode}
        gameSize={gameSize}
        gameMode={gameMode}
      />
    </div>
  );
}

export default App;
