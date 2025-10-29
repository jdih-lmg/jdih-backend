# ⚖️ JDIH Kabupaten Lamongan Backend API

Aplikasi backend sistem **Jaringan Dokumentasi dan Informasi Hukum (JDIH)** Kabupaten Lamongan.  
Menyediakan **API publik** dan **dashboard admin** untuk pengelolaan dokumen hukum, berita daerah, serta sistem manajemen pengguna dengan kontrol akses berbasis peran (RBAC).

---

## 🧭 Deskripsi Singkat

**JDIH Kabupaten Lamongan Backend API** dibangun menggunakan **NestJS + TypeORM + MySQL** dengan arsitektur modular dan clean.  
Aplikasi ini dirancang untuk mendukung sistem dokumentasi hukum daerah yang **terbuka untuk publik** namun tetap **aman dan terkontrol untuk admin**.

---

## ✨ Fitur Utama

### 🔓 Public API
- Akses publik untuk daftar dokumen & berita tanpa autentikasi.
- Dekorator `@Public()` digunakan untuk menandai endpoint publik.
- Middleware otomatis mencatat statistik pengunjung (IP, user agent, halaman, referrer).

### 🔐 Admin Dashboard API
- Sistem login JWT Authentication.
- Role-Based Access Control (RBAC) menggunakan `PermissionGuard`.
- Manajemen **User**, **Role**, **Menu**, dan **Permission**.
- Fitur **Audit Log** untuk mencatat setiap aksi admin.
- Fitur **Dokumen**:
  - CRUD Dokumen
  - Versioning dokumen
  - Soft delete & restore data
  - Status dokumen (draft, verified, published, archived)

### 📊 Statistik Pengunjung
- Middleware `VisitorLoggerMiddleware` mencatat seluruh aktivitas publik.
- Disimpan ke database melalui entitas `VisitorStat`.

### 🧾 Audit Log
- Semua aksi admin (create, update, delete, restore) dicatat secara otomatis untuk menjaga keamanan dan transparansi.

---

## 🧩 Arsitektur Aplikasi

```text
Client (Frontend / Public / Admin)
        │
        ▼
┌─────────────────────────────┐
│         Controller          │  →  Menangani request HTTP
└─────────────────────────────┘
            │
            ▼
┌─────────────────────────────┐
│          Service            │  →  Berisi logic utama & validasi
└─────────────────────────────┘
            │
            ▼
┌─────────────────────────────┐
│        Repository / DB      │  →  Mengakses MySQL via TypeORM
└─────────────────────────────┘
            │
            ▼
┌─────────────────────────────┐
│     Middleware & Guards     │
│  - Visitor Logger           │
│  - JwtAuthGuard             │
│  - PermissionGuard          │
└─────────────────────────────┘
```

## 🛠️ Teknologi yang Digunakan

| Teknologi             | Deskripsi                                                          |
| --------------------- | ------------------------------------------------------------------ |
| **NestJS**            | Framework utama untuk arsitektur modular dan maintainable backend. |
| **TypeORM**           | ORM untuk pengelolaan data di MySQL.                               |
| **MySQL**             | Database utama sistem JDIH.                                        |
| **JWT**               | Autentikasi berbasis token untuk admin.                            |
| **RBAC**              | Role-Based Access Control untuk mengatur hak akses.                |
| **Docker**            | Containerization dan environment consistency.                      |
| **pnpm**              | Package manager cepat dan efisien.                                 |
| **ESLint + Prettier** | Standarisasi dan formatting kode.                                  |

## 📁 Struktur Folder Utama
```bash
src/
 ┣ audit-logs/
 ┣ auth/
 ┣ common/
 ┣ documents/
 ┣ entities/
 ┣ health/
 ┣ news/
 ┣ role/
 ┣ users/
 ┣ visitor-stats/
 ┣ app.module.ts
 ┗ main.ts

auth/ → JWT, Permission, dan Guards (JwtAuthGuard, PermissionGuard)
documents/ → Manajemen dokumen & versioning
news/ → Modul berita dan kategori
visitor-stats/ → Middleware pencatat pengunjung
audit-logs/ → Logging aktivitas admin
common/ → Filter, interceptor, dan validasi global
```

## ⚙️ Cara Menjalankan Proyek
### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/jdih-backend
cd jdih-backend
```

### 2️⃣ Install Dependensi
```bash
pnpm install
```
### 3️⃣ Konfigurasi Environment
```bash
cp .env.example .env
```

### Isi variable env
```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=password
DB_NAME=jdih_lamongan
JWT_SECRET=your_jwt_secret
```

### 4️⃣ Jalankan Server
```bash
pnpm start:dev
```

## 🧠 Konsep Keamanan & Arsitektur
- JWT Auth Guard: memverifikasi token Bearer untuk semua route yang tidak diberi @Public().
- Permission Guard: memverifikasi apakah user memiliki izin (menu + action).
- Public Decorator (@Public()): menandai route publik agar dilewati oleh guards.
- Audit Log System: mencatat aktivitas penting (create, update, delete, restore).
- Soft Delete: entitas yang dihapus tidak benar-benar hilang — bisa direstore.
- Visitor Logger Middleware: mencatat data pengunjung publik secara otomatis.

## 🧾 Contoh Endpoint Publik
- GET /api/documents/list
- GET /api/documents/:id
- GET /api/news/list
- GET /api/news/:id

## 🔐 Contoh Endpoint Admin
- POST /api/auth/login
- POST /api/documents
- PUT /api/documents/:id
- PATCH /api/documents/:id/status
- DELETE /api/documents/:id

## 🧱 Database Overview
Entitas utama:
- users
- roles
- menus
- actions
- role_menu_permissions
- documents
- document_versions
- news
- visitor_stats
- audit_logs

## 🧑‍💻 Pengembang
```
Nama: Miftachul Huda
Peran: Backend Developer
Teknologi utama: NestJS, TypeORM, MySQL
Kontak: miftachulhd5@gmail.com
```

## 📜 Lisensi
Proyek ini dikembangkan untuk sebuah project © 2025 — Developed by Miftachul Huda











