#!/bin/bash
# Install dependencies
pip3 install -r requirements.txt
# Run Django collectstatic to gather static files
python3 manage.py collectstatic --noinput