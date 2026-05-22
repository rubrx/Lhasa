import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../shared/errors';

type Target = 'body' | 'params' | 'query';

export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const first = result.error.issues[0];
      const field = first.path.join('.') || 'input';
      return next(new ValidationError(`${field}: ${first.message}`));
    }

    // Replace with coerced/parsed data (handles defaults, trims, etc.)
    req[target] = result.data;
    next();
  };
}
