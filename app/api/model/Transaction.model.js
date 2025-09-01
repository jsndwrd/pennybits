import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true, // Add index for better query performance
    },
    date: {
      type: Date,
      default: new Date(Date.now()).toISOString().split("T")[0],
    },
    type: {
      type: Number,
      enum: [0, 1],
      required: true,
    },
    amount: {
      type: Number,
      min: 0,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Utilities",
        "Personal",
        "Consumption",
        "Transportation",
        "Education",
      ],
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true },
);

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);

export default Transaction;
