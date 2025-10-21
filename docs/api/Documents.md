# Documents API

Base URL: `/api/documents`

**Authentication Required:** Ya (semua endpoint)  
**Role Required:** ADMIN untuk create/update/delete, USER untuk read

## Endpoints

### 1. GET /api/documents

Mendapatkan daftar dokumen dengan pagination dan filter.

**Query Parameters:**

- `page` (number, optional, default: 1) - Halaman yang diminta
- `limit` (number, optional, default: 10, max: 100) - Jumlah item per halaman
- `title` (string, optional) - Filter berdasarkan judul (case-insensitive, partial match)
- `status` (string, optional) - Filter berdasarkan status: `draft`, `verified`, `published`, `archived`
- `year` (number, optional) - Filter berdasarkan tahun
- `category_id` (number, optional) - Filter berdasarkan kategori
- `type` (string, optional) - Filter berdasarkan tipe dokumen

**Contoh Request:**

```bash
GET /api/documents?page=1&limit=10&status=published&year=2025&category_id=1
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "success": true,
  "message": "Berhasil mendapatkan daftar dokumen",
  "data": [
    {
      "id": 1,
      "title": "Peraturan Bupati No. 1 Tahun 2025",
      "number": "1",
      "type": "Peraturan Bupati",
      "year": 2025,
      "subject": "Pengelolaan Sampah",
      "abstract": "Peraturan ini mengatur...",
      "keywords": "sampah, lingkungan",
      "status": "published",
      "publisher": "Bagian Hukum",
      "signed_by": "Bupati",
      "date_signed": "2025-01-15",
      "effective_date": "2025-02-01",
      "file_url": "https://example.com/doc.pdf",
      "verification_date": "2025-01-20T10:00:00.000Z",
      "category": {
        "id": 1,
        "name": "Peraturan Daerah",
        "description": "Kategori untuk Perda"
      },
      "verified_by": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "versions": [
        {
          "id": 1,
          "version_number": 1,
          "file_url": "https://example.com/doc-v1.pdf",
          "notes": "Versi awal"
        }
      ],
      "created_at": "2025-01-15T10:00:00.000Z",
      "updated_at": "2025-01-16T12:00:00.000Z",
      "deleted_at": null
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "total_pages": 3
  }
}
```

---

### 2. GET /api/documents/:id

Mendapatkan detail dokumen berdasarkan ID.

**Contoh Request:**

```bash
GET /api/documents/1
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "success": true,
  "message": "Berhasil mendapatkan dokumen",
  "data": {
    "id": 1,
    "title": "Peraturan Bupati No. 1 Tahun 2025",
    "number": "1",
    "type": "Peraturan Bupati",
    "year": 2025,
    "subject": "Pengelolaan Sampah",
    "abstract": "Peraturan ini mengatur tentang pengelolaan sampah...",
    "keywords": "sampah, lingkungan, kebersihan",
    "status": "published",
    "publisher": "Bagian Hukum",
    "signed_by": "Bupati",
    "date_signed": "2025-01-15",
    "effective_date": "2025-02-01",
    "file_url": "https://example.com/files/perbup-1-2025.pdf",
    "verification_date": "2025-01-20T10:00:00.000Z",
    "category": {
      "id": 1,
      "name": "Peraturan Daerah",
      "description": "Kategori untuk Perda",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": null
    },
    "verified_by": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "ADMIN"
    },
    "versions": [
      {
        "id": 1,
        "version_number": 1,
        "file_url": "https://example.com/doc-v1.pdf",
        "notes": "Versi awal",
        "created_at": "2025-01-15T10:00:00.000Z"
      }
    ],
    "created_at": "2025-01-15T10:00:00.000Z",
    "updated_at": "2025-01-16T12:00:00.000Z",
    "deleted_at": null
  }
}
```

**Error 404:**

```json
{
  "success": false,
  "message": "Dokumen tidak ditemukan",
  "statusCode": 404,
  "timestamp": "2025-10-21T10:30:00.000Z",
  "path": "/api/documents/999"
}
```

---

### 3. POST /api/documents

Membuat dokumen baru.

**Role Required:** ADMIN

**Request Body:**

