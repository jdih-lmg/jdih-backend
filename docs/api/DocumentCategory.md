# Document Categories API

Base URL: `/api/document-category`

Authentication:

- Public: GET /, GET /list, GET /:id
- Protected (JWT + PermissionGuard): POST, PUT, DELETE, GET /deleted/list, PATCH /restore/:id

Permission module: `dokumen-kategori`  
Actions: `create`, `update`, `manage`

Proteksi & Error:

- Guard: JwtAuthGuard + PermissionGuard (lihat `permission.decorator.ts` dan `permission.guard.ts`)
- Error seragam oleh AllExceptionFilter dengan bentuk:
  {
  "message": string,
  "success": false,
  "data": null,
  "path": string,
  "timestamp": string
  }

Audit:

- CREATE/UPDATE/DELETE dicatat via AuditLogsService (action: CREATE, UPDATE, DELETE)

---

## Entity Structure

```ts
type DocumentCategory = {
  id: number;
  name: string; // max length 150
  description?: string | null; // optional
  created_at: string;
  created_by?: number | null;
  updated_at?: string | null;
  updated_by?: number | null;
  deleted_at?: string | null;
  deleted_by?: number | null;
};
```

Catatan:

- Tidak ada field slug maupun hierarki parent/children pada implementasi saat ini.
- Relasi ke documents ada, namun tidak dimuat default pada response endpoint ini.

---

## Endpoints

### 1) GET /api/document-category/list

Daftar kategori dengan pagination dan pencarian.

Authentication: Public

Query:

- page (number, default: 1)
- limit (number, default: 10)
- search (string, optional) — pencarian nama (case-insensitive)

Response 200:

```json
{
  "message": "Berhasil mendapatkan daftar kategori dokumen",
  "success": true,
  "meta": {
    "page": 1,
    "total": 25,
    "last_page": 3
  },
  "data": [
    {
      "id": 1,
      "name": "Hukum dan HAM",
      "description": "Kategori dokumen terkait hukum dan HAM",
      "created_at": "2025-01-10T10:00:00.000Z"
    }
  ]
}
```

---

### 2) GET /api/document-category

Semua kategori (tanpa pagination).

Authentication: Public

Response 200:

```json
{
  "message": "Berhasil mendapatkan semua kategori dokumen",
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Hukum dan HAM",
      "description": "Kategori dokumen terkait hukum dan HAM",
      "created_at": "2025-01-10T10:00:00.000Z"
    }
  ]
}
```

---

### 3) GET /api/document-category/:id

Detail kategori berdasarkan ID.

Authentication: Public

Response 200:

```json
{
  "message": "Berhasil mendapatkan kategori dokumen dengan id 1",
  "success": true,
  "data": {
    "id": 1,
    "name": "Hukum dan HAM",
    "description": "Kategori dokumen terkait hukum dan HAM",
    "created_at": "2025-01-10T10:00:00.000Z",
    "updated_at": null,
    "deleted_at": null,
    "created_by": 1,
    "updated_by": null,
    "deleted_by": null
  }
}
```

Error 404:

