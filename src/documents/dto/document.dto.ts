import { z } from 'zod';

export const createDocumentSchema = z.object({
  title: z.string().min(3),
  number: z.string().min(1),
  type: z.string().min(1),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  subject: z.string().optional(),
  abstract: z.string().optional(),
  keywords: z.string().optional(),
  status: z.enum(['draft', 'verified', 'published', 'archived']).default('draft'),
  category_id: z.number().optional(),
  publisher: z.string().optional(),
  signed_by: z.string().optional(),
  date_signed: z.date().optional(),
  effective_date: z.date().optional(),
  file_url: z.url().optional(),
  verification_date: z.date().optional(),
  verified_by: z.number().optional(),
});

export const updateDocumentSchema = createDocumentSchema.partial();

export type CreateDocumentDto = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentDto = z.infer<typeof updateDocumentSchema>;
