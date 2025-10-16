import { z } from 'zod';

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Email tidak valid')
    .max(100, 'Email maksimal 100 karakter'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

export type LoginDto = z.infer<typeof LoginSchema>;
