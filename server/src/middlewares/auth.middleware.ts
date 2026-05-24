import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '../../generated/prisma';
import { env } from '../config/env';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {// 1. Get the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, code: 'UNAUTHORIZED', message: 'No token provided' });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, env.JWT_SECRET) as {
            userId: number;
            role: Role;
        };

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, code: 'UNAUTHORIZED', message: 'Invalid or expired token' });
    }

};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ success: false, code: 'FORBIDDEN', message: 'Access denied' });
  }
  next();
};