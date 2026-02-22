/**
 * Main Dashboard Page
 * Displays overview of honeypot activity, threats, and system status
 */

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Shield, Clock } from 'lucide-react';
import { useSSE } from '../hooks/useSSE';
import { LoadingSpinner, SkeletonLoader } from '../components/LoadingSpinner';
import ConnectionStatus from '../components/ConnectionStatus';

const StatCard = ({ icon: Icon, label, value, trend }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
    <div className="flex items-start justify-between mb-2">
      <div className="p-2 bg-blue-500/10 rounded-lg">
        <Icon className="text-blue-400" size={20} />
      </div>
      {trend && (
        <span className={`text-xs font-semibold ${trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-zinc-400 text-sm mb-1">{label}</p>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

const RecentActivityItem = ({ data }) => (
  <div className="border-b border-zinc-800 last:border-0 py-3 px-2 hover:bg-zinc-900/50 transition-colors">
    <div className="flex items-start gap-3">
      <AlertTriangle className="text-yellow-500 mt-1 flex-shrink-0" size={16} />
      <div className="flex-grow min-w-0">
        <p className="text-sm text-white font-semibold truncate">{data?.type || 'Event'}</p>
        <p className="text-xs text-zinc-500">{data?.timestamp || 'N/A'}</p>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLogs: 0,
    activeThreats: 0,
    mitigated: 0,
    uptime: '99.5%',
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isConnected, error, messageCount } = useSSE('/dashboard/stream', (data) => {
    // Update stats based on incoming data
    setStats(prev => ({
      ...prev,
      totalLogs: prev.totalLogs + 1,
      activeThreats: data.type === 'mitre_classification' ? prev.activeThreats + 1 : prev.activeThreats,
    }));

    // Add to recent events
    setRecentEvents(prev => [data, ...prev].slice(0, 5));
    setIsLoading(false);
  });

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-950 border-b border-zinc-900 px-8 py-6 z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-zinc-400">Honeypot monitoring & threat intelligence</p>
          </div>
          <ConnectionStatus isConnected={isConnected} error={error} messageCount={messageCount} />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {isLoading ? (
          <SkeletonLoader count={4} height="h-24" />
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard icon={Shield} label="Total Logs" value={stats.totalLogs} trend={12} />
              <StatCard icon={AlertTriangle} label="Active Threats" value={stats.activeThreats} trend={5} />
              <StatCard icon={TrendingUp} label="Mitigated" value={stats.mitigated} trend={-8} />
              <StatCard icon={Clock} label="Uptime" value={stats.uptime} />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-zinc-800 bg-zinc-800/50">
                  <h3 className="font-semibold text-white">Recent Activity</h3>
                </div>
                <div className="divide-y divide-zinc-800">
                  {recentEvents.length === 0 ? (
                    <div className="p-6 text-center text-zinc-500 text-sm">
                      No recent events
                    </div>
                  ) : (
                    recentEvents.map((event, i) => (
                      <RecentActivityItem key={i} data={event} />
                    ))
                  )}
                </div>
              </div>

              {/* System Status */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-4">System Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Backend API</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {isConnected ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Honeypot</span>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-green-500/20 text-green-400">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Classification Engine</span>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                      Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
