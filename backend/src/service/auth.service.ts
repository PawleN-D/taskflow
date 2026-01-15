import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "@/repositories/user.repository";
import type { User } from "@/types";
import { P } from "vitest/dist/reporters-w_64AS5f";

export class AuthService {
    constructor(private userRepository: UserRepository) {}

    async register(data: { email: string; password: string; name: string }): Promise<{ user: Omit<User, "password_hash">; token: string }> {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error("Email already in use");
        }

        //Hash password
        const password_hash = await bcrypt.hash(data.password, 10);

        const user = await this.userRepository.create({
            email: data.email,
            password_hash,
            name: data.name,
        });

        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET! as string, { expiresIn: "7d" });

        const { password_hash: _, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    }

    async login(data: { email: string; password: string }): Promise <{ user: Omit<User, "password_hash">; token: string }> {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET! as string, { expiresIn: "7d" });

        const { password_hash: _, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    }
}