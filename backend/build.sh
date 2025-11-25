#!/usr/bin/env bash
set -o errexit

echo "Ruta actual:"
pwd
ls -la

cd backend/

echo "Nueva ruta actual:"
pwd
ls -la

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate