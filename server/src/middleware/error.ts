import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors';
import { logger } from '../services/lib/logger';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Known operational errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    });
    return;
  }

  // Multer file upload errors
  if ((err as any)?.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ success: false, code: 'FILE_TOO_LARGE', message: 'Each image must be under 5 MB.' });
    return;
  }
  if ((err as any)?.code === 'LIMIT_FILE_COUNT') {
    res.status(400).json({ success: false, code: 'TOO_MANY_FILES', message: 'Maximum 5 images allowed.' });
    return;
  }
  if ((err as any)?.message === 'Only images allowed') {
    res.status(400).json({ success: false, code: 'INVALID_FILE_TYPE', message: 'Only image files (JPG, PNG, WEBP) are allowed.' });
    return;
  }

  // Prisma unique constraint violation
  if ((err as any)?.code === 'P2002') {
    const field = (err as any)?.meta?.target?.[0] ?? 'field';
    res.status(409).json({
      success: false,
      code: 'CONFLICT',
      message: `${field} already exists`,
    });
    return;
  }

  // JWT errors
  if ((err as any)?.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, code: 'TOKEN_EXPIRED', message: 'Session expired' });
    return;
  }
  if ((err as any)?.name === 'JsonWebTokenError') {
    res.status(401).json({ success: false, code: 'INVALID_TOKEN', message: 'Invalid token' });
    return;
  }

  // Unexpected errors — log full details, hide from client
  logger.error(
    { err, method: req.method, url: req.url, reqId: req.headers['x-request-id'] },
    'Unhandled error',
  );

  res.status(500).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message: 'Something went wrong',
  });
}
