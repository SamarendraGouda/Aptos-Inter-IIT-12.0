import { Schema, Model } from "mongoose";
import { ICoinCombination } from "./coinCombination";
import database from "../../services/db";
import { COIN_PAIR_POOL_MODEL_NAME } from "../../utils/constants";

export interface ICoinPairPool {
  coin1: ICoinCombination;
  coin2: ICoinCombination;
  valueProduct: number;
}

const coinPairPoolSchema = new Schema<ICoinPairPool>({
  coin1: { type: Schema.Types.ObjectId, required: true },
  coin2: { type: Schema.Types.ObjectId, required: true },
  valueProduct: { type: Number, required: true },
});

const coinPairPoolModel: Model<ICoinPairPool> = database.createModel(
  COIN_PAIR_POOL_MODEL_NAME,
  coinPairPoolSchema
);

export default coinPairPoolModel;
