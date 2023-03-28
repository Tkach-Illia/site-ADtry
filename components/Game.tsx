import useSWR from "swr";
import Image from "next/image";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ColorPicker from "./ColorPicker";
import { fetcher } from "@/fetchers/fetcher";
import { Statuses } from "@/consts/Statuses";
import WaitingRoom from "./WaitingRoom";
import { Cell } from "@/interfaces/Cell";
import GameBoard from "./GameBoard";

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
    if (
      myColor === turn &&
      myColor === grid[rowIndex][colIndex].symbol
    ) {
      setTurn("");
      const updatedData = await updateUser(rowIndex, colIndex, myColor);
      setGrid(updatedData.grid);
    }
  };

  switch (data.status) {
    case Statuses.Ended:
      return (
        <div>
          Game ended...
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
        </div>
      );
    case Statuses.Ingame:
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
          <GameBoard grid={grid} onClick={handleCellClick} />
        </div>
      );
    case Statuses.Waiting:
      return(
        <div>
          <WaitingRoom players={2} onGameStart={function (): void {
            throw new Error("Function not implemented.");
          } } />
        </div>
      );
  }
  return <div>Loading...</div>;
}
