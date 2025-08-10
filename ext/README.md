# WiFi Guard Chrome Extension

A barebones Chrome extension for real-time WiFi security monitoring. This extension complements the web app by providing background security checks and browser-based network analysis.

## 🚀 Quick Start

### Development Setup

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `ext/` directory
4. The extension should now appear in your extensions list

### Testing

1. Click the WiFi Guard icon in your browser toolbar
2. Click "Start Security Scan" to test the basic functionality
3. Check the browser console (F12) for debug information

## 📁 Structure

```
ext/
├── manifest.json     # Extension configuration
├── popup.html        # Main popup UI
├── popup.css         # Popup styling (mimics web app)
├── popup.js          # Popup logic and UI interactions
├── background.js     # Service worker for background tasks
└── README.md         # This file
```

## 🏗 Architecture

### Manifest V3 Structure
- **Service Worker**: `background.js` handles background tasks and message passing
- **Popup**: `popup.html/css/js` provides the main user interface
- **Permissions**: Minimal permissions for active tab and storage access

### Key Components

#### Background Script (`background.js`)
- Handles security scan logic
- Manages scan history storage
- Communicates with popup via message passing
- Placeholder implementations for actual network checks

#### Popup Interface (`popup.html/css/js`)
- Mimics the web app's dark theme and layout
- Single-button scan interface
- Expandable results, tips, and technical details
- Responsive design optimized for extension popup

#### Security Checks
Currently implements placeholder versions of:
1. **HTTPS Detection**: Checks if current tab uses HTTPS
2. **Network Analysis**: Placeholder for network property checks  
3. **Certificate Validation**: Placeholder for SSL certificate checks

## 🎨 Design Philosophy

### Web App Consistency
- **Same Color Scheme**: Dark theme with blue accents
- **Matching Layout**: Similar button styles and typography
- **Consistent Language**: Same risk levels (Safe/Caution/Risk) and messaging
- **Progressive Disclosure**: Expandable sections for tips and details

### Extension-Specific Optimizations
- **Compact Layout**: Fits standard extension popup dimensions (400px width)
- **Fast Loading**: Minimal dependencies and optimized for quick startup
- **Persistent State**: Remembers recent scans using Chrome storage APIs

## 🔧 Development Notes

### Current Implementation Status
- ✅ Basic UI structure and styling
- ✅ Message passing between popup and background
- ✅ Placeholder security checks
- ✅ Scan history storage
- ⏳ Real network security analysis (future)
- ⏳ Background monitoring (future)
- ⏳ Real-time notifications (future)

### Extension APIs Used
- `chrome.runtime` - Message passing and extension lifecycle
- `chrome.storage.local` - Scan history and settings storage
- `chrome.tabs` - Current tab information for scanning

### Future Development Areas
1. **Real Security Checks**: Implement actual network analysis
2. **Background Monitoring**: Continuous security monitoring
3. **Notifications**: Alert users to potential threats
4. **Settings**: User preferences and configuration options
5. **Icons**: Custom extension icons (currently using placeholder paths)

## 🧪 Testing

### Manual Testing
1. Load the extension in developer mode
2. Navigate to different websites (HTTP vs HTTPS)
3. Test the scan functionality
4. Verify results display correctly
5. Check that scan history persists

### Console Debugging
- Background script logs: Check extension service worker console
- Popup logs: Check popup developer tools (right-click popup → "Inspect")

## 🚧 Known Limitations

1. **Placeholder Logic**: Security checks are currently simulated
2. **No Icons**: Extension uses placeholder icon paths
3. **Basic Networking**: Limited to browser security model constraints
4. **No Persistence**: Popup state resets on close (by design)

## 📝 Next Steps

See `plan.md` for detailed development roadmap and feature planning.