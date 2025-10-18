# Documents API

Base URL: `/api/documents`

**Authentication Required:** Ya (semua endpoint)

## Endpoints

### 1. GET /api/documents/list

Mendapatkan daftar dokumen dengan pagination dan filter.

**Query Parameters:**

- `page` (number, optional, default: 1) - Halaman yang diminta
- `limit` (number, optional, default: 10, max: 100) - Jumlah item per halaman
- `title` (string, optional) - Filter berdasarkan judul (case-insensitive)
- `status` (string, optional) - Filter berdasarkan status: `draft`, `verified`, `published`, `archived`
- `year` (number, optional) - Filter berdasarkan tahun
- `category_id` (number, optional) - Filter berdasarkan kategori

**Contoh Request:**

```bash
GET /api/documents/list?page=1&limit=10&status=published&year=2025
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "success": true,
  "message": "Berhasil mendapatkan daftar dokumen",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "last_page": 3
  },
  "data": [
    {
      "id": 1,
      "title": "Peraturan Bupati No. 1 Tahun 2025",
      "number": "1",
      "type": "Peraturan Bupati",
      "year": 2025,
      "status": "published",
      "category": {
        "id": 1,
        "name": "Peraturan Daerah"
      },
      "verified_by": {
        "id": 1,
        "name": "Admin"
      },
      "versions": [
        {
          "id": 1,
          "version_number": 1,
          "file_url": "https://example.com/doc.pdf",
          "notes": "Versi awal"
        }
      ],
      "created_at": "2025-01-15T10:00:00.000Z",
      "updated_at": "2025-01-16T12:00:00.000Z",
      "deleted_at": null
    }
  ]
}
```

---

### 2. GET /api/documents

Mendapatkan semua dokumen tanpa pagination.

**Contoh Request:**

```bash
GET /api/documents
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan semua dokumen",
  "success": true,
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
      "category": { "id": 1, "name": "Peraturan Daerah" },
      "publisher": "Bagian Hukum",
      "signed_by": "Bupati",
      "dateSigned": "2025-01-15",
      "effectiveDate": "2025-02-01",
      "fileUrl": "https://example.com/doc.pdf",
      "verificationDate": "2025-01-20T10:00:00.000Z",
      "verified_by": { "id": 1, "name": "Admin" },
      "versions": [],
      "created_at": "2025-01-15T10:00:00.000Z",
      "updated_at": null,
      "deleted_at": null
    }
  ]
}
```

---

### 3. GET /api/documents/:id

Mendapatkan detail dokumen berdasarkan ID.

**Contoh Request:**

```bash
GET /api/documents/1
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan dokumen dengan id 1",
  "success": true,
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
    "category": {
      "id": 1,
      "name": "Peraturan Daerah",
      "description": "Kategori untuk Perda"
    },
    "publisher": "Bagian Hukum",
    "signed_by": "Bupati",
    "dateSigned": "2025-01-15",
    "effectiveDate": "2025-02-01",
    "fileUrl": "https://example.com/files/perbup-1-2025.pdf",
    "verificationDate": "2025-01-20T10:00:00.000Z",
    "verified_by": {
      "id": 1,
      "name": "Admin",
      "email": "admin@jdih.com"
    },
    "versions": [],
    "created_at": "2025-01-15T10:00:00.000Z",
    "updated_at": null,
    "deleted_at": null
  }
}
```

**Error 404:**

```json
{
  "message": "Document dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/documents/999",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

### 4. POST /api/documents

Membuat dokumen baru.

**Request Body:**

```json
{
  "title": "string (min 3 karakter)",
  "number": "string (min 1 karakter)",
  "type": "string (min 1 karakter)",
  "year": "number (1900-currentYear)",
  "subject": "string (optional)",
  "abstract": "string (optional)",
  "keywords": "string (optional)",
  "status": "draft | verified | published | archived (default: draft)",
  "category_id": "number (optional)",
  "publisher": "string (optional)",
  "signed_by": "string (optional)",
  "date_signed": "date (optional)",
  "effective_date": "date (optional)",
  "file_url": "url (optional)",
  "verification_date": "date (optional)",
  "verified_by": "number (optional)"
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
  "signed_by": "Bupati"
}
```

**Response 201:**

```json
{
  "message": "Berhasil membuat dokumen baru",
  "success": true,
  "data": {
    "id": 15,
    "title": "Peraturan Bupati No. 5 Tahun 2025",
    "number": "5",
    "type": "Peraturan Bupati",
    "year": 2025,
    "status": "draft",
    "created_at": "2025-01-15T10:00:00.000Z"
  }
}
```

---

### 5. PUT /api/documents/:id

Memperbarui dokumen berdasarkan ID.

**Request Body:** (semua field optional)

```json
{
  "title": "string",
  "number": "string",
  "type": "string",
  "year": "number",
  "subject": "string",
  "abstract": "string",
  "keywords": "string",
  "status": "draft | verified | published | archived",
  "category_id": "number",
  "publisher": "string",
  "signed_by": "string",
  "date_signed": "date",
  "effective_date": "date",
  "file_url": "url",
  "verification_date": "date",
  "verified_by": "number"
}
```

**Contoh Request:**

```bash
PUT /api/documents/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Peraturan Bupati No. 1 Tahun 2025 (Updated)",
  "status": "published"
}
```

**Response 200:**

```json
{
  "message": "Berhasil memperbarui dokumen dengan id 1",
  "success": true,
  "data": {
    "id": 1,
    "title": "Peraturan Bupati No. 1 Tahun 2025 (Updated)",
    "status": "published",
    "updated_at": "2025-01-15T11:00:00.000Z"
  }
}
```

---

### 6. DELETE /api/documents/:id

Soft delete dokumen berdasarkan ID.

**Contoh Request:**

```bash
DELETE /api/documents/1
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil menghapus dokumen dengan id 1",
  "success": true,
  "data": {
    "id": 1,
    "title": "Peraturan Bupati No. 1 Tahun 2025",
    "deleted_at": "2025-01-15T12:00:00.000Z"
  }
}
```

---

### 7. GET /api/documents/deleted/list

Mendapatkan semua dokumen yang sudah di-soft delete.

**Contoh Request:**

```bash
GET /api/documents/deleted/list
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan semua dokumen yang terhapus",
  "success": true,
  "data": [
    {
      "id": 3,
      "title": "Peraturan Bupati No. 1 Tahun 2025",
      "deleted_at": "2025-01-15T12:00:00.000Z"
    }
  ]
}
```

---

### 8. PATCH /api/documents/restore/:id

Mengembalikan dokumen yang sudah di-soft delete.

**Contoh Request:**

```bash
PATCH /api/documents/restore/3
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mengembalikan dokumen dengan id 3",
  "success": true,
  "data": {
    "id": 3,
    "title": "Peraturan Bupati No. 1 Tahun 2025",
    "deleted_at": null,
    "updated_at": "2025-01-15T13:00:00.000Z"
  }
}
```

**Error 404:**

```json
{
  "message": "Document dengan id 3 tidak dalam status terhapus",
  "success": false,
  "data": null,
  "path": "/api/documents/restore/3",
  "timestamp": "2025-01-15T13:00:00.000Z"
}
```

---

## Status Flow

```
draft → verified → published → archived
```

- **draft**: Dokumen baru dibuat
- **verified**: Dokumen sudah diverifikasi oleh admin
- **published**: Dokumen dipublikasikan untuk publik
- **archived**: Dokumen diarsipkan (tidak aktif)
