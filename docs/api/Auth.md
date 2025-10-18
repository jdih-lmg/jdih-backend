# Auth API

Base URL: `/api/auth`

## Endpoints

### 1. POST /api/auth/register

Registrasi user baru.

**Request Body:**

```json
{
  "name": "string (3-30 karakter)",
  "email": "string (email valid, max 150 karakter)",
  "password": "string (8-100 karakter)",
  "roleId": "number (optional, default: 2 untuk user biasa)"
}
```

**Contoh Request:**

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "roleId": 2
}
```

**Response 201 (Created):**

```json
{
  "message": "Registrasi berhasil",
  "success": true,
  "data": {
    "id": 15,
    "name": "John Doe",
    "email": "john@example.com",
    "role": {
      "id": 2,
      "name": "user",
      "description": "Regular user"
    }
  }
}
```

**Error 400 (Validation):**

```json
{
  "message": "Email tidak valid",
  "success": false,
  "data": null,
  "path": "/api/auth/register",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

### 2. POST /api/auth/login

Login user dan mendapatkan JWT token.

**Request Body:**

```json
{
  "email": "string (email valid)",
  "password": "string"
}
```

**Contoh Request:**

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@jdih.com",
  "password": "Admin123"
}
```

**Response 200 (OK):**

```json
{
  "message": "Login berhasil",
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": 1,
      "email": "admin@jdih.com",
      "role": "admin"
    }
  }
}
```

**Error 401 (Invalid Credentials):**

```json
{
  "message": "Email atau password salah",
  "success": false,
  "data": null,
  "path": "/api/auth/login",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

### 3. GET /api/auth/me

Mendapatkan informasi user dari JWT token.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Contoh Request:**

```bash
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200 (OK):**

```json
{
  "message": "Berhasil mendapatkan profil user dari token",
  "success": true,
  "data": {
    "userId": 1,
    "email": "admin@jdih.com",
    "role": "admin"
  }
}
```

**Error 401 (Unauthorized):**

```json
{
  "message": "Token kedaluwarsa, silakan login kembali",
  "success": false,
  "data": null,
  "path": "/api/auth/me",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## Authentication Flow

1. User melakukan **register** atau sudah memiliki akun
2. User melakukan **login** dan mendapat `access_token`
3. Untuk endpoint yang memerlukan autentikasi, sertakan token di header:
   ```
   Authorization: Bearer <access_token>
   ```
4. Gunakan endpoint `/api/auth/me` untuk validasi token dan mendapat info user

---

## Role-Based Access Control

- **admin** (roleId: 1): Akses penuh ke semua endpoint
- **user** (roleId: 2): Akses terbatas (read-only untuk beberapa resource)

Endpoint tertentu memerlukan role khusus yang akan ditandai dengan decorator `@Roles()`.
