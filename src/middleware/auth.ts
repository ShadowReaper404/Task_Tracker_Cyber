import { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    csrfToken?: string;
    userId?: string;
  }
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId) {
    return next();
  }
  return res.redirect("/login");
}

export function isGuest(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return next();
  }
  return res.redirect("/dashboard");
}
