import type { NextApiRequest, NextApiResponse } from "next";

type Data = String[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(["red", "green"]);
}
