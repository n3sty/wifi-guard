// WiFi Guard Extension - Popup Script
// Handles popup UI interactions and communication with background script

class PopupController {
  constructor() {
    this.isScanning = false;
    this.currentResult = null;
    this.init();
  }

  async init() {
    this.bindEventListeners();
    this.trackAnalytics('popup_opened');
    
    // Check if there's a recent scan result to display
    await this.checkForRecentScan();
  }

  bindEventListeners() {
    // Main scan button
    document.getElementById('scanButton').addEventListener('click', () => {
      this.startScan();
    });

    // Action buttons
    document.getElementById('showTipsButton').addEventListener('click', () => {
      this.toggleTips();
    });

    document.getElementById('showDetailsButton').addEventListener('click', () => {
      this.toggleDetails();
    });

    document.getElementById('scanAgainButton').addEventListener('click', () => {
      this.resetToScan();
    });

    // Listen for background script messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'SCAN_COMPLETED') {
        this.handleScanComplete(message.result);
      }
    });
  }

  async checkForRecentScan() {
    try {
      const response = await this.sendMessage({ type: 'GET_SCAN_HISTORY' });
      if (response.success && response.history.length > 0) {
        const lastScan = response.history[0];
        
        // Show last scan if it's less than 5 minutes old
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        if (lastScan.timestamp > fiveMinutesAgo) {
          this.showResults(lastScan.overallStatus, lastScan.checks);
        }
      }
    } catch (error) {
      console.error('Error checking recent scan:', error);
    }
  }

  async startScan() {
    if (this.isScanning) return;

    this.isScanning = true;
    this.showScanningState();
    this.trackAnalytics('scan_started');

    try {
      const response = await this.sendMessage({ type: 'PERFORM_SECURITY_SCAN' });
      
      if (response.success) {
        console.log('Scan started successfully');
        // The background script will send SCAN_COMPLETED message when done
      } else {
        this.handleScanError(response.error || 'Failed to start scan');
      }
    } catch (error) {
      console.error('Scan error:', error);
      this.handleScanError('Failed to communicate with extension');
    }
  }

  handleScanComplete(result) {
    console.log('Scan completed:', result);
    this.isScanning = false;
    this.currentResult = result;
    this.showResults(result.overallStatus, result.checks);
    this.trackAnalytics('scan_completed', { result: result.overallStatus });
  }

  handleScanError(errorMessage) {
    this.isScanning = false;
    this.hideScanningState();
    
    // Show error state
    console.error('Scan error:', errorMessage);
    // Could show error UI here
  }

  showScanningState() {
    const scanButton = document.getElementById('scanButton');
    const scanText = scanButton.querySelector('.scan-text');
    const loadingSpinner = scanButton.querySelector('.loading-spinner');
    
    scanButton.disabled = true;
    scanText.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');
  }

  hideScanningState() {
    const scanButton = document.getElementById('scanButton');
    const scanText = scanButton.querySelector('.scan-text');
    const loadingSpinner = scanButton.querySelector('.loading-spinner');
    
    scanButton.disabled = false;
    scanText.classList.remove('hidden');
    loadingSpinner.classList.add('hidden');
  }

  showResults(overallStatus, checks) {
    this.hideScanningState();
    
    // Hide scan section, show results
    document.querySelector('.scan-section').classList.add('hidden');
    document.getElementById('resultsSection').classList.remove('hidden');
    
    // Update result display
    const resultElement = document.getElementById('overallResult');
    const resultIcon = resultElement.querySelector('.result-icon');
    const resultTitle = resultElement.querySelector('.result-title');
    const resultMessage = resultElement.querySelector('.result-message');
    
    const resultConfig = this.getResultConfig(overallStatus);
    
    resultElement.className = `overall-result ${overallStatus}`;
    resultIcon.className = `result-icon ${overallStatus}`;
    resultIcon.innerHTML = resultConfig.icon;
    resultTitle.textContent = resultConfig.title;
    resultTitle.className = `result-title ${overallStatus}`;
    resultMessage.textContent = resultConfig.message;
    
    // Store checks for details view
    this.currentChecks = checks;
  }

  getResultConfig(status) {
    const configs = {
      safe: {
        title: 'Network Secure',
        message: 'Your connection appears safe for normal use',
        icon: `<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>`,
        tips: [
          'You can browse normally and use most online services',
          'Still avoid entering highly sensitive data like SSNs',
          'Consider using HTTPS websites when possible'
        ]
      },
      caution: {
        title: 'Use Caution',
        message: 'Some concerns detected - avoid sensitive activities',
        icon: `<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>`,
        tips: [
          'Avoid online banking and shopping with payment info',
          'Don\'t enter passwords for important accounts',
          'Use mobile data for sensitive activities instead',
          'Check if the network name matches the location'
        ]
      },
      danger: {
        title: 'Security Risk',
        message: 'Potential threats detected - avoid this network',
        icon: `<svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>`,
        tips: [
          'Disconnect from this network immediately',
          'Use your mobile data or find a different network',
          'Change passwords if you entered any sensitive info',
          'Report suspicious networks to the establishment'
        ]
      }
    };
    
    return configs[status] || configs.caution;
  }

  toggleTips() {
    const tipsSection = document.getElementById('tipsSection');
    const button = document.getElementById('showTipsButton');
    
    if (tipsSection.classList.contains('hidden')) {
      this.showTips();
      button.textContent = 'Hide Security Tips';
      this.trackAnalytics('show_tips');
    } else {
      tipsSection.classList.add('hidden');
      button.textContent = 'Show Security Tips';
    }
  }

  showTips() {
    const tipsSection = document.getElementById('tipsSection');
    const tipsContent = document.getElementById('tipsContent');
    
    if (this.currentResult) {
      const config = this.getResultConfig(this.currentResult.overallStatus);
      
      tipsContent.innerHTML = config.tips.map(tip => `
        <div class="tip-item">
          <div class="tip-bullet"></div>
          <span class="tip-text">${tip}</span>
        </div>
      `).join('');
    }
    
    tipsSection.classList.remove('hidden');
  }

  toggleDetails() {
    const detailsSection = document.getElementById('detailsSection');
    const button = document.getElementById('showDetailsButton');
    
    if (detailsSection.classList.contains('hidden')) {
      this.showDetails();
      button.textContent = 'Hide Technical Details';
      this.trackAnalytics('show_details');
    } else {
      detailsSection.classList.add('hidden');
      button.textContent = 'Show Technical Details';
    }
  }

  showDetails() {
    const detailsSection = document.getElementById('detailsSection');
    const checksDetails = document.getElementById('checksDetails');
    
    if (this.currentChecks) {
      checksDetails.innerHTML = this.currentChecks.map(check => `
        <div class="check-item">
          <div class="check-status ${check.status}">
            ${this.getCheckIcon(check.status)}
          </div>
          <div class="check-content">
            <div class="check-name">${check.name}</div>
            <div class="check-message">${check.message}</div>
            ${check.details ? `<div class="check-details">${check.details}</div>` : ''}
          </div>
        </div>
      `).join('');
    }
    
    detailsSection.classList.remove('hidden');
  }

  getCheckIcon(status) {
    const icons = {
      passed: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>`,
      warning: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>`,
      failed: `<svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>`
    };
    
    return icons[status] || '';
  }

  resetToScan() {
    document.querySelector('.scan-section').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('tipsSection').classList.add('hidden');
    document.getElementById('detailsSection').classList.add('hidden');
    
    this.trackAnalytics('scan_again');
  }

  // Utility method for messaging
  sendMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }

  // Simple analytics tracking
  trackAnalytics(event, data = {}) {
    console.log('Analytics:', event, data);
    // Could extend this to send to background script for storage
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});