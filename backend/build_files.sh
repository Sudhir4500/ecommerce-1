#!/bin/bash
pip3 install -r requirements.txt
python3 backend/manage.py migrate --noinput
python3 backend/manage.py collectstatic --noinput
ls -la staticfiles  # Debug: Should show staticfiles in the project root