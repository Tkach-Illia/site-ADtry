import { Colors } from "@/consts/Colors";
import type { NextApiRequest, NextApiResponse } from "next";

let aviableColors = Colors;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<typeof Colors>
) {
  res.status(200).json(aviableColors);
}
