# API Documentation - HouseCall Pro Clone

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+5511999999999",
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

## Appointments

### Get All Appointments
```http
GET /api/appointments
Authorization: Bearer <token>

Query Parameters:
- status: scheduled|confirmed|in-progress|completed|cancelled
- technician: technician_id
- customer: customer_id
- startDate: ISO date
- endDate: ISO date
```

### Create Appointment
```http
POST /api/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "customer": "customer_id",
  "technician": "technician_id",
  "service": "service_id",
  "scheduledDate": "2024-01-15",
  "scheduledStartTime": "09:00",
  "scheduledEndTime": "10:00",
  "duration": 60,
  "address": {
    "street": "123 Main St",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567",
    "country": "BR"
  },
  "description": "Repair air conditioning",
  "estimatedCost": 150.00
}
```

### Check-in
```http
POST /api/appointments/:id/checkin
Authorization: Bearer <token>
Content-Type: application/json

{
  "location": {
    "lat": -23.550520,
    "lng": -46.633308
  },
  "photos": ["url1", "url2"]
}
```

### Check-out
```http
POST /api/appointments/:id/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "location": {
    "lat": -23.550520,
    "lng": -46.633308
  },
  "photos": ["url1", "url2"],
  "customerSignature": "base64_signature"
}
```

## Customers

### Get All Customers
```http
GET /api/customers
Authorization: Bearer <token>

Query Parameters:
- status: active|inactive|blocked
- tags: tag1,tag2
- search: search term
```

### Create Customer
```http
POST /api/customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "user": "user_id",
  "addresses": [
    {
      "street": "123 Main St",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01234-567",
      "country": "BR",
      "isDefault": true
    }
  ],
  "tags": ["vip", "commercial"],
  "notes": "Preferred contact via email"
}
```

## Invoices

### Get All Invoices
```http
GET /api/invoices
Authorization: Bearer <token>

Query Parameters:
- status: draft|sent|viewed|paid|partial|overdue|cancelled
- customer: customer_id
- startDate: ISO date
- endDate: ISO date
```

### Create Invoice
```http
POST /api/invoices
Authorization: Bearer <token>
Content-Type: application/json

{
  "customer": "customer_id",
  "appointment": "appointment_id",
  "dueDate": "2024-01-30",
  "items": [
    {
      "description": "AC Repair Service",
      "quantity": 1,
      "unitPrice": 150.00,
      "taxRate": 10,
      "discount": 0
    }
  ],
  "notes": "Payment due in 30 days"
}
```

### Add Payment
```http
POST /api/invoices/:id/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 150.00,
  "method": "credit_card",
  "transactionId": "txn_123456",
  "notes": "Paid in full"
}
```

## Services

### Get All Services
```http
GET /api/services
Authorization: Bearer <token>
```

### Create Service
```http
POST /api/services
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "AC Repair",
  "description": "Air conditioning repair service",
  "category": "HVAC",
  "basePrice": 150.00,
  "pricingType": "fixed",
  "estimatedDuration": 60,
  "requiredSkills": ["HVAC", "Electrical"]
}
```

## Technicians

### Get All Technicians
```http
GET /api/technicians
Authorization: Bearer <token>
```

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
