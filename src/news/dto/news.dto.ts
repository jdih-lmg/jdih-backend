import { z } from 'zod';

export const createNewsSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung'),
  content: z.string().min(10, 'Konten berita minimal 10 karakter'),
  thumbnail_url: z.url('URL thumbnail tidak valid').optional(),
  author_id: z.number().optional(),
  category_ids: z.array(z.number()).optional(),
  is_published: z.boolean().default(false),
  published_at: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined)),
});

export const updateNewsSchema = createNewsSchema.partial();

export type CreateNewsDto = z.infer<typeof createNewsSchema>;
export type UpdateNewsDto = z.infer<typeof updateNewsSchema>;
