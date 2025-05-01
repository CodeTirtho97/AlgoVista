import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import { User, IUser } from '../models';
import config from '../config';

interface JwtPayload {
  id: string;
  email: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Verify JWT token and return the payload
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    if (!token) {
      throw new AuthenticationError('Authentication token is required');
    }
    
    // Remove "Bearer " prefix if present
    const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    // Verify token
    const decoded = jwt.verify(tokenValue, config.jwtSecret) as JwtPayload;
    
    return decoded;
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
};

/**
 * Get user from token
 */
export const getUserFromToken = async (token?: string): Promise<IUser> => {
  try {
    if (!token) {
      throw new AuthenticationError('Authentication required');
    }
    
    // Verify token and get payload
    const decoded = verifyToken(token);
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new AuthenticationError('User not found');
    }
    
    if (!user.isActive) {
      throw new AuthenticationError('User account is inactive');
    }
    
    return user;
  } catch (error) {
    throw new AuthenticationError('Authentication required');
  }
};

/**
 * Authentication middleware for Express routes
 */
export const authenticateUser = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    // Get user from token
    const user = await getUserFromToken(token);
    
    // Attach user to request
    req.user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Authentication failed'
    });
  }
};

/**
 * Admin authorization middleware
 */
export const authorizeAdmin = (req: any, res: any, next: any) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Admin privileges required'
    });
  }
  
  next();
};