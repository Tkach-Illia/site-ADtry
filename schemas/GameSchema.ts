import { IGame } from "@/interfaces/IGame";
import mongoose, { Model, Schema } from "mongoose";

const GameSchema: Schema<IGame> = new Schema({
  grid: {
    type: [[[Number, String]]],
    required: true,
  },
  ips: {
    type: [String],
    required: true,
  },
});

const Game: Model<IGame> = mongoose.model("Game", GameSchema);

export default Game;
