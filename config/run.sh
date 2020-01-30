#!/usr/bin/env bash

export RELEASE=$(sentry-cli releases propose-version)

python manage.py collectstatic --no-input
python manage.py compilemessages
python manage.py migrate
python manage.py check --deploy

sentry-cli releases finalize "$RELEASE"
sentry-cli releases deploys "$RELEASE" new -e "$DJANGO_ENV"

uwsgi --ini=/app/config/uwsgi.ini
