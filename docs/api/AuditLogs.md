# Document Version API Documentation

## Overview

Endpoints untuk manajemen versi dokumen. Mendukung version control dan tracking perubahan.

## Base URL

```
/documents/:documentId/versions
```

## Endpoints

### POST /documents/:documentId/versions

Membuat versi baru untuk dokumen. Versi akan auto-increment dari versi terakhir.

**Access:** Protected (JWT Required)

**Headers:**

```
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "changeDescription": "string (required)",
  "fileUrl": "string (required)",
  "fileSize": "number (required)",
  "fileType": "string (required)"
}
```

**Response:** `201 Created`

```json
{
  "message": "Versi dokumen berhasil dibuat",
  "success": true,
  "data": {
    "id": "number",
    "documentId": "number",
    "version": "number",
    "changeDescription": "string",
    "fileUrl": "string",
    "fileSize": "number",
    "fileType": "string",
    "uploadedBy": "number",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Error Responses:**

404 Not Found - Dokumen tidak ditemukan:

```json
{
  "statusCode": 404,
  "message": "Dokumen tidak ditemukan"
}
```

**Notes:**

- Versi akan otomatis increment (1, 2, 3, dst)
- `uploadedBy` otomatis diisi dari user yang login
- `currentVersion` pada dokumen akan otomatis terupdate

---

### GET /documents/:documentId/versions

Mendapatkan semua versi dari dokumen, diurutkan dari terbaru.

**Access:** Public

**Response:** `200 OK`

```json
{
  "message": "Daftar versi dokumen berhasil diambil",
  "success": true,
  "data": [
    {
      "id": "number",
      "documentId": "number",
      "version": "number",
      "changeDescription": "string",
      "fileUrl": "string",
      "fileSize": "number",
      "fileType": "string",
      "uploadedBy": "number",
      "createdAt": "date",
      "updatedAt": "date",
      "uploader": {
        "id": "number",
        "name": "string",
        "email": "string"
      }
    }
  ]
}
```

**Error Responses:**

404 Not Found - Dokumen tidak ditemukan:

```json
{
  "statusCode": 404,
  "message": "Dokumen tidak ditemukan"
}
```

---

### GET /documents/:documentId/versions/:id

Mendapatkan detail versi spesifik beserta info dokumen dan uploader.

**Access:** Public

**Response:** `200 OK`

```json
{
  "message": "Versi dokumen berhasil ditemukan",
  "success": true,
  "data": {
    "id": "number",
    "documentId": "number",
    "version": "number",
    "changeDescription": "string",
    "fileUrl": "string",
    "fileSize": "number",
    "fileType": "string",
    "uploadedBy": "number",
    "createdAt": "date",
    "updatedAt": "date",
    "document": {
      "id": "number",
      "title": "string",
      "documentNumber": "string",
      "currentVersion": "number"
    },
    "uploader": {
      "id": "number",
      "name": "string",
      "email": "string"
    }
  }
}
```

**Error Responses:**

404 Not Found - Versi tidak ditemukan:

```json
{
  "statusCode": 404,
  "message": "Versi dokumen tidak ditemukan"
}
```

404 Not Found - Dokumen tidak ditemukan:

```json
{
  "statusCode": 404,
  "message": "Dokumen tidak ditemukan"
}
```

400 Bad Request - Versi tidak sesuai dengan dokumen:

```json
{
  "statusCode": 400,
  "message": "Versi tidak termasuk dalam dokumen ini"
}
```

---

### DELETE /documents/:documentId/versions/:id

Hapus versi dokumen (soft delete).

**Access:** Protected (JWT Required)

**Headers:**

```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`

```json
{
  "message": "Versi dokumen berhasil dihapus",
  "success": true
}
```

**Error Responses:**

404 Not Found - Versi tidak ditemukan:

```json
{
  "statusCode": 404,
  "message": "Versi dokumen tidak ditemukan"
}
```

404 Not Found - Dokumen tidak ditemukan:

```json
{
  "statusCode": 404,
  "message": "Dokumen tidak ditemukan"
}
```

400 Bad Request - Versi tidak sesuai dengan dokumen:

```json
{
  "statusCode": 400,
  "message": "Versi tidak termasuk dalam dokumen ini"
}
```

400 Bad Request - Tidak bisa menghapus versi aktif:

```json
{
  "statusCode": 400,
  "message": "Tidak bisa menghapus versi yang sedang aktif"
}
```

**Notes:**

- Tidak bisa menghapus versi yang sedang aktif (currentVersion)
- Jika versi dihapus, currentVersion pada dokumen akan otomatis disesuaikan ke versi terbaru yang tersisa
