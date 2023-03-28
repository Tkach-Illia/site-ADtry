import { Cell } from "@/interfaces/Cell";
import Image from "next/image";
import React from "react";

interface Props {
  grid: Cell[][];
  onClick: (rowIndex: number, colIndex: number) => void;
}

const GameBoard: React.FC<Props> = ({ grid, onClick }) => {
  const cellSize = 50;

  return (
    <div>
      {Array.isArray(grid) &&
        grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex" }}>
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  backgroundColor: "white",
                  border: "1px solid black",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  userSelect: "none",
                }}
                onClick={() => onClick(rowIndex, colIndex)}
              >
                {cell.value <= 3 ? (
                  <Image
                    src={`/${cell.symbol}/number-${cell.value}.png`}
                    alt={`${cell.value}`}
                    width={cellSize}
                    height={cellSize}
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

export default GameBoard;
