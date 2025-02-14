export default function Messages({ gameSize, currentMove }) {
  return (
    <div className="message">
      {gameSize * Math.ceil(gameSize / 1.5) - currentMove > 0 && gameSize > 3
        ? `Limitation will remove after ${Math.max(
          gameSize * Math.ceil(gameSize / 1.5) - currentMove,
          0
        )} moves`
        : `Move limitation Removed`}
    </div>
  );
}
