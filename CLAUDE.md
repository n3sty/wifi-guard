# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**ALWAYS READ @~/claude/claude.md**

## Repository Overview

WiFi Guard is a security-focused Next.js application designed as an MVP for user testing. It provides one-click WiFi security scanning with a "grandma-friendly" interface, targeting non-technical users who need to assess public WiFi safety.

**Target Audience**: Non-technical users (parents, travelers, students) using public WiFi
**Core Value Proposition**: "Speedtest for WiFi security" - instant network safety assessment

## Development Commands

### Standard Next.js Development
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server (requires build first)
- `npm run lint` - Run ESLint linting

### User Testing Workflow
- Run `npm run build && npm run start` for production testing environment
- Test on different devices and networks (coffee shops, airports, home networks)
- See `USER_TESTING_GUIDE.md` for detailed testing protocols

## Architecture Overview

### Core Technology Stack
- **Next.js 15** with App Router
- **TypeScript** with strict mode
- **Tailwind CSS** with custom design system
- **Framer Motion** for animations and transitions
- **React 19** with modern hooks and patterns

### Key Components Structure

#### Main Security Scanner (`src/components/security-checker.tsx`)
- Single-page application with state management for scanning process
- Three security checks: HTTPS detection, performance analysis, SSL validation
- Result categories: Safe (🟢), Caution (🟡), Danger (🔴)
- Educational content and technical details expandable sections

#### Analytics System (`src/lib/analytics.ts`)
- Client-side analytics for user testing (no personal data collection)
- Tracks: scan events, feature usage, session duration
- Local storage based with export functionality for research
- Privacy-focused design suitable for user testing scenarios

#### Design System (`src/app/globals.css`)
- Dark theme with cyberpunk/security aesthetic
- Custom CSS variables for consistent theming
- Glass morphism effects and gradient backgrounds
- Responsive animations optimized for performance
- Custom button styles (primary, secondary, danger)

### Security Check Implementation

The app performs three browser-based security checks:

1. **HTTPS Detection**: Verifies if the app is loaded over HTTPS
2. **Performance Analysis**: Measures response times to detect anomalies
3. **SSL Validation**: Tests certificate handling across trusted endpoints

**Important**: These are client-side checks with inherent limitations. The app educates users about these limitations and focuses on basic security awareness.

## Development Patterns

### State Management
- Uses React hooks (`useState`, `useEffect`) for component state
- No external state management library (appropriate for MVP scope)
- Analytics state managed through singleton class pattern

### Animation Strategy
- Framer Motion for page transitions and micro-interactions
- Custom CSS animations for background effects and loading states
- Performance-optimized with `will-change` properties
- Reduced motion considerations built into animations

### Mobile-First Design
- All components designed for touch interfaces first
- Large touch targets (buttons, interactive elements)
- Responsive typography and spacing
- Tested across iOS Safari, Android Chrome, desktop browsers

### User Experience Patterns
- Progressive disclosure (technical details behind toggles)
- Clear visual hierarchy with status colors
- Educational content contextual to scan results
- One-click primary action with minimal cognitive load

## User Testing Considerations

### Success Metrics Implementation
- Analytics tracking for completion rates
- User interaction patterns captured
- Session duration and feature usage measured
- Export functionality for research analysis

### Browser Security Limitations
- Client-side checks cannot detect all network threats
- App educates users about limitations transparently
- Focuses on basic security awareness rather than comprehensive analysis
- Designed for educational value and behavioral change

### Testing Scenarios Supported
- Coffee shop public WiFi assessment
- Airport/hotel network evaluation
- Home network baseline testing
- Mobile device real-world usage

## Code Conventions

### TypeScript Usage
- Strict mode enabled for type safety
- Interface definitions for complex objects (SecurityCheck, AnalyticsEvent)
- Proper typing for async operations and browser APIs

### Component Organization
- Single large component for main functionality (appropriate for MVP)
- Utility functions co-located with usage
- CSS classes follow BEM-inspired naming for custom styles

### Performance Optimizations
- Framer Motion components use proper exit animations
- CSS animations leverage GPU acceleration
- Local storage operations wrapped in try-catch for reliability
- Fetch operations use appropriate modes and caching strategies

## Deployment Notes

### Static Export Ready
- No server-side dependencies
- Can be deployed to Vercel, Netlify, or any static hosting
- Environment variables not required for core functionality

### User Testing Deployment
- Production build required for accurate performance testing
- Analytics data persists locally for research collection
- Cross-browser testing essential due to browser security API differences

## Key Files Understanding

- `src/components/security-checker.tsx` - Main application logic and UI
- `src/lib/analytics.ts` - User testing analytics implementation
- `src/app/globals.css` - Design system and custom animations
- `USER_TESTING_GUIDE.md` - Comprehensive testing protocols and success criteria
- `README.md` - Project overview and research foundation

## Important Constraints

### Security Limitations
- Browser-based scanning has inherent limitations
- Cannot detect network-level attacks or sophisticated threats
- Educational tool rather than comprehensive security solution
- Transparent about limitations to maintain user trust

### User Testing Focus
- Built specifically for MVP validation
- Analytics designed for research rather than production metrics
- UI optimized for first-time user experience
- Success measured by usability rather than technical accuracy