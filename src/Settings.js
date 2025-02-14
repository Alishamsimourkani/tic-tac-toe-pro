export default function Settings({
  gameSize,
  setGameSize,
  playerX,
  setPlayerX,
  playerO,
  setPlayerO,
  gameMode,
  setGameMode,
  difficulty,
  setDifficulty,
}) {
  function handleSizeChange(event) {
    setGameSize(parseInt(event.target.value, 10));
  }
  function handlePlayerChange(event, player) {
    if (player === "X") setPlayerX(event.target.value);
    else setPlayerO(event.target.value);
  }

  return (
    <div className="settings">
      <label>
        Select Board Size:
        <select value={gameSize} onChange={handleSizeChange}>
          {[3, 5, 7, 9].map((size) => (
            <option key={size} value={size}>
              {size}x{size}
            </option>
          ))}
        </select>
      </label>

      <label>
        Player X:
        <input
          type="text"
          value={playerX}
          onChange={(e) => handlePlayerChange(e, "X")}
        />
      </label>

      <label>
        Player O:
        <input
          type="text"
          value={playerO}
          onChange={(e) => handlePlayerChange(e, "O")}
        />
      </label>
      <div className="game-mode">
        <label>
          Game Mode:
          <select
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value)}
          >
            <option value="twoPlayer">Two Players</option>
            <option value="singlePlayer">Play with AI</option>
          </select>
        </label>

        {gameMode === "singlePlayer" && (
          <label>
            Difficulty:
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
        )}
      </div>
    </div>
  );
}
