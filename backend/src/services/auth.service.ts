import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'ADMIN']).optional().default('USER'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthService {
  static async register(data: z.infer<typeof registerSchema>) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw { status: 400, message: 'Email is already in use.' };
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'USER',
      },
    });

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async login(data: z.infer<typeof loginSchema>) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw { status: 401, message: 'Invalid credentials.' };
    }

    const isValidPassword = await comparePassword(data.password, user.password);
    if (!isValidPassword) {
      throw { status: 401, message: 'Invalid credentials.' };
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }
}
