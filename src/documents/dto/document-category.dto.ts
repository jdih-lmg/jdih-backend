import { z } from 'zod';

export const CreateDocumentCategorySchema = z.object({
  name: z.string().min(2).max(150, 'Nama kategori dokumen maksimal 150 karakter'),
  description: z.string().optional(),
});
export type CreateDocumentCategoryDto = z.infer<typeof CreateDocumentCategorySchema>;

export const UpdateDocumentCategorySchema = CreateDocumentCategorySchema.partial();
export type UpdateDocumentCategoryDto = z.infer<typeof UpdateDocumentCategorySchema>;
