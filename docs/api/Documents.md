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
  category?: {
    id: number;
    name: string;
  };
  publisher?: string;
  signed_by?: string;
  date_signed?: Date;
  effective_date?: Date;
  file_url?: string;
  verification_date?: Date;
  verified_by?: {
    id: number;
    name: string;
  };
  created_at: Date;
  created_by?: number;
  updated_at?: Date;
  updated_by?: number;
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
  "date_signed": "2025-01-15",
  "effective_date": "2025-02-01",
  "file_url": "https://example.com/uploads/documents/perbup-5-2025.pdf"
}
```

**Validation Rules:**

- `title`: Required, string, minimum 3 characters
- `number`: Required, string, minimum 1 character
- `type`: Required, string, minimum 1 character
- `year`: Required, integer, min 1900, max current year
- `subject`: Optional, string
- `abstract`: Optional, string
- `keywords`: Optional, string
- `status`: Optional, enum ('draft', 'verified', 'published', 'archived'), default 'draft'
- `category_id`: Optional, number (must exist in document_categories)
- `publisher`: Optional, string
- `signed_by`: Optional, string
- `date_signed`: Optional, date string (ISO format, akan dikonversi ke Date)
- `effective_date`: Optional, date string (ISO format, akan dikonversi ke Date)
- `verification_date`: Optional, date string (ISO format, akan dikonversi ke Date)
- `file_url`: Optional, string (harus valid URL format)
- `verified_by`: Optional, number (user ID)

**Business Rules:**

- Role `petugas_dokumen` hanya dapat membuat dokumen dengan status `draft` (status akan dipaksa menjadi draft)
- Role `admin` dan `verifikator` dapat membuat dokumen dengan status apapun
- Jika user selain admin/verifikator mencoba set status selain draft, akan error 403

**Response 201 (Created):**

```json
{
  "message": "Berhasil membuat dokumen baru",
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
    "date_signed": "2025-01-15T00:00:00.000Z",
    "effective_date": "2025-02-01T00:00:00.000Z",
    "file_url": "https://example.com/uploads/documents/perbup-5-2025.pdf",
    "verification_date": null,
    "category": {
      "id": 1,
      "name": "Hukum dan HAM"
    },
    "verified_by": null,
    "created_at": "2025-10-29T10:00:00.000Z",
    "created_by": 1,
    "updated_at": "2025-10-29T10:00:00.000Z",
    "updated_by": null
  }
}
```

**Error Responses:**

```json
// 400 Bad Request - Validation Error
{
  "message": "Validation failed: title must be at least 3 characters",
  "success": false,
  "data": null,
  "path": "/api/documents",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

```json
// 403 Forbidden - Role petugas_dokumen trying to set status other than draft
{
  "message": "Role petugas_dokumen tidak diizinkan membuat dokumen dengan status verified",
  "success": false,
  "data": null,
  "path": "/api/documents",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

```json
// 403 Forbidden - User not found
{
  "message": "User tidak ditemukan atau tidak memiliki akses.",
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

**Query Parameters:**

- `page` (number, optional, default: 1) - Nomor halaman
- `limit` (number, optional, default: 10) - Jumlah data per halaman
- `title` (string, optional) - Filter berdasarkan judul (partial match, case insensitive)
- `status` (string, optional) - Filter berdasarkan status: `draft`, `verified`, `published`, `archived`
- `year` (number, optional) - Filter berdasarkan tahun
- `category_id` (number, optional) - Filter berdasarkan kategori ID

**Example Request:**

```
GET /api/documents/list?page=1&limit=10&year=2025&status=published
GET /api/documents/list?title=peraturan&category_id=1
```

**Response 200:**

```json
{
  "success": true,
  "message": "Berhasil mendapatkan daftar dokumen",
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
      "date_signed": "2025-01-15T00:00:00.000Z",
      "effective_date": "2025-02-01T00:00:00.000Z",
      "file_url": "https://example.com/uploads/documents/perbup-5-2025.pdf",
      "verification_date": "2025-01-20T10:00:00.000Z",
      "category": {
        "id": 1,
        "name": "Hukum dan HAM"
      },
      "verified_by": {
        "id": 2,
        "name": "Verifikator User"
      },
      "created_at": "2025-10-29T10:00:00.000Z",
      "created_by": 1,
      "updated_at": "2025-10-29T10:00:00.000Z",
      "updated_by": 1
    }
  ]
}
```

---

### 3. GET /api/documents

Mendapatkan semua dokumen tanpa pagination.

**Authentication:** Public

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan semua dokumen",
  "success": true,
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
      "date_signed": "2025-01-15T00:00:00.000Z",
      "effective_date": "2025-02-01T00:00:00.000Z",
      "file_url": "https://example.com/uploads/documents/perbup-5-2025.pdf",
      "verification_date": "2025-01-20T10:00:00.000Z",
      "category": {
        "id": 1,
        "name": "Hukum dan HAM"
      },
      "verified_by": {
        "id": 2,
        "name": "Verifikator User"
      },
      "created_at": "2025-10-29T10:00:00.000Z",
      "created_by": 1,
      "updated_at": "2025-10-29T10:00:00.000Z",
      "updated_by": 1
    }
  ]
}
```

---

### 4. GET /api/documents/:id

Mendapatkan detail dokumen berdasarkan ID.

**Authentication:** Public

**Path Parameters:**

- `id` (number, required) - ID dokumen

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan dokumen dengan id 15",
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
    "date_signed": "2025-01-15T00:00:00.000Z",
    "effective_date": "2025-02-01T00:00:00.000Z",
    "file_url": "https://example.com/uploads/documents/perbup-5-2025.pdf",
    "verification_date": "2025-01-20T10:00:00.000Z",
    "category": {
      "id": 1,
      "name": "Hukum dan HAM"
    },
    "verified_by": {
      "id": 2,
      "name": "Verifikator User"
    },
    "created_at": "2025-10-29T10:00:00.000Z",
    "created_by": 1,
    "updated_at": "2025-10-29T10:00:00.000Z",
    "updated_by": 1
  }
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "message": "Document dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/documents/999",
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
  "signed_by": "H. Loekman Djoyosoemarto",
  "abstract": "Peraturan ini mengatur tentang pengelolaan anggaran daerah dengan revisi...",
  "category_id": 2
}
```

