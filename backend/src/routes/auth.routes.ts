import { Router } from 'express';
import { UserRepository } from '../repositories/user.repository.js';
import { registerSchema } from '../lib/validation.js';
import { AppError } from '../middleware/errorHandler.js';
import { ZodError } from 'zod';
import { AuthService } from '@/service/auth.service.js';

const router = Router();
const userRepo = new UserRepository();
const authService = new AuthService(userRepo);

router.post('/register', async (req, res, next) => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);

    // Register user
    const result = await authService.register(validatedData);

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      // Extract the first error message
      const firstError = error.errors[0];
      const message = `${firstError.path.join('.')}: ${firstError.message}`;
      return next(new AppError(400, message));
    }
    
    if (error instanceof Error) {
      if (error.message === 'User already exists') {
        return next(new AppError(409, error.message));
      }
    }
    
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'Email and password are required');
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      return next(new AppError(401, error.message));
    }
    next(error);
  }
});

export default router;