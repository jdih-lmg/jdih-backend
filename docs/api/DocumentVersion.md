# Document Versions API

Base URL: `/api/document-versions`

**Authentication Required:** Ya

## Endpoints

### 1. GET /api/document-versions/list

Mendapatkan daftar versi dokumen dengan pagination dan pencarian.

**Query Parameters:**

- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)
- `search` (string, optional) - Pencarian berdasarkan notes

**Contoh Request:**

```bash
GET /api/document-versions/list?page=1&limit=10&search=amandemen
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan semua versi dokumen",
  "success": true,
  "data": [
    {
      "id": 1,
      "version_number": 2,
      "file_url": "https://example.com/doc-v2.pdf",
      "notes": "Versi amandemen",
      "document": {
        "id": 4,
        "title": "Peraturan Bupati No. 1 Tahun 2025",
        "abstract": "Peraturan ini mengatur..."
      },
      "created_by": 1,
      "updated_by": null,
      "created_at": "2025-01-15T10:00:00.000Z",
      "updated_at": null,
      "deleted_at": null
    }
  ],
  "meta": {
    "data": "...",
    "total": 10,
    "page": 1,
    "last_page": 1
  }
}
```

---

### 2. GET /api/document-versions

Mendapatkan semua versi dokumen tanpa pagination.

**Contoh Request:**

