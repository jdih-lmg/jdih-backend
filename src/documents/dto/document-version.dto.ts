import { z } from 'zod';

export const CreateDocumentVersionSchema = z.object({
  documentId: z.number().int().positive(),
  versionNumber: z.number().int().positive(),
  fileUrl: z.string().url().max(255).optional(),
  notes: z.string().max(2000).optional(),
});
export type CreateDocumentVersionDto = z.infer<typeof CreateDocumentVersionSchema>;
export const UpdateDocumentVersionSchema = CreateDocumentVersionSchema.partial();
export type UpdateDocumentVersionDto = z.infer<typeof UpdateDocumentVersionSchema>;
