import { Router } from "express";
import { AuthService } from "@/service/auth.service";
import { UserRepository } from "@/repositories/user.repository";
import { registerSchema } from "@/lib/validation";
import { AppError } from "@/middleware/errorHandler";

const router = Router();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

router.post("/register", async (req, res, next) => {});
router.post("/login", async (req, res, next) => {});

export default router;