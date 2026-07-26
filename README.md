# BuildConnect

**BuildConnect** is a full-stack construction marketplace that connects customers with skilled workers, verified contractors, and material suppliers — on a single platform with transparent pricing, ratings, and secure bookings.

## Features

- Hire individual workers (painters, carpenters, electricians, and more)
- Book contractors for full construction, labour-only, or renovation projects
- Browse and purchase construction materials from verified vendors
- Role-based dashboards for customers, providers, vendors, and administrators
- JWT authentication with secure session management
- Real-time listings stored in MongoDB

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend | Next.js API Routes |
| Database | MongoDB with Mongoose |
| Auth | JWT (httpOnly cookies) |
| State | Zustand (shopping cart) |

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)

### Installation

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

On first launch, the application automatically creates the database, collections, and starter catalogue data if the database is empty.

### Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/buildconnect
JWT_SECRET=your-secure-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Application Routes

| Page | Route |
|------|-------|
| Home | `/` |
| About | `/about` |
| Contact | `/contact` |
| Login / Register | `/login` |
| Workers | `/workers` |
| Contractors | `/contractors` |
| Materials | `/materials` |
| Cart & Checkout | `/cart` |
| Bookings | `/bookings` |
| Profile | `/profile` |
| Admin Dashboard | `/admin/dashboard` |
| Provider Dashboard | `/provider/dashboard` |
| Vendor Dashboard | `/vendor/dashboard` |

## API Overview

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register` | Create account |
| `POST /api/auth/login` | Sign in |
| `POST /api/auth/logout` | Sign out |
| `GET /api/auth/me` | Current session |
| `GET /api/workers` | List workers |
| `GET /api/contractors` | List contractors |
| `GET /api/products` | List materials |
| `POST /api/bookings` | Create booking |
| `POST /api/orders` | Place order |
| `GET/POST /api/reviews` | Reviews |
| `POST/PATCH/DELETE /api/providers` | Manage worker & contractor listings |
| `POST/PATCH/DELETE /api/products` | Manage material listings |

## Project Structure

```
src/
├── app/
│   ├── (public)/       # Marketing & customer pages
│   ├── admin/          # Admin dashboard
│   ├── provider/       # Worker & contractor dashboard
│   ├── vendor/         # Vendor dashboard
│   └── api/            # REST API routes
├── components/
├── context/            # Auth state
├── lib/
├── models/
└── store/
```

## Database

See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for MongoDB Compass connection instructions.

## License

Proprietary — BuildConnect Technologies Pvt. Ltd.

## GitHub Pages (Static Demo)

Live demo: [https://HARIPRASAD-TB.github.io/CSMMS](https://HARIPRASAD-TB.github.io/CSMMS)

This project uses **Next.js**, not Create React App. GitHub Pages hosts a **static export** of the frontend only. API routes, MongoDB, authentication, and server middleware do not run on GitHub Pages. For the full application, run locally or deploy to a Node.js host (e.g. Vercel).

### Deploy to GitHub Pages

```bash
npm install
npm run deploy
```

This runs `build:gh` (static export with `/CSMMS` base path) and publishes the `out/` folder to the `gh-pages` branch.

In your GitHub repository settings, set **Pages → Build and deployment → Branch** to `gh-pages` / `/ (root)`.
