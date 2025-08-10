# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**IMPORTANT**: Always read `structure.md` first to understand the monorepo context and product strategy before making changes.

## Repository Overview

This is a monorepo containing WiFi Guard - a WiFi security assessment tool with two complementary products:

- **`web/`**: Next.js web app for one-click WiFi security scanning (MVP/user testing)
- **`ext/`**: Chrome extension for real-time WiFi protection (React + TypeScript + Tailwind)

## Core Mission

**WiFi Guard's primary purpose is to assess the SECURITY OF THE NETWORK the user is connected to, not the websites they visit.** The application evaluates whether the WiFi network itself is safe for general use, detecting potential threats like:

- Unencrypted connections that expose traffic to eavesdropping
- Network-level attacks (man-in-the-middle, rogue access points)
- DNS manipulation and spoofing
- Traffic interception capabilities
- Certificate validation bypasses

The goal is "Speedtest for WiFi security" - a simple one-click assessment of network safety.

## Development Commands

### Web App (`web/` directory)
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Extension (`ext/` directory)
```bash
npm install          # Install dependencies
npm run dev          # Development build with file watching
npm run build        # Production build
npm run preview      # Preview built files
```

**Loading in Chrome:**
1. Run `npm run build` to create `dist/` folder
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select `ext/dist/` folder

## Architecture

### Web App Technical Stack
- **Next.js 15** with App Router
- **TypeScript** with strict mode
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Client-side analytics** (privacy-focused, localStorage-based)

### Security Checks Implementation
The core security scanner (`src/components/security-checker.tsx`) performs three main checks:

1. **HTTPS Detection**: Verifies encrypted connection (`window.location.protocol`)
2. **Network Performance**: Measures response times to detect anomalies (fetch to external endpoints)
3. **SSL Validation**: Tests certificate handling across multiple endpoints

Results are classified as Safe 🟢 / Caution 🟡 / Risk 🔴 with educational content.

### Extension Technical Stack
- **React 18** with TypeScript for UI components
- **Tailwind CSS** for styling (matches web app exactly)
- **Vite** for fast build process and development
- **Chrome Manifest V3** for extension platform
- **Chrome APIs**: storage, tabs, runtime for extension functionality

### Extension Architecture & Data Flow

The extension follows a **message-passing architecture** between popup and background script:

```
┌─────────────────┐    Messages    ┌──────────────────┐
│  Popup (React)  │ ──────────────→ │ Background Script│
│                 │                 │ (Service Worker) │
│ SecurityChecker │ ←────────────── │                  │
│ Component       │    Results      │ - Performs scans │
└─────────────────┘                 │ - Stores history │
                                    │ - Tab monitoring │
                                    └──────────────────┘
                                            │
                                            ▼
                                    ┌──────────────────┐
                                    │ Chrome Storage   │
                                    │ - Scan history   │
                                    │ - Settings       │
                                    │ - Last scan time │
                                    └──────────────────┘
```

#### Detailed Message Flow:

1. **Scan Initiation** (Popup → Background)
   ```typescript
   sendMessage({ type: 'PERFORM_SECURITY_SCAN' })
   ```

2. **Scan Start Response** (Background → Popup)
   ```typescript
   { success: true, status: 'started', checks: SecurityCheck[] }
   ```

3. **Scan Processing** (Background)
   - Gets current tab information
   - Performs 3 security checks sequentially:
     - HTTPS Detection (real implementation)
     - Network Analysis (placeholder)  
     - Certificate Validation (placeholder)

4. **Scan Completion** (Background → Popup)
   ```typescript
   {
     type: 'SCAN_COMPLETED',
     result: {
       overallStatus: 'safe' | 'caution' | 'danger',
       checks: SecurityCheck[],
       scanResult: ScanResult
     }
   }
   ```

5. **Data Persistence** (Background → Chrome Storage)
   ```typescript
   {
     scanHistory: ScanResult[], // Last 50 scans
     lastScanTime: timestamp,
     settings: { autoScan: boolean, notifications: boolean }
   }
   ```

#### Security Check Structure:

Each scan performs these checks in sequence:

```typescript
interface SecurityCheck {
  id: 'https-check' | 'network-check' | 'certificate-check';
  name: string;           // Human-readable name
  status: 'checking' | 'passed' | 'warning' | 'failed';
  message: string;        // Brief result
  details?: string;       // Detailed explanation
}
```

**Current Implementation Status:**
- ✅ **HTTPS Detection**: Real implementation checking tab.url protocol
- ⏳ **Network Analysis**: Placeholder (always passes) - future: timing, DNS checks
- ⏳ **Certificate Validation**: Placeholder (always passes) - future: cert chain validation

#### Result Classification Logic:
```typescript
overallStatus = hasFailures ? 'danger' : hasWarnings ? 'caution' : 'safe'
```

### Analytics System
- Client-side only tracking (`src/lib/analytics.ts`)
- No personal data collection
- Session-based with localStorage persistence
- Export functionality for user testing analysis
- Events: scan_started, scan_completed, show_details_clicked, etc.

### User Experience Design
- **"Grandma-friendly"** single-button interface
- **Mobile-first** responsive design
- **Dark theme** with security-focused aesthetics
- **Progressive disclosure** (details/tips expandable)
- **Educational content** appropriate to risk level

## Key Files

### Web App
- `web/src/components/security-checker.tsx` - Main application component with all scan logic
- `web/src/lib/analytics.ts` - Client-side analytics system
- `web/src/app/page.tsx` - Simple root page wrapper

### Extension
- `ext/src/components/SecurityChecker.tsx` - React popup component (matches web app UX)
- `ext/src/background.ts` - Service worker handling scans and storage
- `ext/src/hooks/useExtensionMessage.ts` - React hook for Chrome message passing
- `ext/src/types.ts` - TypeScript interfaces for security checks and results
- `ext/dist/manifest.json` - Chrome extension configuration

### Documentation
- `structure.md` - Monorepo overview and product strategy (**read this first**)
- `ext/plan.md` - Extension development roadmap
- `ext/README-React.md` - React development setup guide

## Development Context

### Purpose
This is an MVP designed for user testing to validate the "Speedtest for WiFi security" concept. The web app serves as both a standalone tool and a funnel for the planned premium extension.

### Target Users
Non-technical users who use public WiFi (parents, travelers, students) who need simple security assessment without technical knowledge.

### Platform Capabilities & Limitations

#### Web App Constraints
The web app works within browser security constraints:
- Limited to HTTP/HTTPS checks and basic performance monitoring
- Cannot access network-level information or perform deep analysis
- Focuses on checks that browsers allow (SSL cert validation, response timing)

#### Extension Advantages
The Chrome extension has enhanced capabilities:
- **Tab Access**: Can inspect current tab URL and properties
- **Background Processing**: Service worker runs independently of popup
- **Host Permissions**: Can make network requests to external endpoints
- **Persistent Storage**: Results survive browser restarts
- **Future Potential**: Network monitoring, DNS analysis, certificate inspection

Both platforms share the core mission of **network security assessment** rather than website security evaluation.