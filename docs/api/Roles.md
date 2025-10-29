# Roles API

Base URL: `/api/roles`

Authentication:

- Protected (JWT + PermissionGuard)

Permission module: `roles`  
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

- Controller: `src/role/role.controller.ts`
- Service: `src/role/role.service.ts`
- Module: `src/role/role.module.ts`
- Entity: [`Role`](../../src/entities/roles.entity.ts), [`RoleMenuPermission`](../../src/entities/role-menu-permissions.entity.ts), [`Action`](../../src/entities/actions.entity.ts)

---

## Data Model

Role:

```ts
type Role = {
  id: number;
  name: string; // max 100
  description?: string | null;

  // timestamps + audit
  created_at: string;
  created_by?: number | null;
  updated_at?: string | null;
  updated_by?: number | null;
  deleted_at?: string | null;
  deleted_by?: number | null;

  // relasi
  users?: { id: number; name: string; email: string }[];
};
```

RoleMenuPermission (perizinan per menu+aksi):

```ts
type RoleMenuPermission = {
  id: number;
  is_allowed: boolean; // default true
  role: { id: number; name: string };
  menu: { id: number; name: string; slug: string; path?: string | null; icon?: string | null };
  action: { id: number; name: string; description?: string | null };

  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
};
```

---

## Endpoints

### 1) POST /api/roles

Membuat role baru.

Access: JWT (+ permission `roles:create`)

Headers:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

Request Body:

```json
{
  "name": "admin",
  "description": "Administrator dengan akses penuh"
}
```

Response 201:

