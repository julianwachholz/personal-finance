# personal-finance

## Setup

```
docker compose up -d
docker exec postgres psql -U postgres -c "CREATE EXTENSION citext;"
docker exec api ./manage.py migrate
```

Now you can open the app at http://localhost:9166/ and register an account.
