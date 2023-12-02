import database from "../../services/db";
import { Schema, Model, ObjectId } from "mongoose";
import { ITransaction } from "../trade/transactions";

export interface IUser {
  address: string;
  createdAt: Date;
  transactionHistory: ObjectId[] | ITransaction[];
}

const userSchema = new Schema<IUser>({
  address: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true },
  transactionHistory: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
});

const userModel: Model<IUser> = database.createModel<IUser>("User", userSchema);

export default userModel;
