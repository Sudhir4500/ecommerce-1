#!/bin/bash
set -e

# Activate virtual environment
source /path/to/your/venv/bin/activate

# Set environment variables
export DJANGO_SETTINGS_MODULE=core.settings.production

# Install dependencies
if [ -f requirements.txt ]; then
    pip3 install -r requirements.txt
else
    echo "Error: requirements.txt not found"
    exit 1
fi

# Apply migrations
python3 manage.py migrate 

# Collect static files
python3 manage.py collectstatic --noinput

# Start the server
gunicorn --bind 0.0.0.0:8000 yourproject.wsgi:application