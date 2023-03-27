import useSWR from "swr";
import Image from "next/image";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ColorPicker from "./ColorPicker";
import { fetcher } from "@/fetchers/fetcher";

interface Cell {
  value: number;
  symbol: string;
}

export default function Game(): React.ReactElement {
  const [grid, setGrid] = useState<Cell[][]>(
    Array.from(Array(10), () => new Array(10).fill({ value: 0, symbol: "b" }))
  );
  const [myColor, setMyColor] = useState<string>();
  const [turn, setTurn] = useState<string>();

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
    symbol: string | undefined
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
      await axios.delete(`/api/grid`);
      await axios.delete(`/api/color`);
      setMyColor("");
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
      <div
        style={{
          width: "80px",
          height: "30px",
          backgroundColor: "#1E90FF",
          borderRadius: "4px",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          fontWeight: 500,
        }}
        onClick={restartGame}
      >
        Restart
      </div>
      <ColorPicker selectedColor={myColor} setSelectedColor={setMyColor} />
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
                  if (
                    myColor === turn &&
                    myColor === grid[rowIndex][colIndex].symbol
                  ) {
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
