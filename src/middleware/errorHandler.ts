import { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error("Unhandled error:", err.message);

  if (res.headersSent) {
    return _next(err);
  }

  res.status(500).send("An unexpected error occurred. Please try again later.");
}
