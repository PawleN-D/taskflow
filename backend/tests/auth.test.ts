import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
// import { app } from '../src/app';
import { db } from '../src/db/connection';
import { users } from '../src/db/schema';
import { eq } from 'drizzle-orm';

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    // Clean users table before each test
    await db.delete(users);
  });

  it('should register a new user with valid data', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      name: 'Test User',
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.user.name).toBe(userData.name);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).not.toHaveProperty('password_hash');
  });

  it('should reject registration with invalid email', async () => {
    const userData = {
      email: 'invalid-email',
      password: 'SecurePass123!',
      name: 'Test User',
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('email');
  });

  it('should reject registration with weak password', async () => {
    const userData = {
      email: 'test@example.com',
      password: '123',
      name: 'Test User',
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(400);

    expect(response.body.error).toContain('password');
  });

  it('should reject duplicate email registration', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      name: 'Test User',
    };

    // First registration
    await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    // Duplicate registration
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(409);

    expect(response.body.error).toContain('already exists');
  });

  it('should hash the password before storing', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      name: 'Test User',
    };

    await request(app)
      .post('/api/auth/register')
      .send(userData);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email));

    expect(user.password_hash).not.toBe(userData.password);
    expect(user.password_hash.length).toBeGreaterThan(50);
  });
});