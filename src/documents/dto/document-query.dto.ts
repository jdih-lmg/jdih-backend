import { z } from 'zod';

export const documentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  title: z.string().optional(),
  status: z.enum(['draft', 'verified', 'published', 'archived']).optional(),
  year: z.coerce.number().int().optional(),
  category_id: z.coerce.number().int().optional(),
});

export type DocumentQueryDto = z.infer<typeof documentQuerySchema>;
