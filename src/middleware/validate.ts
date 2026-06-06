import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export function validate(schema: ZodSchema, source: "body" | "query" | "params" = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[source]);
      req[source] = data;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorIssues = (err.issues || []).map((e: any) => ({
          field: e.path?.join(".") || "",
          message: e.message,
        }));
        return res.status(400).json({ errors: errorIssues });
      }
      next(err);
    }
  };
}
