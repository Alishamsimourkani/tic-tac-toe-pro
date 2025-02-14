import Square from "./Squere";
import { calculateWinner, getNeighbors } from "./utils/gameLogic";

export default function Board({
  gameSize,
  xIsNext,
  move,
  squares,
  onPlay,
  lastMoveIndex,
}) {
  function handleClick(i) {
    if (calculateWinner(squares, gameSize) || squares[i]) {
      return;
    }
    // If it's not the first move, check if the selected move is a valid non-neighbor
    if (
      lastMoveIndex !== null &&
      gameSize > 3 &&
      move < gameSize * Math.ceil(gameSize / 1.5)
    ) {
      const neighbors = getNeighbors(lastMoveIndex, gameSize);
      const lastRow = Math.floor(lastMoveIndex / gameSize);
      const lastCol = lastMoveIndex % gameSize;

      // Check if the move is in a neighboring cell or in the same row/column
      const selectedRow = Math.floor(i / gameSize);
      const selectedCol = i % gameSize;
      if (
        neighbors.includes(i) ||
        selectedRow === lastRow ||
        selectedCol === lastCol
      ) {
        return; // Prevent move if it's in a neighboring cell or same row/column
      }
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  return (
    <>
      <h3>FaFi Game</h3>
      {Array.from({ length: gameSize }, (_, row) => (
        <div key={row} className="board-row">
          {Array.from({ length: gameSize }, (_, col) => {
            const index = row * gameSize + col;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}
