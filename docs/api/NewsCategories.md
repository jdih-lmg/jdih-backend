# News Categories API

Base URL: `/api/news-categories`

Authentication:

- Public: GET /, GET /:id
- Protected (JWT + PermissionGuard): POST, PUT, DELETE, GET /deleted/list, PATCH /restore/:id

Permission module: `berita-kategori`  
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

- Controller: [`news-categories.controller.ts`](../../src/news/news-categories/news-categories.controller.ts)
- Service: [`news-categories.service.ts`](../../src/news/news-categories/news-categories.service.ts)
- Entity: [`NewsCategory`](../../src/entities/news-categories.entity.ts)

Catatan:

- Relasi ManyToMany ke `News` tersedia, namun tidak dimuat default pada response.

---

## Entity Structure

```ts
type NewsCategory = {
  id: number;
  name: string; // max 100
  slug: string; // unique, max 100
  description?: string | null; // max 255
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  deleted_at?: string | null; // ISO datetime (soft delete)
};
```

---

## Endpoints

### 1) GET /api/news-categories

Daftar kategori berita (tanpa pagination).

Authentication: Public

Response 200:

```json
{
  "message": "Berhasil mendapatkan semua kategori berita",
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Pengumuman",
      "slug": "pengumuman",
      "description": null,
      "createdAt": "2025-09-30T10:00:00.000Z",
      "updatedAt": "2025-09-30T10:00:00.000Z"
    }
  ]
}
```

---

### 2) GET /api/news-categories/:id

Detail kategori berita berdasarkan ID.

Authentication: Public

Response 200:

```json
{
  "message": "Berhasil mendapatkan kategori berita",
  "success": true,
  "data": {
    "id": 1,
    "name": "Pengumuman",
    "slug": "pengumuman",
    "description": null,
    "createdAt": "2025-09-30T10:00:00.000Z",
    "updatedAt": "2025-09-30T10:00:00.000Z",
    "deleted_at": null
  }
}
```

Error 404:

```json
{
  "message": "Kategori berita dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/news-categories/999",
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

---

### 3) POST /api/news-categories

Membuat kategori berita.

Authentication: JWT  
Permission Required: `berita-kategori:create`

Headers:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

Request Body:

```json
{
  "name": "Pengumuman",
  "slug": "pengumuman",
  "description": "Kategori untuk pengumuman"
}
```

Validation ringkas:

- name: required, string, max 100
- slug: required, string, max 100, unique
- description: optional, string, max 255

Response 201:

```json
{
  "message": "Berhasil membuat kategori berita",
  "success": true,
  "data": {
    "id": 3,
    "name": "Pengumuman",
    "slug": "pengumuman",
    "description": "Kategori untuk pengumuman"
  }
}
```

---

### 4) PUT /api/news-categories/:id

Update kategori berita.

Authentication: JWT  
Permission Required: `berita-kategori:update`

Request Body (opsional):

```json
{
  "name": "Informasi",
  "slug": "informasi",
  "description": "Kategori informasi umum"
}
```

Response 200:

```json
{
  "message": "Berhasil memperbarui kategori berita dengan id 3",
  "success": true,
  "data": {
    "id": 3,
    "name": "Informasi",
    "slug": "informasi",
    "description": "Kategori informasi umum"
  }
}
```

Error 404:

```json
{
  "message": "Kategori berita dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/news-categories/999",
  "timestamp": "2025-10-29T12:30:00.000Z"
}
```

---

### 5) DELETE /api/news-categories/:id

Soft delete kategori berita.

Authentication: JWT  
Permission Required: `berita-kategori:manage`

Response 200:

```json
{
  "message": "Berhasil menghapus kategori berita dengan id 3",
  "success": true,
  "data": { "id": 3, "deleted_at": "2025-10-29T12:30:00.000Z" }
}
```

---

### 6) GET /api/news-categories/deleted/list

Daftar kategori berita yang dihapus (soft-deleted).

Authentication: JWT  
Permission Required: `berita-kategori:manage`

Response 200:

```json
{
  "message": "Berhasil mendapatkan semua kategori berita yang dihapus",
  "success": true,
  "data": [{ "id": 5, "name": "Lama", "slug": "lama", "deleted_at": "2025-10-20T10:00:00.000Z" }]
}
```

---

### 7) PATCH /api/news-categories/restore/:id

Restore kategori berita yang dihapus.

Authentication: JWT  
Permission Required: `berita-kategori:manage`

Response 200:

```json
{
  "message": "Berhasil mengembalikan kategori berita dengan id 5",
  "success": true,
  "data": { "id": 5, "deleted_at": null }
}
```

---

## Error Responses (Umum)

401 Unauthorized:

```json
{
  "message": "Unauthorized",
  "success": false,
  "data": null,
  "path": "/api/news-categories",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

403 Forbidden (tanpa permission):

```json
{
  "message": "Forbidden resource",
  "success": false,
  "data": null,
  "path": "/api/news-categories",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

404 Not Found:

```json
{
  "message": "Kategori berita dengan id {id} tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/news-categories/{id}",
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

---

## cURL Examples

List categories:

```bash
curl "http://localhost:3000/api/news-categories"
```

Detail category:

```bash
curl "http://localhost:3000/api/news-categories/1"
```

Create category:

```bash
curl -X POST "http://localhost:3000/api/news-categories" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Pengumuman","slug":"pengumuman","description":"Kategori untuk pengumuman"}'
```

Update category:

```bash
curl -X PUT "http://localhost:3000/api/news-categories/3" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Informasi","slug":"informasi"}'
```

Delete category:

```bash
curl -X DELETE "http://localhost:3000/api/news-categories/3" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Deleted list:

```bash
curl "http://localhost:3000/api/news-categories/deleted/list" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Restore:

```bash
curl -X PATCH "http://localhost:3000/api/news-categories/restore/5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
