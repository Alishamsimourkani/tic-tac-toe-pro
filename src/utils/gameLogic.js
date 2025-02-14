export function calculateWinner(squares, gameSize) {
  const lines = [];

  // Generate row and column win conditions dynamically
  for (let i = 0; i < gameSize; i++) {
    lines.push([...Array(gameSize)].map((_, j) => i * gameSize + j)); // Row
    lines.push([...Array(gameSize)].map((_, j) => j * gameSize + i)); // Column
  }

  // Generate diagonal win conditions
  lines.push([...Array(gameSize)].map((_, i) => i * (gameSize + 1))); // Top-left to bottom-right
  lines.push([...Array(gameSize)].map((_, i) => (i + 1) * (gameSize - 1))); // Top-right to bottom-left

  // Check for a winner
  for (const [a, ...rest] of lines) {
    if (squares[a] && rest.every((index) => squares[index] === squares[a])) {
      return squares[a];
    }
  }

  return null; // No winner
}

export function getNeighbors(index, gameSize) {
  const row = Math.floor(index / gameSize);
  const col = index % gameSize;
  const neighbors = [];

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1], // Up, Down, Left, Right
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1], // Diagonals
  ];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (newRow >= 0 && newRow < gameSize && newCol >= 0 && newCol < gameSize) {
      neighbors.push(newRow * gameSize + newCol);
    }
  }

  return neighbors;
}

export function getValidMoves(squares, lastMoveIndex, gameSize, currentMove) {
  const forbiddenMoves = getForbiddenMoves(
    lastMoveIndex,
    gameSize,
    currentMove
  );

  return squares
    .map((_, i) => i)
    .filter((i) => squares[i] === null && !forbiddenMoves.includes(i));
}

export function getForbiddenMoves(lastMoveIndex, gameSize, currentMove) {
  if (
    lastMoveIndex === null ||
    gameSize <= 3 ||
    currentMove + 1 >= gameSize * Math.ceil(gameSize / 2)
  ) {
    return []; // No restrictions at the start
  }

  const neighbors = getNeighbors(lastMoveIndex, gameSize);
  const lastRow = Math.floor(lastMoveIndex / gameSize);
  const lastCol = lastMoveIndex % gameSize;

  // Forbidden moves: neighbors + same row + same column
  const forbiddenMoves = new Set(neighbors);

  for (let i = 0; i < gameSize; i++) {
    forbiddenMoves.add(lastRow * gameSize + i); // Same row
    forbiddenMoves.add(i * gameSize + lastCol); // Same column
  }

  return Array.from(forbiddenMoves);
}