**Business Rules:**

- Role `petugas_dokumen` hanya dapat update dokumen dengan status `draft` (status akan dipaksa menjadi draft)
- Role `admin` dan `verifikator` dapat update dengan status apapun
- Jika user selain admin/verifikator mencoba set status selain draft, akan error 403
- Field `updated_by` dan `updated_at` akan otomatis diisi

**Response 200:**

```json
{
  "message": "Berhasil memperbarui dokumen dengan id 15",
  "success": true,
  "data": {
    "id": 15,
    "title": "Peraturan Bupati Lampung Tengah Nomor 5 Tahun 2025 (Revisi)",
    "number": "5",
    "type": "Peraturan Bupati",
    "year": 2025,
    "subject": "Tentang Pengelolaan Anggaran Daerah Tahun 2025",
    "abstract": "Peraturan ini mengatur tentang pengelolaan anggaran daerah dengan revisi...",
    "keywords": "anggaran,keuangan,daerah",
    "status": "draft",
    "publisher": "Pemerintah Kabupaten Lampung Tengah",
    "signed_by": "H. Loekman Djoyosoemarto",
    "date_signed": "2025-01-15T00:00:00.000Z",
    "effective_date": "2025-02-01T00:00:00.000Z",
    "file_url": "https://example.com/uploads/documents/perbup-5-2025.pdf",
    "verification_date": null,
    "category": {
      "id": 2,
      "name": "Ekonomi dan Keuangan"
    },
    "verified_by": null,
    "created_at": "2025-10-29T10:00:00.000Z",
    "created_by": 1,
    "updated_at": "2025-10-29T11:00:00.000Z",
    "updated_by": 1
  }
}
```

**Error Responses:**

```json
// 403 Forbidden - Role restriction
{
  "message": "Role petugas_dokumen tidak diizinkan membuat dokumen dengan status verified",
  "success": false,
  "data": null,
  "path": "/api/documents/15",
  "timestamp": "2025-10-29T11:00:00.000Z"
}
```

