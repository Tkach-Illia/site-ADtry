import { Colors } from "@/consts/Colors";
import type { NextApiRequest, NextApiResponse } from "next";

let aviableColors = Colors;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<typeof Colors>
) {
  switch (req.method) {
    case "PUT":
      try {
        const { pickedColor, oldColor } = req.body;
        aviableColors = aviableColors.filter((item) => item !== pickedColor);
        if (oldColor) {
          aviableColors.push(oldColor);
        }
      } catch {
        console.log("color.ts");
      }
      break;
    case "DELETE":
      try {
        aviableColors = Colors;
      } catch {
        console.log("color.ts");
      }

      break;
  }
  res.status(200).json(aviableColors);
}
