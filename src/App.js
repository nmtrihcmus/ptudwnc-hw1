import { useState } from 'react';

function Square({ value, onSquareClick, winningLines, squareIndex }) {
  return (
    <button
      className={
        winningLines && winningLines.includes(squareIndex)
          ? "square-win"
          : "square"
      }
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ squares, xIsNext, onPlay }) {
  function handleClick(i) {
    const locations = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3]
    ];
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, locations[i]);
  }

  const winner = calculateWinner(squares);
  const lines = winner && winner.lines;

  let status;
  if (winner) {
    status = winner.winner === "Draw!" ? "Draw!" : "Winner: " + winner.winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const intializeBoard = () => {
    return Array(3)
      .fill(null)
      .map((_, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {Array(3)
            .fill(null)
            .map((_, colIndex) => {
              const squareIndex = rowIndex * 3 + colIndex;
              return (
                <Square
                  key={squareIndex}
                  value={squares[squareIndex]}
                  squareIndex={squareIndex}
                  onSquareClick={() => handleClick(squareIndex)}
                  winningLines={lines}
                />
              );
            })}
        </div>
      ));
  };

  return (
    <>
      <div className="status">{status}</div>
      {intializeBoard()}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [ascending, setAscending] = useState(false);
  const [movesCoordinates, setMovesCoordinates] = useState([]);

  function handlePlay(nextSquares, coordinateSquare) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setMovesCoordinates([...movesCoordinates, coordinateSquare]);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description =
        "Go to move #" +
        move +
        " Col: " +
        movesCoordinates[move - 1][0] +
        " Row: " +
        movesCoordinates[move - 1][1];
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        <span>You are at move #{currentMove}</span>
      </div>
      <div className="game-info">
        <button className="toggle-btn" onClick={() => setAscending(!ascending)}>
          Reverse
        </button>
        <ol>{ascending ? moves.reverse() : moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        lines: [a, b, c]
      };
    }
  }

  if (squares.every((square) => square)) {
    return {
      winner: "Draw!",
      lines: []
    };
  }

  return null;
}