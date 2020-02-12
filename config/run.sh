#!/usr/bin/env bash

export RELEASE=$(sentry-cli releases propose-version)
sentry-cli releases new -p shinywaffle "$RELEASE"
sentry-cli releases set-commits --auto "$RELEASE"

python manage.py collectstatic --no-input
python manage.py compilemessages
python manage.py migrate
python manage.py check --deploy

sentry-cli releases finalize "$RELEASE"
sentry-cli releases deploys "$RELEASE" new -e "$DJANGO_ENV"

uwsgi --ini=/app/config/uwsgi.ini
