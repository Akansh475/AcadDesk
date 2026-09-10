#!/usr/bin/env bash
# AcadDesk startup script

echo "==> Checking PostgreSQL..."
if ! nc -z 127.0.0.1 5432 2>/dev/null; then
  echo "⚠️  PostgreSQL is not running on port 5432."
  echo "Attempting to launch Postgres.app..."
  open -a Postgres 2>/dev/null || true
  sleep 3
  if ! nc -z 127.0.0.1 5432 2>/dev/null; then
    echo "❌ Error: Could not connect to PostgreSQL on port 5432."
    echo "Please open Postgres.app manually and make sure the server is started."
    exit 1
  fi
fi

echo "✅ PostgreSQL is running."
echo "==> Starting AcadDesk (Backend on port 5000 & Frontend on port 5173)..."
npm run dev
