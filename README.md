# Nyumba — Property Marketplace Platform

A full-stack property marketplace for Kenya, built with Django REST Framework + React + Tailwind CSS.

---

## ⚡ Quick Start (3 commands)

```bash
# 1. Edit your database + API credentials
cp .env.example .env
nano .env          # fill in DB_PASSWORD, CLOUDINARY_*, MPESA_*

# 2. Run the setup script (installs everything + runs migrations)
bash setup.sh

# 3. Start both servers
source venv/bin/activate && python manage.py runserver   # terminal 1
cd frontend && npm run dev                               # terminal 2
```

Open **http://localhost:5173** in your browser.

---

## 📋 Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Python | 3.10+ | `python3 --version` |
| Node.js | 18+ | `node --version` |
| PostgreSQL | 14+ | `psql --version` |

### Install PostgreSQL (Ubuntu/Debian)
```bash
sudo apt update && sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE DATABASE nyumba_db;"
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'yourpassword';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE nyumba_db TO postgres;"
```

### Install PostgreSQL (macOS)
```bash
brew install postgresql
brew services start postgresql
createdb nyumba_db
```

---

## 🌍 Environment Variables (.env)

```env
# Django
SECRET_KEY=your-very-secret-key-change-this
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# PostgreSQL
DB_NAME=nyumba_db
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# Cloudinary (free at cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mpesa Daraja (developer.safaricom.co.ke)
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/mpesa/callback/
MPESA_ENV=sandbox
```

---

## 🗂️ Project Structure

```
nyumba-platform/
├── setup.sh              ← Run this first!
├── manage.py
├── requirements.txt
├── .env.example
│
├── config/               ← Django settings + root URLs
├── users/                ← Auth, JWT, roles (user/agent/admin)
├── properties/           ← Listings, search, images, favorites
├── bookings/             ← Visit scheduling
├── reviews/              ← Ratings & comments
├── analytics/            ← Event tracking + dashboard stats
├── payments/             ← Mpesa Daraja STK Push
│
└── frontend/             ← React + Tailwind
    ├── src/
    │   ├── App.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── SearchPage.jsx
    │   │   ├── PropertyDetailPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── FavoritesPage.jsx
    │   │   ├── BookingsPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── CreateListingPage.jsx
    │   │   ├── AgentDashboard.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── components/
    │   │   ├── layout/   Navbar, Footer
    │   │   └── property/ PropertyCard, SearchFilters
    │   ├── api/          All API calls
    │   ├── context/      AuthContext (JWT state)
    │   ├── hooks/        useTrack (analytics)
    │   └── utils/        formatPrice, constants
    └── package.json
```

---

## 🔌 API Reference

### Auth
```
POST /api/auth/register/        Register (role: user or agent)
POST /api/auth/login/           Login → access + refresh tokens
POST /api/auth/logout/          Blacklist refresh token
POST /api/auth/token/refresh/   Refresh access token
GET  /api/auth/profile/         Get own profile
```

### Properties
```
GET    /api/properties/                    List active properties
POST   /api/properties/                    Create listing (agent only)
GET    /api/properties/{id}/               Property detail
PATCH  /api/properties/{id}/               Update (owner/admin)
GET    /api/properties/featured/           Featured listings
GET    /api/properties/my_listings/        Agent's own listings
GET    /api/properties/recommended/        Personalised for user
POST   /api/properties/{id}/images/        Upload image
DELETE /api/properties/images/{id}/        Delete image
GET    /api/properties/favorites/          Saved properties
POST   /api/properties/favorites/          Save property
DELETE /api/properties/favorites/{id}/     Unsave
```

### Search & Filters
```
GET /api/properties/?search=westlands&listing_type=rent&min_price=10000&max_price=50000&bedrooms=2&city=Nairobi&county=Nairobi&is_furnished=true&ordering=-views_count
```

### Bookings, Reviews, Payments
```
GET/POST /api/bookings/                  List/create bookings
GET/POST /api/reviews/{property_id}/reviews/   List/add reviews
POST     /api/payments/initiate/         Trigger Mpesa STK Push
POST     /api/payments/mpesa/callback/   Safaricom webhook
POST     /api/analytics/track/           Track frontend event
GET      /api/analytics/dashboard/       Dashboard stats
```

---

## 👥 Roles & Access

| Feature | User | Agent | Admin |
|---------|------|-------|-------|
| Browse & search | ✓ | ✓ | ✓ |
| Save favorites | ✓ | ✓ | ✓ |
| Book visits | ✓ | ✓ | ✓ |
| Leave reviews | ✓ | ✓ | ✓ |
| Create listings | ✗ | ✓ | ✓ |
| Manage own listings | ✗ | ✓ | ✓ |
| Agent dashboard | ✗ | ✓ | ✗ |
| Admin panel | ✗ | ✗ | ✓ |
| Verify listings | ✗ | ✗ | ✓ |
| Full analytics | ✗ | own | all |

---

## 🛠️ Next Steps

1. **Get API keys** — Sign up at [cloudinary.com](https://cloudinary.com) and [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
2. **Run the setup script** — `bash setup.sh`
3. **Add sample data** via the Django admin at `/admin/`
4. **Deploy** — use Railway, Render, or a VPS (Ubuntu + Nginx + Gunicorn)

Built with ❤️ in Kenya 🇰🇪
