import { Model, ObjectId, Schema } from "mongoose";
import { ICoin } from "./coin";
import database from "../../services/db";
import { COIN_COMBINATION_MODEL_NAME } from "../../utils/constants";

export interface ICoinCombination {
  coin: ObjectId | ICoin;
  value: number;
}

const coinCombinationSchema = new Schema<ICoinCombination>({
  coin: { type: Schema.Types.ObjectId, required: true },
  value: { type: Number, required: true },
});

const coinCombinationModel: Model<ICoinCombination> =
  database.createModel<ICoinCombination>(
    COIN_COMBINATION_MODEL_NAME,
    coinCombinationSchema
  );

export default coinCombinationModel;