```bash
GET /api/document-versions
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan semua versi dokumen",
  "success": true,
  "data": [
    {
      "id": 1,
      "version_number": 1,
      "file_url": "https://example.com/doc.pdf",
      "notes": "Versi awal",
      "document": {
        "id": 4,
        "title": "Peraturan Bupati No. 1 Tahun 2025",
        "abstract": "Peraturan ini mengatur..."
      },
      "created_by": 1,
      "created_at": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### 3. GET /api/document-versions/documents/:documentId/versions

Mendapatkan semua versi untuk dokumen tertentu.

**Contoh Request:**

```bash
GET /api/document-versions/documents/4/versions
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan semua versi dokumen dengan id dokumen 4",
  "success": true,
  "data": [
    {
      "id": 1,
      "version_number": 1,
      "file_url": "https://example.com/doc-v1.pdf",
      "notes": "Versi awal",
      "document": {
        "id": 4,
        "title": "Peraturan Bupati No. 1 Tahun 2025",
        "abstract": "Peraturan ini mengatur..."
      },
      "created_at": "2025-01-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "version_number": 2,
      "file_url": "https://example.com/doc-v2.pdf",
      "notes": "Revisi pasal 5",
      "document": {
        "id": 4,
        "title": "Peraturan Bupati No. 1 Tahun 2025",
        "abstract": "Peraturan ini mengatur..."
      },
      "created_at": "2025-01-16T10:00:00.000Z"
    }
  ]
}
```

---

### 4. GET /api/document-versions/:id

Mendapatkan detail versi dokumen berdasarkan ID.

**Contoh Request:**

```bash
GET /api/document-versions/1
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan versi dokumen dengan id 1",
  "success": true,
  "data": {
    "id": 1,
    "version_number": 2,
    "file_url": "https://example.com/doc-v2.pdf",
    "notes": "Perubahan pasal 5",
    "document": {
      "id": 4,
      "title": "Peraturan Bupati No. 1 Tahun 2025",
      "abstract": "Peraturan ini mengatur..."
    },
    "created_by": 1,
    "updated_by": null,
    "created_at": "2025-01-15T10:00:00.000Z",
    "updated_at": null,
    "deleted_at": null
  }
}
```

**Error 404:**

```json
{
  "message": "Versi dokumen dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/document-versions/999",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

### 5. POST /api/document-versions

Membuat versi dokumen baru (dengan `document_id` di body).

**Request Body:**

```json
{
  "document_id": "number (required, ID dokumen yang valid)",
  "version_number": "number (required, min: 1)",
  "file_url": "string (optional, max 255, valid URL)",
  "notes": "string (optional, max 2000)"
}
```

**Contoh Request:**

```bash
POST /api/document-versions
Authorization: Bearer <token>
Content-Type: application/json

{
  "document_id": 4,
  "version_number": 3,
  "file_url": "https://example.com/doc-v3.pdf",
  "notes": "Revisi final"
}
```

**Response 201:**

```json
{
  "message": "Versi dokumen berhasil dibuat",
  "success": true,
  "data": {
    "id": 3,
    "document_id": 4,
    "version_number": 3,
    "file_url": "https://example.com/doc-v3.pdf",
    "notes": "Revisi final",
    "created_at": "2025-01-15T10:00:00.000Z"
  }
}
```

**Error 404:**

```json
{
  "message": "Dokumen dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/document-versions",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

### 6. POST /api/document-versions/documents/:documentId/versions

Membuat versi dokumen baru (dengan `documentId` di URL).

**Request Body:**

```json
{
  "version_number": "number (required, min: 1)",
  "file_url": "string (optional, valid URL)",
  "notes": "string (optional)"
}
```

**Contoh Request:**

```bash
POST /api/document-versions/documents/4/versions
Authorization: Bearer <token>
Content-Type: application/json

{
  "version_number": 4,
  "file_url": "https://example.com/doc-v4.pdf",
  "notes": "Perubahan lampiran"
}
```

**Response 201:**

```json
{
  "message": "Versi dokumen untuk dokumen 4 berhasil dibuat",
  "success": true,
  "data": {
    "id": 4,
    "version_number": 4,
    "file_url": "https://example.com/doc-v4.pdf",
    "notes": "Perubahan lampiran",
    "document": {
      "id": 4,
      "title": "Peraturan Bupati No. 1 Tahun 2025",
      "abstract": "Peraturan ini mengatur..."
    },
    "created_at": "2025-01-15T10:00:00.000Z"
  }
}
```

---

### 7. PUT /api/document-versions/:id

Memperbarui versi dokumen berdasarkan ID.

**Request Body:** (semua field optional)

```json
{
  "document_id": "number",
  "version_number": "number",
  "file_url": "string",
  "notes": "string"
}
```

**Contoh Request:**

```bash
PUT /api/document-versions/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Revisi pasal 5 dan 7",
  "file_url": "https://example.com/doc-v2-updated.pdf"
}
```

**Response 200:**

```json
{
  "message": "Versi dokumen dengan id 1 berhasil diupdate",
  "success": true,
  "data": {
    "id": 1,
    "version_number": 2,
    "file_url": "https://example.com/doc-v2-updated.pdf",
    "notes": "Revisi pasal 5 dan 7",
    "updated_at": "2025-01-15T11:00:00.000Z"
  }
}
```

---

### 8. DELETE /api/document-versions/:id

Soft delete versi dokumen berdasarkan ID.

**Contoh Request:**

```bash
DELETE /api/document-versions/1
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Versi dokumen dengan id 1 berhasil dihapus",
  "success": true,
  "data": {
    "id": 1,
    "version_number": 2,
    "deleted_at": "2025-01-15T12:00:00.000Z"
  }
}
```

---

### 9. GET /api/document-versions/deleted/list

Mendapatkan semua versi dokumen yang sudah di-soft delete.

**Contoh Request:**

```bash
GET /api/document-versions/deleted/list
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan semua versi dokumen yang dihapus",
  "success": true,
  "data": [
    {
      "id": 1,
      "version_number": 2,
      "deleted_at": "2025-01-15T12:00:00.000Z"
    }
  ]
}
```

---

### 10. PATCH /api/document-versions/restore/:id

Mengembalikan versi dokumen yang sudah di-soft delete.

**Contoh Request:**

```bash
PATCH /api/document-versions/restore/1
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Versi dokumen dengan id 1 berhasil dikembalikan",
  "success": true,
  "data": {
    "id": 1,
    "version_number": 2,
    "deleted_at": null
  }
}
```

**Error 404:**

```json
{
  "message": "Versi dokumen dengan id 1 tidak ditemukan atau belum dihapus",
  "success": false,
  "data": null,
  "path": "/api/document-versions/restore/1",
  "timestamp": "2025-01-15T13:00:00.000Z"
}
```

---

## Version Management

- Setiap dokumen dapat memiliki **multiple versions**
- `version_number` harus unik per dokumen
- Versi yang lebih tinggi biasanya menandakan revisi terbaru
- Soft delete memungkinkan restore versi lama jika diperlukan
