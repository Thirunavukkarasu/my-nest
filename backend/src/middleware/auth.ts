import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import env from '../lib/env';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                name: string;
            };
        }
    }
}

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            error: 'Access token required'
        });
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as {
            id: number;
            email: string;
            name: string;
        };

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            error: 'Invalid or expired token'
        });
    }
};

