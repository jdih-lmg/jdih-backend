import { z } from 'zod';

export const UpdateUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Username minimal 3 karakter')
    .max(30, 'Username maksimal 30 karakter')
    .optional(),
  email: z.string().email('Email tidak valid').optional(),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(100, 'Password maksimal 100 karakter')
    .optional(),
  roleId: z
    .number()
    .int('Role ID harus berupa angka bulat')
    .positive('Role ID harus positif')
    .optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
