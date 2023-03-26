import { Colors } from "@/consts/Colors";
import type { NextApiRequest, NextApiResponse } from "next";

let aviableColors = Colors;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<typeof Colors>
) {
  if (req.method === "PUT") {
    try {
      const { pickedColor, oldColor } = req.body;
      aviableColors = aviableColors.filter((item) => item !== pickedColor);
      if (oldColor) {
        aviableColors.push(oldColor);
      }
      res.status(200).json(aviableColors);
    } catch {
      console.log("color.ts");
    }
  } else {
    res.status(200).json(aviableColors);
  }
}
