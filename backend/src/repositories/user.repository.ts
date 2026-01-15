import {db} from '../db/connection';
import {users} from '../db/schema';
import {eq} from 'drizzle-orm';
import type {User} from '../types';

export class UserRepository {
    async create(data: {
        email: string;
        password_hash: string;
        name: string;
    }): Promise<User> {
        const [user] = await db.insert(users).values(data).returning();
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const [user] =await db.select().from(users).where(eq(users.email, email));
        return user || null;
    }

    async findById(id: string): Promise<User | null> {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || null;
    }
}