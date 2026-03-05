# Payze Integration

<img src="./public/image.png" alt="Payze Integration">

A full **Payze** payment gateway integration built with Node.js, TypeScript, Express and MongoDB.

<img src="https://skillicons.dev/icons?i=nodejs,ts,express,mongodb" />

---

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express 4.x
- **Database:** MongoDB (Mongoose 8.x)
- **Validation:** class-validator + class-transformer
- **HTTP Client:** Axios

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file:

```bash
cp .env.example .env
```

Fill in your values:

```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/payze-integration
TOKEN_SECRET=your_jwt_secret_here
PAYZE_API_KEY=your_payze_api_key
PAYZE_API_SECRET=your_payze_api_secret
APP_URL=http://localhost:3001
```

> Get `PAYZE_API_KEY` and `PAYZE_API_SECRET` from [payze.io](https://payze.io).

### 3. Run the server

```bash
# Development (hot-reload)
npm run dev

# Production build
npm run build
npm start
```

---

## API Endpoints

### Products

| Method | URL | Description |
|--------|-----|-------------|
| `POST` | `/v1/products` | Create a new product |

**POST /v1/products** — request body:
```json
{
  "name": "iPhone 15",
  "price": 1200
}
```

---

### Orders

| Method | URL | Description |
|--------|-----|-------------|
| `POST` | `/v1/orders` | Create an order and initiate payment |
| `GET`  | `/v1/orders/:id` | Get order details |
| `GET`  | `/v1/orders/callback` | Payze success callback |
| `GET`  | `/v1/orders/callback/error` | Payze failure callback |

**POST /v1/orders** — request body:
```json
{
  "user": {
    "fullName": "John Doe",
    "phone": "+998901234567"
  },
  "products": [
    {
      "productId": "64f1a2b3c4d5e6f7a8b9c0d1",
      "count": 2
    }
  ]
}
```

**Response:**
```json
{
  "message": "ORDER_CREATED",
  "data": {
    "order": { "..." : "..." },
    "paymentUrl": "https://payze.io/pay?token=XXXXX"
  }
}
```

Redirect the user to `paymentUrl` to complete the payment.

---

## Payment Flow

```
1. Client  →  POST /v1/orders
              Order is created, Payze API is called
              ← paymentUrl is returned

2. Client  →  Redirects the user to paymentUrl

3. User    →  Completes payment on Payze page

4. Payze   →  GET /v1/orders/callback?transactionId=XXX
              Transaction is verified with Payze
              Order is updated with "performetedAt"

              or

   Payze   →  GET /v1/orders/callback/error?transactionId=XXX
              Order is updated with "canceledAt"
```
