### WiFi Guard Monorepo Structure

```
.
  structure.md
  ext/
    plan.md
  web/
    .gitignore
    README.md
    package.json
    package-lock.json
    next.config.ts
    postcss.config.mjs
    eslint.config.mjs
    tsconfig.json
    public/
      file.svg
      globe.svg
      next.svg
      vercel.svg
      window.svg
    src/
      app/
        favicon.ico
        globals.css
        layout.tsx
        page.tsx
      components/
        security-checker.tsx
      lib/
        analytics.ts
```

### Products and goals

- **Web app (`web/`)**: Free, "grandma‑friendly" WiFi security checker.
  - Goal: Fast, accessible scan with clear guidance; acts as the top‑of‑funnel for the extension.
  - Scope: HTTP‑layer checks within browser limits; education and upgrade prompts.

- **Browser extension (`ext/`)**: Premium real‑time protection (Chrome MV3 + Firefox).
  - Goal: Background monitoring, certificate/DNS analysis, proactive alerts.
  - Scope: Service worker + content scripts, cross‑browser abstraction, messaging, polished popup UI.

****### Connecting factors

- **Unified UX and language**: Consistent copy, risk levels, and visuals.
- **Shared security model**: Keep check definitions aligned between web and extension; promote parity where possible.
- **Upgrade path**: Web surfaces value and funnels to extension for advanced, real‑time protection.
- **Analytics & privacy**: Common telemetry approach with strict privacy; same consent and policy.
- **Documentation source of truth**: Extension roadmap in `ext/plan.md`; high‑level overview here.

### Build & release (high level)

- **Web**: Next.js app build and deploy.
- **Extension**: MV3/Firefox packaging; submit to Chrome Web Store and Firefox Add‑ons.