```json
// 404 Not Found
{
  "message": "Document dengan id 999 tidak ditemukan",
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

| From        | To          | Allowed Roles      | Notes                                     |
| ----------- | ----------- | ------------------ | ----------------------------------------- |
| `draft`     | `verified`  | admin, verifikator | Set `verification_date` dan `verified_by` |
| `verified`  | `published` | admin only         | Set `effective_date`                      |
| `verified`  | `archived`  | admin only         | -                                         |
| `published` | `archived`  | admin only         | -                                         |
| `archived`  | `draft`     | admin only         | Reset verification info                   |

**Special Rules:**

- `petugas_dokumen` tidak boleh mengubah status dokumen sama sekali (akan error 403)
- Transisi yang tidak ada di tabel akan error 400 Bad Request

**Response 200:**

```json
{
  "message": "Berhasil mengubah status dokumen dengan id 15 menjadi verified",
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
    "status": "verified",
    "publisher": "Pemerintah Kabupaten Lampung Tengah",
    "signed_by": "Bupati Lampung Tengah",
    "date_signed": "2025-01-15T00:00:00.000Z",
    "effective_date": "2025-02-01T00:00:00.000Z",
    "file_url": "https://example.com/uploads/documents/perbup-5-2025.pdf",
    "verification_date": "2025-10-29T11:00:00.000Z",
    "category": {
      "id": 1,
      "name": "Hukum dan HAM"
    },
    "verified_by": {
      "id": 2,
      "name": "Verifikator User"
    },
    "created_at": "2025-10-29T10:00:00.000Z",
    "created_by": 1,
    "updated_at": "2025-10-29T11:00:00.000Z",
    "updated_by": 2
  }
}
```

**Error Responses:**

```json
// 400 Bad Request - Status field empty
{
  "message": "status harus diisi",
  "success": false,
  "data": null,
  "path": "/api/documents/15/status",
  "timestamp": "2025-10-29T11:00:00.000Z"
}
```

```json
// 400 Bad Request - Invalid status transition
{
  "message": "Transisi status dari draft ke published tidak diizinkan",
  "success": false,
  "data": null,
  "path": "/api/documents/15/status",
  "timestamp": "2025-10-29T11:00:00.000Z"
}
```

```json
// 403 Forbidden - petugas_dokumen trying to change status
{
  "message": "Petugas dokumen tidak boleh mengubah status dokumen",
  "success": false,
  "data": null,
  "path": "/api/documents/15/status",
  "timestamp": "2025-10-29T11:00:00.000Z"
}
```

```json
// 403 Forbidden - Insufficient permission for transition
{
  "message": "Role verifikator tidak memiliki izin untuk mengubah status dari verified ke published",
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
  "message": "Berhasil menghapus dokumen dengan id 15",
  "success": true,
  "data": {
    "id": 15,
    "title": "Peraturan Bupati Lampung Tengah Nomor 5 Tahun 2025",
    "number": "5",
    "type": "Peraturan Bupati",
    "year": 2025,
    "status": "draft",
    "created_at": "2025-10-29T10:00:00.000Z",
    "created_by": 1,
    "updated_at": "2025-10-29T11:00:00.000Z",
    "updated_by": 1
  }
}
```

**Notes:**

- Dokumen tidak benar-benar dihapus dari database (soft delete)
- Field `deleted_at` akan diisi dengan timestamp
- Field `deleted_by` akan diisi dengan user ID yang menghapus

**Error Responses:**

```json
// 404 Not Found
{
  "message": "Document dengan id 999 tidak ditemukan",
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
  "message": "Berhasil mendapatkan semua dokumen yang terhapus",
  "success": true,
  "data": [
    {
      "id": 10,
      "title": "Peraturan Bupati Nomor 3 Tahun 2024",
      "number": "3",
      "type": "Peraturan Bupati",
      "year": 2024,
      "subject": "Tentang Pengelolaan Aset Daerah",
      "abstract": "...",
      "keywords": "aset,pengelolaan",
      "status": "draft",
      "publisher": "Pemerintah Kabupaten Lampung Tengah",
      "signed_by": "Bupati Lampung Tengah",
      "date_signed": "2024-03-15T00:00:00.000Z",
      "effective_date": null,
      "file_url": "https://example.com/uploads/documents/perbup-3-2024.pdf",
      "verification_date": null,
      "category": {
        "id": 2,
        "name": "Ekonomi dan Keuangan"
      },
      "verified_by": null,
      "created_at": "2024-03-10T10:00:00.000Z",
      "created_by": 1,
      "updated_at": "2025-10-25T10:00:00.000Z",
      "updated_by": 1
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
  "message": "Berhasil mengembalikan dokumen dengan id 10",
  "success": true,
  "data": {
    "id": 10,
    "title": "Peraturan Bupati Nomor 3 Tahun 2024",
    "number": "3",
    "type": "Peraturan Bupati",
    "year": 2024,
    "subject": "Tentang Pengelolaan Aset Daerah",
    "abstract": "...",
    "keywords": "aset,pengelolaan",
    "status": "draft",
    "publisher": "Pemerintah Kabupaten Lampung Tengah",
    "signed_by": "Bupati Lampung Tengah",
    "date_signed": "2024-03-15T00:00:00.000Z",
    "effective_date": null,
    "file_url": "https://example.com/uploads/documents/perbup-3-2024.pdf",
    "verification_date": null,
    "category": {
      "id": 2,
      "name": "Ekonomi dan Keuangan"
    },
    "verified_by": null,
    "created_at": "2024-03-10T10:00:00.000Z",
    "created_by": 1,
    "updated_at": "2025-10-29T11:30:00.000Z",
    "updated_by": 1
  }
}
```

**Error Responses:**

```json
// 404 Not Found - Document not found
{
  "message": "Document dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/documents/restore/999",
  "timestamp": "2025-10-29T11:00:00.000Z"
}
```

```json
// 404 Not Found - Document not deleted
{
  "message": "Document dengan id 10 tidak dalam status terhapus",
  "success": false,
  "data": null,
  "path": "/api/documents/restore/10",
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

| Endpoint           | Permission Required  | Notes                              |
| ------------------ | -------------------- | ---------------------------------- |
| GET /list          | -                    | Public                             |
| GET /              | -                    | Public                             |
| GET /:id           | -                    | Public                             |
| POST /             | `dokumen` → `create` | `petugas_dokumen` hanya bisa draft |
| PUT /:id           | `dokumen` → `update` | `petugas_dokumen` hanya bisa draft |
| PATCH /:id/status  | `dokumen` → `verify` | Tergantung transisi status         |
| DELETE /:id        | `dokumen` → `manage` | Soft delete                        |
| GET /deleted/list  | `dokumen` → `manage` | -                                  |
| PATCH /restore/:id | `dokumen` → `manage` | -                                  |

## Role-Based Access Control

### Petugas Dokumen

- Dapat membuat dokumen (hanya status `draft`)
- Dapat mengupdate dokumen (hanya status `draft`)
- **TIDAK DAPAT** mengubah status dokumen
- **TIDAK DAPAT** menghapus atau restore dokumen

### Verifikator

- Dapat membuat dokumen (semua status)
- Dapat mengupdate dokumen (semua status)
- Dapat mengubah status: `draft` → `verified`
- **TIDAK DAPAT** publish atau archive dokumen
- **TIDAK DAPAT** menghapus atau restore dokumen

### Admin

- Dapat melakukan semua operasi
- Dapat mengubah status apapun
- Dapat menghapus dan restore dokumen
- Full access ke semua endpoint

## Audit Logging

Semua operasi CREATE, UPDATE, DELETE, dan perubahan STATUS akan tercatat dalam tabel `audit_logs` dengan informasi:

- User yang melakukan aksi (`user_id`)
- Timestamp (`created_at`)
- Action type (CREATE, UPDATE, DELETE)
- Entity type ('Document', 'Document Status')
- Entity ID (`entity_id`)
- Data sebelum perubahan (`old_value`)
- Data setelah perubahan (`new_value`)

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

### Membuat Dokumen Draft (Petugas Dokumen)

```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Peraturan Bupati Nomor 1 Tahun 2025",
    "number": "1",
    "type": "Peraturan Bupati",
    "year": 2025,
    "subject": "Tentang Tata Kelola Pemerintahan",
    "category_id": 1,
    "signed_by": "Bupati Lampung Tengah",
    "date_signed": "2025-01-10"
  }'
```

### Mencari Dokumen dengan Filter

```bash
# Cari berdasarkan tahun dan status
curl "http://localhost:3000/api/documents/list?page=1&limit=10&year=2025&status=published"

# Cari berdasarkan judul
curl "http://localhost:3000/api/documents/list?title=peraturan&limit=20"

# Cari berdasarkan kategori
curl "http://localhost:3000/api/documents/list?category_id=1&page=2"
```

### Verifikasi Dokumen (Verifikator/Admin)

```bash
curl -X PATCH http://localhost:3000/api/documents/15/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "verified"}'
```

### Publikasi Dokumen (Admin Only)

```bash
curl -X PATCH http://localhost:3000/api/documents/15/status \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "published"}'
```

### Update Dokumen

```bash
curl -X PUT http://localhost:3000/api/documents/15 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Tentang Pengelolaan Anggaran Daerah Tahun 2025 (Diperbarui)",
    "abstract": "Peraturan ini mengatur tentang pengelolaan anggaran daerah dengan ketentuan baru...",
    "keywords": "anggaran,keuangan,daerah,updated"
  }'
```

### Menghapus Dokumen (Admin)

```bash
curl -X DELETE http://localhost:3000/api/documents/15 \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### Melihat Dokumen yang Dihapus (Admin)

```bash
curl http://localhost:3000/api/documents/deleted/list \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### Restore Dokumen (Admin)

```bash
curl -X PATCH http://localhost:3000/api/documents/restore/15 \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## Notes

- Semua date fields menggunakan ISO 8601 format
- File upload dilakukan terpisah, endpoint ini hanya menerima URL file
- Query parameter `title` menggunakan case-insensitive partial match
- Pagination dimulai dari page 1 (bukan 0)
- Default limit adalah 10 items per page
- Semua endpoint yang memerlukan authentication menggunakan JWT Bearer token
- Token harus dikirim di header: `Authorization: Bearer <token>`
