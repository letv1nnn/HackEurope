/**
 * Hook for managing SSE connections with automatic reconnection
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import apiClient from '../services/api';
import config from '../config';

/**
 * Custom hook for SSE streaming with reconnection logic
 * 
 * @param {string} endpoint - API endpoint to stream from
 * @param {function} onMessage - Callback when message is received
 * @param {boolean} enabled - Whether the stream should be active
 * @returns {object} Stream state and control functions
 */
export const useSSE = (endpoint, onMessage, enabled = true) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  
  const eventSourceRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);

  const handleMessage = useCallback((data) => {
    setMessageCount(prev => prev + 1);
    setError(null);
    onMessage(data);
  }, [onMessage]);

  const handleError = useCallback((error) => {
    console.error('SSE Error:', error);
    setIsConnected(false);
    setError(error);
    
    // Attempt reconnection
    if (reconnectAttemptsRef.current < config.sse.reconnectAttempts) {
      reconnectAttemptsRef.current += 1;
      const delay = config.sse.reconnectDelay * reconnectAttemptsRef.current;
      console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${config.sse.reconnectAttempts}) in ${delay}ms`);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        connectStream();
      }, delay);
    } else {
      setError(new Error('Max reconnection attempts reached'));
    }
  }, []);

  const connectStream = useCallback(() => {
    if (!enabled) return;
    
    try {
      setIsConnected(true);
      eventSourceRef.current = apiClient.stream(endpoint, handleMessage, handleError);
    } catch (err) {
      handleError(err);
    }
  }, [endpoint, enabled, handleMessage, handleError]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  useEffect(() => {
    if (enabled) {
      reconnectAttemptsRef.current = 0;
      connectStream();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connectStream, disconnect]);

  return {
    isConnected,
    error,
    messageCount,
    disconnect,
    reconnect: connectStream,
  };
};

export default useSSE;
