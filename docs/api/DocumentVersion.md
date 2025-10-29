# Document Versions API

Base URL: `/api/document-versions`

Authentication:

- Public: GET /, GET /list, GET /:id, GET /documents/:documentId/versions
- Protected (JWT + PermissionGuard): POST, PUT, DELETE, GET /deleted/list, PATCH /restore/:id

Permission module: `dokumen-versi`  
Actions: `create`, `update`, `manage`

Proteksi & Error:

- Guard: JwtAuthGuard + PermissionGuard (lihat `permission.decorator.ts` dan `permission.guard.ts`)
- Error seragam oleh AllExceptionFilter:
  {
  "message": string,
  "success": false,
  "data": null,
  "path": string,
  "timestamp": string
  }

Implementasi:

- Controller: [`document-versions.controller.ts`](../../src/documents/document-versions/document-versions.controller.ts)
- Service: [`document-versions.service.ts`](../../src/documents/document-versions/document-versions.service.ts)
- Entity: [`DocumentVersion`](../../src/entities/document-versions.entity.ts)

---

## Entity Structure

```ts
type DocumentVersion = {
  id: number;
  version_number: number;
  file_url?: string | null;
  notes?: string | null;

  document?: {
    id: number;
    title: string;
    abstract?: string | null;
  } | null;

  created_at: string;
  created_by?: number | null;
  updated_at?: string | null;
  updated_by?: number | null;
  deleted_at?: string | null;
  deleted_by?: number | null;
};
```

Catatan:

- Field menggunakan snake_case sesuai entity (mis. `version_number`, `file_url`).
- Endpoint GET memetakan relasi `document` menjadi ringkas: hanya `id`, `title`, `abstract`.

---

## Endpoints

### 1) GET /api/document-versions/list

Daftar semua versi dokumen dengan pagination dan pencarian (berdasarkan `notes`).

Authentication: Public

Query:

- page (number, default: 1)
- limit (number, default: 10)
- search (string, optional) — pencarian di kolom `notes` (case-insensitive)

Response 200:

```json
{
  "message": "Berhasil mendapatkan semua versi dokumen",
  "success": true,
  "meta": { "page": 1, "total": 25, "last_page": 3 },
  "data": [
    {
      "id": 3,
      "version_number": 2,
      "file_url": "/uploads/documents/versions/perbup-5-2025-v2.pdf",
      "notes": "Revisi setelah verifikasi",
      "document": { "id": 15, "title": "Perbup No. 5/2025", "abstract": "Ringkasan ..." },
      "created_by": 2,
      "updated_by": null,
      "created_at": "2025-01-20T15:30:00.000Z",
      "updated_at": null,
      "deleted_at": null
    }
  ]
}
```

---

### 2) GET /api/document-versions

Semua versi (tanpa pagination).

Authentication: Public

Response 200:

```json
{
  "message": "Berhasil mendapatkan semua versi dokumen",
  "success": true,
  "data": [
    {
      "id": 1,
      "version_number": 1,
      "file_url": "/uploads/documents/versions/perbup-5-2025-v1.pdf",
      "notes": "Versi awal dokumen",
      "document": { "id": 15, "title": "Perbup No. 5/2025", "abstract": "Ringkasan ..." },
      "created_by": 1,
      "updated_by": null,
      "created_at": "2025-01-15T10:00:00.000Z",
      "updated_at": null,
      "deleted_at": null
    }
  ]
}
```

---

### 3) GET /api/document-versions/documents/:documentId/versions

Semua versi untuk sebuah dokumen berdasarkan `documentId`.

Authentication: Public

Params:

- documentId (number)

Response 200:

