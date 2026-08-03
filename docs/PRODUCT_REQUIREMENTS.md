# Product Requirements

## Vision

Make enterprise-grade procure-to-pay practical for organisations that need clear workflows and strong controls without the complexity of traditional procurement suites.

## Users and roles

| Role | Primary responsibilities |
| --- | --- |
| Requester / procurement officer | Creates requisitions, compares offers, and tracks purchases. |
| Approver / head of procurement | Reviews and approves or rejects requisitions, supplier selections, POs, and invoices according to policy. |
| Supplier | Maintains a company profile and catalogue, responds to sourcing events, fulfils POs, and submits invoices. |
| Finance | Reviews matched invoices and records or initiates payments. |
| Administrator | Manages organisations, users, approval policies, categories, and audit access. |

## Functional scope

### Requisition and approval

- Capture requested items or services, quantities, required date, delivery location, cost centre, attachments, and budget reference.
- Save drafts, submit requests, route approvals using configurable value and category rules, and retain decision comments.
- Provide a complete status timeline and immutable audit history.

### Supplier management and sourcing

- Onboard suppliers with business details, contacts, categories, certifications, and compliance documents.
- Support supplier catalogues and approved-supplier lists.
- Match suppliers by category, availability, performance, compliance, and profile completeness.
- Invite suppliers to bid; collect price, tax, lead time, delivery terms, and proposal attachments.
- Compare bids transparently and record the award rationale.

### Purchase orders and fulfilment

- Generate a purchase order only from an approved selection.
- Send, acknowledge, amend, cancel, and version purchase orders.
- Record partial and complete goods/service receipts, discrepancies, and supporting evidence.

### Invoicing and payment

- Allow suppliers to submit invoices with line items and attachments.
- Perform configurable two-way or three-way matching between PO, receipt, and invoice.
- Route exceptions for review and approval.
- Record payment status and references; integrate with an accounting or payment provider in a later phase.

### Reporting and governance

- Dashboards for pending approvals, spend, savings, supplier performance, and exceptions.
- Search and filter across requisitions, POs, invoices, and suppliers.
- Export authorised reports and retain an auditable record of state changes.

## Non-functional requirements

- Role and organisation boundaries must be enforced by the API, not only the UI.
- All financial values use explicit currency and decimal-safe calculations.
- Significant workflow actions are attributable, timestamped, and non-destructively auditable.
- The web client is responsive and usable on common desktop and tablet screen sizes.
- APIs are versioned before external/mobile clients depend on them.
- Desktop and mobile clients must use the same authenticated API contract as the web client.

## MVP boundary

The first usable release includes authentication, organisation-aware roles, supplier profiles, requisition creation, configurable single- or multi-step approval, bid submission/comparison, PO generation, goods receipt, invoice matching, and payment-status recording. Live payment execution, ERP synchronisation, advanced supplier scoring, and native mobile applications are post-MVP.

## Success measures

- A buyer can complete a requisition-to-payment-record workflow without leaving ProcureFlow.
- An approver can decide assigned work with the context and audit trail needed for policy compliance.
- A supplier can onboard, respond to an invitation, acknowledge a PO, and submit an invoice.
- Users can identify who performed each workflow transition and when.
