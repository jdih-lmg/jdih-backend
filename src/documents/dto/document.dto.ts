import { z } from 'zod';

export const CreateDocumentSchema = z.object({
  title: z.string().min(3).max(255),
  number: z.string().min(2).max(100),
  type: z.string().min(2).max(100),
  year: z.number().int().gte(1900).lte(new Date().getFullYear()),
  subject: z.string().max(1000).optional(),
  abstract: z.string().max(2000).optional(),
  keywords: z.string().max(255).optional(),
  status: z.enum(['draft', 'verified', 'published', 'archived']).default('draft').optional(),
  categoryId: z.number().int().positive().nullable().optional(),
  publisher: z.string().max(150).optional(),
  signedBy: z.string().max(150).optional(),
  dateSigned: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
  }, z.date().optional()),
  effectiveDate: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
  }, z.date().optional()),
  fileUrl: z.string().url().max(255).optional(),
  verificationDate: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
  }, z.date().optional()),
  verifiedBy: z.number().int().positive().nullable().optional(),
});
export type CreateDocumentDto = z.infer<typeof CreateDocumentSchema>;

export const UpdateDocumentSchema = CreateDocumentSchema.partial();
export type UpdateDocumentDto = z.infer<typeof UpdateDocumentSchema>;
