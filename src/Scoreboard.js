export default function ({ playerX, playerO, score }) {
  return (
    <div className="scoreboard">
      {playerX} (X) = {score.X} | {playerO} (O) = {score.O}
    </div>
  );
}
