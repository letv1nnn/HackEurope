/**
 * Utility functions for the frontend
 */

/**
 * Format timestamp to readable format
 */
export const formatTimestamp = (timestamp) => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString();
  } catch {
    return timestamp;
  }
};

/**
 * Get severity level color classes
 */
export const getSeverityColor = (severity) => {
  const severityMap = {
    critical: 'bg-red-900 text-red-100',
    high: 'bg-orange-900 text-orange-100',
    medium: 'bg-yellow-900 text-yellow-100',
    low: 'bg-blue-900 text-blue-100',
    info: 'bg-gray-700 text-gray-100',
  };
  return severityMap[severity?.toLowerCase()] || 'bg-gray-700 text-gray-100';
};

/**
 * Get status color classes
 */
export const getStatusColor = (status) => {
  const statusMap = {
    pending: 'text-yellow-400',
    processing: 'text-blue-400',
    completed: 'text-green-400',
    failed: 'text-red-400',
    error: 'text-red-400',
  };
  return statusMap[status?.toLowerCase()] || 'text-gray-400';
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

/**
 * Format large numbers with commas
 */
export const formatNumber = (num) => {
  return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
};

/**
 * Extract IP address from event data
 */
export const extractIP = (event) => {
  return event?.src_ip || event?.attacker_ip || event?.ip || 'Unknown';
};

/**
 * Extract technique ID from event data
 */
export const extractTechniqueId = (event) => {
  return event?.technique_id || event?.tactic_id || 'N/A';
};

/**
 * Extract technique name from event data
 */
export const extractTechniqueName = (event) => {
  return event?.technique_name || event?.tactic_name || 'Unknown';
};

/**
 * Group events by type
 */
export const groupEventsByType = (events) => {
  return events.reduce((acc, event) => {
    const type = event.type || 'unknown';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(event);
    return acc;
  }, {});
};

/**
 * Sort events by timestamp (newest first)
 */
export const sortEventsByTimestamp = (events) => {
  return [...events].sort((a, b) => {
    const timeA = new Date(a.timestamp || 0).getTime();
    const timeB = new Date(b.timestamp || 0).getTime();
    return timeB - timeA;
  });
};

export default {
  formatTimestamp,
  getSeverityColor,
  getStatusColor,
  truncateText,
  formatNumber,
  extractIP,
  extractTechniqueId,
  extractTechniqueName,
  groupEventsByType,
  sortEventsByTimestamp,
};
