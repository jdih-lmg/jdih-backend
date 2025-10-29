# Audit Logs API

Base URL: `/api/audit-logs`

Authentication Required: Ya  
Permission Required: Module `audit-logs` dengan action `read`

## Overview

Audit Logs mencatat aktivitas penting sistem seperti CREATE, UPDATE, DELETE, VERIFY, LOGIN, dan LOGOUT. Setiap log menyimpan informasi user, waktu kejadian, entitas yang terlibat, serta data lama dan baru.

- Proteksi route: [`JwtAuthGuard`](../../src/auth/guards/jwt-auth.guard.ts) + Permission Guard (lihat [`permission.decorator.ts`](../../src/auth/decorators/permission.decorator.ts) dan [`permission.guard.ts`](../../src/auth/guards/permission.guard.ts))
- Format error diseragamkan oleh [`AllExceptionFilter`](../../src/common/filters/all-exception.filter.ts)
- Entity: [`AuditLog`](../../src/entities/audit-logs.entity.ts)

Implementasi:

- Controller: [`audit-logs.controller.ts`](../../src/audit-logs/audit-logs.controller.ts)
- Service: [`audit-logs.service.ts`](../../src/audit-logs/audit-logs.service.ts)
- Module: [`audit-logs.module.ts`](../../src/audit-logs/audit-logs.module.ts)

---

## Data Model

Kolom pada tabel `audit_logs`:

- id: number
- user_id: number
- action: string
- entity: string
- entity_id: number
- old_data: object | null
- new_data: object | null
- created_at: string (datetime)

Relasi:

- user: object (opsional, join ke entity [`User`](../../src/entities/users.entity.ts))

Contoh item:

```json
{
  "id": 1,
  "action": "CREATE",
  "entity": "Document",
  "entity_id": 15,
  "old_data": null,
  "new_data": {
    "id": 15,
    "title": "Peraturan Bupati No. 5 Tahun 2025",
    "status": "draft"
  },
  "created_at": "2025-01-15T10:00:00.000Z",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@jdih.com"
  }
}
```

---

## Endpoints

### 1) GET /api/audit-logs

Mendapatkan semua audit logs dengan filter dan pagination.

Permission Required: `audit-logs:read`

Headers:

```
Authorization: Bearer <access_token>
```

Query Parameters:

- page (number, optional, default: 1)
- limit (number, optional, default: 10)
- action (string, optional) — salah satu: CREATE, UPDATE, DELETE, VERIFY, LOGIN, LOGOUT
- entity (string, optional) — contoh: Document, User, DocumentCategory
- user_id (number, optional)
- start_date (string, optional, ISO 8601)
- end_date (string, optional, ISO 8601)

Response 200:

```json
{
  "message": "Audit logs berhasil diambil",
  "success": true,
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "last_page": 3
  },
  "data": [
    {
      "id": 1,
      "action": "CREATE",
      "entity": "Document",
      "entity_id": 15,
      "old_data": null,
      "new_data": { "id": 15, "title": "Peraturan Bupati No. 5 Tahun 2025", "status": "draft" },
      "created_at": "2025-01-15T10:00:00.000Z",
      "user": { "id": 1, "name": "Admin User", "email": "admin@jdih.com" }
    }
  ]
}
```

---

### 2) GET /api/audit-logs/:id

Mendapatkan detail audit log berdasarkan ID.

Permission Required: `audit-logs:read`

Headers:

```
Authorization: Bearer <access_token>
```

Response 200:

```json
{
  "message": "Berhasil mengambil log",
  "success": true,
  "data": {
    "id": 1,
    "action": "CREATE",
    "entity": "Document",
    "entity_id": 15,
    "old_data": null,
    "new_data": { "id": 15, "title": "Peraturan Bupati No. 5 Tahun 2025", "status": "draft" },
    "created_at": "2025-01-15T10:00:00.000Z",
    "user": { "id": 1, "name": "Admin User", "email": "admin@jdih.com" }
  }
}
```

Error 404:

```json
{
  "message": "Audit log dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/audit-logs/999",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

### 3) GET /api/audit-logs/user/:userId

Mendapatkan audit logs berdasarkan user ID dengan pagination.

Permission Required: `audit-logs:read`

Headers:

```
Authorization: Bearer <access_token>
```

Query Parameters:

- page (number, optional, default: 1)
- limit (number, optional, default: 10)

Response 200:

```json
{
  "message": "Berhasil mengambil log berdasarkan user",
  "success": true,
  "meta": { "page": 1, "limit": 10, "total": 50, "last_page": 5 },
  "data": [
    {
      "id": 1,
      "action": "CREATE",
      "entity": "Document",
      "entity_id": 15,
      "old_data": null,
      "new_data": { "id": 15, "title": "Peraturan Bupati No. 5 Tahun 2025" },
      "created_at": "2025-01-15T10:00:00.000Z",
      "user": { "id": 1, "name": "Admin User", "email": "admin@jdih.com" }
    }
  ]
}
```

---

### 4) GET /api/audit-logs/entity/:entity/:entityId

Mendapatkan audit logs berdasarkan nama entity dan ID dengan pagination.

Permission Required: `audit-logs:read`

Headers:

```
Authorization: Bearer <access_token>
```

Parameters:

- entity (string) — contoh: Document, User, DocumentCategory
- entityId (number)

Query Parameters:

- page (number, optional, default: 1)
- limit (number, optional, default: 10)

Response 200:

```json
{
  "message": "Berhasil mengambil log berdasarkan entity",
  "success": true,
  "meta": { "page": 1, "limit": 10, "total": 5, "last_page": 1 },
  "data": [
    {
      "id": 1,
      "action": "CREATE",
      "entity": "Document",
      "entity_id": 15,
      "old_data": null,
      "new_data": { "id": 15, "title": "Peraturan Bupati No. 5 Tahun 2025", "status": "draft" },
      "created_at": "2025-01-15T10:00:00.000Z",
      "user": { "id": 1, "name": "Admin User", "email": "admin@jdih.com" }
    },
    {
      "id": 2,
      "action": "UPDATE",
      "entity": "Document",
      "entity_id": 15,
      "old_data": { "status": "draft" },
      "new_data": { "status": "verified" },
      "created_at": "2025-01-15T11:00:00.000Z",
      "user": { "id": 1, "name": "Admin User", "email": "admin@jdih.com" }
    }
  ]
}
```

---

## Audit Action Types

- CREATE — Pembuatan entitas baru
- UPDATE — Perubahan data entitas
- DELETE — Penghapusan entitas (soft delete)
- VERIFY — Verifikasi dokumen
- LOGIN — User melakukan login
- LOGOUT — User melakukan logout

Catatan: Endpoint Audit Logs bersifat read-only. Pencatatan log dilakukan internal melalui service.

---

## Error Responses

401 Unauthorized (tanpa token/invalid):

```json
{
  "message": "Unauthorized",
  "success": false,
  "data": null,
  "path": "/api/audit-logs",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

403 Forbidden (tidak memiliki permission):

```json
{
  "message": "Forbidden resource",
  "success": false,
  "data": null,
  "path": "/api/audit-logs",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

404 Not Found:

```json
{
  "message": "Audit log dengan id {id} tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/audit-logs/{id}",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## cURL Examples

List logs:

```bash
curl "http://localhost:3000/api/audit-logs?page=1&limit=10&action=CREATE&entity=Document&user_id=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Detail log:

```bash
curl http://localhost:3000/api/audit-logs/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Logs by user:

```bash
curl "http://localhost:3000/api/audit-logs/user/1?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Logs by entity:

```bash
curl "http://localhost:3000/api/audit-logs/entity/Document/15?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
