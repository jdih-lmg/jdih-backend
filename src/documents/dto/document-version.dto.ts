import { z } from 'zod';

export const CreateDocumentVersionSchema = z.object({
  document_id: z.number().int().positive('ID dokumen harus berupa angka positif'),
  version_number: z.number().int().positive().min(1, 'Nomor versi minimal adalah 1'),
  file_url: z.url().max(255).optional(),
  notes: z.string().max(2000).optional(),
});
export type CreateDocumentVersionDto = z.infer<typeof CreateDocumentVersionSchema>;

export const UpdateDocumentVersionSchema = CreateDocumentVersionSchema.partial();
export type UpdateDocumentVersionDto = z.infer<typeof UpdateDocumentVersionSchema>;
