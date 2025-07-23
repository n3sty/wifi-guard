"use client";

import { useState, useEffect } from "react";

interface NetworkInformation extends EventTarget {
  type?: 'bluetooth' | 'cellular' | 'ethernet' | 'mixed' | 'none' | 'other' | 'unknown' | 'wifi' | 'wimax';
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  onchange?: EventListener;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

export interface NetworkInfo {
  type?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  isOnline: boolean;
  isSupported: boolean;
  isCellular: boolean;
  isWiFi: boolean;
  isSlowConnection: boolean;
}

export const useNetworkInfo = (): NetworkInfo => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSupported: false,
    isCellular: false,
    isWiFi: false,
    isSlowConnection: false,
  });

  useEffect(() => {
    if (typeof navigator === 'undefined') return;

    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    
    if (!connection) {
      setNetworkInfo(prev => ({ ...prev, isSupported: false }));
      return;
    }

    const updateNetworkInfo = () => {
      const isCellular = connection.type === 'cellular';
      const isWiFi = connection.type === 'wifi';
      const isSlowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';

      setNetworkInfo({
        type: connection.type,
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
        isOnline: navigator.onLine,
        isSupported: true,
        isCellular,
        isWiFi,
        isSlowConnection,
      });
    };

    // Initial update
    updateNetworkInfo();

    // Listen for changes
    connection.addEventListener('change', updateNetworkInfo);
    window.addEventListener('online', updateNetworkInfo);
    window.addEventListener('offline', updateNetworkInfo);

    return () => {
      connection.removeEventListener('change', updateNetworkInfo);
      window.removeEventListener('online', updateNetworkInfo);
      window.removeEventListener('offline', updateNetworkInfo);
    };
  }, []);

  return networkInfo;
};