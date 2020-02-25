export function getMinePosition(arr, count) {
  /**
   * Passing the 'arr' as the total cell of the game board, 
   * 'count' is the number of mines on the board
   */
  const random = arr.slice(0);
  let len = arr.length;
  const min = len - count;
  let keeper;
  let index;
  /**
   * This while loop to generate the position of mines,
   * and put it to the end of 'random' arr;
   */
  while(len-- > min) {
    index = Math.floor((len + 1) * Math.random());
    keeper = random[index];
    random[index] = random[len];
    random[len] = keeper;
  }
  /**
   * Just Return the mine position array,
   * min is the start index of the mines
   */
  return random.slice(min);
}

export function indexToPos(index, row) {
  /**
   * Calculate the original [x, y] coordinate by index in array
   */
  const x = Math.floor(index / row);
  const y = index % row;
  return [x, y];
}

export function posToIndex(arr, row) {
  /**
   * Use the [x, y] calculate the index in array
   */
  const x = arr[0];
  const y = arr[1];
  return x * row + y;
}