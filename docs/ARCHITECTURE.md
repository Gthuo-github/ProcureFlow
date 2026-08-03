# Architecture

## Overview

ProcureFlow uses a decoupled client/server architecture. Next.js provides the browser interface, Django REST Framework owns the business rules and API, and PostgreSQL persists transactional data. The Electron desktop app and future mobile client consume the same API rather than duplicating procurement logic.

```text
Next.js web client ──────┐
Electron desktop client ─┼── HTTPS / versioned REST API ── Django + DRF ── PostgreSQL
Mobile client (future) ──┘                                  │
                                                            ├── object storage (attachments)
                                                            ├── background workers / notifications
                                                            └── accounting or payment integrations
```

## Current repository components

| Location | Responsibility |
| --- | --- |
| `backend/config` | Django settings, URL routing, ASGI/WSGI configuration. |
| `backend/users` | Custom user model, customer/supplier profiles, authentication and permissions. |
| `backend/suppliers` | Supplier API/domain area. |
| `backend/products` | Product catalogue API/domain area. |
| `backend/orders` | Order-related API/domain area; evolves into requisition, sourcing, and PO workflows. |
| `backend/invoices` | Invoice-related API/domain area. |
| `frontend` | Next.js user interface. |

## Domain design direction

The target model separates each business document so that state and audit history remain explicit:

```text
Organisation
  ├── Users and approval policies
  ├── Suppliers and supplier catalogues
  └── Requisition → Sourcing event / bids → Purchase order
                         ↓                     ↓
                    Award decision        Goods receipt → Invoice → Payment record
```

Every transactional record should include an organisation owner, creator, timestamps, status, currency where relevant, and an audit trail. Do not represent a workflow solely by editing a generic order record: requisitions, POs, receipts, invoices, and payments have different legal and operational meanings.

## API conventions

- Prefix public APIs with `/api/v1/` when API versioning is introduced; preserve legacy routes during migration.
- Use JWT bearer authentication for browser, desktop, and mobile clients.
- Enforce object-level permissions and organisation tenancy in querysets and service logic.
- Return consistent validation errors and pagination metadata.
- Keep workflow transitions as named actions (for example, `submit`, `approve`, `issue`, `receive`) rather than unrestricted status updates.
- Generate an OpenAPI schema and keep it current for all client teams.

## Security and data integrity

- Keep secrets in environment files or deployment secret stores; never commit them.
- Use PostgreSQL constraints and database transactions for approvals, PO issuance, matching, and payment-state transitions.
- Store uploaded documents outside the application container in production and control access with signed URLs or authorised download endpoints.
- Log security-relevant and financial workflow events without logging credentials, tokens, or sensitive document contents.
- Configure production CORS, trusted origins, allowed hosts, HTTPS, backups, and error monitoring explicitly.

## Integration boundary

Accounting/ERP systems, payment providers, email/SMS, and supplier-verification services are adapters around the core P2P domain. Integrations must use idempotent requests, persist external reference IDs, and surface failed synchronisations for retry and review.
