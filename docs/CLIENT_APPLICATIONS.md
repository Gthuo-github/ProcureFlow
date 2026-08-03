# Client Applications: Web, Desktop, and Mobile

## Web first

The Next.js web app is the primary product surface. New capabilities should be designed and validated there first, with accessible responsive layouts and API contracts suitable for reuse.

## Electron desktop application

Electron should package the production web client only after the web workflow is stable. Keep Electron-specific code thin:

- Use a secure preload bridge and context isolation.
- Disable Node integration in renderer windows.
- Use HTTPS APIs and the same JWT/session strategy as the web client.
- Store credentials only in the operating system's secure credential store.
- Plan code signing, auto-updates, crash reporting, and release channels before external distribution.
- Do not embed Django, PostgreSQL, or business rules in the desktop client; the backend remains the system of record.

## Mobile application

Mobile scope follows a stable API and should initially focus on high-value, short tasks:

- approval decisions with supporting context;
- push notifications and status tracking;
- goods receipt confirmation, including evidence capture where appropriate;
- supplier response and PO acknowledgement.

Native or cross-platform technology can be selected later based on team expertise and offline requirements. Any offline workflow must identify the authoritative server state, synchronise securely, and resolve conflicts without compromising approvals or financial controls.
