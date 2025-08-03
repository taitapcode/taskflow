import z from 'zod';

export const signupSchema = z
  .object({
    displayName: z.string().min(3, 'Display name must be at least 3 characters long'),
    email: z.email({ error: 'Invalid email address' }),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password does not match',
    path: ['confirmPassword'],
  });

export type SignupSchema = z.infer<typeof signupSchema>;
