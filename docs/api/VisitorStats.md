# Visitor Stats API

Base URL: `/api/visitor-stats`

Authentication:

- Protected (JWT + PermissionGuard)

Permission module: `visitor-stats`  
Actions: `read`

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

- Controller: [`visitor-stats.controller.ts`](../../src/visitor-stats/visitor-stats.controller.ts)
- Service: [`visitor-stats.service.ts`](../../src/visitor-stats/visitor-stats.service.ts)
- Module: [`visitor-stats.module.ts`](../../src/visitor-stats/visitor-stats.module.ts)
- Middleware: [`visitor-logger.middleware.ts`](../../src/visitor-stats/visitor-logger.middleware.ts)
- Entity: [`VisitorStat`](../../src/entities/visitor-stats.entity.ts)

Catatan:

- Middleware mencatat kunjungan ke tabel `visitor_stats` dengan kolom: `id`, `ip_address`, `user_agent`, `visited_at`.
- Beberapa route publik seperti health check dapat dikecualikan dari pencatatan sesuai konfigurasi middleware.

---

## Entity Structure

```ts
type VisitorStat = {
  id: number;
  ip_address: string; // max length 45 (IPv4/IPv6)
  user_agent?: string | null;
  visited_at: string; // ISO datetime
};
```

---

## Endpoints

### 1) GET /api/visitor-stats

Daftar statistik kunjungan dengan pagination dan filter dasar.

Access: JWT (+ permission `visitor-stats:read`)

Query:

- page (number, default: 1)
- limit (number, default: 10)
- startDate (string ISO, optional) — filter dari tanggal (berdasarkan visited_at)
- endDate (string ISO, optional) — filter sampai tanggal (berdasarkan visited_at)
- ipAddress (string, optional) — filter persis/like pada `ip_address`
- userAgent (string, optional) — filter like pada `user_agent`

Response 200:

```json
{
  "message": "Statistik pengunjung berhasil diambil",
  "success": true,
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "last_page": 5
  },
  "data": [
    {
      "id": 1,
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0 (X11; Linux x86_64)...",
      "visited_at": "2025-10-28T10:30:15.000Z"
    }
  ]
}
```

---

### 2) GET /api/visitor-stats/summary

Ringkasan metrik kunjungan.

Access: JWT (+ permission `visitor-stats:read`)

Query (opsional):

- startDate (string ISO)
- endDate (string ISO)

Response 200:

```json
{
  "message": "Ringkasan statistik berhasil diambil",
  "success": true,
  "data": {
    "today": 150,
    "yesterday": 200,
    "thisWeek": 1200,
    "thisMonth": 5000,
    "total": 25000,
    "uniqueVisitors": 3500
  }
}
```

Catatan:

- Perhitungan berdasarkan `visited_at`.
- `uniqueVisitors` dihitung dari jumlah IP unik (`ip_address`) pada cakupan waktu yang diminta (atau keseluruhan bila tanpa filter).

---

## Error Responses (Umum)

401 Unauthorized:

```json
{
  "message": "Unauthorized",
  "success": false,
  "data": null,
  "path": "/api/visitor-stats",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

403 Forbidden (tanpa permission):

```json
{
  "message": "Forbidden resource",
  "success": false,
  "data": null,
  "path": "/api/visitor-stats",
  "timestamp": "2025-10-29T10:00:00.000Z"
}
```

---

## cURL Examples

List (pagination + filter):

```bash
curl "http://localhost:3000/api/visitor-stats?page=1&limit=10&startDate=2025-10-01&endDate=2025-10-31&ipAddress=192.168.1.100" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Summary (range tertentu):

```bash
curl "http://localhost:3000/api/visitor-stats/summary?startDate=2025-10-01&endDate=2025-10-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
