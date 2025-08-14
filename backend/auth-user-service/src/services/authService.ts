import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/database';
import { AuthError } from '../utils/errors';

// Types for authentication - Phase 1
export interface AuthUser {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  acceptTerms: boolean;
  marketingConsent?: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
  private readonly JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  async register(data: RegisterData): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() }
    });

    if (existingUser) {
      throw new AuthError('User with this email already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        isVerified: false,
        role: 'USER'
      }
    });

    // Create user profile
    await prisma.userProfile.create({
      data: {
        userId: user.id
      }
    });

    // Generate tokens
    const { token, refreshToken, expiresAt } = await this.generateTokens(user.id);

    // Create session
    await prisma.authSession.create({
      data: {
        userId: user.id,
        token,
        refreshToken,
        expiresAt
      }
    });

    return {
      user: this.mapToAuthUser(user),
      token,
      refreshToken,
      expiresAt
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email.toLowerCase() }
    });

    if (!user) {
      throw new AuthError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AuthError('Account is deactivated', 403);
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new AuthError('Invalid email or password', 401);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate tokens
    const { token, refreshToken, expiresAt } = await this.generateTokens(user.id);

    // Create session
    await prisma.authSession.create({
      data: {
        userId: user.id,
        token,
        refreshToken,
        expiresAt
      }
    });

    return {
      user: this.mapToAuthUser(user),
      token,
      refreshToken,
      expiresAt
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as { userId: string };
      
      const session = await prisma.authSession.findFirst({
        where: {
          refreshToken,
          isActive: true,
          expiresAt: { gt: new Date() }
        },
        include: { user: true }
      });

      if (!session) {
        throw new AuthError('Invalid refresh token', 401);
      }

      // Generate new tokens
      const { token: newToken, refreshToken: newRefreshToken, expiresAt } = await this.generateTokens(session.userId);

      // Update session
      await prisma.authSession.update({
        where: { id: session.id },
        data: {
          token: newToken,
          refreshToken: newRefreshToken,
          expiresAt,
          lastUsedAt: new Date()
        }
      });

      return {
        user: this.mapToAuthUser(session.user),
        token: newToken,
        refreshToken: newRefreshToken,
        expiresAt
      };
    } catch (error) {
      throw new AuthError('Invalid refresh token', 401);
    }
  }

  async logout(token: string): Promise<void> {
    await prisma.authSession.updateMany({
      where: { token },
      data: { isActive: false }
    });
  }

  async logoutAll(userId: string): Promise<void> {
    await prisma.authSession.updateMany({
      where: { userId },
      data: { isActive: false }
    });
  }

  async verifyToken(token: string): Promise<AuthUser> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string };
      
      const session = await prisma.authSession.findFirst({
        where: {
          token,
          isActive: true,
          expiresAt: { gt: new Date() }
        },
        include: { user: true }
      });

      if (!session) {
        throw new AuthError('Invalid token', 401);
      }

      return this.mapToAuthUser(session.user);
    } catch (error) {
      throw new AuthError('Invalid token', 401);
    }
  }

  private async generateTokens(userId: string) {
    const token = jwt.sign({ userId }, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
    const refreshToken = jwt.sign({ userId }, this.JWT_REFRESH_SECRET, { expiresIn: this.JWT_REFRESH_EXPIRES_IN });
    
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes

    return { token, refreshToken, expiresAt };
  }

  private mapToAuthUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}

export const authService = new AuthService();
