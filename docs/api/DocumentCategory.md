# Document Categories API

Base URL: `/api/document-category`

**Authentication Required:** Ya  
**Role Required:** ADMIN untuk create/update/delete, USER untuk read

## Endpoints

### 1. GET /api/document-category/list

Mendapatkan daftar kategori dokumen dengan pagination dan pencarian.

**Query Parameters:**

- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)
- `search` (string, optional) - Pencarian berdasarkan nama kategori

**Contoh Request:**

```bash
GET /api/document-category/list?page=1&limit=10&search=peraturan
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Peraturan Daerah",
      "description": "Kategori untuk Perda dan turunannya",
      "created_at": "2025-01-15T10:00:00.000Z",
      "updated_at": null,
      "deleted_at": null
    }
  ],
  "total": 4,
  "page": 1,
  "last_page": 1
}
```

---

### 2. GET /api/document-category

Mendapatkan semua kategori dokumen tanpa pagination.

**Contoh Request:**

```bash
GET /api/document-category
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan semua kategori dokumen",
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Peraturan Daerah",
      "description": "Kategori untuk Perda dan turunannya",
      "created_at": "2025-01-15T10:00:00.000Z",
      "updated_at": null,
      "deleted_at": null
    },
    {
      "id": 2,
      "name": "Peraturan Bupati",
      "description": "Kategori untuk Perbup dan turunannya",
      "created_at": "2025-01-15T10:00:00.000Z",
      "updated_at": null,
      "deleted_at": null
    }
  ]
}
```

---

### 3. GET /api/document-category/:id

Mendapatkan detail kategori dokumen berdasarkan ID.

**Contoh Request:**

```bash
GET /api/document-category/1
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan kategori dokumen dengan id 1",
  "success": true,
  "data": {
    "id": 1,
    "name": "Peraturan Daerah",
    "description": "Kategori untuk Perda dan turunannya",
    "created_at": "2025-01-15T10:00:00.000Z",
    "updated_at": null,
    "deleted_at": null
  }
}
```

**Error 404:**

```json
{
  "message": "Kategori dokumen dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/document-category/999",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

### 4. POST /api/document-category

Membuat kategori dokumen baru.

**Role Required:** ADMIN

**Request Body:**

```json
{
  "name": "string (2-150 karakter)",
  "description": "string (optional)"
}
```

**Contoh Request:**

```bash
POST /api/document-category
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Keputusan Bupati",
  "description": "Kategori untuk Keputusan Bupati"
}
```

**Response 201:**

```json
{
  "message": "Berhasil membuat kategori dokumen",
  "success": true,
  "data": {
    "id": 5,
    "name": "Keputusan Bupati",
    "description": "Kategori untuk Keputusan Bupati",
    "created_at": "2025-01-15T10:00:00.000Z",
    "created_by": 1
  }
}
```

---

### 5. PUT /api/document-category/:id

Memperbarui kategori dokumen berdasarkan ID.

**Role Required:** ADMIN

**Request Body:** (semua field optional)

```json
{
  "name": "string",
  "description": "string"
}
```

**Contoh Request:**

```bash
PUT /api/document-category/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Peraturan Daerah (Updated)",
  "description": "Kategori untuk Perda dan turunannya - Updated"
}
```

**Response 200:**

```json
{
  "message": "Berhasil memperbarui kategori dokumen dengan id 1",
  "success": true,
  "data": {
    "id": 1,
    "name": "Peraturan Daerah (Updated)",
    "description": "Kategori untuk Perda dan turunannya - Updated",
    "updated_at": "2025-01-15T11:00:00.000Z",
    "updated_by": 1
  }
}
```

---

### 6. DELETE /api/document-category/:id

Soft delete kategori dokumen berdasarkan ID.

**Role Required:** ADMIN

**Contoh Request:**

```bash
DELETE /api/document-category/5
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil menghapus kategori dokumen dengan id 5",
  "success": true,
  "data": {
    "id": 5,
    "name": "Keputusan Bupati",
    "deleted_at": "2025-01-15T12:00:00.000Z",
    "deleted_by": 1
  }
}
```

---

### 7. GET /api/document-category/deleted/list

Mendapatkan semua kategori dokumen yang sudah di-soft delete.

**Role Required:** ADMIN

**Contoh Request:**

```bash
GET /api/document-category/deleted/list
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan semua kategori dokumen yang dihapus",
  "success": true,
  "data": [
    {
      "id": 5,
      "name": "Keputusan Bupati",
      "deleted_at": "2025-01-15T12:00:00.000Z"
    }
  ]
}
```

---

### 8. PATCH /api/document-category/restore/:id

Mengembalikan kategori dokumen yang sudah di-soft delete.

**Role Required:** ADMIN

**Contoh Request:**

```bash
PATCH /api/document-category/restore/5
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mengembalikan kategori dokumen dengan id 5",
  "success": true,
  "data": {
    "id": 5,
    "name": "Keputusan Bupati",
    "deleted_at": null
  }
}
```

**Error 404:**

```json
{
  "message": "Kategori dokumen dengan id 5 tidak ditemukan atau belum dihapus",
  "success": false,
  "data": null,
  "path": "/api/document-category/restore/5",
  "timestamp": "2025-01-15T13:00:00.000Z"
}
```

---

## Audit Logs

Setiap operasi CREATE, UPDATE, DELETE pada kategori dokumen akan tercatat di **Audit Logs** dengan informasi:

- User yang melakukan aksi
- Timestamp
- Data lama dan data baru (untuk UPDATE)
