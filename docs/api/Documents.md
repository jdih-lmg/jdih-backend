# Documents API

Base URL: `/api/documents`

**Authentication Required:** Ya (untuk semua endpoint kecuali yang diberi label Public)  
**Role Required:** Berbeda-beda per endpoint (menggunakan Permission-based Access Control)

## Overview

API Documents mengelola dokumen hukum dalam sistem JDIH. Dokumen memiliki berbagai jenis seperti Peraturan Daerah, Peraturan Bupati, Keputusan Bupati, dll. Setiap dokumen memiliki status (draft, verified, published, archived) dan dapat memiliki multiple versions.

## Document Entity Structure

```typescript
{
  id: number;
  title: string;
  number: string;
  type: string;
  year: number;
  subject?: string;
  abstract?: string;
  keywords?: string;
  status: 'draft' | 'verified' | 'published' | 'archived';
  category?: DocumentCategory;
  publisher?: string;
  signed_by?: string;
  dateSigned?: Date;
  effectiveDate?: Date;
  fileUrl?: string;
  verificationDate?: Date;
  verified_by?: User;
  versions: DocumentVersion[];
  created_at: Date;
  created_by?: number;
  updated_at?: Date;
  updated_by?: number;
  deleted_at?: Date;
  deleted_by?: number;
}
```

## Endpoints

### 1. POST /api/documents

Membuat dokumen baru.

**Authentication:** Required  
**Permission Required:** `dokumen` → `create`

**Request Body:**

```json
{
  "title": "Peraturan Bupati Lampung Tengah Nomor 5 Tahun 2025",
  "number": "5",
  "type": "Peraturan Bupati",
  "year": 2025,
  "subject": "Tentang Pengelolaan Anggaran Daerah",
  "abstract": "Peraturan ini mengatur tentang pengelolaan anggaran daerah...",
  "keywords": "anggaran,keuangan,daerah",
  "category_id": 1,
  "publisher": "Pemerintah Kabupaten Lampung Tengah",
  "signed_by": "Bupati Lampung Tengah",
  "dateSigned": "2025-01-15",
  "effectiveDate": "2025-02-01",
  "fileUrl": "/uploads/documents/perbup-5-2025.pdf"
}
```

**Validation Rules:**

- `title`: Required, string, max 255 characters
- `number`: Required, string, max 100 characters
- `type`: Required, string, max 100 characters
- `year`: Required, number (integer)
- `subject`: Optional, text
- `abstract`: Optional, text
- `keywords`: Optional, string, max 255 characters
- `category_id`: Optional, number (must exist in document_categories)
- `publisher`: Optional, string, max 150 characters
- `signed_by`: Optional, string, max 150 characters
- `dateSigned`: Optional, date (YYYY-MM-DD)
- `effectiveDate`: Optional, date (YYYY-MM-DD)
- `fileUrl`: Optional, string, max 255 characters

**Business Rules:**

- Role `petugas_dokumen` hanya dapat membuat dokumen dengan status `draft`
- Role `admin` dan `verifikator` dapat membuat dokumen dengan status apapun

**Response 201 (Created):**

```json
{
  "message": "Dokumen berhasil dibuat",
  "success": true,
  "data": {
    "id": 15,
    "title": "Peraturan Bupati Lampung Tengah Nomor 5 Tahun 2025",
    "number": "5",
    "type": "Peraturan Bupati",
    "year": 2025,
    "subject": "Tentang Pengelolaan Anggaran Daerah",
    "abstract": "Peraturan ini mengatur tentang pengelolaan anggaran daerah...",
    "keywords": "anggaran,keuangan,daerah",
    "status": "draft",
    "publisher": "Pemerintah Kabupaten Lampung Tengah",
    "signed_by": "Bupati Lampung Tengah",
    "dateSigned": "2025-01-15T00:00:00.000Z",
    "effectiveDate": "2025-02-01T00:00:00.000Z",
    "fileUrl": "/uploads/documents/perbup-5-2025.pdf",
    "verificationDate": null,
    "created_at": "2025-10-29T10:00:00.000Z",
    "updated_at": "2025-10-29T10:00:00.000Z",
    "deleted_at": null,
    "created_by": 1,
    "updated_by": null,
    "deleted_by": null,
    "category": {
      "id": 1,
      "name": "Hukum dan HAM",
      "slug": "hukum-dan-ham"
    },
    "verified_by": null,
    "versions": []
  }
}
```

**Error Responses:**

