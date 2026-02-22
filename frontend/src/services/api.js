/**
 * API service utilities for frontend.
 * Centralized HTTP and SSE communication.
 */

import config from '../config';

const apiClient = {
  /**
   * Make an HTTP GET request.
   */
  get: async (endpoint, options = {}) => {
    try {
      const url = `${config.api.baseUrl}/api/${config.api.version}${endpoint}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: AbortSignal.timeout(config.api.timeout),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API GET request failed:', error);
      throw error;
    }
  },

  /**
   * Make an HTTP POST request.
   */
  post: async (endpoint, data, options = {}) => {
    try {
      const url = `${config.api.baseUrl}/api/${config.api.version}${endpoint}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(config.api.timeout),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API POST request failed:', error);
      throw error;
    }
  },

  /**
   * Open an SSE connection to a streaming endpoint.
   */
  stream: (endpoint, onMessage, onError = null) => {
    const url = `${config.api.baseUrl}/api/${config.api.version}${endpoint}`;
    
    try {
      const eventSource = new EventSource(url);
      
      eventSource.onopen = () => {
        console.log(`SSE connection opened: ${endpoint}`);
      };
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Failed to parse SSE message:', error);
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        if (onError) onError(error);
        eventSource.close();
      };
      
      return eventSource;
    } catch (error) {
      console.error('Failed to create SSE connection:', error);
      if (onError) onError(error);
      return null;
    }
  },
};

export default apiClient;
