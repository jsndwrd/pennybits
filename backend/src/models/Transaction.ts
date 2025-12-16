import mongoose, { Schema } from "mongoose";

export type TransactionType = 0 | 1;

export interface TransactionDocument extends mongoose.Document {
  userId: string;
  date: Date;
  type: TransactionType;
  amount: number;
  category:
    | "Utilities"
    | "Personal"
    | "Consumption"
    | "Transportation"
    | "Education";
  description?: string;
}

const TransactionSchema = new Schema<TransactionDocument>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: Date, default: () => new Date() },
    type: { type: Number, enum: [0, 1], required: true },
    amount: { type: Number, min: 0, required: true },
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
    description: { type: String },
  },
  { timestamps: true },
);

export const Transaction =
  mongoose.models.Transaction ||
  mongoose.model<TransactionDocument>("Transaction", TransactionSchema);

