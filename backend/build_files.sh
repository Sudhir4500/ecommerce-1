#!/bin/bash
set -e

# Install dependencies
pip3 install -r requirements.txt

# Run migrations (optional, only if needed in Vercel)
python3 manage.py makemigrations
python3 manage.py migrate 

# Collect static files to a directory Vercel can serve
python3 manage.py collectstatic --noinput --clear
ls -la staticfiles/

