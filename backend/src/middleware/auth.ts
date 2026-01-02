import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import env from '../lib/env';
import { getUserPermissions } from '../lib/userPermissions';

// Extend Express Request type to include user and permissions
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                name: string;
                roleId?: number | null;
            };
            permissions?: string[];
        }
    }
}

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({
            error: 'Access token required'
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as {
            id: number;
            email: string;
            name: string;
            roleId?: number | null;
        };

        req.user = decoded;

        // Fetch user permissions and attach to request
        const permissions = await getUserPermissions(decoded.id);
        req.permissions = permissions;

        next();
    } catch (error) {
        res.status(403).json({
            error: 'Invalid or expired token'
        });
    }
};

