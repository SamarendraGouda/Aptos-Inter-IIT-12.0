import userModel from "../models/auth/users";
import { Request, Response } from "express";

const addUser = async (req: Request, res: Response) => {
  try {
    const { address } = req.body;
    const user = await userModel.create({
      address,
      createdAt: new Date(),
      transactionHistory: [],
    });
    res.status(201).json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default addUser;
