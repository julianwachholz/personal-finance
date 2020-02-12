FROM postgres:11
COPY citext.sql /docker-entrypoint-initdb.d
