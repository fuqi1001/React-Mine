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

  /**
   * col: number of col for the game
   * row: number of row for the game
   * percentage: mines probability for all block
   * blockObject: Block Object to keep each cell's state or status
   * gameOver: game over flag
   * content: emoji container, for game status [🧐, gamming] [🥳, winning] [🥺, fail]
   * stepCount: count number of action
   */

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
    /**
     * generate origin block array, put index as value
     */
    for(let i = 0; i < blockNumber; i++) {
      blockIndex.push(i);
    }

    // set mine
    const numOfMine = Math.floor(blockNumber * percentage);
    // Use help function to get all mines position
    const minePosition = getMinePosition(blockIndex, numOfMine);
  
    /**
     * Constructor the Block Objects,
     * as init status
     */
    const blockObj = blockIndex.map(index => ({
      show: false,
      blockType: 0,
      isMine: minePosition.indexOf(index) === -1 ? false : true,
    }));
    
    blockObj.forEach((block, index) => {
      if (!block.isMine) {
        /**
         * Use helper function to get all neighbor block object index(as in array)
         * normally has 8 neighbor, some blocks in boundary, might different
         */
        const allNeighbor = neighborBlock(index);
        /**
         * Count number of mines around,
         * if 0, the current block is empty block,
         * if !0, the current will show the number of mines when be flipped
         */
        const countOfMine = allNeighbor.filter(i => blockObj[i].isMine).length;
        if (!countOfMine) block.isEmpty = true;
        block.content = countOfMine;
      }
    });
    /**
     * useState hook to set the init block objects and game status
     */
    setBlockObject(blockObj);
    setGameOver(false);
  }

  // useEffect hook to run init() function when first rendering
  useEffect(() => init(),[]);

  // helper function to return neighbor block
  const neighborBlock = (index, isConnect) => {
    const [x, y] = indexToPos(index, row);

    // boundary check functions
    const boundCheck = bound => num => num >= 0 && num < bound;
    const checkHor = boundCheck(row);
    const checkVer = boundCheck(col);
    const checkBlockPos = ([x, y]) => checkHor(x) && checkVer(y);

    /**
     * Up Right Down Left
     */
    const moveDir = [
      [x - 1, y],
      [x, y + 1],
      [x + 1, y],
      [x, y - 1]
    ];
    
    // Left up, right up, right down, left down
    const diagDir = [
      [x - 1, y - 1],
      [x - 1, y + 1],
      [x + 1, y + 1],
      [x + 1, y - 1],
    ];
    /**
     * if check directly connected blocks, 
     * can only go 4 direction, 
     * if not,
     * can go 8 direction
     */
    const nextStep = isConnect ? moveDir : [...diagDir, ...moveDir];
    // fitler out exceed boundary blocks
    const neighbor = nextStep.filter(checkBlockPos);
    // return all neighbor block index in array by helper function;
    return neighbor.map(pos => posToIndex(pos, row));
  }

  const neighborEmptyBlock = (index) => {
    // iterator get all connected EMPTY(or Blank) block
    // brute force 
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

    /**
     * If current block is mine, game over
     * set all block status to show up,
     * set all block flip
     */
    if (block.isMine) {
      blockObject.forEach(it => {it.show = true});
      setBlockObject(blockObject);
      setGameOver(true);
      setContent('🥺');
      return;
    }

    /**
     * flip current block
     * check winning status
     * loop over each block, isMine or isSafe but be fliped
     */
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

    /**
     * if current block is empty
     * get all neighbor Empty block by helper function `neighborEmptyBlock`
     * then get all empty block's neighbor block and concat with origin empty block together
     * might have overlap but doesn't matter
     * setting all these block to show status
     * then check winning status
     */
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

  /**
   * handle right click to flag current block
   */
  const handleBlockFlag = (e, block, index) => {
    e.preventDefault();
    if (gameOver) {
      init();
      return;
    }
    if (block.show) return;
    setStepCount(stepCount + 1);
    // different flag mark, mark as mine or mark as unknow
    blockObject[index].blockType = block.blockType !== 2 ? block.blockType + 1 : 0;
    setBlockObject(blockObject);
  }

  return(
    <div className="board">
      <p><span onClick={() => init()}>{content}</span></p>
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