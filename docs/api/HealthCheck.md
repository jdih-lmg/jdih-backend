# Health API

Base URL: `/api/health`

**Authentication Required:** Tidak

## Endpoints

### GET /api/health

Memeriksa status kesehatan aplikasi dan koneksi database.

**Contoh Request:**

```bash
GET /api/health
```

**Response 200 (OK):**

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

**Response 200 (Degraded - Database Down):**

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

---

## Response Fields

| Field       | Type   | Description                                           |
| ----------- | ------ | ----------------------------------------------------- |
| `status`    | string | Status aplikasi: `ok` atau `degraded`                 |
| `uptime`    | number | Waktu aplikasi berjalan (dalam detik)                 |
| `timestamp` | string | Timestamp saat pengecekan (ISO 8601)                  |
| `checks`    | object | Status komponen individual                            |
| `database`  | string | Status koneksi database: `up`, `down`, atau `unknown` |

---

## Use Cases

1. **Monitoring**: Digunakan oleh monitoring tools (Prometheus, Datadog, dll)
2. **Load Balancer**: Health check untuk load balancer
3. **CI/CD**: Validasi deployment berhasil
4. **DevOps**: Quick check status aplikasi

---

## Implementation

Endpoint ini melakukan:

1. Query sederhana ke database (`SELECT 1`)
2. Menghitung uptime aplikasi
3. Mengembalikan status komponen

Jika database down, status menjadi `degraded` tetapi aplikasi tetap responsif.
