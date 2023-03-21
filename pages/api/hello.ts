// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

interface Cell {
  value: number;
  symbol: string;
}

type Data = {
  grid: Cell[][];
};

let arr = Array.from(Array(5), () => new Array(5).fill({ value: 0, symbol: "w" }));

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'PUT') {
    res.status(200).json({ grid: arr });
    return;
  }
  try {
    const { rowIndex, colIndex, symbol } = req.body;
    arr[rowIndex][colIndex] = { symbol: symbol, value: arr[rowIndex][colIndex].value + 1 };
    res.status(200).json({ grid: arr });
  } catch (error) {
    console.error(error);
  }
}
