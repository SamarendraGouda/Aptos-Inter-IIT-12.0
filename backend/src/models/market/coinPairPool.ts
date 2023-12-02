import { Schema, ObjectId, Model } from "mongoose";
import { MARKET_POOL_MODEL_NAME } from "../../utils/constants";
import database from "../../services/db";
import { ICoinPairPool } from "./coinPair";

interface IMarketPool {
  coinPairs: ObjectId[] | ICoinPairPool[];
}

const marketPoolSchema = new Schema<IMarketPool>({
  coinPairs: [{ type: Schema.Types.ObjectId, required: true }],
});

const marketPoolModel: Model<IMarketPool> = database.createModel<IMarketPool>(
  MARKET_POOL_MODEL_NAME,
  marketPoolSchema
);

export default marketPoolModel;
