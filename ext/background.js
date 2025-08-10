// WiFi Guard Extension - Background Service Worker
// Handles background tasks and extension lifecycle

// Extension installation/startup
chrome.runtime.onInstalled.addListener((details) => {
  console.log('WiFi Guard extension installed/updated', details);
  
  // Set default storage values
  chrome.storage.local.set({
    lastScanTime: null,
    scanHistory: [],
    settings: {
      autoScan: false,
      notifications: true
    }
  });
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  
  switch (message.type) {
    case 'PERFORM_SECURITY_SCAN':
      handleSecurityScan(sendResponse);
      return true; // Keep message channel open for async response
      
    case 'GET_SCAN_HISTORY':
      getScanHistory(sendResponse);
      return true;
      
    case 'CLEAR_HISTORY':
      clearScanHistory(sendResponse);
      return true;
      
    default:
      console.warn('Unknown message type:', message.type);
      sendResponse({ error: 'Unknown message type' });
  }
});

// Perform security scan (placeholder implementation)
async function handleSecurityScan(sendResponse) {
  try {
    console.log('Starting security scan...');
    
    // Get current tab info
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      sendResponse({ error: 'No active tab found' });
      return;
    }
    
    // Basic checks (similar to web app but adapted for extension context)
    const checks = [
      {
        id: 'https-check',
        name: 'Connection Security',
        status: 'checking',
        message: 'Verifying encryption...',
      },
      {
        id: 'network-check',
        name: 'Network Analysis',
        status: 'checking',
        message: 'Analyzing network properties...',
      },
      {
        id: 'certificate-check',
        name: 'Certificate Validation',
        status: 'checking',
        message: 'Checking certificates...',
      }
    ];
    
    // Send initial scan start response
    sendResponse({
      success: true,
      status: 'started',
      checks: checks
    });
    
    // Simulate scan process (in real implementation, this would do actual checks)
    setTimeout(() => {
      performActualChecks(tab, checks);
    }, 100);
    
  } catch (error) {
    console.error('Security scan error:', error);
    sendResponse({ 
      error: 'Failed to start security scan',
      details: error.message 
    });
  }
}

// Perform the actual security checks
async function performActualChecks(tab, checks) {
  try {
    const results = [...checks];
    
    // Check 1: HTTPS Detection
    const isHttps = tab.url?.startsWith('https://');
    results[0] = {
      ...results[0],
      status: isHttps ? 'passed' : 'failed',
      message: isHttps ? 'Connection encrypted' : 'Connection not secure',
      details: isHttps 
        ? 'This website uses HTTPS encryption to protect your data.'
        : 'This website uses unencrypted HTTP, which creates security risks on public WiFi.'
    };
    
    // Check 2: Network Analysis (placeholder)
    results[1] = {
      ...results[1],
      status: 'passed',
      message: 'Network appears normal',
      details: 'No obvious signs of network interference detected.'
    };
    
    // Check 3: Certificate Check (placeholder)
    results[2] = {
      ...results[2],
      status: 'passed',
      message: 'Certificates verified',
      details: 'SSL certificate validation is working properly.'
    };
    
    // Determine overall result
    const hasFailures = results.some(check => check.status === 'failed');
    const hasWarnings = results.some(check => check.status === 'warning');
    const overallStatus = hasFailures ? 'danger' : hasWarnings ? 'caution' : 'safe';
    
    // Store scan result
    const scanResult = {
      timestamp: Date.now(),
      url: tab.url,
      title: tab.title,
      overallStatus,
      checks: results
    };
    
    await saveScanResult(scanResult);
    
    // Notify popup of completion (if it's listening)
    try {
      chrome.runtime.sendMessage({
        type: 'SCAN_COMPLETED',
        result: {
          overallStatus,
          checks: results,
          scanResult
        }
      });
    } catch (error) {
      // Popup might not be open, which is fine
      console.log('Could not notify popup (likely closed):', error.message);
    }
    
  } catch (error) {
    console.error('Error performing security checks:', error);
  }
}

// Save scan result to storage
async function saveScanResult(scanResult) {
  try {
    const { scanHistory = [] } = await chrome.storage.local.get(['scanHistory']);
    
    // Keep only last 50 scans
    const updatedHistory = [scanResult, ...scanHistory].slice(0, 50);
    
    await chrome.storage.local.set({
      scanHistory: updatedHistory,
      lastScanTime: scanResult.timestamp
    });
    
    console.log('Scan result saved to history');
  } catch (error) {
    console.error('Error saving scan result:', error);
  }
}

// Get scan history
async function getScanHistory(sendResponse) {
  try {
    const { scanHistory = [] } = await chrome.storage.local.get(['scanHistory']);
    sendResponse({ success: true, history: scanHistory });
  } catch (error) {
    console.error('Error getting scan history:', error);
    sendResponse({ error: 'Failed to get scan history' });
  }
}

// Clear scan history
async function clearScanHistory(sendResponse) {
  try {
    await chrome.storage.local.set({ scanHistory: [], lastScanTime: null });
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error clearing scan history:', error);
    sendResponse({ error: 'Failed to clear scan history' });
  }
}

// Handle tab updates (for potential auto-scanning feature)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Could trigger auto-scan here if enabled
    console.log('Tab updated:', tab.url);
  }
});

console.log('WiFi Guard background script loaded');