## Users API

Base URL: `/api/users`

Semua respons sukses mengikuti pola:

```
{
	"message": string,
	"success": true,
	"data": ...
}
```

Respons error (global exception filter):

```
{
	"message": string,
	"success": false,
	"data": null,
	"path": string,
	"timestamp": string
}
```

Entity user yang diekspos (sanitasi, tanpa password hash):

```
{
	"id": number,
	"name": string,
	"email": string,
	"role": { "id": number, "name": string, "description": string | null } | null,
	"createdAt": string (ISO datetime),
	"updatedAt": string | null
}
```

---

### 1. GET /api/users

Ambil semua user.

Request:

```
GET /api/users
```

Contoh Response 200:

```
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

### 2. GET /api/users/:id

Ambil detail user berdasarkan ID.

Request:

```
GET /api/users/1
```

Response 200:

```
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

Response 404 (contoh):

```
{
	"message": "User dengan id 999 tidak ditemukan",
	"success": false,
	"data": null,
		"path": "/api/users/999",
	"timestamp": "2025-10-03T09:30:00.000Z"
}
```

### 3. POST /api/users

Buat user baru.

Body Schema (CreateUserDto):

```
{
	"name": string (3..30),
	"email": string (email valid, max 150),
	"password": string (8..100),
	"roleId": number (optional, tapi service saat ini mengharuskan role valid bila dikirim)
}
```

Contoh Request:

```
POST /api/users
Content-Type: application/json

{
	"name": "Operator",
	"email": "operator@jdih.com",
	"password": "Rahasia123",
	"roleId": 1
}
```

Response 201:

```
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

Error 404 (role tidak ditemukan):

```
{
	"message": "Role dengan id 99 tidak ditemukan",
	"success": false,
	"data": null,
		"path": "/api/users",
	"timestamp": "..."
}
```

Error 400 (validasi zod — contoh name pendek):

```
{
	"message": "Username minimal 3 karakter",
	"success": false,
	"data": null,
		"path": "/api/users",
	"timestamp": "..."
}
```

### 4. PUT /api/users/:id

Update sebagian/seluruh field user.

Body Schema (UpdateUserDto):
Semua field optional, aturan panjang sama dengan create.

```
{
	"name"?: string,
	"email"?: string,
	"password"?: string,
	"roleId"?: number
}
```

Contoh Request:

```
PUT /api/users/1
{
	"name": "Administrator Utama",
	"password": "PasswordBaru999"
}
```

Response 200:

```
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

Error 404 (user tidak ditemukan):

```
{
	"message": "User dengan id 999 tidak ditemukan",
	"success": false,
	"data": null,
		"path": "/api/users/999",
	"timestamp": "..."
}
```

Error 404 (role baru tidak ditemukan):

```
{
	"message": "Role dengan id 77 tidak ditemukan",
	"success": false,
	"data": null,
		"path": "/api/users/1",
	"timestamp": "..."
}
```

### 5. DELETE /api/users/:id

Menghapus user (hard delete via repository.remove()).

Request:

```
DELETE /api/users/3
```

Response 200:

```
{
	"message": "Berhasil menghapus user id 3",
	"success": true,
	"data": {
		"name": "Operator",
		"email": "operator@jdih.com"
	}
}
```

Error 404:

```
{
	"message": "User dengan id 3 tidak ditemukan",
	"success": false,
	"data": null,
		"path": "/api/users/3",
	"timestamp": "..."
}
```

---
