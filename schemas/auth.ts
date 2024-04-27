import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const RegisterSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name is required'),
    email: z
      .string({ required_error: 'Email is required' })
      .min(1, 'Email is required')
      .email('Invalid email'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password !== data.confirmPassword) {
        return false;
      }

      return true;
    },
    {
      message: 'Passwords must match',
      path: ['confirmPassword'],
    },
  );

export const ForgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export const VerifyEmailSchema = z.string();