```json
{
  "title": "string (required, min 3 karakter)",
  "number": "string (required, min 1 karakter)",
  "type": "string (required, min 1 karakter)",
  "year": "number (required, 1900-currentYear)",
  "subject": "string (optional)",
  "abstract": "string (optional)",
  "keywords": "string (optional)",
  "status": "draft | verified | published | archived (optional, default: draft)",
  "category_id": "number (optional)",
  "publisher": "string (optional)",
  "signed_by": "string (optional)",
  "date_signed": "string (optional, format: YYYY-MM-DD)",
  "effective_date": "string (optional, format: YYYY-MM-DD)",
  "file_url": "string (optional, valid URL)",
  "verification_date": "string (optional, ISO 8601 datetime)",
  "verified_by": "number (optional, user ID)"
}
```

**Contoh Request:**

```bash
POST /api/documents
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Peraturan Bupati No. 5 Tahun 2025",
  "number": "5",
  "type": "Peraturan Bupati",
  "year": 2025,
  "subject": "Pajak Daerah",
  "abstract": "Mengatur tentang pajak daerah",
  "keywords": "pajak, daerah",
  "status": "draft",
  "category_id": 1,
  "publisher": "Bagian Hukum",
  "signed_by": "Bupati",
  "date_signed": "2025-01-15",
  "effective_date": "2025-02-01"
}
```

**Response 201:**

```json
{
  "success": true,
  "message": "Dokumen berhasil dibuat",
  "data": {
    "id": 15,
    "title": "Peraturan Bupati No. 5 Tahun 2025",
    "number": "5",
    "type": "Peraturan Bupati",
    "year": 2025,
    "subject": "Pajak Daerah",
    "abstract": "Mengatur tentang pajak daerah",
    "keywords": "pajak, daerah",
    "status": "draft",
    "category_id": 1,
    "publisher": "Bagian Hukum",
    "signed_by": "Bupati",
    "date_signed": "2025-01-15",
    "effective_date": "2025-02-01",
    "created_at": "2025-10-21T10:00:00.000Z"
  }
}
```

**Error 400 - Validation Error:**

```json
{
  "success": false,
  "message": "Validation failed",
  "statusCode": 400,
  "errors": [
    {
      "field": "title",
      "message": "title must be longer than or equal to 3 characters"
    },
    {
      "field": "year",
      "message": "year must not be greater than 2025"
    }
  ],
  "timestamp": "2025-10-21T10:30:00.000Z",
  "path": "/api/documents"
}
```

**Error 404 - Category Not Found:**

```json
{
  "success": false,
  "message": "Kategori tidak ditemukan",
  "statusCode": 404,
  "timestamp": "2025-10-21T10:30:00.000Z",
  "path": "/api/documents"
}
```

---

### 4. PUT /api/documents/:id

Memperbarui dokumen berdasarkan ID (full update).

**Role Required:** ADMIN

**Request Body:** (semua field yang ada di create, semua optional untuk update)

```json
{
  "title": "string (optional)",
  "number": "string (optional)",
  "type": "string (optional)",
  "year": "number (optional)",
  "subject": "string (optional)",
  "abstract": "string (optional)",
  "keywords": "string (optional)",
  "status": "draft | verified | published | archived (optional)",
  "category_id": "number (optional)",
  "publisher": "string (optional)",
  "signed_by": "string (optional)",
  "date_signed": "string (optional)",
  "effective_date": "string (optional)",
  "file_url": "string (optional)",
  "verification_date": "string (optional)",
  "verified_by": "number (optional)"
}
```

**Contoh Request:**

```bash
PUT /api/documents/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Peraturan Bupati No. 1 Tahun 2025 (Revisi)",
  "status": "published",
  "verification_date": "2025-10-21T10:00:00.000Z",
  "verified_by": 1
}
```

**Response 200:**

```json
{
  "success": true,
  "message": "Dokumen berhasil diperbarui",
  "data": {
    "id": 1,
    "title": "Peraturan Bupati No. 1 Tahun 2025 (Revisi)",
    "number": "1",
    "type": "Peraturan Bupati",
    "year": 2025,
    "status": "published",
    "verification_date": "2025-10-21T10:00:00.000Z",
    "verified_by": 1,
    "updated_at": "2025-10-21T11:00:00.000Z"
  }
}
```

---

### 5. PATCH /api/documents/:id

Memperbarui dokumen berdasarkan ID (partial update).

