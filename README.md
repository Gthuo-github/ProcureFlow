# ProcureFlow

ProcureFlow is a user-friendly procure-to-pay (P2P) platform inspired by the core SAP Ariba procurement lifecycle. It helps organisations request goods and services, source and evaluate suppliers, approve purchases, receive deliveries, reconcile invoices, and record payment—all in one approachable workflow.

The product is being delivered in three clients that share one backend:

- **Web:** Next.js application for buyers, approvers, and suppliers.
- **Desktop:** Electron wrapper for the web experience.
- **Mobile:** planned companion application for approvals, receiving, and status updates.

## Product workflow

```text
Need identified → Requisition → Approval → Supplier sourcing / bids
→ Purchase order → Goods receipt → Invoice matching / approval → Payment
```

See [Product requirements](docs/PRODUCT_REQUIREMENTS.md) for the detailed scope and [Architecture](docs/ARCHITECTURE.md) for the technical design.

## Repository layout

```text
backend/       Django REST API and procurement domain apps
frontend/      Next.js web client
docs/          Product, architecture, delivery, and development documentation
```

## Current technology baseline

- Backend: Django and Django REST Framework
- Frontend: Next.js, React, TypeScript, Tailwind CSS, TanStack Query
- Data: PostgreSQL
- Authentication: JWT with role-based access control
- Desktop (planned): Electron

## Quick start

### Backend

1. Create a Python virtual environment and install dependencies:

   ```powershell
   cd backend
   pip install -r requirements.txt
   ```

2. Configure the root `.env.dev` with the required Django and PostgreSQL variables. Do not commit secrets.

3. Run migrations and start the API:

   ```powershell
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

The web application runs at `http://localhost:3000`; Django runs at `http://localhost:8000` by default.

## Documentation

- [Product requirements](docs/PRODUCT_REQUIREMENTS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Delivery roadmap](docs/ROADMAP.md)
- [Development guide](docs/DEVELOPMENT.md)
- [Desktop and mobile strategy](docs/CLIENT_APPLICATIONS.md)
- [Contribution guide](CONTRIBUTING.md)

## Status

The project has an initial Django/Next.js base and early domain apps for users, suppliers, products, orders, and invoices. The end-to-end P2P workflow remains under active development; consult the roadmap before treating any planned capability as production-ready.
