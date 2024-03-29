FROM python:3.7.5-alpine

WORKDIR /app

ARG DJANGO_ENV=production
ARG SENTRY_ORG
ARG SENTRY_AUTH_TOKEN

ENV DJANGO_ENV=${DJANGO_ENV} \
    PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=1.0.3

RUN apk --no-cache add \
    bash \
    build-base \
    curl \
    # gcc \
    gettext \
    # git \
    libffi-dev \
    linux-headers \
    openssl \
    # musl-dev \
    postgresql-dev \
    # tini \
    && pip install -U pip \
    && pip install poetry==$POETRY_VERSION

COPY poetry.lock pyproject.toml /app/
RUN poetry config virtualenvs.create false \
    && poetry install $(test "$DJANGO_ENV" == production && echo "--no-dev") --no-interaction --no-ansi

COPY . /app

CMD [ "/app/config/run.sh" ]
