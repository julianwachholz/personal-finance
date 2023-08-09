#!/usr/bin/env bash

python manage.py collectstatic --no-input
python manage.py compilemessages
python manage.py migrate
python manage.py check --deploy

uwsgi --ini=/app/config/uwsgi.ini
