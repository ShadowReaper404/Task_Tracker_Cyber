import { Request, Response, NextFunction } from "express";
import { generateCsrfToken, verifyCsrfToken } from "../lib/csrf";

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateCsrfToken();
  }

  res.locals.csrfToken = req.session.csrfToken;

  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const token = req.body?._csrf || req.headers["x-csrf-token"] as string;

    if (!verifyCsrfToken(req.session.csrfToken, token)) {
      return res.status(403).send("Invalid CSRF token");
    }
  }

  next();
}