```json
// 400 Bad Request - Validation Error
{
  "message": "title is required, year must be a number",
  "success": false,
  "data": null,
  "path": "/api/documents",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

```json
// 403 Forbidden - Permission Denied
{
  "message": "Anda tidak memiliki izin untuk membuat dokumen",
  "success": false,
  "data": null,
  "path": "/api/documents",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

```json
// 404 Not Found - Category Not Found
{
  "message": "Kategori tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/documents",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

---

### 2. GET /api/documents/list

Mendapatkan daftar dokumen dengan pagination dan filter.

**Authentication:** Public (dapat diakses tanpa login)  
**Note:** Hanya menampilkan dokumen dengan status `published` untuk user yang tidak login

**Query Parameters:**

- `page` (number, optional, default: 1) - Nomor halaman
- `limit` (number, optional, default: 10) - Jumlah data per halaman
- `title` (string, optional) - Filter berdasarkan judul (partial match)
- `status` (string, optional) - Filter berdasarkan status: `draft`, `verified`, `published`, `archived`
- `year` (number, optional) - Filter berdasarkan tahun
- `category_id` (number, optional) - Filter berdasarkan kategori
- `type` (string, optional) - Filter berdasarkan tipe dokumen

**Example Request:**

```
GET /api/documents/list?page=1&limit=10&year=2025&status=published
```

**Response 200:**

```json
{
  "message": "Berhasil mengambil data dokumen",
  "success": true,
  "meta": {
    "page": 1,
    "total": 45,
    "last_page": 5
  },
  "data": [
    {
      "id": 15,
      "title": "Peraturan Bupati Lampung Tengah Nomor 5 Tahun 2025",
      "number": "5",
      "type": "Peraturan Bupati",
      "year": 2025,
      "subject": "Tentang Pengelolaan Anggaran Daerah",
      "abstract": "Peraturan ini mengatur tentang pengelolaan anggaran daerah...",
      "keywords": "anggaran,keuangan,daerah",
      "status": "published",
      "publisher": "Pemerintah Kabupaten Lampung Tengah",
      "signed_by": "Bupati Lampung Tengah",
      "dateSigned": "2025-01-15T00:00:00.000Z",
      "effectiveDate": "2025-02-01T00:00:00.000Z",
      "fileUrl": "/uploads/documents/perbup-5-2025.pdf",
      "verificationDate": "2025-01-20T10:00:00.000Z",
      "created_at": "2025-10-29T10:00:00.000Z",
      "updated_at": "2025-10-29T10:00:00.000Z",
      "category": {
        "id": 1,
        "name": "Hukum dan HAM",
        "slug": "hukum-dan-ham"
      },
      "verified_by": {
        "id": 2,
        "name": "Verifikator User",
        "email": "verifikator@jdih.com"
      }
    }
  ]
}
```

**Error Responses:**

```json
// 500 Internal Server Error
{
  "message": "Terjadi kesalahan pada server",
  "success": false,
  "data": null,
  "path": "/api/documents/list",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

---

### 3. GET /api/documents

Mendapatkan semua dokumen tanpa pagination.

**Authentication:** Public

**Response 200:**

```json
{
  "message": "Berhasil mengambil data dokumen",
  "success": true,
  "data": [
    {
      "id": 15,
      "title": "Peraturan Bupati Lampung Tengah Nomor 5 Tahun 2025",
      "number": "5",
      "type": "Peraturan Bupati",
      "year": 2025,
      "status": "published",
      "created_at": "2025-10-29T10:00:00.000Z"
    }
  ]
}
```

---

### 4. GET /api/documents/:id

Mendapatkan detail dokumen berdasarkan ID.

**Authentication:** Public (untuk dokumen dengan status `published`)

**Path Parameters:**

- `id` (number, required) - ID dokumen

**Response 200:**

```json
{
  "message": "Berhasil mengambil dokumen",
  "success": true,
  "data": {
    "id": 15,
    "title": "Peraturan Bupati Lampung Tengah Nomor 5 Tahun 2025",
    "number": "5",
    "type": "Peraturan Bupati",
    "year": 2025,
    "subject": "Tentang Pengelolaan Anggaran Daerah",
    "abstract": "Peraturan ini mengatur tentang pengelolaan anggaran daerah...",
    "keywords": "anggaran,keuangan,daerah",
    "status": "published",
    "publisher": "Pemerintah Kabupaten Lampung Tengah",
    "signed_by": "Bupati Lampung Tengah",
    "dateSigned": "2025-01-15T00:00:00.000Z",
    "effectiveDate": "2025-02-01T00:00:00.000Z",
    "fileUrl": "/uploads/documents/perbup-5-2025.pdf",
    "verificationDate": "2025-01-20T10:00:00.000Z",
    "created_at": "2025-10-29T10:00:00.000Z",
    "updated_at": "2025-10-29T10:00:00.000Z",
    "deleted_at": null,
    "created_by": 1,
    "updated_by": 1,
    "deleted_by": null,
    "category": {
      "id": 1,
      "name": "Hukum dan HAM",
      "slug": "hukum-dan-ham",
      "description": "Kategori dokumen terkait hukum dan HAM"
    },
    "verified_by": {
      "id": 2,
      "name": "Verifikator User",
      "email": "verifikator@jdih.com"
    },
    "versions": [
      {
        "id": 1,
        "version": 1,
        "fileUrl": "/uploads/documents/versions/perbup-5-2025-v1.pdf",
        "notes": "Versi awal",
        "created_at": "2025-10-29T10:00:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "message": "Dokumen tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/documents/15",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

---

### 5. PUT /api/documents/:id

Mengupdate dokumen yang sudah ada.

**Authentication:** Required  
**Permission Required:** `dokumen` → `update`

**Path Parameters:**

- `id` (number, required) - ID dokumen

**Request Body:** (Semua field optional, hanya kirim field yang ingin diupdate)

```json
{
  "title": "Peraturan Bupati Lampung Tengah Nomor 5 Tahun 2025 (Revisi)",
  "subject": "Tentang Pengelolaan Anggaran Daerah Tahun 2025",
  "signed_by": "H. Loekman Djoyosoemarto"
}
```

**Business Rules:**

- Role `petugas_dokumen` hanya dapat update dokumen dengan status `draft`
- Tidak dapat mengubah status dokumen melalui endpoint ini (gunakan PATCH `/api/documents/:id/status`)

**Response 200:**

```json
{
  "message": "Dokumen berhasil diupdate",
  "success": true,
  "data": {
    "id": 15,
    "title": "Peraturan Bupati Lampung Tengah Nomor 5 Tahun 2025 (Revisi)",
    "subject": "Tentang Pengelolaan Anggaran Daerah Tahun 2025",
    "signed_by": "H. Loekman Djoyosoemarto",
    "updated_at": "2025-10-29T11:00:00.000Z",
    "updated_by": 1
  }
}
```

**Error Responses:**

```json
// 403 Forbidden - Cannot update published document
{
  "message": "Tidak dapat mengubah dokumen yang sudah dipublikasi",
  "success": false,
  "data": null,
  "path": "/api/documents/15",
  "timestamp": "2025-10-29T11:00:00.000Z"
}
```

```json
// 404 Not Found
{
  "message": "Dokumen tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/documents/999",
  "timestamp": "2025-10-29T11:00:00.000Z"
}
```

---

### 6. PATCH /api/documents/:id/status

Mengubah status dokumen.

**Authentication:** Required  
**Permission Required:** `dokumen` → `verify`

**Path Parameters:**

- `id` (number, required) - ID dokumen

**Request Body:**

```json
{
  "status": "verified"
}
```

**Allowed Status Transitions:**

- `draft` → `verified` (admin, verifikator)
- `verified` → `published` (admin only)
- `verified` → `archived` (admin only)
- `published` → `archived` (admin only)
- `archived` → `draft` (admin only)

**Response 200:**

```json
{
  "message": "Status dokumen berhasil diubah",
  "success": true,
  "data": {
    "id": 15,
    "status": "verified",
    "verificationDate": "2025-10-29T11:00:00.000Z",
    "verified_by": {
      "id": 2,
      "name": "Verifikator User"
    }
  }
}
```

**Error Responses:**

```json
// 400 Bad Request - Invalid status transition
{
  "message": "Transisi status tidak valid: draft → published",
  "success": false,
  "data": null,
  "path": "/api/documents/15/status",
  "timestamp": "2025-10-29T11:00:00.000Z"
}
```

```json
// 403 Forbidden - Insufficient permission
{
  "message": "Anda tidak memiliki izin untuk memverifikasi dokumen",
  "success": false,
  "data": null,
  "path": "/api/documents/15/status",
  "timestamp": "2025-10-29T11:00:00.000Z"
}
```

---

### 7. DELETE /api/documents/:id

Menghapus dokumen (soft delete).

**Authentication:** Required  
**Permission Required:** `dokumen` → `manage`

**Path Parameters:**

- `id` (number, required) - ID dokumen

**Response 200:**

```json
{
  "message": "Dokumen berhasil dihapus",
  "success": true,
  "data": null
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "message": "Dokumen tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/documents/999",
  "timestamp": "2025-10-29T11:00:00.000Z"
}
```

```json
// 403 Forbidden
{
  "message": "Anda tidak memiliki izin untuk menghapus dokumen",
  "success": false,
  "data": null,
  "path": "/api/documents/15",
  "timestamp": "2025-10-29T11:00:00.000Z"
}
```

---

### 8. GET /api/documents/deleted/list

Mendapatkan daftar dokumen yang telah dihapus (soft deleted).

**Authentication:** Required  
**Permission Required:** `dokumen` → `manage`

**Response 200:**

```json
{
  "message": "Berhasil mengambil dokumen yang dihapus",
  "success": true,
  "data": [
    {
      "id": 10,
      "title": "Peraturan Bupati Nomor 3 Tahun 2024",
      "number": "3",
      "year": 2024,
      "status": "draft",
      "deleted_at": "2025-10-25T10:00:00.000Z",
      "deleted_by": 1
    }
  ]
}
```

---

### 9. PATCH /api/documents/restore/:id

Restore dokumen yang telah dihapus.

**Authentication:** Required  
**Permission Required:** `dokumen` → `manage`

**Path Parameters:**

- `id` (number, required) - ID dokumen yang akan di-restore

**Response 200:**

```json
{
  "message": "Dokumen berhasil direstore",
  "success": true,
  "data": {
    "id": 10,
    "title": "Peraturan Bupati Nomor 3 Tahun 2024",
    "deleted_at": null,
    "deleted_by": null
  }
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "message": "Dokumen tidak ditemukan atau belum dihapus",
  "success": false,
  "data": null,
  "path": "/api/documents/restore/999",
  "timestamp": "2025-10-29T11:00:00.000Z"
}
```

---

## Document Status

| Status      | Deskripsi                                    | Dapat diakses public? |
| ----------- | -------------------------------------------- | --------------------- |
| `draft`     | Dokumen masih draft, belum diverifikasi      | ❌                    |
| `verified`  | Dokumen sudah diverifikasi, siap dipublikasi | ❌                    |
| `published` | Dokumen sudah dipublikasikan                 | ✅                    |
| `archived`  | Dokumen diarsipkan (tidak aktif)             | ❌                    |

## Permission Matrix

| Endpoint           | Permission Required  | Notes                         |
| ------------------ | -------------------- | ----------------------------- |
| GET /list          | -                    | Public (hanya published)      |
| GET /              | -                    | Public (hanya published)      |
| GET /:id           | -                    | Public (hanya published)      |
| POST /             | `dokumen` → `create` | `petugas_dokumen` hanya draft |
| PUT /:id           | `dokumen` → `update` | -                             |
| PATCH /:id/status  | `dokumen` → `verify` | Tergantung transisi status    |
| DELETE /:id        | `dokumen` → `manage` | Soft delete                   |
| GET /deleted/list  | `dokumen` → `manage` | -                             |
| PATCH /restore/:id | `dokumen` → `manage` | -                             |

## Audit Logging

Semua operasi CREATE, UPDATE, DELETE, dan perubahan STATUS akan tercatat dalam tabel `audit_logs` dengan informasi:

- User yang melakukan aksi
- Timestamp
- Action type (CREATE, UPDATE, DELETE, STATUS_CHANGE)
- Data sebelum dan sesudah perubahan

## File Upload Notes

- File upload dilakukan terpisah menggunakan multipart/form-data
- File yang diupload disimpan di folder `/uploads/documents/`
- Format file yang didukung: PDF
- Maximum file size: 10MB (configurable)
- File path disimpan di field `fileUrl`

## Error Response Format

Semua error mengikuti format standar dari `AllExceptionFilter`:

```json
{
  "message": "Pesan error yang deskriptif",
  "success": false,
  "data": null,
  "path": "/api/endpoint/yang/error",
  "timestamp": "2025-10-29T11:00:00.000Z"
}
```

### Common HTTP Status Codes

- `200 OK` - Request berhasil
- `201 Created` - Resource berhasil dibuat
- `400 Bad Request` - Validation error atau bad input
- `401 Unauthorized` - Token tidak valid atau expired
- `403 Forbidden` - User tidak memiliki permission
- `404 Not Found` - Resource tidak ditemukan
- `500 Internal Server Error` - Error pada server

## Examples

### Membuat Dokumen Draft

```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Peraturan Bupati Nomor 1 Tahun 2025",
    "number": "1",
    "type": "Peraturan Bupati",
    "year": 2025,
    "category_id": 1
  }'
```

### Mencari Dokumen

```bash
curl "http://localhost:3000/api/documents/list?page=1&limit=10&year=2025&title=Peraturan"
```

### Mengubah Status Dokumen

```bash
curl -X PATCH http://localhost:3000/api/documents/15/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "verified"}'
```
