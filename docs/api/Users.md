# Users API

Base URL: `/api/users`

Authentication: Protected (JWT + PermissionGuard)

Permission module: `users`  
Actions: `read`, `create`, `update`, `manage`

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
- Controller: [`users.controller.ts`](../../src/users/users.controller.ts)
- Service: [`users.service.ts`](../../src/users/users.service.ts)
- Module: [`users.module.ts`](../../src/users/users.module.ts)
- Entity: [`User`](../../src/entities/users.entity.ts), relasi ke [`Role`](../../src/entities/roles.entity.ts)

Audit:
- CREATE/UPDATE/DELETE umumnya dicatat via AuditLogsService (action: CREATE, UPDATE, DELETE)

---

## Entity Structure

```ts
type User = {
  id: number;
  name: string;                  // max 150
  email: string;                 // unique, max 150
  // password tidak ditampilkan di response API
  role?: { id: number; name: string } | null;

  created_at: string;            // ISO datetime
  created_by?: number | null;
  updated_at?: string | null;
  updated_by?: number | null;
  deleted_at?: string | null;    // soft delete
  deleted_by?: number | null;
};
```

Catatan:
- Penyimpanan password di DB menggunakan field `password_hash`. Input API menggunakan `password` (akan di-hash).
- Relasi `role` bersifat optional (SET NULL saat role dihapus).

---

## Endpoints

### 1) GET /api/users/list

Daftar users (pagination + search).

Access: JWT (+ permission `users:read`)

Query:
- page (number, default: 1)
- limit (number, default: 10)
- search (string, optional) — cari pada name/email (case-insensitive)

Response 200:
```json
{
  "message": "Daftar user berhasil diambil",
  "success": true,
  "meta": { "page": 1, "total": 25, "last_page": 3 },
  "data": [
    {
      "id": 5,
      "name": "John Doe",
      "email": "john@example.com",
      "role": { "id": 2, "name": "user" },
      "created_at": "2025-01-15T10:00:00.000Z",
      "updated_at": "2025-01-20T12:00:00.000Z"
    }
  ]
}
```

---

### 2) GET /api/users

Semua users (tanpa pagination).

Access: JWT (+ permission `users:read`)

Response 200:
```json
{
  "message": "Daftar user berhasil diambil",
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@jdih.com",
      "role": { "id": 1, "name": "admin" },
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 3) GET /api/users/:id

Detail user berdasarkan ID.

Access: JWT (+ permission `users:read`)

Response 200:
```json
{
  "message": "User berhasil ditemukan",
  "success": true,
  "data": {
    "id": 5,
    "name": "John Doe",
    "email": "john@example.com",
    "role": { "id": 2, "name": "user" },
    "created_at": "2025-01-15T10:00:00.000Z",
    "updated_at": "2025-01-20T12:00:00.000Z",
    "deleted_at": null
  }
}
```

Error 404:
```json
{
  "message": "User tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/users/999",
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

---

### 4) POST /api/users

Membuat user baru.

Access: JWT (+ permission `users:create`)

Headers:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role_id": 2
}
```

Validasi ringkas:
- name: required, string, max 150
- email: required, valid email, unique, max 150 (di-normalize trim + lowercase)
- password: required, min 8 (akan di-hash)
- role_id: required, number (harus role yang valid)

Response 201:
```json
{
  "message": "User berhasil dibuat",
  "success": true,
  "data": {
    "id": 10,
    "name": "John Doe",
    "email": "john@example.com",
    "role": { "id": 2, "name": "user" },
    "created_at": "2025-10-29T12:10:00.000Z"
  }
}
```

Error 409 (email duplikat):
```json
{
  "message": "Email sudah terdaftar",
  "success": false,
  "data": null,
  "path": "/api/users",
  "timestamp": "2025-10-29T12:10:00.000Z"
}
```

Error 404 (role tidak ditemukan):
```json
{
  "message": "Role tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/users",
  "timestamp": "2025-10-29T12:10:00.000Z"
}
```

---

### 5) PATCH /api/users/:id

Update data user (parsial).

Access: JWT (+ permission `users:update`)

Request Body (opsional):
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "password": "NewPassword123!",
  "role_id": 3
}
```

Perilaku:
- Password, jika dikirim, akan di-hash.
- Email, jika diubah, dicek duplikasi (kecuali milik user sendiri).

Response 200:
```json
{
  "message": "User berhasil diupdate",
  "success": true,
  "data": {
    "id": 10,
    "name": "John Updated",
    "email": "john.updated@example.com",
    "role": { "id": 3, "name": "verifikator" },
    "updated_at": "2025-10-29T12:20:00.000Z",
    "updated_by": 1
  }
}
```

Error 404 (user/role):
```json
{
  "message": "User atau Role tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/users/10",
  "timestamp": "2025-10-29T12:20:00.000Z"
}
```

Error 409 (email digunakan user lain):
```json
{
  "message": "Email sudah terdaftar",
  "success": false,
  "data": null,
  "path": "/api/users/10",
  "timestamp": "2025-10-29T12:20:00.000Z"
}
```

---

### 6) DELETE /api/users/:id

Soft delete user.

Access: JWT (+ permission `users:manage`)

Response 200:
```json
{
  "message": "User berhasil dihapus",
  "success": true,
  "data": {
    "id": 10,
    "deleted_at": "2025-10-29T12:30:00.000Z",
    "deleted_by": 1
  }
}
```

Error 404:
```json
{
  "message": "User tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/users/999",
  "timestamp": "2025-10-29T12:30:00.000Z"
}
```

---

### 7) GET /api/users/deleted/list

Daftar user yang dihapus (soft-deleted).

Access: JWT (+ permission `users:manage`)

Response 200:
```json
{
  "message": "Berhasil mendapatkan semua user yang dihapus",
  "success": true,
  "data": [
    { "id": 8, "name": "Old User", "email": "old@example.com", "deleted_at": "2025-10-20T10:00:00.000Z" }
  ]
}
```

---

### 8) PATCH /api/users/restore/:id

Restore user yang dihapus.

Access: JWT (+ permission `users:manage`)

Response 200:
```json
{
  "message": "User berhasil dikembalikan",
  "success": true,
  "data": { "id": 8, "deleted_at": null }
}
```

Error 404:
```json
{
  "message": "User tidak ditemukan atau belum dihapus",
  "success": false,
  "data": null,
  "path": "/api/users/restore/8",
  "timestamp": "2025-10-29T12:40:00.000Z"
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
  "path": "/api/users",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

403 Forbidden (tanpa permission):
```json
{
  "message": "Forbidden resource",
  "success": false,
  "data": null,
  "path": "/api/users",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

404 Not Found:
```json
{
  "message": "User tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/users/{id}",
  "timestamp": "2025-10-29T12:00:00.000Z"
}
```

---

## cURL Examples

List (pagination + search):
```bash
curl "http://localhost:3000/api/users/list?page=1&limit=10&search=john" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

All:
```bash
curl "http://localhost:3000/api/users" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Detail:
```bash
curl "http://localhost:3000/api/users/10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Create:
```bash
curl -X POST "http://localhost:3000/api/users" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"Password123!","role_id":2}'
```

Update:
```bash
curl -X PATCH "http://localhost:3000/api/users/10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"john.updated@example.com","password":"NewPassword123!"}'
```

Delete:
```bash
curl -X DELETE "http://localhost:3000/api/users/10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Deleted list:
```bash
curl "http://localhost:3000/api/users/deleted/list" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Restore:
```bash
curl -X PATCH "http://localhost:3000/api/users/restore/8" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
