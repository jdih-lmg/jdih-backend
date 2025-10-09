import { z } from 'zod';

export const createDocumentSchema = z.object({
  title: z.string().min(3),
  number: z.string().min(1),
  type: z.string().min(1),
  year: z.number().int(),
  subject: z.string().optional(),
  abstract: z.string().optional(),
  keywords: z.string().optional(),
  status: z.enum(['draft', 'verified', 'published', 'archived']).default('draft'),
  category_id: z.number().optional(),
  publisher: z.string().optional(),
  signed_by: z.string().optional(),
  date_signed: z.string().optional(),
  effective_date: z.string().optional(),
  file_url: z.string().url().optional(),
});

export const updateDocumentSchema = createDocumentSchema.partial();

export type CreateDocumentDto = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentDto = z.infer<typeof updateDocumentSchema>;
