import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(3, 'Username minimal 3 karakter').max(30, 'Username maksimal 30 karakter'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Email tidak valid')
    .max(150, 'Email maksimal 150 karakter'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(100, 'Password maksimal 100 karakter'),
  roleId: z
    .number()
    .int('Role ID harus berupa angka bulat')
    .positive('Role ID harus positif')
    .optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
