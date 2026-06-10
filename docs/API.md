# API

Base path: `/api/v1`

## GET /health

Returns application health without touching the database.

Success:

```json
{
  "status": "ok",
  "service": "codecraft-web"
}
```

## POST /leads

Creates a bootcamp lead.

Request:

```json
{
  "fullName": "نام کامل",
  "phone": "09123456789",
  "ageRange": "AGE_15_17",
  "skillLevel": "ABSOLUTE_BEGINNER"
}
```

Optional fields are supported by the schema for future surfaces: `parentPhone`, `city`, and `source`.

Responses:

- `201` lead created
- `400` validation error
- `409` duplicate phone
- `500` unexpected server error
