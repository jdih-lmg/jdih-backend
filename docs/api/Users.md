# Users API

Base URL: `/api/users`

**Authentication Required:** Ya  
**Role Required:** USER (untuk read), ADMIN (untuk create/update/delete)

Semua respons sukses mengikuti pola:

```json
{
  "message": "string",
  "success": true,
  "data": {}
}
```

Respons error (global exception filter):

```json
{
  "message": "string",
  "success": false,
  "data": null,
  "path": "string",
  "timestamp": "string"
}
```

Entity user yang diekspos (sanitasi, tanpa password hash):

```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "role": {
    "id": "number",
    "name": "string",
    "description": "string | null"
  },
  "createdAt": "string (ISO datetime)",
  "updatedAt": "string | null"
}
```

---

### 1. GET /api/users

Ambil semua user.

**Role Required:** USER

**Contoh Request:**

```bash
GET /api/users
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan semua user",
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Admin",
      "email": "admin@jdih.com",
      "role": { "id": 1, "name": "admin", "description": "Administrator" },
      "createdAt": "2025-09-30T07:13:02.000Z",
      "updatedAt": null
    }
  ]
}
```

---

### 2. GET /api/users/:id

Ambil detail user berdasarkan ID.

**Contoh Request:**

```bash
GET /api/users/1
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan user id 1",
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin",
    "email": "admin@jdih.com",
    "role": { "id": 1, "name": "admin", "description": "Administrator" },
    "createdAt": "2025-09-30T07:13:02.000Z",
    "updatedAt": null
  }
}
```

**Error 404:**

```json
{
  "message": "User dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/users/999",
  "timestamp": "2025-10-03T09:30:00.000Z"
}
```

---

### 3. POST /api/users

Buat user baru.

**Request Body:**

```json
{
  "name": "string (3-30 karakter)",
  "email": "string (email valid, max 150)",
  "password": "string (8-100 karakter)",
  "roleId": "number (optional)"
}
```

**Contoh Request:**

```bash
POST /api/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Operator",
  "email": "operator@jdih.com",
  "password": "Rahasia123",
  "roleId": 1
}
```

**Response 201:**

```json
{
  "message": "Berhasil membuat user baru",
  "success": true,
  "data": {
    "id": 12,
    "name": "Operator",
    "email": "operator@jdih.com",
    "role": { "id": 1, "name": "admin", "description": "Administrator" },
    "createdAt": "2025-10-03T09:35:00.000Z",
    "updatedAt": null
  }
}
```

**Error 404 (Role tidak ditemukan):**

```json
{
  "message": "Role dengan id 99 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/users",
  "timestamp": "2025-10-03T09:35:00.000Z"
}
```

**Error 400 (Validasi):**

```json
{
  "message": "Username minimal 3 karakter",
  "success": false,
  "data": null,
  "path": "/api/users",
  "timestamp": "2025-10-03T09:35:00.000Z"
}
```

---

### 4. PUT /api/users/:id

Update sebagian/seluruh field user.

**Request Body:** (semua field optional)

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "roleId": "number"
}
```

**Contoh Request:**

```bash
PUT /api/users/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Administrator Utama",
  "password": "PasswordBaru999"
}
```

**Response 200:**

```json
{
  "message": "Berhasil mengupdate user id 1",
  "success": true,
  "data": {
    "id": 1,
    "name": "Administrator Utama",
    "email": "admin@jdih.com",
    "role": { "id": 1, "name": "admin", "description": "Administrator" },
    "createdAt": "2025-09-30T07:13:02.000Z",
    "updatedAt": "2025-10-03T09:40:11.000Z"
  }
}
```

**Error 404:**

```json
{
  "message": "User dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/users/999",
  "timestamp": "2025-10-03T09:40:11.000Z"
}
```

---

### 5. DELETE /api/users/:id

Soft delete user berdasarkan ID.

**Contoh Request:**

```bash
DELETE /api/users/3
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil menandai user id 3 sebagai terhapus",
  "success": true,
  "data": {
    "name": "Operator",
    "email": "operator@jdih.com"
  }
}
```

**Error 400 (Sudah terhapus):**

```json
{
  "message": "User id 3 sudah terhapus",
  "success": false,
  "data": null,
  "path": "/api/users/3",
  "timestamp": "2025-10-03T10:00:01.000Z"
}
```

---

### 6. GET /api/users/deleted/list

Mengambil daftar user yang sudah di-soft delete.

**Contoh Request:**

```bash
GET /api/users/deleted/list
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan user terhapus",
  "success": true,
  "data": [
    {
      "id": 3,
      "name": "Operator",
      "email": "operator@jdih.com",
      "deletedAt": "2025-10-03T10:00:01.000Z"
    }
  ]
}
```

---

### 7. PATCH /api/users/:id/restore

Merestore user yang telah di-soft delete.

**Contoh Request:**

```bash
PATCH /api/users/3/restore
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil merestore user id 3",
  "success": true,
  "data": {
    "id": 3,
    "name": "Operator",
    "email": "operator@jdih.com",
    "role": { "id": 1, "name": "admin", "description": "Administrator" },
    "createdAt": "2025-10-01T07:13:02.000Z",
    "updatedAt": "2025-10-03T10:02:11.000Z"
  }
}
```

**Error 404:**

```json
{
  "message": "User dengan id 999 tidak ditemukan",
  "success": false,
  "data": null,
  "path": "/api/users/999/restore",
  "timestamp": "2025-10-03T10:02:11.000Z"
}
```

**Error 400 (Belum terhapus):**

```json
{
  "message": "User id 3 tidak dalam status terhapus",
  "success": false,
  "data": null,
  "path": "/api/users/3/restore",
  "timestamp": "2025-10-03T10:02:11.000Z"
}
```

---

## Role Management

- **admin** (id: 1): Full access
- **user** (id: 2): Limited access

Password di-hash menggunakan bcrypt sebelum disimpan ke database.
