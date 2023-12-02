import mongoose, { Mongoose, Model, model, Schema } from "mongoose";
import { handleError } from "../utils/errorHandler";

class Database {
  baseURL: string;
  name: string;

  constructor(baseURL: string, name: string) {
    this.baseURL = baseURL;
    this.name = name;
  }

  connect = async () => {
    const dbURL = `${this.baseURL}/${this.name}`;
    try {
      const db: Mongoose = await mongoose.connect(dbURL);
      console.log("db created successfully");
    } catch (error) {
      handleError(error, "create database");
    }
  };

  createModel<T>(modelName: string, schema: Schema<T>): Model<T> {
    return model<T>(modelName, schema);
  }
}

const DB_NAME: string = "futures";
const DB_URL: string = process.env.DB_URL ?? "mongodb://127.0.0.1/";

const database: Readonly<Database> = Object.freeze(
  new Database(DB_URL, DB_NAME)
);

export default database;
