export function getMinePosition(arr, count) {
  const random = arr.slice(0);
  let len = arr.length;
  const min = len - count;
  let keeper;
  let index;
  while(len-- > min) {
    index = Math.floor((len + 1) * Math.random());
    keeper = random[index];
    random[index] = random[len];
    random[len] = keeper;
  }
  return random.slice(min);
}

export function indexToPos(index, row) {
  const x = Math.floor(index / row);
  const y = index % row;
  return [x, y];
}

export function posToIndex(arr, row) {
  const x = arr[0];
  const y = arr[1];
  return x * row + y;
}