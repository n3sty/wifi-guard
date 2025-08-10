# WiFi Guard React Extension

A modern Chrome extension built with React, TypeScript, and Tailwind CSS. This provides a much more familiar development experience similar to your Next.js web app.

## 🚀 Quick Start

### Development Setup

1. **Install dependencies:**
   ```bash
   cd ext/
   npm install
   ```

2. **Build the extension:**
   ```bash
   npm run build
   # or for development with file watching:
   npm run dev
   ```

3. **Load in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `ext/dist/` folder
   - The extension should now appear in your extensions list

4. **Development workflow:**
   - Run `npm run dev` to watch for changes
   - Make changes to React components
   - Reload the extension in Chrome when needed

## 📁 Structure

```
ext/
├── src/
│   ├── components/
│   │   └── SecurityChecker.tsx    # Main React component
│   ├── hooks/
│   │   └── useExtensionMessage.ts # Chrome extension messaging hook
│   ├── background.ts              # Service worker (TypeScript)
│   ├── popup.tsx                  # React app entry point
│   ├── popup.html                 # HTML template
│   ├── styles.css                 # Tailwind CSS imports
│   └── types.ts                   # TypeScript type definitions
├── dist/                          # Built extension files (load this in Chrome)
├── package.json                   # Dependencies and scripts
├── vite.config.ts                 # Build configuration
├── tailwind.config.js             # Tailwind CSS config
└── tsconfig.json                  # TypeScript configuration
```

## 🛠 Technology Stack

### Frontend
- **React 18** - Component-based UI
- **TypeScript** - Type safety and better development experience  
- **Tailwind CSS** - Utility-first CSS framework (matches web app)
- **Heroicons** - Beautiful SVG icons

### Build Tools
- **Vite** - Fast build tool and development server
- **PostCSS** - CSS processing for Tailwind

### Extension APIs
- **Chrome Extension Manifest V3** - Latest extension format
- **Chrome Storage API** - Persistent data storage
- **Chrome Runtime API** - Message passing between components

## 🎨 React Components

### SecurityChecker
The main component that handles:
- Security scan UI and state management
- Communication with background script via custom hook
- Results display with expandable sections
- Matches the web app's design exactly

### Custom Hooks

#### useExtensionMessage
Handles Chrome extension message passing:
```tsx
const { sendMessage, isConnected } = useExtensionMessage();

// Send message to background script
const response = await sendMessage({ 
  type: 'PERFORM_SECURITY_SCAN' 
});
```

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Development build with file watching
npm run dev

# Production build  
npm run build

# Preview built files
npm run preview
```

## 📝 Key Features vs Vanilla JavaScript

### ✅ What's Better with React:
- **Familiar Syntax**: Same JSX/TSX as your web app
- **Component Architecture**: Reusable, maintainable components  
- **State Management**: React hooks for clean state handling
- **TypeScript**: Full type safety and IntelliSense
- **Tailwind CSS**: Same utility classes as web app
- **Hot Reload**: Fast development with `npm run dev`

### 🎯 Development Experience:
- Write components just like in Next.js
- Use familiar hooks (`useState`, `useEffect`)
- Import and use icons from Heroicons
- Full TypeScript support with Chrome API types
- Tailwind CSS classes work exactly the same

## 🚧 Extension-Specific Considerations

### Message Passing
React components communicate with the background script:
```tsx
// In React component
const response = await sendMessage({ type: 'PERFORM_SECURITY_SCAN' });

// Background script responds
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PERFORM_SECURITY_SCAN') {
    // Handle scan...
    sendResponse({ success: true, data: results });
  }
});
```

### State Persistence
Chrome storage for persistent data:
```tsx
// Save scan results
await chrome.storage.local.set({ scanHistory: results });

// Load previous scans
const { scanHistory } = await chrome.storage.local.get(['scanHistory']);
```

## 🎨 Styling Notes

The extension uses the exact same color scheme and styling as your web app:
- Dark theme (`bg-gray-900`)
- Blue accents (`bg-blue-600`, `text-blue-400`)
- Same button styles and animations
- Consistent spacing and typography
- Same status colors (green/amber/red)

## 🧪 Testing

1. **Manual Testing:**
   - Make changes to `src/components/SecurityChecker.tsx`
   - Run `npm run dev` to rebuild
   - Reload extension in Chrome
   - Test functionality

2. **Console Debugging:**
   - Background script: Extension service worker console
   - React components: Right-click popup → "Inspect"

## 🚀 Next Steps

With this React setup, you can now:
1. **Add new components** easily in `src/components/`
2. **Share code** between web app and extension
3. **Use familiar React patterns** like hooks and context
4. **Leverage TypeScript** for better development experience
5. **Style with Tailwind** just like your web app

The development experience should now feel very similar to working on your Next.js web app!