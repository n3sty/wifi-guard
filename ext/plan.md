### WiFi Guard Extension — Super Basic Plan

- **Goal**: Ship the cross‑browser WiFi Guard extension with reliable message passing and polished UX.

- **Status**
  - Phase 6: Experience fine‑tuning & pre‑launch optimization
  - Store packages prepared for Chrome/Firefox; cross‑browser architecture complete

- **Immediate plan (unblock build)**
  1. Fix shared types to resolve threat/type mismatches and export missing types.
  2. Resolve BrowserAPI compatibility typing across Chrome MV3 and Firefox WebRequest.
  3. Update background message listener to return `true` for async responses; verify channels.
  4. Rebuild until all TypeScript errors (50+ currently) are cleared.

- **Next steps (post‑unblock)**
  - Verify popup ↔ background ↔ content script messaging end‑to‑end.
  - Finalize popup UI wiring to analysis capabilities; polish UX copy.
  - Cross‑browser test matrix pass (Chrome, Firefox, Edge) with graceful degradation.
  - Performance pass: ensure minimal browser impact; enable analytics/crash reporting.
  - Package and submit to Chrome Web Store and Firefox Add‑ons.

- **Scope summary**
  - Firefox: WebRequest integration for traffic, certificate, and DNS analysis.
  - Chrome: DeclarativeNetRequest rules, service worker orchestration, fallbacks.
  - Shared abstraction and types; background worker + popup UI; content scripts as needed.

- **Permissions (minimal)**
  - Required: `activeTab`, `storage`
  - Platform‑specific: Chrome MV3 `declarativeNetRequest`; Firefox `webRequest` (with host permissions as needed)

- **References**
  - Project notes: `~/brain/projects/wifi-guard.md`
  - Architecture research: `/Users/Job/browser-extension-research.md`
  - Monorepo structure: `/Users/Job/wifi-guard-monorepo-structure.md`
