import { useState, useEffect } from 'react';
import { SecurityCheck, ScanResponse } from '@/types';
import { useExtensionMessage } from '@/hooks/useExtensionMessage';
import { CheckIcon, ExclamationTriangleIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';

export default function SecurityChecker() {
  const [isScanning, setIsScanning] = useState(false);
  const [checks, setChecks] = useState<SecurityCheck[]>([]);
  const [overallStatus, setOverallStatus] = useState<'safe' | 'caution' | 'danger' | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const { sendMessage, isConnected } = useExtensionMessage();

  useEffect(() => {
    // Check for recent scan on popup open
    checkForRecentScan();
  }, []);

  const checkForRecentScan = async () => {
    try {
      const response = await sendMessage({ type: 'GET_SCAN_HISTORY' });
      if (response.success && response.history.length > 0) {
        const lastScan = response.history[0];
        // Show last scan if it's less than 5 minutes old
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        if (lastScan.timestamp > fiveMinutesAgo) {
          setOverallStatus(lastScan.overallStatus);
          setChecks(lastScan.checks);
        }
      }
    } catch (error) {
      console.error('Error checking recent scan:', error);
    }
  };

  const startScan = async () => {
    if (!isConnected) return;

    setIsScanning(true);
    setOverallStatus(null);
    setChecks([]);
    setShowDetails(false);
    setShowTips(false);

    try {
      const response: ScanResponse = await sendMessage({ type: 'PERFORM_SECURITY_SCAN' });
      
      if (response.success && response.checks) {
        setChecks(response.checks);
        
        // Listen for scan completion
        const messageListener = (message: any) => {
          if (message.type === 'SCAN_COMPLETED') {
            setIsScanning(false);
            setOverallStatus(message.result.overallStatus);
            setChecks(message.result.checks);
            chrome.runtime.onMessage.removeListener(messageListener);
          }
        };
        
        chrome.runtime.onMessage.addListener(messageListener);
      }
    } catch (error) {
      console.error('Scan error:', error);
      setIsScanning(false);
    }
  };

  const resetToScan = () => {
    setOverallStatus(null);
    setChecks([]);
    setShowDetails(false);
    setShowTips(false);
  };

  const getStatusConfig = (status: 'safe' | 'caution' | 'danger') => {
    const configs = {
      safe: {
        title: 'Network Secure',
        message: 'Your connection appears safe for normal use',
        bgColor: 'bg-emerald-900/30',
        borderColor: 'border-emerald-500/30',
        textColor: 'text-emerald-400',
        icon: CheckIcon,
        tips: [
          'You can browse normally and use most online services',
          'Still avoid entering highly sensitive data like SSNs',
          'Consider using HTTPS websites when possible'
        ]
      },
      caution: {
        title: 'Use Caution',
        message: 'Some concerns detected - avoid sensitive activities',
        bgColor: 'bg-amber-900/30',
        borderColor: 'border-amber-500/30',
        textColor: 'text-amber-400',
        icon: ExclamationTriangleIcon,
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
        bgColor: 'bg-red-900/30',
        borderColor: 'border-red-500/30',
        textColor: 'text-red-400',
        icon: ShieldExclamationIcon,
        tips: [
          'Disconnect from this network immediately',
          'Use your mobile data or find a different network',
          'Change passwords if you entered any sensitive info',
          'Report suspicious networks to the establishment'
        ]
      }
    };
    
    return configs[status];
  };

  if (!isConnected) {
    return (
      <div className="w-96 h-96 p-6 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p>Extension not connected</p>
          <p className="text-sm mt-2">Please reload the extension</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 min-h-[500px] p-5 bg-gray-900">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5-3V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14l2-2h8a2 2 0 002-2v-2" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white mb-2">WiFi Guard</h1>
        <p className="text-gray-400 text-sm">Check suspicious networks like a cyber-security guard</p>
      </div>

      {/* Main Content */}
      {!overallStatus && (
        <div className="text-center mb-6">
          <button
            onClick={startScan}
            disabled={isScanning}
            className={`
              w-full py-5 px-6 rounded-2xl font-semibold text-lg transition-all duration-200
              ${isScanning 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01]'
              }
              border border-blue-500/20
            `}
          >
            {isScanning ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span>Scanning Network...</span>
              </div>
            ) : (
              'Start Security Scan'
            )}
          </button>
          
          {/* Status indicators */}
          <div className="flex justify-center space-x-4 mt-4 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-500/50 rounded-full" />
              <span>Safe</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-amber-500/50 rounded-full" />
              <span>Caution</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500/50 rounded-full" />
              <span>Risk</span>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {overallStatus && (
        <div className="space-y-4">
          {(() => {
            const config = getStatusConfig(overallStatus);
            const IconComponent = config.icon;
            
            return (
              <div className={`border rounded-2xl p-5 ${config.bgColor} ${config.borderColor}`}>
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-opacity-20 flex items-center justify-center" 
                       style={{backgroundColor: `${config.textColor.replace('text-', '').replace('-400', '')}20`}}>
                    <IconComponent className={`w-6 h-6 ${config.textColor}`} />
                  </div>
                  <div>
                    <h2 className={`text-lg font-semibold ${config.textColor}`}>{config.title}</h2>
                    <p className="text-gray-300 text-sm mt-1">{config.message}</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => setShowTips(!showTips)}
              className="w-full py-3 px-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-medium transition-colors border border-blue-500/20 hover:scale-[1.005]"
            >
              {showTips ? 'Hide Security Tips' : 'Show Security Tips'}
            </button>
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-colors border border-gray-700 hover:scale-[1.005]"
            >
              {showDetails ? 'Hide Details' : 'Show Technical Details'}
            </button>
            
            <button
              onClick={resetToScan}
              className="w-full py-3 px-4 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium transition-colors border border-gray-600 hover:scale-[1.005]"
            >
              Scan Again
            </button>
          </div>

          {/* Tips Section */}
          {showTips && (
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-3">What should I do now?</h3>
                  <div className="space-y-2">
                    {getStatusConfig(overallStatus).tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 flex-shrink-0" />
                        <p className="text-gray-300 text-xs leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Details Section */}
          {showDetails && checks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-white font-semibold text-center text-sm">Security Check Details</h3>
              {checks.map((check) => (
                <div key={check.id} className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      check.status === 'passed' ? 'bg-emerald-500/20 text-emerald-400' :
                      check.status === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {check.status === 'passed' ? (
                        <CheckIcon className="w-3 h-3" />
                      ) : check.status === 'warning' ? (
                        <ExclamationTriangleIcon className="w-3 h-3" />
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{check.name}</h4>
                      <p className="text-gray-400 text-xs mt-1">{check.message}</p>
                      {check.details && (
                        <p className="text-gray-500 text-xs mt-2 leading-relaxed">{check.details}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}