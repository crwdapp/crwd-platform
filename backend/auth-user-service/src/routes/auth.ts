import { Router } from 'express';
import { authService } from '../services/authService';
import { authenticateToken } from '../middleware/auth';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validators/authValidators';
import { ValidationError } from '../utils/errors';

const router = Router();

// Register - Phase 1
router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      throw new ValidationError('Validation failed', error.details);
    }

    const result = await authService.register(value);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Login - Phase 1
router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      throw new ValidationError('Validation failed', error.details);
    }

    const result = await authService.login(value);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Refresh token - Phase 1
router.post('/refresh', async (req, res, next) => {
  try {
    const { error, value } = refreshTokenSchema.validate(req.body);
    if (error) {
      throw new ValidationError('Validation failed', error.details);
    }

    const result = await authService.refreshToken(value.refreshToken);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Logout - Phase 1
router.post('/logout', authenticateToken, async (req: any, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await authService.logout(token);
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

// Logout all sessions - Phase 1
router.post('/logout-all', authenticateToken, async (req: any, res, next) => {
  try {
    await authService.logoutAll(req.user.id);
    res.json({ message: 'Logged out from all sessions' });
  } catch (error) {
    next(error);
  }
});

// Get current user - Phase 1
router.get('/me', authenticateToken, async (req: any, res, next) => {
  try {
    const user = await authService.verifyToken(req.headers.authorization?.split(' ')[1]!);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export default router;
