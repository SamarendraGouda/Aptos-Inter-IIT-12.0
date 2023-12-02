import { Schema, Model } from "mongoose";
import database from "../../services/db";
import { COIN_MODEL_NAME } from "../../utils/constants";

export interface ICoin {
  name: string;
  symbol: string;
  address: string;
}

const coinSchema = new Schema<ICoin>({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  address: { type: String, required: true },
});

const coinModel: Model<ICoin> = database.createModel<ICoin>(
  COIN_MODEL_NAME,
  coinSchema
);
export default coinModel;
