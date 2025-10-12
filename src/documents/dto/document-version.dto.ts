import { z } from 'zod';

export const CreateDocumentVersionSchema = z.object({
  documentId: z.number().int().positive('ID dokumen harus berupa angka positif'),
  versionNumber: z.number().int().positive().min(1, 'Nomor versi minimal adalah 1'),
  fileUrl: z
    .url({ protocol: /^https$/, message: 'url file tidak valid atau tidak aman' })
    .max(255)
    .optional(),
  notes: z.string().max(2000).optional(),
});
export type CreateDocumentVersionDto = z.infer<typeof CreateDocumentVersionSchema>;

export const UpdateDocumentVersionSchema = CreateDocumentVersionSchema.partial();
export type UpdateDocumentVersionDto = z.infer<typeof UpdateDocumentVersionSchema>;
