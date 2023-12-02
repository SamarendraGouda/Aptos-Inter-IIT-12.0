import addUser from "../controllers/users";
import { Router } from "express";

const userRouter: Router = Router();

userRouter.post("/add", addUser);

export default userRouter;
