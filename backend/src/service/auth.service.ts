import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository.js';
import { IUser } from '../db/models/User.js';

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  async register(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<{ user: Partial<IUser>; token: string }> {
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const password_hash = await bcrypt.hash(data.password, 10);

    const user = await this.userRepo.create({
      email: data.email,
      password_hash,
      name: data.name,
    });

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return { user: userWithoutPassword, token };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: Partial<IUser>; token: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const userWithoutPassword = {
      _id: user._id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return { user: userWithoutPassword, token };
  }
}