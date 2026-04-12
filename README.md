
# Site para acompanhantes

This is a code bundle for Site para acompanhantes. The original project is available at https://www.figma.com/design/n9URCIbySVwxzXpFVQRWn6/Site-para-acompanhantes.

## Running the code

Run `npm i` to install dependencies.

Run `npm run dev` to start the development server.

## API configuration

This project consumes API endpoints through a shared HTTP client.

Create a `.env` file in the root of the frontend project and set:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

When `VITE_API_BASE_URL` is defined, requests are made to:

- `${VITE_API_BASE_URL}/models`
- `${VITE_API_BASE_URL}/models/:id`
- `${VITE_API_BASE_URL}/admin/dashboard`
- `${VITE_API_BASE_URL}/admin/billing`
- `${VITE_API_BASE_URL}/admin/users`

If the API is unavailable or returns empty data in some screens, the frontend falls back to local mock data.

## Endpoint contracts

The frontend accepts two response shapes for most endpoints:

1. Raw payload
```json
[{ "...": "..." }]
```

2. Wrapped payload
```json
{ "data": [{ "...": "..." }] }
```

### GET /models

Used by the models catalog page.

Accepted payload (array or `{ data: array }`):

```json
[
  {
    "id": 1,
    "name": "Isabela Santos",
    "age": 25,
    "city": "São Paulo",
    "category": "VIP",
    "gender": "Female",
    "image": "https://...",
    "price": 500,
    "verified": true,
    "gallery": ["https://...", "https://..."]
  }
]
```

Notes:

- `price` can be number or string.
- `price` is normalized to euro format in UI.
- Items without `image` are filtered out.

### GET /models/:id

Used by the model profile page.

Accepted payload (object or `{ data: object }`):

```json
{
  "id": 1,
  "name": "Isabela Santos",
  "age": 25,
  "city": "São Paulo",
  "category": "VIP",
  "gender": "Female",
  "image": "https://...",
  "price": 500,
  "verified": true,
  "rating": 4.9,
  "reviews": 127,
  "phone": "(11) 99999-9999",
  "email": "isabela@example.com",
  "description": "...",
  "services": ["Dinners", "Travel"],
  "availability": "Monday to Saturday",
  "languages": ["Portuguese", "English"],
  "gallery": ["https://..."],
  "testimonials": [
    {
      "id": 1,
      "author": "Carlos M.",
      "rating": 5,
      "date": "15/02/2026",
      "comment": "Amazing experience"
    }
  ]
}
```

Notes:

- Partial payloads are supported. Missing fields are filled by local defaults in the UI.

### GET /admin/dashboard

Used by the admin dashboard page.

Accepted payload (object or `{ data: object }`):

```json
{
  "stats": [
    { "title": "Total Users", "value": "1,234", "change": "+12%", "positive": true }
  ],
  "recentActivities": [
    {
      "id": 1,
      "user": "Isabela Santos",
      "action": "New model registration",
      "time": "2 hours ago",
      "type": "success"
    }
  ],
  "topModels": [
    { "id": 1, "name": "Isabela Santos", "revenue": "€ 15.400,00", "views": "2.3K" }
  ]
}
```

### GET /admin/billing

Used by the admin billing page.

Accepted payload (object or `{ data: object }`):

```json
{
  "stats": [
    { "title": "Monthly Revenue", "value": "€ 45.200,00", "change": "+18%" }
  ],
  "transactions": [
    {
      "id": "TRX-001234",
      "model": "Isabela Santos",
      "client": "Carlos M.",
      "amount": "€ 500,00",
      "commission": "€ 100,00",
      "date": "08/03/2026",
      "status": "Completed",
      "method": "Credit Card"
    }
  ]
}
```

### GET /admin/users

Used by the admin users page.

Accepted payload (array or `{ data: array }`):

```json
[
  {
    "id": 1,
    "name": "Isabela Santos",
    "email": "isabela@example.com",
    "role": "Model",
    "status": "Active",
    "verified": true,
    "joinedDate": "15/01/2026",
    "revenue": "€ 15.400,00"
  }
]
```
  