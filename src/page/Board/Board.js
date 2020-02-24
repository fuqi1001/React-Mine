import React, { useState, useEffect } from 'react';
import { getMinePosition, indexToPos, posToIndex } from '../../utils/utils';
import './Board.scss';

const diff = {
  EASY: 12 / 100,
  MID: 16 / 100,
  HARD: 20 / 100,
}

// style function
const boardWidth = (row) => ({
  width: `${row * (30 + 4)}px`,
});
const blockColor = (block) => ({
  backgroundColor: block.isMine ? '#c50d66' : '#fff'
});
const flagMap = {
  0: '',
  1: 'M',
  2: '?',
}



const Board = ({...props}) => {
  const { gameMode, gameSize } = props;
  const [col, setCol] = useState(gameSize[0]);
  const [row, setRow] = useState(gameSize[1]);
  const [percentage, setPercentage] = useState(diff[gameMode]);
  const [blockObject, setBlockObject] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [content, setContent] = useState('🧐');
  const [stepCount, setStepCount] = useState(0);

  const init = () => {
    setCol(gameSize[0]);
    setRow(gameSize[1]);
    setPercentage(diff[gameMode]);
    
    setContent('🧐');
    const blockNumber = gameSize[0] * gameSize[1];

    const blockIndex = [];
    for(let i = 0; i < blockNumber; i++) {
      blockIndex.push(i);
    }

    // set mine
    const numOfMine = Math.floor(blockNumber * percentage);
    const minePosition = getMinePosition(blockIndex, numOfMine);
    
    // transfer num to blockObj 
    const blockObj = blockIndex.map(index => ({
      show: false,
      blockType: 0,
      isMine: minePosition.indexOf(index) === -1 ? false : true,
    }));
    
    blockObj.forEach((block, index) => {
      if (!block.isMine) {
        const allNeighbor = neighborBlock(index);
        const countOfMine = allNeighbor.filter(i => blockObj[i].isMine).length;
        if (!countOfMine) block.isEmpty = true;
        block.content = countOfMine;
      }
    });
    setBlockObject(blockObj);
    setGameOver(false);
  }

  useEffect(() => init(),[]);

  const neighborBlock = (index, isConnect) => {
    const [x, y] = indexToPos(index, row);
    const boundCheck = bound => num => num >= 0 && num < bound;
    
    const checkHor = boundCheck(row);
    const checkVer = boundCheck(col);
    const checkBlockPos = ([x, y]) => checkHor(x) && checkVer(y);
    const moveDir = [
      [x - 1, y],
      [x, y + 1],
      [x + 1, y],
      [x, y - 1]
    ];
    const diagDir = [
      [x - 1, y - 1],
      [x - 1, y + 1],
      [x + 1, y + 1],
      [x + 1, y - 1],
    ];
    const nextStep = isConnect ? moveDir : [...diagDir, ...moveDir];
    const neighbor = nextStep.filter(checkBlockPos);
    return neighbor.map(pos => posToIndex(pos, row));
  }

  const neighborEmptyBlock = (index) => {
    const getBlockIndex = (idx) => neighborBlock(idx, true);
    const emptyBlock = [];
    const iteratorBlock = arr => arr.forEach(i => {
      if (blockObject[i].isEmpty && !blockObject[i].isMarked) {
        blockObject[i].isMarked = true;
        emptyBlock.push(i);
        iteratorBlock(getBlockIndex(i, true));
      }
    });

    iteratorBlock(getBlockIndex(index));
    return emptyBlock;
  }

  const handleBlockClick = (block, index) => {
    if (gameOver) {
      init();
      return;
    }
    setStepCount(stepCount + 1);
    blockObject[index].blockType = 0;
    if (block.isMine) {
      blockObject.forEach(it => {it.show = true});
      setBlockObject(blockObject);
      setGameOver(true);
      setContent('🥺');
      return;
    }

    blockObject[index].show = true;
    let winFlag = blockObject.every(it => {
      return it.isMine || (!it.isMine && it.show)
    });
    if (winFlag) {
      setGameOver(true);
      setContent('🥳');
      setBlockObject(blockObject);
      return;
    }

    if (block.isEmpty) {
      const emptyBlock = neighborEmptyBlock(index);
      const openEmptyBlock = 
        emptyBlock.map(it => neighborBlock(it))
                  .reduce((prev, cur) => [...prev, ...cur], []);
      const openedBlock = [...emptyBlock, ...openEmptyBlock];
      openedBlock.forEach(i => {
        blockObject[i].show = true
      });
      winFlag = blockObject.every(it => {
        return it.isMine || (!it.isMine && it.show)
      });
      if (winFlag) {
        setGameOver(true);
        setContent('🥳');
        setBlockObject(blockObject);
        return;
      }
      setBlockObject(blockObject);
      return;
    }
    setBlockObject(blockObject);
  }

  const handleBlockFlag = (e, block, index) => {
    e.preventDefault();
    if (gameOver) {
      init();
      return;
    }
    if (block.show) return;
    setStepCount(stepCount + 1);
    blockObject[index].blockType = block.blockType !== 2 ? block.blockType + 1 : 0;
    setBlockObject(blockObject);
  }

  return(
    <div className="board">
      <p>{content}</p>
      <ul className='main-board' style={boardWidth(row)}>
        {blockObject.map((block, index) => (
          <li 
            key={index}
            style={block.show ? blockColor(block) : null}
            onClick={() => handleBlockClick(block, index)}
            onContextMenu={(e) => handleBlockFlag(e, block, index)}
          >
            {block.show ? (!block.isEmpty && block.content) : flagMap[block.blockType]}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Board;