```json
{
  "message": "Kategori dokumen dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/document-category/999",
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

---

### 4) POST /api/document-category

Membuat kategori baru.

Authentication: JWT  
Permission Required: `dokumen-kategori:create`

Request Body:

```json
{
  "name": "Pendidikan",
  "description": "Kategori dokumen terkait pendidikan"
}
```

Validation (berdasarkan entity dan schema):

- name: required, string, max 150 karakter
- description: optional, string

Response 201:

```json
{
  "message": "Berhasil membuat kategori dokumen",
  "success": true,
  "data": {
    "id": 10,
    "name": "Pendidikan",
    "description": "Kategori dokumen terkait pendidikan",
    "created_at": "2025-10-29T12:00:00.000Z",
    "created_by": 1
  }
}
```

---

### 5) PUT /api/document-category/:id

Update kategori.

Authentication: JWT  
Permission Required: `dokumen-kategori:update`

Request Body (semua optional):

```json
{
  "name": "Pendidikan dan Kebudayaan",
  "description": "Kategori dokumen terkait pendidikan dan kebudayaan"
}
```

Response 200:

```json
{
  "message": "Berhasil memperbarui kategori dokumen dengan id 10",
  "success": true,
  "data": {
    "id": 10,
    "name": "Pendidikan dan Kebudayaan",
    "description": "Kategori dokumen terkait pendidikan dan kebudayaan",
    "updated_at": "2025-10-29T13:00:00.000Z",
    "updated_by": 1
  }
}
```

Error 404:

```json
{
  "message": "Kategori dokumen dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/document-category/999",
  "timestamp": "2025-10-29T13:00:00.000Z"
}
```

---

### 6) DELETE /api/document-category/:id

Soft delete kategori.

Authentication: JWT  
Permission Required: `dokumen-kategori:manage`

Response 200:

```json
{
  "message": "Berhasil menghapus kategori dokumen dengan id 10",
  "success": true,
  "data": {
    "id": 10,
    "name": "Pendidikan",
    "description": "Kategori dokumen terkait pendidikan",
    "deleted_at": "2025-10-29T13:00:00.000Z",
    "deleted_by": 1
  }
}
```

Error 404:

```json
{
  "message": "Kategori dokumen dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/document-category/999",
  "timestamp": "2025-10-29T13:00:00.000Z"
}
```

---

### 7) GET /api/document-category/deleted/list

Daftar kategori yang sudah dihapus (soft-deleted).

Authentication: JWT  
Permission Required: `dokumen-kategori:manage`

Response 200:

```json
{
  "message": "Berhasil mendapatkan semua kategori dokumen yang dihapus",
  "success": true,
  "data": [
    {
      "id": 8,
      "name": "Kategori Lama",
      "description": null,
      "deleted_at": "2025-10-25T10:00:00.000Z",
      "deleted_by": 1
    }
  ]
}
```

---

### 8) PATCH /api/document-category/restore/:id

Restore kategori yang dihapus.

Authentication: JWT  
Permission Required: `dokumen-kategori:manage`

Response 200:

```json
{
  "message": "Berhasil mengembalikan kategori dokumen dengan id 8",
  "success": true,
  "data": {
    "id": 8,
    "name": "Kategori Lama",
    "description": null,
    "deleted_at": "2025-10-25T10:00:00.000Z",
    "deleted_by": 1
  }
}
```

Catatan: Response menampilkan data sebelum di-restore (sesuai implementasi service). Untuk melihat status terbaru (deleted_at null), panggil kembali GET /api/document-category/:id.

---

## Permission Matrix

| Endpoint           | Permission              |
| ------------------ | ----------------------- |
| GET /              | - (Public)              |
| GET /list          | - (Public)              |
| GET /:id           | - (Public)              |
| POST /             | dokumen-kategori:create |
| PUT /:id           | dokumen-kategori:update |
| DELETE /:id        | dokumen-kategori:manage |
| GET /deleted/list  | dokumen-kategori:manage |
| PATCH /restore/:id | dokumen-kategori:manage |

---

## Error Responses

401 Unauthorized:

```json
{
  "message": "Unauthorized",
  "success": false,
  "data": null,
  "path": "/api/document-category",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

403 Forbidden (tanpa permission):

```json
{
  "message": "Forbidden resource",
  "success": false,
  "data": null,
  "path": "/api/document-category",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

404 Not Found:

```json
{
  "message": "Kategori dokumen dengan id {id} tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/document-category/{id}",
  "timestamp": "2025-10-29T13:00:00.000Z"
}
```

---

## cURL Examples

List (pagination + search):

```bash
curl "http://localhost:3000/api/document-category/list?page=1&limit=10&search=ham"
```

All:

```bash
curl "http://localhost:3000/api/document-category"
```

Detail:

```bash
curl "http://localhost:3000/api/document-category/1"
```

Create:

```bash
curl -X POST "http://localhost:3000/api/document-category" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Pendidikan","description":"Kategori dokumen terkait pendidikan"}'
```

Update:

```bash
curl -X PUT "http://localhost:3000/api/document-category/10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Pendidikan dan Kebudayaan"}'
```

Delete:

```bash
curl -X DELETE "http://localhost:3000/api/document-category/10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Deleted list:

```bash
curl "http://localhost:3000/api/document-category/deleted/list" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Restore:

```bash
curl -X PATCH "http://localhost:3000/api/document-category/restore/8" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
