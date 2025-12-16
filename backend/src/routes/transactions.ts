import express from "express";
import mongoose from "mongoose";
import { Transaction } from "../models/Transaction.js";
import { requireUserId } from "../middleware/requireUserId.js";

export const transactionsRouter = express.Router();

transactionsRouter.use(requireUserId);

transactionsRouter.get("/", async (req, res) => {
  const userId = req.userId!;
  const transactions = await Transaction.find({ userId }).sort({
    date: -1,
    createdAt: -1,
  });
  res.json(transactions);
});

transactionsRouter.post("/", async (req, res) => {
  const userId = req.userId!;
  const { date, type, amount, category, description } = req.body ?? {};

  const created = await Transaction.create({
    userId,
    date,
    type,
    amount,
    category,
    description,
  });

  res.status(201).json(created);
});

transactionsRouter.delete("/:id", async (req, res) => {
  const userId = req.userId!;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid transaction id" });
  }

  const transaction = await Transaction.findById(id);
  if (!transaction) return res.status(404).json({ error: "Transaction not found" });
  if (transaction.userId !== userId) return res.status(403).json({ error: "Forbidden" });

  const deleted = await Transaction.findByIdAndDelete(id);
  res.json(deleted);
});

