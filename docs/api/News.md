# News API

Base URL:

- News: `/api/news`
- News Categories: `/api/news-categories`

Authentication:

- Public (News): GET list, GET detail
- Public (Categories): GET list, GET detail
- Protected (JWT + PermissionGuard): POST, PUT, DELETE, GET /deleted/list, PATCH /restore/:id

Permission modules:

- News: `berita` — actions: `create`, `update`, `manage`
- News Categories: `berita-kategori` — actions: `create`, `update`, `manage`

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

- Controller: [`news.controller.ts`](../../src/news/news.controller.ts)
- Service: [`news.service.ts`](../../src/news/news.service.ts)
- Entity: [`News`](../../src/entities/news.entity.ts), [`NewsCategory`](../../src/entities/news-categories.entity.ts)

Audit:

- CREATE/UPDATE/DELETE biasanya dicatat via AuditLogsService (action: CREATE, UPDATE, DELETE)

---

## Entity Structure

News:

```ts
type News = {
  id: number;
  title: string; // max 255
  slug: string; // unique, max 255
  content: string;
  thumbnailUrl?: string | null; // max 255
  author?: { id: number; name: string; email: string } | null;
  isPublished: boolean; // default false
  publishedAt?: string | null;

  categories?: { id: number; name: string; slug: string }[] | null;

  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};
```

NewsCategory:

```ts
type NewsCategory = {
  id: number;
  name: string; // max 100
  slug: string; // unique, max 100
  description?: string | null; // max 255
  createdAt: string;
  updatedAt: string;
  deleted_at?: string | null;
};
```

---

## News Endpoints

### 1) GET /api/news/list

Daftar berita (pagination + search).

Authentication: Public

Query:

- page (number, default: 1)
- limit (number, default: 10)
- search (string, optional) — pencarian judul/konten (case-insensitive)

Response 200:

```json
{
  "message": "Berhasil mendapatkan daftar berita",
  "success": true,
  "meta": { "page": 1, "total": 25, "last_page": 3 },
  "data": [
    {
      "id": 12,
      "title": "Peluncuran JDIH 2025",
      "slug": "peluncuran-jdih-2025",
      "thumbnailUrl": "/uploads/news/cover-12.jpg",
      "isPublished": true,
      "publishedAt": "2025-10-01T09:00:00.000Z",
      "categories": [{ "id": 3, "name": "Pengumuman", "slug": "pengumuman" }],
      "author": { "id": 1, "name": "Admin User", "email": "admin@jdih.com" },
      "createdAt": "2025-09-30T10:00:00.000Z",
      "updatedAt": "2025-10-01T09:00:00.000Z"
    }
  ]
}
```

---

### 2) GET /api/news

Semua berita (tanpa pagination).

Authentication: Public

Response 200:

```json
{
  "message": "Berhasil mendapatkan semua berita",
  "success": true,
  "data": [
    {
      "id": 12,
      "title": "Peluncuran JDIH 2025",
      "slug": "peluncuran-jdih-2025",
      "isPublished": true,
      "publishedAt": "2025-10-01T09:00:00.000Z",
      "createdAt": "2025-09-30T10:00:00.000Z"
    }
  ]
}
```

---

### 3) GET /api/news/:id

Detail berita berdasarkan ID.

Authentication: Public

Response 200:

```json
{
  "message": "Berhasil mendapatkan detail berita",
  "success": true,
  "data": {
    "id": 12,
    "title": "Peluncuran JDIH 2025",
    "slug": "peluncuran-jdih-2025",
    "content": "<p>Konten berita...</p>",
    "thumbnailUrl": "/uploads/news/cover-12.jpg",
    "isPublished": true,
    "publishedAt": "2025-10-01T09:00:00.000Z",
    "categories": [{ "id": 3, "name": "Pengumuman", "slug": "pengumuman" }],
    "author": { "id": 1, "name": "Admin User", "email": "admin@jdih.com" },
    "createdAt": "2025-09-30T10:00:00.000Z",
    "updatedAt": "2025-10-01T09:00:00.000Z"
  }
}
```

Error 404:

