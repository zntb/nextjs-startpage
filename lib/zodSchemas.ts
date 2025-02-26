import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters long')
      .max(25, 'Name must be at most 25 characters long')
      .regex(
        /^[a-z0-9_]+$/,
        'Username must contain only lowercase letters, numbers, and underscores',
      ),
    email: z.string().email().trim(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .trim(),
});
