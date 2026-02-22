/**
 * Connection Status Indicator Component
 */

import React from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

export const ConnectionStatus = ({ isConnected, error, messageCount }) => {
  const statusIcon = isConnected ? (
    <Wifi size={14} className="text-green-500" />
  ) : error ? (
    <AlertCircle size={14} className="text-red-500" />
  ) : (
    <WifiOff size={14} className="text-yellow-500" />
  );

  const statusText = isConnected
    ? 'Connected'
    : error
    ? 'Error'
    : 'Connecting...';

  const statusBg = isConnected
    ? 'bg-green-500/10 border-green-500/20'
    : error
    ? 'bg-red-500/10 border-red-500/20'
    : 'bg-yellow-500/10 border-yellow-500/20';

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border ${statusBg}`}>
      <div className="flex items-center gap-2">
        {statusIcon}
        <span className="text-zinc-300">{statusText}</span>
      </div>
      {messageCount !== undefined && (
        <span className="text-zinc-500 ml-2">({messageCount})</span>
      )}
      {error && (
        <span className="text-red-400 text-[10px] ml-2">{error.message}</span>
      )}
    </div>
  );
};

export default ConnectionStatus;
