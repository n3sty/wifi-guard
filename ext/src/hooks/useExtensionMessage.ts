import { useState, useEffect, useCallback } from 'react';
import { ExtensionMessage } from '@/types';

export const useExtensionMessage = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if we're in extension context
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
      setIsConnected(true);
    }

    // Listen for messages from background script
    const messageListener = (message: ExtensionMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
      console.log('Received message in popup:', message);
      // Handle messages as needed
    };

    if (isConnected) {
      chrome.runtime.onMessage.addListener(messageListener);
    }

    return () => {
      if (isConnected) {
        chrome.runtime.onMessage.removeListener(messageListener);
      }
    };
  }, [isConnected]);

  const sendMessage = useCallback(async (message: ExtensionMessage): Promise<any> => {
    if (!isConnected) {
      throw new Error('Extension not connected');
    }

    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }, [isConnected]);

  return { sendMessage, isConnected };
};