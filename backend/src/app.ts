import express, { Express } from "express";
import cors, { CorsOptions } from "cors";
import transactioRouter from "./routes/transactions";
import userRouter from "./routes/users";

const app: Express = express();

const corsOptions: CorsOptions = {
  origin: ["http://localhost:3000", "http://localhost:8080"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.get("/", (req, res) => {
  res.send("Test Working!");
});

app.use(cors(corsOptions));
app.use("/transactions", transactioRouter);
app.use("/users", userRouter);

export default app;
