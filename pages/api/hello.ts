import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  grid: Cell[][];
};

interface Cell {
  value: number;
  symbol: string;
}

let arr = Array.from(Array(5), () =>
  new Array(5).fill({ value: 0, symbol: "w" })
);

function updateArr() {
  const newGrid = [...arr];
  for (let rowIndex = 0; rowIndex < 5; rowIndex++)
    for (let colIndex = 0; colIndex < 5; colIndex++)
      if (arr[rowIndex][colIndex].value >= 4) {
        newGrid[rowIndex][colIndex] = {
          symbol: arr[rowIndex][colIndex].symbol,
          value: newGrid[rowIndex][colIndex].value - 4,
        };
        if (rowIndex > 0) {
          newGrid[rowIndex - 1][colIndex] = {
            symbol: arr[rowIndex][colIndex].symbol,
            value: newGrid[rowIndex - 1][colIndex].value + 1,
          }; // Вгорі
        }
        if (rowIndex < 4) {
          newGrid[rowIndex + 1][colIndex] = {
            symbol: arr[rowIndex][colIndex].symbol,
            value: newGrid[rowIndex + 1][colIndex].value + 1,
          }; // Знизу
        }
        if (colIndex > 0) {
          newGrid[rowIndex][colIndex - 1] = {
            symbol: arr[rowIndex][colIndex].symbol,
            value: newGrid[rowIndex][colIndex - 1].value + 1,
          }; // Зліва
        }
        if (colIndex < 4) {
          newGrid[rowIndex][colIndex + 1] = {
            symbol: arr[rowIndex][colIndex].symbol,
            value: newGrid[rowIndex][colIndex + 1].value + 1,
          }; // Справа
        }
      }
  arr = newGrid;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "PUT") {
    try {
      const { rowIndex, colIndex, symbol, userId } = req.body;
      arr[rowIndex][colIndex] = {
        symbol: symbol,
        value: arr[rowIndex][colIndex].value + 1,
      };
      updateArr();
      res.status(200).json({ grid: arr });
    } catch (error) {
      console.error(error);
    }
  } else {
    updateArr();
    res.status(200).json({ grid: arr });
  }
}
