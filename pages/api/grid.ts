import { Colors } from "@/consts/Colors";
import { Statuses } from "@/consts/Statuses";
import { Cell } from "@/interfaces/Cell";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: Statuses;
  grid: Cell[][];
  turn: string | undefined;
};

let status = Statuses.Waiting;
let size = 10;
let playerQueue = Colors;
let currentPlayer: string | undefined = Colors[0];
let arr = Array.from(Array(size), () =>
  new Array(size).fill({ value: 0, symbol: "b" })
);

function fillArr() {
  for (let rowIndex = 4; rowIndex < size - 2; rowIndex++)
    for (let colIndex = 4; colIndex < size - 2; colIndex++)
      arr[rowIndex][colIndex] = {
        symbol: "w",
        value: 0,
      };
  arr[5][5] = {
    symbol: "green",
    value: 1,
  };
  arr[6][6] = {
    symbol: "red",
    value: 1,
  };
}
fillArr();

function nextPlayer() {
  currentPlayer = playerQueue.shift();
  if (currentPlayer) playerQueue.push(currentPlayer);
}
nextPlayer();

function endCheck(grid: Cell[][]) {
  const uniqueStrings = new Set<string>();
  grid.forEach((pairArray) => {
    pairArray.forEach((pair) => {
      const { value, symbol } = pair;
      uniqueStrings.add(symbol);
    });
  });
  if (uniqueStrings.size == 3) status = Statuses.Ended;
}

function updateArr() {
  const newGrid = [...arr];
  for (let rowIndex = 0; rowIndex < size; rowIndex++)
    for (let colIndex = 0; colIndex < size; colIndex++)
      if (
        arr[rowIndex][colIndex].symbol != "b" &&
        arr[rowIndex][colIndex].value >= 4
      ) {
        if (arr[rowIndex - 1][colIndex].symbol != "b" && rowIndex > 0) {
          newGrid[rowIndex - 1][colIndex] = {
            symbol: arr[rowIndex][colIndex].symbol,
            value: newGrid[rowIndex - 1][colIndex].value + 1,
          }; // Вгорі
        }
        if (arr[rowIndex + 1][colIndex].symbol != "b" && rowIndex < size - 1) {
          newGrid[rowIndex + 1][colIndex] = {
            symbol: arr[rowIndex][colIndex].symbol,
            value: newGrid[rowIndex + 1][colIndex].value + 1,
          }; // Знизу
        }
        if (arr[rowIndex][colIndex - 1].symbol != "b" && colIndex > 0) {
          newGrid[rowIndex][colIndex - 1] = {
            symbol: arr[rowIndex][colIndex].symbol,
            value: newGrid[rowIndex][colIndex - 1].value + 1,
          }; // Зліва
        }
        if (arr[rowIndex][colIndex + 1].symbol != "b" && colIndex < size - 1) {
          newGrid[rowIndex][colIndex + 1] = {
            symbol: arr[rowIndex][colIndex].symbol,
            value: newGrid[rowIndex][colIndex + 1].value + 1,
          }; // Справа
        }
        newGrid[rowIndex][colIndex] = {
          symbol:
            newGrid[rowIndex][colIndex].value - 4 > 0
              ? arr[rowIndex][colIndex].symbol
              : "w",
          value: newGrid[rowIndex][colIndex].value - 4,
        };
      }
  arr = newGrid;
  endCheck(arr);
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log(`Your IP address is ${ip}`);
  switch (req.method) {
    case "PATCH":
      try {
        const { rowIndex, colIndex, symbol } = req.body;
        if (symbol) {
          arr[rowIndex][colIndex] = {
            symbol: symbol,
            value: arr[rowIndex][colIndex].value + 1,
          };
          updateArr();
          nextPlayer();
        }
      } catch (error) {
        console.error(error);
      }
      break;
    case "DELETE":
      fillArr();
      status = Statuses.Waiting;
      break;
    case "PUT":
      status = Statuses.Ingame;
      break;
  }
  updateArr();
  res.status(200).json({ status: status, grid: arr, turn: currentPlayer });
}
