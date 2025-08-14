import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { AuthError } from '../utils/errors';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new AuthError('Access token required', 401);
    }

    const user = await authService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AuthError('Insufficient permissions', 403));
    }

    next();
  };
};
