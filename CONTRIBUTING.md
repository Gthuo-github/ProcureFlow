# Contributing to ProcureFlow

## Before starting

- Check the product requirements and roadmap for the intended workflow and phase.
- Keep changes focused; do not mix unrelated refactors with a feature or bug fix.
- Never commit `.env` files, access tokens, credentials, or production data.

## Pull request expectations

- Explain the user-facing change and the affected workflow state.
- Include Django migrations for model changes.
- Add or update tests, especially for permissions, approval paths, and monetary calculations.
- Run the applicable backend and frontend checks in the development guide.
- Call out API contract changes and update the OpenAPI documentation when introduced.

## Domain rules

- Preserve auditability: do not silently overwrite approval, PO, receipt, invoice, or payment decisions.
- Keep tenant/organisation filtering and role checks server-side.
- Avoid floating-point values for money.
- Make externally triggered operations idempotent and record external identifiers.
