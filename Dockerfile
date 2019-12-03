FROM python:3.7.5-alpine

WORKDIR /app

ARG DJANGO_ENV=dev

ENV DJANGO_ENV=${DJANGO_ENV} \
    PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=0.12.17

RUN apk --no-cache add \
    bash \
    build-base \
    # curl \
    # gcc \
    gettext \
    # git \
    libffi-dev \
    linux-headers \
    openssl \
    # musl-dev \
    postgresql-dev \
    # tini \
    && pip install -U "pip<19.0" \
    && pip install poetry==$POETRY_VERSION

COPY poetry.lock pyproject.toml /app/
RUN poetry config settings.virtualenvs.create false \
    && poetry install $(test "$ENV" == production && echo "--no-dev") --no-interaction --no-ansi

COPY . /app