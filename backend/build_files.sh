#!/bin/bash
# Install dependencies
pip3 install -r requirements.txt

# Run migrations
python3 backend/manage.py migrate --noinput

# Collect static files
python3 backend/manage.py collectstatic --noinput

# Debug: Check if staticfiles directory exists and contains files
echo "Checking staticfiles directory..."
ls -la ui/staticfiles