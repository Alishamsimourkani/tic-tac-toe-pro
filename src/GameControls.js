export default function GameControls({ resetGame, undoMove, currentMove }) {
  return (
    <div className="game-info">
      <button className="btn" onClick={resetGame}>
        Reset Game
      </button>
      <button className="btn" onClick={undoMove} disabled={currentMove === 0}>
        Undo
      </button>
    </div>
  );
}
