# MongoDB Setup for BuildConnect

All application data is stored in **MongoDB** — users, providers, products, bookings, orders, and reviews.

On **first run**, BuildConnect automatically:

1. Connects using `MONGODB_URI` from `.env.local`
2. Creates the `buildconnect` database (if it does not exist)
3. Creates required collections
4. Loads starter catalogue data when the database is empty

---

## Local MongoDB + Compass

### 1. Install MongoDB Community Server

Download: https://www.mongodb.com/try/download/community

Run the installer with **Install as a Service** enabled (default port `27017`).

### 2. Install MongoDB Compass

Download: https://www.mongodb.com/try/download/compass

### 3. Connect in Compass

1. Open Compass → **New Connection**
2. URI: `mongodb://localhost:27017`
3. Click **Connect**

You do not need to create the database manually — BuildConnect creates it on startup.

### 4. Configure the application

Create or edit `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/buildconnect
JWT_SECRET=your-secure-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Start the application

```bash
npm run dev
```

Terminal output when initialized:

```
[BuildConnect] MongoDB ready: Platform initialized with starter listings and accounts.
```

### 6. Verify in Compass

Refresh Compass → open database **buildconnect** → collections:

| Collection | Contents |
|------------|----------|
| `users` | Customer, admin, provider, and vendor accounts |
| `providers` | Worker and contractor listings |
| `products` | Material catalogue |
| `bookings` | Service bookings |
| `orders` | Material orders |
| `reviews` | Customer reviews |

### 7. Health check

Open: http://localhost:3000/api/health

---

## MongoDB Atlas (Cloud)

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Add a database user and network access (your IP or `0.0.0.0/0` for development)
3. Copy the connection string and update `.env.local`:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/buildconnect?retryWrites=true&w=majority
```

4. Use the same URI in Compass to manage data visually

---

## Reset starter data (development only)

```bash
curl -X POST http://localhost:3000/api/seed
```

This reloads the default catalogue. Disabled in production.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED 127.0.0.1:27017` | Start the MongoDB Windows service |
| Empty listings | Ensure MongoDB is running, then restart `npm run dev` |
| Database not visible in Compass | Run the app once, then refresh Compass |
