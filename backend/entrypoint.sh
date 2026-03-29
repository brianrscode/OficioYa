#!/usr/bin/env sh
set -e

echo "Waiting for PostgreSQL..."
until uv run python -c "import os; import psycopg2; psycopg2.connect(host=os.getenv('HOST_BD'), port=os.getenv('PORT_BD'), dbname=os.getenv('NAME_BD'), user=os.getenv('USER_BD'), password=os.getenv('PASSWORD_BD')).close()"; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is up - running migrations"
uv run python manage.py migrate --noinput

echo "Starting Django server"
uv run python manage.py runserver 0.0.0.0:8000
