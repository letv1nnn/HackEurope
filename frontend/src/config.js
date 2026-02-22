/**
 * Frontend application configuration.
 * Environment variables and application settings.
 */

const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    timeout: 30000,
    version: 'v1',
  },
  
  // SSE Configuration
  sse: {
    reconnectAttempts: parseInt(import.meta.env.VITE_SSE_RECONNECT_ATTEMPTS || '5'),
    reconnectDelay: parseInt(import.meta.env.VITE_SSE_RECONNECT_DELAY || '1000'),
    heartbeatInterval: 30000,
  },
  
  // Application Configuration
  app: {
    name: 'Pen Test Agent',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },
  
  // Feature flags
  features: {
    enableSSE: true,
    enableRealtimeUpdates: true,
    enableDarkMode: true,
  },
};

export default config;
