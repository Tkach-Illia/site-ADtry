import useSWR from "swr";
import Image from "next/image";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Cell {
  value: number;
  symbol: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Game(): React.ReactElement {
  const [grid, setGrid] = useState<Cell[][]>(
    Array.from(Array(10), () => new Array(10).fill({ value: 0, symbol: "b" }))
  );
  const [colors, setColors] = useState<string[]>(["g", "r"]);
  const [myColor, setMyColor] = useState<string>("r");
  const [turn, setTurn] = useState<string>("g");

  const { data, error } = useSWR(`/api/grid`, fetcher, {
    refreshInterval: 500,
  });

  useEffect(() => {
    if (data) {
      setGrid(data.grid);
      setTurn(data.turn);
    }
  }, [data]);

  if (error) return <div>Failed to load user</div>;
  if (!data) return <div>Loading...</div>;

  const updateUser = async (
    rowIndex: number,
    colIndex: number,
    symbol: string
  ) => {
    try {
      const response = await axios.put(`/api/grid`, {
        rowIndex: rowIndex,
        colIndex: colIndex,
        symbol: symbol,
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const restartGame = async () => {
    try {
      const response = await axios.put(`/api/grid`, {
        rowIndex: 0,
        colIndex: 0,
        symbol: "rr",
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleCellClick = async (rowIndex: number, colIndex: number) => {
    const updatedData = await updateUser(rowIndex, colIndex, myColor);
    setGrid(updatedData.grid);
  };

  return (
    <div>
      <div>
        <div
          style={{
            width: "50px",
            height: "50px",
            backgroundColor: "blue",
          }}
          onClick={restartGame}
        >
          Restart
        </div>
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "grey",
            }}
            onClick={() => {
              setMyColor(color);
            }}
          >
            {color}
          </div>
        ))}
      </div>
      <div>{turn}</div>
      {Array.isArray(grid) &&
        grid.map((row, rowIndex) => (
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
                  userSelect: "none",
                }}
                onClick={() => {
                  if (myColor === turn && myColor === grid[rowIndex][colIndex].symbol) {
                    setTurn("");
                    handleCellClick(rowIndex, colIndex);
                  }
                }}
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
}
