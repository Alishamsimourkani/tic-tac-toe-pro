const XIcon = () => (
  <svg viewBox="0 0 128 128" width="100%" height="100%">
    <path
      d="M16,16L112,112"
      style={{
        stroke: "#4CAF50",
        strokeWidth: 10,
        strokeLinecap: "round",
      }}
    />
    <path
      d="M112,16L16,112"
      style={{
        stroke: "#4CAF50",
        strokeWidth: 10,
        strokeLinecap: "round",
      }}
    />
  </svg>
);

const OIcon = () => (
  <svg viewBox="0 0 128 128" width="100%" height="100%">
    <path
      d="M64,16A48,48 0 1,0 64,112A48,48 0 1,0 64,16"
      style={{
        stroke: "#E91E63",
        strokeWidth: 10,
        strokeLinecap: "round",
        fill: "none",
      }}
    />
  </svg>
);

export default function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value === "X" ? <XIcon /> : value === "O" ? <OIcon /> : null}
    </button>
  );
}
