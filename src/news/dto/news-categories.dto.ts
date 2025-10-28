import { z } from 'zod';

export const createNewsCategorySchema = z.object({
  name: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string().optional(),
});

export type CreateNewsCategoryDto = z.infer<typeof createNewsCategorySchema>;

export const updateNewsCategorySchema = createNewsCategorySchema.partial();
export type UpdateNewsCategoryDto = z.infer<typeof updateNewsCategorySchema>;