**Role Required:** ADMIN

**Request Body:** (field yang ingin diupdate saja)

```json
{
  "status": "published",
  "verification_date": "2025-10-21T10:00:00.000Z"
}
```

**Response 200:** (sama dengan PUT)

---

### 6. DELETE /api/documents/:id

Soft delete dokumen berdasarkan ID.

**Role Required:** ADMIN

**Contoh Request:**

```bash
DELETE /api/documents/1
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "success": true,
  "message": "Dokumen berhasil dihapus",
  "data": {
    "id": 1,
    "title": "Peraturan Bupati No. 1 Tahun 2025",
    "deleted_at": "2025-10-21T12:00:00.000Z"
  }
}
```

**Error 404:**

```json
{
  "success": false,
  "message": "Dokumen tidak ditemukan",
  "statusCode": 404,
  "timestamp": "2025-10-21T12:00:00.000Z",
  "path": "/api/documents/1"
}
```

---

### 7. GET /api/documents/deleted

Mendapatkan semua dokumen yang sudah di-soft delete.

**Role Required:** ADMIN

**Query Parameters:** (sama seperti GET /api/documents)

**Contoh Request:**

```bash
GET /api/documents/deleted?page=1&limit=10
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "success": true,
  "message": "Berhasil mendapatkan daftar dokumen yang dihapus",
  "data": [
    {
      "id": 3,
      "title": "Peraturan Bupati No. 3 Tahun 2024",
      "number": "3",
      "type": "Peraturan Bupati",
      "year": 2024,
      "status": "archived",
      "deleted_at": "2025-10-20T12:00:00.000Z",
      "created_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "total_pages": 1
  }
}
```

---

### 8. PATCH /api/documents/:id/restore

Mengembalikan dokumen yang sudah di-soft delete.

**Role Required:** ADMIN

**Contoh Request:**

```bash
PATCH /api/documents/3/restore
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "success": true,
  "message": "Dokumen berhasil dipulihkan",
  "data": {
    "id": 3,
    "title": "Peraturan Bupati No. 3 Tahun 2024",
    "deleted_at": null,
    "updated_at": "2025-10-21T13:00:00.000Z"
  }
}
```

**Error 404:**

```json
{
  "success": false,
  "message": "Dokumen tidak ditemukan atau belum dihapus",
  "statusCode": 404,
  "timestamp": "2025-10-21T13:00:00.000Z",
  "path": "/api/documents/3/restore"
}
```

---

## Status Flow

```
draft → verified → published → archived
```

- **draft**: Dokumen baru dibuat, belum diverifikasi
- **verified**: Dokumen sudah diverifikasi oleh admin
- **published**: Dokumen dipublikasikan dan dapat diakses publik
- **archived**: Dokumen diarsipkan (tidak aktif tetapi masih tersimpan)

## Field Validations

### Required Fields:

- `title` (min: 3 characters)
- `number` (min: 1 character)
- `type` (min: 1 character)
- `year` (range: 1900 - current year)

### Optional Fields:

- `subject`, `abstract`, `keywords`, `publisher`, `signed_by`
- `date_signed`, `effective_date` (format: YYYY-MM-DD)
- `file_url` (must be valid URL if provided)
- `status` (enum: draft, verified, published, archived)
- `category_id` (must exist in database)
- `verified_by` (must be valid user ID)
- `verification_date` (ISO 8601 datetime string)

## Relations

- **category**: Many-to-One dengan DocumentCategory (optional)
- **verified_by**: Many-to-One dengan User (optional)
- **versions**: One-to-Many dengan DocumentVersion

## Audit Logs

Setiap operasi CREATE, UPDATE, DELETE pada dokumen akan tercatat di **Audit Logs** dengan informasi:

- User yang melakukan aksi
- Timestamp
- Action type (CREATE, UPDATE, DELETE, RESTORE)
- Entity: `Document`
- Data lama dan data baru (untuk UPDATE)
- IP Address dan User Agent

## Error Responses

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Unauthorized",
  "statusCode": 401
}
```

**403 Forbidden:**

```json
{
  "success": false,
  "message": "Forbidden resource",
  "statusCode": 403
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Internal server error",
  "statusCode": 500,
  "timestamp": "2025-10-21T10:30:00.000Z",
  "path": "/api/documents"
}
```
