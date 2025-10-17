# Audit Logs API

Base URL: `/api/audit-logs`

**Authentication Required:** Ya  
**Role Required:** ADMIN (untuk beberapa endpoint)

## Endpoints

### 1. GET /api/audit-logs

Mendapatkan semua audit logs dengan filter opsional.

**Query Parameters:**

- `userId` (number, optional) - Filter berdasarkan user
- `action` (string, optional) - Filter berdasarkan aksi: `CREATE`, `UPDATE`, `DELETE`, `VERIFY`, `LOGIN`, `LOGOUT`
- `entity` (string, optional) - Filter berdasarkan entity: `Document`, `DocumentCategory`, `User`, dll
- `startDate` (date, optional) - Filter logs setelah tanggal tertentu
- `endDate` (date, optional) - Filter logs sebelum tanggal tertentu

**Contoh Request:**

```bash
GET /api/audit-logs?action=CREATE&entity=Document
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan audit logs",
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "action": "CREATE",
      "entity": "Document",
      "entity_id": 5,
      "old_data": null,
      "new_data": {
        "id": 5,
        "title": "Peraturan Bupati No. 5 Tahun 2025",
        "status": "draft"
      },
      "created_at": "2025-01-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "user_id": 1,
      "action": "UPDATE",
      "entity": "Document",
      "entity_id": 5,
      "old_data": {
        "status": "draft"
      },
      "new_data": {
        "status": "published"
      },
      "created_at": "2025-01-15T11:00:00.000Z"
    }
  ]
}
```

---

### 2. GET /api/audit-logs/:id

Mendapatkan detail audit log berdasarkan ID.

**Contoh Request:**

```bash
GET /api/audit-logs/1
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan audit log dengan id 1",
  "success": true,
  "data": {
    "id": 1,
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@jdih.com"
    },
    "action": "CREATE",
    "entity": "Document",
    "entity_id": 5,
    "old_data": null,
    "new_data": {
      "id": 5,
      "title": "Peraturan Bupati No. 5 Tahun 2025",
      "number": "5",
      "type": "Peraturan Bupati",
      "year": 2025,
      "status": "draft"
    },
    "created_at": "2025-01-15T10:00:00.000Z"
  }
}
```

---

### 3. GET /api/audit-logs/user/:userId

Mendapatkan semua audit logs untuk user tertentu.

**Contoh Request:**

```bash
GET /api/audit-logs/user/1
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan audit logs untuk user 1",
  "success": true,
  "data": [
    {
      "id": 1,
      "action": "CREATE",
      "entity": "Document",
      "entity_id": 5,
      "created_at": "2025-01-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "action": "UPDATE",
      "entity": "DocumentCategory",
      "entity_id": 1,
      "created_at": "2025-01-15T11:00:00.000Z"
    }
  ]
}
```

---

### 4. GET /api/audit-logs/entity/:entity/:entityId

Mendapatkan riwayat audit untuk entity tertentu.

**Contoh Request:**

```bash
GET /api/audit-logs/entity/Document/5
Authorization: Bearer <token>
```

**Response 200:**

```json
{
  "message": "Berhasil mendapatkan audit logs untuk Document id 5",
  "success": true,
  "data": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "name": "Admin"
      },
      "action": "CREATE",
      "old_data": null,
      "new_data": {
        "title": "Peraturan Bupati No. 5 Tahun 2025",
        "status": "draft"
      },
      "created_at": "2025-01-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "user": {
        "id": 1,
        "name": "Admin"
      },
      "action": "UPDATE",
      "old_data": {
        "status": "draft"
      },
      "new_data": {
        "status": "published"
      },
      "created_at": "2025-01-15T11:00:00.000Z"
    }
  ]
}
```

---

## Audit Action Types

- **CREATE** - Entity baru dibuat
- **UPDATE** - Entity diperbarui
- **DELETE** - Entity dihapus (soft delete)
- **VERIFY** - Dokumen diverifikasi
- **LOGIN** - User login
- **LOGOUT** - User logout

## Tracked Entities

- **Document** - Perubahan pada dokumen
- **DocumentCategory** - Perubahan pada kategori dokumen
- **DocumentVersion** - Perubahan pada versi dokumen
- **User** - Perubahan pada user
- **Role** - Perubahan pada role

## Data Structure

- `old_data`: Data sebelum perubahan (null untuk CREATE)
- `new_data`: Data setelah perubahan (null untuk DELETE)
- Untuk UPDATE: Hanya field yang berubah yang dicatat

## Use Cases

1. **Compliance & Audit Trail**: Melacak siapa melakukan apa dan kapan
2. **Debugging**: Melihat riwayat perubahan data
3. **Security**: Mendeteksi aktivitas mencurigakan
4. **Rollback**: Memahami state sebelumnya untuk restore data
