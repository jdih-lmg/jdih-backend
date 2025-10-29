# Authentication API

Base URL: `/api/auth`

Authentication Required: Tidak (kecuali endpoint tertentu)

## Overview

API Authentication mengelola proses registrasi, login, otentikasi JWT, dan logout. Validasi payload menggunakan Zod, token dibuat via JWT, dan error diseragamkan oleh [`AllExceptionFilter`](../../src/common/filters/all-exception.filter.ts).

- Guard publik: route dengan dekorator `@Public()` dilewati oleh [`JwtAuthGuard`](../../src/auth/guards/jwt-auth.guard.ts)
- Secret & expiry: diambil dari environment (`JWT_SECRET`, `JWT_EXPIRES_IN`) dengan default `kunci_rahasia_jwt` dan `1h` di [`AuthModule`](../../src/auth/auth.module.ts)

Implementasi:

- Service: [`AuthService`](../../src/auth/auth.service.ts)
- Controller: [`AuthController`](../../src/auth/auth.controller.ts)
- Strategy: [`JwtStrategy`](../../src/auth/jwt.strategy.ts)
- Guard: [`JwtAuthGuard`](../../src/auth/guards/jwt-auth.guard.ts)
- DTOs: [`RegisterSchema`](../../src/auth/dto/register.dto.ts), [`LoginSchema`](../../src/auth/dto/login.dto.ts)

---

## Endpoints

### 1) POST /api/auth/register

Registrasi user baru.

Authentication Required: Tidak

Validation Rules (Zod):

- name: string, min 3, max 100
- email: email valid, max 100
- password: string, min 8
- role_id: number, optional (saat ini diabaikan — role default: `user`)

Request Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role_id": 2
}
```

Response 201:

```json
{
  "message": "Registrasi berhasil",
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 5,
      "name": "John Doe",
      "email": "john@example.com",
      "role": { "id": 2, "name": "user" },
      "created_at": "2025-01-15T10:00:00.000Z"
    }
  }
}
```

Error 409 (Email sudah terdaftar):

```json
{
  "message": "Email sudah terdaftar",
  "success": false,
  "data": null,
  "path": "/api/auth/register",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

Error 400 (Validasi):

```json
{
  "message": "Nama minimal 3 karakter, Email tidak valid, Password minimal 8 karakter",
  "success": false,
  "data": null,
  "path": "/api/auth/register",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

Catatan:

- Implementasi validasi: [`RegisterSchema`](../../src/auth/dto/register.dto.ts)
- Penentuan role default: `user` di [`AuthService.register`](../../src/auth/auth.service.ts)
- Token dibuat via method `signToken` di [`AuthService`](../../src/auth/auth.service.ts)

---

### 2) POST /api/auth/login

Login untuk mendapatkan JWT access token.

Authentication Required: Tidak

Validation Rules (Zod):

- email: required, valid email, akan di-trim dan lowercased
- password: required, min 8

Request Body:

```json
{
  "email": "admin@jdih.com",
  "password": "Admin123!"
}
```

Response 200:

```json
{
  "message": "Login berhasil",
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@jdih.com",
      "role": { "id": 1, "name": "admin" }
    }
  }
}
```

Error 401 (Invalid credentials):

```json
{
  "message": "Email atau password salah",
  "success": false,
  "data": null,
  "path": "/api/auth/login",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

Catatan:

- Normalisasi email dan verifikasi password: [`AuthService.login`](../../src/auth/auth.service.ts)
- Aksi login dicatat ke audit log via [`AuditLogsService.logAction`](../../src/audit-logs/audit-logs.service.ts)

---

### 3) GET /api/auth/me

Mengambil payload user dari JWT (profil singkat).

Authentication Required: Ya

Headers:

```
Authorization: Bearer <access_token>
```

Response 200:

```json
{
  "message": "Berhasil mendapatkan profil user dari token",
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@jdih.com",
    "name": "Admin User",
    "role": { "id": 1, "name": "admin" }
  }
}
```

Error 401:

```json
{
  "message": "Unauthorized",
  "success": false,
  "data": null,
  "path": "/api/auth/me",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

Catatan:

- Sumber payload user: [`JwtStrategy.validate`](../../src/auth/jwt.strategy.ts)
- Guard: [`JwtAuthGuard`](../../src/auth/guards/jwt-auth.guard.ts)

---

### 4) POST /api/auth/logout

Logout user (untuk keperluan audit log).

Authentication Required: Ya

Headers:

```
Authorization: Bearer <access_token>
```

Response 200:

```json
{
  "message": "Logout berhasil",
  "success": true
}
```

Catatan:

- Aksi logout dicatat via [`AuditLogsService.logAction`](../../src/audit-logs/audit-logs.service.ts)

---

## JWT Token

Konfigurasi:

- Secret: `JWT_SECRET` (default: `kunci_rahasia_jwt`)
- Expiry: `JWT_EXPIRES_IN` (default: `1h`)

Proses:

- Pembuatan token: [`AuthService.signToken`](../../src/auth/auth.service.ts)
- Validasi token: [`JwtStrategy`](../../src/auth/jwt.strategy.ts)
- Guard route: [`JwtAuthGuard`](../../src/auth/guards/jwt-auth.guard.ts)

---

## Password Requirements

Sesuai skema validasi saat ini:

- Minimal 8 karakter

Contoh valid:

- `Password123`
- `Admin2025!`

Contoh tidak valid:

- `Pass1` (kurang dari 8 karakter)

---

## Error Response Format

Semua error menggunakan format standar dari [`AllExceptionFilter`](../../src/common/filters/all-exception.filter.ts):

```json
{
  "message": "Pesan error",
  "success": false,
  "data": null,
  "path": "/api/endpoint",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

Kasus umum 401 oleh [`JwtAuthGuard`](../../src/auth/guards/jwt-auth.guard.ts):

- Token kedaluwarsa:

```json
{
  "message": "Token kedaluwarsa, silakan login kembali",
  "success": false,
  "data": null,
  "path": "/api/route-yang-diminta",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

- Token tidak valid:

```json
{
  "message": "Token tidak valid",
  "success": false,
  "data": null,
  "path": "/api/route-yang-diminta",
  "timestamp": "2025-01-15T10:00:00.000Z"
}
```

---

## cURL Examples

Registrasi:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"Password123!"}'
```

Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jdih.com","password":"Admin123!"}'
```

Profil (me):

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Logout:

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
