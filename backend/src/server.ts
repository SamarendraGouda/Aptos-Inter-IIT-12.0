import app from "./app";
import dotenv from "dotenv";
import database from "./services/db";

const startServer = async () => {
  dotenv.config();
  await database.connect();

  app.listen(8000, () => {
    console.log("listening on 8000");
  });
};

startServer();
