import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter').max(100, 'Nama maksimal 100 karakter'),
  email: z.email('Email tidak valid').max(100, 'Email maksimal 100 karakter'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  role_id: z.number().optional(),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
