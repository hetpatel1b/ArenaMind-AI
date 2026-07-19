# API Conventions

The ArenaMind AI API is designed with strict conventions to ensure a predictable and enterprise-grade developer experience.

## Standard Envelopes

All successful array endpoints return a `PaginatedResult` envelope:

```json
{
  "success": true,
  "data": [
    // Array of DTOs
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

All standard single-entity endpoints return:

```json
{
  "success": true,
  "data": {
    // DTO object
  }
}
```

Errors are standardized across the entire API:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Incident not found"
  }
}
```

## Querying Features

### Pagination

Append `page` and `limit` to control data size.

- `?page=2&limit=50`

### Sorting

Append `sort` (field name) and `order` (`asc` or `desc`).

- `?sort=createdAt&order=desc`

### Filtering

Pass any whitelisted field directly as a query parameter.

- `?status=open&severityTier=1`

### Search

Use the `q` parameter to perform full-text searches across domain-relevant fields (e.g., incident titles/descriptions).

- `?q=fire`

## Security

### RBAC (Role-Based Access Control)

The API strictly enforces operational roles (`operations_manager`, `coordinator`, etc.) at the route level.

### Tenant Isolation

Every request requires contextual isolation. Cross-tenant data leakage is structurally impossible at the repository and service layers.
