import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateInput = (
  schema: ZodSchema,
  source: "body" | "query" | "params" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: result.error.errors[0]?.message,
        errors: result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }

    next();
  };
};