```json
{
  "message": "Berhasil mendapatkan semua versi dokumen dengan id dokumen 15",
  "success": true,
  "data": [
    {
      "id": 1,
      "version_number": 1,
      "file_url": "/uploads/documents/versions/perbup-5-2025-v1.pdf",
      "notes": "Versi awal dokumen",
      "document": { "id": 15, "title": "Perbup No. 5/2025", "abstract": "Ringkasan ..." },
      "created_at": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

Error 404 (Dokumen tidak ditemukan):

```json
{
  "message": "Dokumen dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/document-versions/documents/999/versions",
  "timestamp": "2025-10-29T11:00:00.000Z"
}
```

---

### 4) GET /api/document-versions/:id

Detail versi berdasarkan ID.

Authentication: Public

Response 200:

```json
{
  "message": "Berhasil mendapatkan versi dokumen dengan id 2",
  "success": true,
  "data": {
    "id": 2,
    "version_number": 2,
    "file_url": "/uploads/documents/versions/perbup-5-2025-v2.pdf",
    "notes": "Revisi setelah verifikasi",
    "document": { "id": 15, "title": "Perbup No. 5/2025", "abstract": "Ringkasan ..." },
    "created_by": 2,
    "updated_by": null,
    "created_at": "2025-01-20T15:30:00.000Z",
    "updated_at": null,
    "deleted_at": null
  }
}
```

Error 404:

```json
{
  "message": "Versi dokumen dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/document-versions/999",
  "timestamp": "2025-10-29T11:00:00.000Z"
}
```

---

### 5) POST /api/document-versions

Membuat versi dokumen (document_id dikirim di body).

Authentication: JWT  
Permission Required: `dokumen-versi:create`

Request Body:

```json
{
  "document_id": 15,
  "version_number": 3,
  "file_url": "/uploads/documents/versions/perbup-5-2025-v3.pdf",
  "notes": "Revisi lampiran"
}
```

Validation (berdasarkan service + entity):

- document_id: number, required (harus ada di tabel documents)
- version_number: number, required
- file_url: string, optional, max 255
- notes: string, optional

Response 201:

```json
{
  "message": "Versi dokumen berhasil dibuat",
  "success": true,
  "data": {
    "id": 3,
    "version_number": 3,
    "file_url": "/uploads/documents/versions/perbup-5-2025-v3.pdf",
    "notes": "Revisi lampiran",
    "document": { "id": 15, "title": "Perbup No. 5/2025", "abstract": "Ringkasan ..." },
    "created_by": 1,
    "created_at": "2025-10-29T11:00:00.000Z"
  }
}
```

Error 404 (Dokumen tidak ditemukan):

```json
{
  "message": "Dokumen dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/document-versions",
  "timestamp": "2025-10-29T11:00:00.000Z"
}
```

---

### 6) POST /api/document-versions/documents/:documentId/versions

Alternatif pembuatan versi di bawah path dokumen (document_id dari URL).

Authentication: JWT  
Permission Required: `dokumen-versi:create`

Params:

- documentId (number)

Request Body:

```json
{
  "version_number": 4,
  "file_url": "/uploads/documents/versions/perbup-5-2025-v4.pdf",
  "notes": "Revisi final"
}
```

Response 201:

```json
{
  "message": "Versi dokumen untuk dokumen 15 berhasil dibuat",
  "success": true,
  "data": {
    "id": 4,
    "version_number": 4,
    "file_url": "/uploads/documents/versions/perbup-5-2025-v4.pdf",
    "notes": "Revisi final",
    "document": { "id": 15, "title": "Perbup No. 5/2025", "abstract": "Ringkasan ..." },
    "created_by": 1,
    "created_at": "2025-10-29T11:20:00.000Z"
  }
}
```

---

### 7) PUT /api/document-versions/:id

Update informasi versi (sebagian/seluruh field).

Authentication: JWT  
Permission Required: `dokumen-versi:update`

Request Body (semua optional):

```json
{
  "version_number": 3,
  "file_url": "/uploads/documents/versions/perbup-5-2025-v3-updated.pdf",
  "notes": "Revisi lampiran - updated"
}
```

Response 200:

```json
{
  "message": "Versi dokumen dengan id 3 berhasil diupdate",
  "success": true,
  "data": {
    "id": 3,
    "version_number": 3,
    "file_url": "/uploads/documents/versions/perbup-5-2025-v3-updated.pdf",
    "notes": "Revisi lampiran - updated",
    "updated_by": 1,
    "updated_at": "2025-10-29T12:00:00.000Z"
  }
}
```

Error 404:

```json
{
  "message": "Versi dokumen dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/document-versions/999",
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

---

### 8) DELETE /api/document-versions/:id

Soft delete versi dokumen.

Authentication: JWT  
Permission Required: `dokumen-versi:manage`

Response 200:

```json
{
  "message": "Versi dokumen dengan id 3 berhasil dihapus",
  "success": true,
  "data": {
    "id": 3,
    "version_number": 3,
    "file_url": "/uploads/documents/versions/perbup-5-2025-v3-updated.pdf",
    "notes": "Revisi lampiran - updated",
    "deleted_at": "2025-10-29T12:30:00.000Z",
    "deleted_by": 1
  }
}
```

Error 404 (sudah dihapus):

```json
{
  "message": "Versi dokumen dengan id 3 sudah dihapus",
  "success": false,
  "data": null,
  "path": "/api/document-versions/3",
  "timestamp": "2025-10-29T12:35:00.000Z"
}
```

---

### 9) GET /api/document-versions/deleted/list

Daftar versi yang sudah dihapus (soft-deleted).

Authentication: JWT  
Permission Required: `dokumen-versi:manage`

Response 200:

```json
{
  "message": "Berhasil mendapatkan semua versi dokumen yang dihapus",
  "success": true,
  "data": [
    {
      "id": 3,
      "version_number": 3,
      "file_url": "/uploads/documents/versions/perbup-5-2025-v3-updated.pdf",
      "notes": "Revisi lampiran - updated",
      "deleted_at": "2025-10-29T12:30:00.000Z",
      "deleted_by": 1
    }
  ]
}
```

---

### 10) PATCH /api/document-versions/restore/:id

Restore versi yang dihapus.

Authentication: JWT  
Permission Required: `dokumen-versi:manage`

Response 200:

```json
{
  "message": "Versi dokumen dengan id 3 berhasil dikembalikan",
  "success": true,
  "data": {
    "id": 3,
    "version_number": 3,
    "file_url": "/uploads/documents/versions/perbup-5-2025-v3-updated.pdf",
    "notes": "Revisi lampiran - updated",
    "deleted_at": null
  }
}
```

Error 404:

```json
{
  "message": "Versi dokumen dengan id 3 tidak ditemukan atau belum dihapus",
  "success": false,
  "data": null,
  "path": "/api/document-versions/restore/3",
  "timestamp": "2025-10-29T12:45:00.000Z"
}
```

---

## Permission Matrix

| Endpoint                             | Permission           |
| ------------------------------------ | -------------------- |
| GET /                                | - (Public)           |
| GET /list                            | - (Public)           |
| GET /:id                             | - (Public)           |
| GET /documents/:documentId/versions  | - (Public)           |
| POST /                               | dokumen-versi:create |
| POST /documents/:documentId/versions | dokumen-versi:create |
| PUT /:id                             | dokumen-versi:update |
| DELETE /:id                          | dokumen-versi:manage |
| GET /deleted/list                    | dokumen-versi:manage |
| PATCH /restore/:id                   | dokumen-versi:manage |

---

## cURL Examples

List (pagination + search):

```bash
curl "http://localhost:3000/api/document-versions/list?page=1&limit=10&search=verifikasi"
```

All:

```bash
curl "http://localhost:3000/api/document-versions"
```

By document:

```bash
curl "http://localhost:3000/api/document-versions/documents/15/versions"
```

Detail:

```bash
curl "http://localhost:3000/api/document-versions/2"
```

Create (body berisi document_id):

```bash
curl -X POST "http://localhost:3000/api/document-versions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"document_id":15,"version_number":3,"file_url":"/uploads/documents/versions/perbup-5-2025-v3.pdf","notes":"Revisi lampiran"}'
```

Create (di bawah dokumen tertentu):

```bash
curl -X POST "http://localhost:3000/api/document-versions/documents/15/versions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"version_number":4,"file_url":"/uploads/documents/versions/perbup-5-2025-v4.pdf","notes":"Revisi final"}'
```

Update:

```bash
curl -X PUT "http://localhost:3000/api/document-versions/3" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes":"Revisi lampiran - updated"}'
```

Delete:

```bash
curl -X DELETE "http://localhost:3000/api/document-versions/3" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Restore:

```bash
curl -X PATCH "http://localhost:3000/api/document-versions/restore/3" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
