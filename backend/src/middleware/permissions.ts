/**
 * Permission Check Middleware
 * Middleware to check if user has required permissions
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware factory to check if user has a specific permission
 */
export const requirePermission = (requiredPermission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication required'
            });
        }

        const userPermissions = req.permissions || [];

        if (!userPermissions.includes(requiredPermission)) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                required: requiredPermission,
                message: `You need the permission: ${requiredPermission}`
            });
        }

        next();
    };
};

/**
 * Middleware factory to check if user has any of the specified permissions
 */
export const requireAnyPermission = (requiredPermissions: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication required'
            });
        }

        const userPermissions = req.permissions || [];

        const hasPermission = requiredPermissions.some(permission =>
            userPermissions.includes(permission)
        );

        if (!hasPermission) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                required: requiredPermissions,
                message: `You need at least one of these permissions: ${requiredPermissions.join(', ')}`
            });
        }

        next();
    };
};

/**
 * Middleware factory to check if user has all of the specified permissions
 */
export const requireAllPermissions = (requiredPermissions: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication required'
            });
        }

        const userPermissions = req.permissions || [];

        const hasAllPermissions = requiredPermissions.every(permission =>
            userPermissions.includes(permission)
        );

        if (!hasAllPermissions) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                required: requiredPermissions,
                message: `You need all of these permissions: ${requiredPermissions.join(', ')}`
            });
        }

        next();
    };
};

