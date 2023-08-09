# personal-finance

This was a small budgeting app I wrote for myself and family. It's lacking
a lot of features but hopefully serves as a nice starting point for others.

### Tech stack

- Django with Django REST Framework
- React.js with Ant Design UI
- PostgreSQL database

### Features

- Registering accounts
- A nice welcome wizard to get started
- Setting user options like currency, locale, and formatting
- Categories with unlimited subcategories
- Adding different accounts (savings, checking, etc)
- Keyboard accessible UI to create and modify transactions
- Transactions may have payees and tags associated to see a tally for each

## Setup

```
docker compose up -d
docker exec postgres psql -U postgres -c "CREATE EXTENSION citext;"
docker exec api ./manage.py migrate
```

Now you can open the app at http://localhost:9166/ and register an account.
