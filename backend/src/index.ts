import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDb } from "./db.js";
import { transactionsRouter } from "./routes/transactions.js";

dotenv.config();

const app = express();

app.use(express.json());

const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
app.use(cors({ origin: frontendOrigin }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/transactions", transactionsRouter);

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  },
);

const port = Number(process.env.PORT || 4000);

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start backend:", err);
    process.exit(1);
  });

