# Health API

Base URL: `/api/health`

Authentication Required: Tidak

## Overview

Endpoint untuk memeriksa kesehatan aplikasi dan koneksi database. Endpoint ini bersifat public (`@Public()`), sehingga dilewati oleh JwtAuthGuard.

Implementasi:

- Controller: [`health.controller.ts`](../../src/health/health.controller.ts)
- Service: [`health.service.ts`](../../src/health/health.service.ts)
- Module: [`health.module.ts`](../../src/health/health.module.ts)

Jika terjadi error tak terduga, format error akan diseragamkan oleh [`AllExceptionFilter`](../../src/common/filters/all-exception.filter.ts).

---

## Endpoints

### GET /api/health

Memeriksa status aplikasi dan koneksi database.

Contoh Request:

```bash
curl http://localhost:3000/api/health
```

Response 200 (OK):

```json
{
  "status": "ok",
  "uptime": 3600.5,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "checks": {
    "database": "up"
  }
}
```

Response 200 (Degraded - Database Down):

```json
{
  "status": "degraded",
  "uptime": 3600.5,
  "timestamp": "2025-01-15T10:30:00.000Z",
  "checks": {
    "database": "down"
  }
}
```

Catatan:

- Nilai `uptime` diambil dari waktu berjalan proses (detik).
- Service akan mencoba koneksi sederhana ke database (mis. `SELECT 1`); hasilnya dipetakan ke `checks.database` dengan nilai `up`, `down`, atau `unknown`.

---

## Response Fields

- status: string — Status aplikasi: `ok` atau `degraded`
- uptime: number — Waktu aplikasi berjalan (detik)
- timestamp: string — Waktu pengecekan (ISO 8601)
- checks: object — Status komponen individual
  - database: string — `up`, `down`, atau `unknown`

---

## Error Responses

Jika terjadi error tak terduga, response mengikuti standar global filter:

```json
{
  "message": "Terjadi kesalahan pada server",
  "success": false,
  "data": null,
  "path": "/api/health",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## Use Cases

- Monitoring: Dipakai tools seperti Prometheus/Datadog.
- Load Balancer: Health check liveness/readiness.
- CI/CD: Validasi setelah deploy.
- DevOps: Quick check status aplikasi.
