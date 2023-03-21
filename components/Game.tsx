import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Cell {
  value: number;
  symbol: string;
}

const Game: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>(
    Array.from(Array(5), () => new Array(5).fill({ value: 0, symbol: "w" }))
  );

  useEffect(() => {
    for (let rowIndex = 0; rowIndex < 5; rowIndex++)
      for (let colIndex = 0; colIndex < 5; colIndex++)
        if (grid[rowIndex][colIndex].value >= 4) {
          const newGrid = [...grid];
          newGrid[rowIndex][colIndex] = {
            symbol: grid[rowIndex][colIndex].symbol,
            value: newGrid[rowIndex][colIndex].value - 4,
          };
          if (rowIndex > 0) {
            newGrid[rowIndex - 1][colIndex] = {
              symbol: grid[rowIndex][colIndex].symbol,
              value: newGrid[rowIndex - 1][colIndex].value + 1,
            }; // Вгорі
          }
          if (rowIndex < 4) {
            newGrid[rowIndex + 1][colIndex] = {
              symbol: grid[rowIndex][colIndex].symbol,
              value: newGrid[rowIndex + 1][colIndex].value + 1,
            }; // Знизу
          }
          if (colIndex > 0) {
            newGrid[rowIndex][colIndex - 1] = {
              symbol: grid[rowIndex][colIndex].symbol,
              value: newGrid[rowIndex][colIndex - 1].value + 1,
            }; // Зліва
          }
          if (colIndex < 4) {
            newGrid[rowIndex][colIndex + 1] = {
              symbol: grid[rowIndex][colIndex].symbol,
              value: newGrid[rowIndex][colIndex + 1].value + 1,
            }; // Справа
          }
          setGrid(newGrid);
        }
  }, [grid]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex] = {
      symbol: 'r',
      value: newGrid[rowIndex][colIndex].value + 1,
    };
    setGrid(newGrid);
  };
  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent> ,rowIndex: number, colIndex: number) => {
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex] = {
      symbol: 'g',
      value: newGrid[rowIndex][colIndex].value + 1,
    };
    setGrid(newGrid);
    event.preventDefault();
  }

  return (
    <div>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "white",
                border: "1px solid black",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                userSelect: 'none'
              }}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onContextMenu={(event) =>handleContextMenu(event, rowIndex, colIndex)}
            >
              {cell.value <= 3 ? (
                <Image
                  src={`/${cell.symbol}/number-${cell.value}.png`}
                  alt={`${cell.value}`}
                  width={30}
                  height={30}
                />
              ) : (
                <div style={{ fontSize: "20px" }}>{cell.value}</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Game;
