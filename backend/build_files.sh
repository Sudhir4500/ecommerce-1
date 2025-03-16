#!/bin/bash
# Install dependencies
pip3 install -r requirements.txt

# Run migrations
python3 backend/manage.py migrate --noinput

# Collect static files
python3 backend/manage.py collectstatic --noinput

