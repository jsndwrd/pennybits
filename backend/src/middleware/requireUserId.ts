import type { Request, Response, NextFunction } from "express";

export function requireUserId(req: Request, res: Response, next: NextFunction) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  req.userId = userId;
  next();
}

