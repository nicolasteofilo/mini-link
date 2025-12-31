import type { Request, Response, NextFunction } from "express";
import { z, type ZodTypeAny } from "zod";

export const validateParams =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid params", errors: z.treeifyError(parsed.error) });
    }

    return next();
  };
