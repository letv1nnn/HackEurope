/**
 * Live Updates Page
 * Real-time threat updates via SSE
 */

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { useSSE } from '../hooks/useSSE';
import { formatTimestamp, getSeverityColor, truncateText } from '../utils/formatters';
import ConnectionStatus from '../components/ConnectionStatus';

const UpdateItem = ({ data, index }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'mitre_classification':
        return <AlertTriangle className="text-orange-400" size={18} />;
      case 'cowrie_log':
        return <Zap className="text-blue-400" size={18} />;
      case 'attack_chain':
        return <AlertTriangle className="text-red-400" size={18} />;
      default:
        return <Clock className="text-zinc-400" size={18} />;
    }
  };

  return (
    <div className="border-b border-zinc-800 last:border-0 p-4 hover:bg-zinc-900/50 transition-colors animation-in fade-in slide-in-from-top-2" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="flex gap-4">
        <div className="flex-shrink-0 mt-1">
          {getIcon(data.type)}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-white truncate">
              {data.technique_name || data.eventid || 'Event'}
            </h4>
            {data.severity && (
              <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${getSeverityColor(data.severity)}`}>
                {data.severity.toUpperCase()}
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400 mb-2">
            {truncateText(data.summary || data.message || 'No details available', 100)}
          </p>
          <div className="flex gap-4 text-xs text-zinc-500">
            {data.src_ip && <span>IP: {data.src_ip}</span>}
            {data.timestamp && <span>{formatTimestamp(data.timestamp)}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Updates() {
  const [updates, setUpdates] = useState([]);
  const [filter, setFilter] = useState('all'); // all, critical, warnings, info

  const { isConnected, error, messageCount } = useSSE('/dashboard/stream', (data) => {
    setUpdates(prev => [data, ...prev].slice(0, 100));
  });

  const filteredUpdates = updates.filter(update => {
    if (filter === 'all') return true;
    if (filter === 'critical') return update.severity?.toLowerCase() === 'critical';
    if (filter === 'warnings') return ['high', 'critical'].includes(update.severity?.toLowerCase());
    if (filter === 'info') return ['info', 'low'].includes(update.severity?.toLowerCase());
    return true;
  });

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-950 border-b border-zinc-900 px-8 py-6 z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Live Updates</h1>
            <p className="text-zinc-400">Real-time threat intelligence stream</p>
          </div>
          <ConnectionStatus isConnected={isConnected} error={error} messageCount={messageCount} />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'critical', label: 'Critical' },
            { value: 'warnings', label: 'Warnings' },
            { value: 'info', label: 'Info' },
          ].map(btn => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                filter === btn.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Updates List */}
      <div>
        {isConnected ? (
          filteredUpdates.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              <Clock className="mx-auto mb-2 opacity-30" size={32} />
              <p className="text-sm">Waiting for updates...</p>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800">
              {filteredUpdates.map((update, index) => (
                <UpdateItem key={index} data={update} index={index} />
              ))}
            </div>
          )
        ) : (
          <div className="p-8 text-center text-zinc-500">
            <AlertTriangle className="mx-auto mb-2 text-red-500" size={32} />
            <p className="text-sm">Connection lost. Attempting to reconnect...</p>
          </div>
        )}
      </div>
    </div>
  );
}
