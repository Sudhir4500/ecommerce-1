#!/bin/bash
set -e

echo "Installing dependencies..."
if [ -f requirements.txt ]; then
    pip3 install -r requirements.txt
else
    echo "Error: requirements.txt not found"
    exit 1
fi

echo "Applying migrations..."
python3 manage.py migrate 

echo "Collecting static files..."
python3 manage.py collectstatic --noinput --clear
echo "Static files collected. Contents of staticfiles:"
ls -la staticfiles/ || echo "staticfiles directory not found or empty"

echo "Copying static files to .vercel/output/static..."
mkdir -p .vercel/output/static
cp -r staticfiles/* .vercel/output/static/ 2>/dev/null || echo "No static files to copy"
echo "Contents of .vercel/output/static:"
ls -la .vercel/output/static/ || echo ".vercel/output/static not found or empty"