```json
{
  "message": "Role berhasil dibuat",
  "success": true,
  "data": {
    "id": 1,
    "name": "admin",
    "description": "Administrator dengan akses penuh",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

Error 409 (nama role duplikat):

```json
{
  "message": "Role name sudah digunakan",
  "success": false,
  "data": null,
  "path": "/api/roles",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

---

### 2) GET /api/roles

Mendapatkan semua roles (opsional: beserta jumlah user per role).

Access: JWT (+ permission `roles:read`)

Headers:

```
Authorization: Bearer <access_token>
```

Response 200:

```json
{
  "message": "Daftar role berhasil diambil",
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "admin",
      "description": "Administrator dengan akses penuh",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z",
      "user_count": 2
    }
  ]
}
```

---

### 3) GET /api/roles/:id

Detail role beserta permissions dan users.

Access: JWT (+ permission `roles:read`)

Headers:

```
Authorization: Bearer <access_token>
```

Response 200:

```json
{
  "message": "Role berhasil ditemukan",
  "success": true,
  "data": {
    "id": 1,
    "name": "admin",
    "description": "Administrator dengan akses penuh",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z",
    "permissions": [
      {
        "id": 10,
        "is_allowed": true,
        "menu": {
          "id": 1,
          "name": "Documents",
          "slug": "documents",
          "path": "/documents",
          "icon": "file"
        },
        "action": { "id": 2, "name": "read", "description": "View document" },
        "created_at": "2025-01-01T00:00:00.000Z"
      }
    ],
    "users": [{ "id": 1, "name": "Admin User", "email": "admin@jdih.com" }]
  }
}
```

Error 404:

```json
{
  "message": "Role tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/roles/999",
  "timestamp": "2025-10-29T10:05:00.000Z"
}
```

---

### 4) PATCH /api/roles/:id

Update role (parsial).

Access: JWT (+ permission `roles:update`)

Headers:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

Request Body (opsional):

```json
{
  "name": "verifikator",
  "description": "Petugas verifikasi dokumen"
}
```

Response 200:

```json
{
  "message": "Role berhasil diupdate",
  "success": true,
  "data": {
    "id": 2,
    "name": "verifikator",
    "description": "Petugas verifikasi dokumen",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-10-29T10:10:00.000Z"
  }
}
```

Error 409:

```json
{
  "message": "Role name sudah digunakan",
  "success": false,
  "data": null,
  "path": "/api/roles/2",
  "timestamp": "2025-10-29T10:10:00.000Z"
}
```

---

### 5) DELETE /api/roles/:id

Soft delete role.

Access: JWT (+ permission `roles:manage`)

Headers:

```
Authorization: Bearer <access_token>
```

Response 200:

```json
{
  "message": "Role berhasil dihapus",
  "success": true,
  "data": {
    "id": 3,
    "deleted_at": "2025-10-29T10:15:00.000Z"
  }
}
```

Error 400 (role masih digunakan user):

```json
{
  "message": "Role tidak bisa dihapus karena masih digunakan oleh user",
  "success": false,
  "data": null,
  "path": "/api/roles/3",
  "timestamp": "2025-10-29T10:15:00.000Z"
}
```

Error 400 (role default):

```json
{
  "message": "Role default tidak bisa dihapus",
  "success": false,
  "data": null,
  "path": "/api/roles/1",
  "timestamp": "2025-10-29T10:15:00.000Z"
}
```

---

### 6) POST /api/roles/:id/permissions

Assign/update permissions untuk role (replace semua permissions lama).

Access: JWT (+ permission `roles:manage`)

Headers:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

Request Body:

```json
{
  "permissions": [
    { "menu_id": 1, "action_id": 1 },
    { "menu_id": 1, "action_id": 2 },
    { "menu_id": 2, "action_id": 1 }
  ]
}
```

Response 200:

```json
{
  "message": "Permissions berhasil diupdate",
  "success": true,
  "data": [
    {
      "id": 21,
      "is_allowed": true,
      "menu": { "id": 1, "name": "Documents", "slug": "documents" },
      "action": { "id": 1, "name": "create" },
      "created_at": "2025-10-29T10:20:00.000Z"
    }
  ]
}
```

Error 404:

```json
{
  "message": "Role/Menu/Action tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/roles/5/permissions",
  "timestamp": "2025-10-29T10:20:00.000Z"
}
```

Notes:

- Permissions lama dihapus lalu diganti dengan daftar baru.
- Kombinasi menu_id + action_id yang sama akan tersimpan sekali.
- Pastikan ID menu dan action valid.

---

### 7) GET /api/roles/:id/permissions

Mengambil semua permissions dari role, dikelompokkan per menu.

Access: JWT (+ permission `roles:read`)

Headers:

```
Authorization: Bearer <access_token>
```

Response 200:

```json
{
  "message": "Permissions berhasil diambil",
  "success": true,
  "data": [
    {
      "menu": {
        "id": 1,
        "name": "Documents",
        "slug": "documents",
        "path": "/documents",
        "icon": "file"
      },
      "actions": [
        { "id": 1, "name": "create", "description": "Create new document" },
        { "id": 2, "name": "read", "description": "View document" },
        { "id": 3, "name": "update", "description": "Update document" },
        { "id": 4, "name": "delete", "description": "Delete document" }
      ]
    }
  ]
}
```

Error 404:

```json
{
  "message": "Role tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/roles/999/permissions",
  "timestamp": "2025-10-29T10:25:00.000Z"
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
  "path": "/api/roles",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

403 Forbidden (tanpa permission):

```json
{
  "message": "Forbidden resource",
  "success": false,
  "data": null,
  "path": "/api/roles",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

404 Not Found:

```json
{
  "message": "Role/Menu/Action tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/roles",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

---

## cURL Examples

Create role:

```bash
curl -X POST "http://localhost:3000/api/roles" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"admin","description":"Administrator dengan akses penuh"}'
```

List roles:

```bash
curl "http://localhost:3000/api/roles" -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Get detail:

```bash
curl "http://localhost:3000/api/roles/1" -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Update:

```bash
curl -X PATCH "http://localhost:3000/api/roles/2" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"verifikator"}'
```

Delete:

```bash
curl -X DELETE "http://localhost:3000/api/roles/3" -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Assign permissions:

```bash
curl -X POST "http://localhost:3000/api/roles/5/permissions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"permissions":[{"menu_id":1,"action_id":1},{"menu_id":1,"action_id":2},{"menu_id":2,"action_id":1}]}'
```

Get permissions:

```bash
curl "http://localhost:3000/api/roles/5/permissions" -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
