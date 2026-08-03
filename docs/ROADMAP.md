# Delivery Roadmap

This roadmap orders work by product dependency. Dates should be assigned only after the team estimates the approved scope.

## Phase 0 — Foundation

- Stabilise the Django and Next.js local-development experience.
- Introduce environment examples, migrations, automated tests, formatting/linting, CI, and API documentation.
- Define organisation tenancy, role permissions, audit-event conventions, and API versioning.

**Exit:** a developer can start both apps, authenticate, and run the test suite from documented steps.

## Phase 1 — Requisition to approval

- Organisation and user administration.
- Supplier profile onboarding and category management.
- Requisition drafts, submission, attachments, and approval routing.
- Buyer and approver dashboards with notifications and audit timelines.

**Exit:** an authorised requester can submit a requisition and an approver can make an auditable decision.

## Phase 2 — Sourcing and purchase order

- Supplier discovery and invitation workflow.
- Bid submission, comparison, and award justification.
- PO generation, approval where required, issue, acknowledgement, amendment, and cancellation.

**Exit:** an approved requisition can become an issued, supplier-acknowledged PO.

## Phase 3 — Receipt, invoice, and payment record

- Partial/full goods and service receipt.
- Supplier invoice submission and two-/three-way matching.
- Exception handling, invoice approval, and payment-status recording.
- Supplier performance measures based on delivery and quality signals.

**Exit:** the entire P2P workflow is traceable from request to payment record.

## Phase 4 — Desktop, integrations, and reporting

- Package the web experience with Electron, including secure update and release processes.
- Add accounting/ERP and payment-provider adapters.
- Deliver operational reporting, exports, and administrator controls.

**Exit:** desktop users can run a supported release and approved integrations reconcile reliably.

## Phase 5 — Mobile

- Build a mobile client against the stable, versioned API.
- Prioritise approvals, notifications, receipt confirmation, and status tracking.
- Add offline behaviour only for explicitly supported workflows with conflict resolution.

**Exit:** mobile users can securely complete the selected high-frequency tasks without loss of auditability.
