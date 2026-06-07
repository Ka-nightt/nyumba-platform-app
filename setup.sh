#!/usr/bin/env bash
set -e

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║        Nyumba Platform — Setup Script        ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── 1. Backend ────────────────────────────────────────
echo "▶ Setting up Django backend..."
python3 -m venv venv

# Activate based on OS
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  source venv/Scripts/activate
else
  source venv/bin/activate
fi

pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet
echo "  ✓ Python packages installed"

# ── 2. .env ───────────────────────────────────────────
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  ✓ .env created — EDIT IT before running migrations"
  echo ""
  echo "  ⚠️  Open .env and fill in:"
  echo "     DB_PASSWORD, CLOUDINARY_*, MPESA_*"
  echo ""
fi

# ── 3. Database ───────────────────────────────────────
echo "▶ Running migrations..."
python manage.py makemigrations users properties bookings reviews analytics payments
python manage.py migrate
echo "  ✓ Database tables created"

# ── 4. Superuser ──────────────────────────────────────
echo ""
echo "▶ Create admin superuser:"
python manage.py createsuperuser

# ── 5. Frontend ───────────────────────────────────────
echo ""
echo "▶ Setting up React frontend..."
cd frontend
npm install --silent
echo "  ✓ Node packages installed"
cd ..

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║              Setup Complete! 🎉              ║"
echo "╠══════════════════════════════════════════════╣"
echo "║  Start backend:                              ║"
echo "║    source venv/bin/activate                  ║"
echo "║    python manage.py runserver                ║"
echo "║                                              ║"
echo "║  Start frontend (new terminal):              ║"
echo "║    cd frontend && npm run dev                ║"
echo "║                                              ║"
echo "║  URLs:                                       ║"
echo "║    Frontend:  http://localhost:5173          ║"
echo "║    API:       http://localhost:8000/api/     ║"
echo "║    Admin:     http://localhost:8000/admin/   ║"
echo "╚══════════════════════════════════════════════╝"
