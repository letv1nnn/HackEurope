/**
 * Frontend application constants.
 * Shared constants and enums for components.
 */

export const EventTypes = {
  COWRIE_LOG: 'cowrie_log',
  MITRE_CLASSIFICATION: 'mitre_classification',
  NODE_START: 'node_start',
  NODE_END: 'node_end',
  FIXER_STATUS: 'fixer_status',
  ERROR: 'error',
};

export const Severity = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info',
};

export const SeverityColors = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
  info: '#8b5cf6',
};

export const Status = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  ERROR: 'error',
};

export const NavItems = [
  {
    section: 'Main',
    items: [
      { name: 'Dashboard', path: '/', icon: '📊' },
      { name: 'Updates', path: '/updates', icon: '🔔', badge: 'Live' },
      { name: 'Analytics', path: '/analytics', icon: '📈' },
    ]
  },
  {
    section: 'Management',
    items: [
      { name: 'Projects', path: '/projects', icon: '📁' },
      { name: 'Settings', path: '/settings', icon: '⚙️' },
    ]
  },
];
