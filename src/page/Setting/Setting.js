import React from 'react';
import './Setting.scss';
import { EASY, MID, HARD } from '../App';

function checkSize(curSize, num) {
  if (curSize === num) return 'selected';
  return '';
}

function checkMode(curMode, mode) {
  if (curMode === mode) return 'selected';
  return '';
}

const Setting = ({...props}) => {
  
  const { gameSize, gameMode, setGameSize, setGameMode } = props;
  
  const handleSetSize = (arr) => {
    setGameSize(arr);
  }

  const handleSetMode = (mode) => {
    setGameMode(mode);
  }
  return(
    <div className='setting'>
      <div className='setting-size'>
        <button onClick={() => handleSetSize([12, 12])} className={`btn ${checkSize(gameSize[0], 12)}`}><span>12 * 12</span></button>
        <button onClick={() => handleSetSize([16, 16])} className={`btn ${checkSize(gameSize[0], 16)}`}><span>16 * 16</span></button>
        <button onClick={() => handleSetSize([20, 20])} className={`btn ${checkSize(gameSize[0], 20)}`}><span>20 * 20</span></button>
      </div>
      <div className='setting-mode marg'>
        <button onClick={() => handleSetMode(EASY)} className={`btn ${checkMode(gameMode, 'EASY')}`}><span>Easy</span></button>
        <button onClick={() => handleSetMode(MID)} className={`btn ${checkMode(gameMode, 'MID')}`}><span>Medium</span></button>
        <button onClick={() => handleSetMode(HARD)} className={`btn ${checkMode(gameMode, 'HARD')}`}><span>Hard</span></button>
      </div>
    </div>
  )
}

export default Setting;