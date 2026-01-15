import { Router } from "express";
import { AuthService } from "@/service/auth.service";
import { UserRepository } from "@/repositories/user.repository";
import { registerSchema } from "@/lib/validation";
import { AppError } from "@/middleware/errorHandler";

const router = Router();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

router.post("/register", async (req, res, next) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const result = await authService.register(validatedData);
        res.status(201).json(result);
    } catch (error) {
        if (error instanceof AppError) {
            if(error.message === 'User already exists') {
                return next(new AppError(409, error.message));
            }

            if(error.name === 'ZodError') {
                return next(new AppError(400, 'Validation Failed'));
            }
        }
        next(error);
    }
});
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            throw new AppError(400, "Email and password are required");
        }
        const result = await authService.login({ email, password });
        res.status(200).json(result);
    } catch (error) {
        if(error instanceof Error && error.message === 'Invalid credentials'){
            return next (new AppError(401, error.message)); 
        }
        next(error);
        
    }
});

export default router;