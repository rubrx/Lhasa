import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '../../generated/prisma';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {// 1. Get the Authorization header
        const authHeader = req.headers.authorization;

        // 2. Check if it exists and starts with "Bearer "
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No Token provided" });
        }

        // 3. Extract the token
        const token = authHeader.split(" ")[1];

        // 4. Verify the token using jwt.verify
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: number;
            role: Role;
        };

        // 5. Attach decoded data to req.user
        req.user = decoded;

        // 6. Call next()
        next();
    } catch (error) {
        // Handle errors: no token = 401, invalid/expired token = 401
        return res.status(401).json({ message: "Invalid or expired token" });
    }

};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};