```json
{
  "message": "Berita dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/news/999",
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

---

### 4) POST /api/news

Membuat berita baru.

Authentication: JWT  
Permission Required: `berita:create`

Headers:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

Request Body:

```json
{
  "title": "Peluncuran JDIH 2025",
  "slug": "peluncuran-jdih-2025",
  "content": "<p>Konten berita...</p>",
  "thumbnailUrl": "/uploads/news/cover-12.jpg",
  "isPublished": true,
  "categoryIds": [1, 3]
}
```

Validation ringkas:

- title: required, string, max 255
- slug: required, string, unique
- content: required, text
- thumbnailUrl: optional, string, max 255
- isPublished: optional, boolean (default false)
- categoryIds: optional, number[]

Response 201:

```json
{
  "message": "Berhasil membuat berita",
  "success": true,
  "data": {
    "id": 12,
    "title": "Peluncuran JDIH 2025",
    "slug": "peluncuran-jdih-2025",
    "isPublished": true,
    "publishedAt": "2025-10-01T09:00:00.000Z",
    "categories": [{ "id": 3, "name": "Pengumuman", "slug": "pengumuman" }]
  }
}
```

---

### 5) PUT /api/news/:id

Update berita.

Authentication: JWT  
Permission Required: `berita:update`

Request Body (semua optional):

```json
{
  "title": "Judul Baru",
  "slug": "judul-baru",
  "content": "<p>Konten diperbarui</p>",
  "thumbnailUrl": "/uploads/news/cover-12-new.jpg",
  "isPublished": false,
  "categoryIds": [2]
}
```

Response 200:

```json
{
  "message": "Berhasil memperbarui berita dengan id 12",
  "success": true,
  "data": {
    "id": 12,
    "title": "Judul Baru",
    "slug": "judul-baru",
    "isPublished": false,
    "publishedAt": null,
    "updatedAt": "2025-10-29T12:30:00.000Z"
  }
}
```

Error 404:

```json
{
  "message": "Berita dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/news/999",
  "timestamp": "2025-10-29T12:30:00.000Z"
}
```

---

### 6) DELETE /api/news/:id

Soft delete berita.

Authentication: JWT  
Permission Required: `berita:manage`

Response 200:

```json
{
  "message": "Berhasil menghapus berita dengan id 12",
  "success": true,
  "data": {
    "id": 12,
    "deletedAt": "2025-10-29T12:45:00.000Z"
  }
}
```

---

### 7) GET /api/news/deleted/list

Daftar berita yang dihapus (soft-deleted).

Authentication: JWT  
Permission Required: `berita:manage`

Response 200:

```json
{
  "message": "Berhasil mendapatkan semua berita yang dihapus",
  "success": true,
  "data": [
    {
      "id": 8,
      "title": "Berita Lama",
      "slug": "berita-lama",
      "deletedAt": "2025-10-20T10:00:00.000Z"
    }
  ]
}
```

---

### 8) PATCH /api/news/restore/:id

Restore berita yang dihapus.

Authentication: JWT  
Permission Required: `berita:manage`

Response 200:

```json
{
  "message": "Berhasil mengembalikan berita dengan id 8",
  "success": true,
  "data": { "id": 8, "deletedAt": null }
}
```

---

## News Categories Endpoints

### 1) GET /api/news-categories

Daftar kategori berita.

Authentication: Public

Response 200:

```json
{
  "message": "Berhasil mendapatkan semua kategori berita",
  "success": true,
  "data": [{ "id": 1, "name": "Pengumuman", "slug": "pengumuman", "description": null }]
}
```

---

### 2) GET /api/news-categories/:id

Detail kategori.

Authentication: Public

Response 200:

```json
{
  "message": "Berhasil mendapatkan kategori berita",
  "success": true,
  "data": { "id": 1, "name": "Pengumuman", "slug": "pengumuman", "description": null }
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

Buat kategori.

Authentication: JWT  
Permission Required: `berita-kategori:create`

Request Body:

```json
{
  "name": "Pengumuman",
  "slug": "pengumuman",
  "description": "Kategori untuk pengumuman"
}
```

Response 201:

```json
{
  "message": "Berhasil membuat kategori berita",
  "success": true,
  "data": { "id": 3, "name": "Pengumuman", "slug": "pengumuman" }
}
```

---

### 4) PUT /api/news-categories/:id

Update kategori.

Authentication: JWT  
Permission Required: `berita-kategori:update`

Request Body (optional):

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
  "data": { "id": 3, "name": "Informasi", "slug": "informasi" }
}
```

---

### 5) DELETE /api/news-categories/:id

Soft delete kategori.

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

Daftar kategori yang dihapus.

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

Restore kategori yang dihapus.

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
  "path": "/api/news",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

403 Forbidden (tanpa permission):

```json
{
  "message": "Forbidden resource",
  "success": false,
  "data": null,
  "path": "/api/news",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

404 Not Found:

```json
{
  "message": "Berita/Kategori dengan id {id} tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/news/{id}",
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

---

## cURL Examples

List news (pagination + search):

```bash
curl "http://localhost:3000/api/news/list?page=1&limit=10&search=jdih"
```

Detail news:

```bash
curl "http://localhost:3000/api/news/12"
```

Create news:

```bash
curl -X POST "http://localhost:3000/api/news" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Peluncuran JDIH 2025","slug":"peluncuran-jdih-2025","content":"<p>Konten...</p>","isPublished":true,"categoryIds":[1,3]}'
```

Update news:

```bash
curl -X PUT "http://localhost:3000/api/news/12" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Judul Baru","isPublished":false}'
```

Delete news:

```bash
curl -X DELETE "http://localhost:3000/api/news/12" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

List categories:

```bash
curl "http://localhost:3000/api/news-categories"
```

Create category:

```bash
curl -X POST "http://localhost:3000/api/news-categories" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Pengumuman","slug":"pengumuman"}'
```
