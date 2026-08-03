# Development Guide

## Prerequisites

- Python compatible with the Django requirements.
- Node.js LTS and npm.
- PostgreSQL.

## Environment configuration

The Django configuration reads `.env.dev` from the repository root, with backend-level fallbacks. Set at least the following values locally:

```dotenv
SECRET_KEY=replace-with-a-local-secret
POSTGRES_DB=procureflow
POSTGRES_USER=procureflow_user
POSTGRES_PASSWORD=replace-with-a-password
DB_HOST=localhost
DB_PORT=5432
```

The frontend reads its local variables from `frontend/.env.local`. Keep actual environment files out of version control and add safe templates such as `.env.example` when configuration is formalised.

## Run locally

Start PostgreSQL, then in separate terminals run:

```powershell
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

```powershell
cd frontend
npm install
npm run dev
```

## Verification

Run the checks relevant to each change before opening a review:

```powershell
cd backend
python manage.py test
python manage.py check
```

```powershell
cd frontend
npm run lint
npm run build
```

## Engineering conventions

- Put business rules and authorisation on the Django side; the frontend should not be the source of truth for permissions or workflow state.
- Use migrations for model changes and include migration files in commits.
- Use `DecimalField` and explicit currency codes for money.
- Add tests for permissions, state transitions, validation, and financial matching behaviour.
- Avoid placing API URLs and credentials directly in UI components; configure an API client through environment variables.
- Treat attachments and external callbacks as untrusted input.
