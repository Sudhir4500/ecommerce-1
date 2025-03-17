#!/usr/bin/env bash

set -e
# exit on error
set -o errexit

# change this line for whichever package you use, such as pip, or poetry, etc.
pip install -r requirements.txt

# apply any database migrations that are outstanding
python manage.py makemigrations
python manage.py migrate

# convert our static asset files on vercel
python manage.py collectstatic --no-input --clear
ls -la staticfiles/