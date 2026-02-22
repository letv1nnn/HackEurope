/**
 * Analytics Page
 * Displays detailed analytics and insights about threats
 */

import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Filter } from 'lucide-react';
import { useSSE } from '../hooks/useSSE';

const ChartPlaceholder = ({ title, icon: Icon }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
    <div className="flex items-center gap-2 mb-4">
      <Icon className="text-blue-400" size={20} />
      <h3 className="font-semibold text-white">{title}</h3>
    </div>
    <div className="flex items-center justify-center h-48 bg-zinc-800/30 rounded text-zinc-500">
      <div className="text-center">
        <Icon size={32} className="mx-auto mb-2 opacity-30" />
        <p className="text-sm">Chart will appear here</p>
      </div>
    </div>
  </div>
);

export default function Analytics() {
  const [threatStats, setThreatStats] = useState({
    byTactic: {},
    byTechnique: {},
    bySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
  });

  useSSE('/dashboard/stream', (data) => {
    if (data.type === 'mitre_classification') {
      setThreatStats(prev => ({
        ...prev,
        bySeverity: {
          ...prev.bySeverity,
          [data.severity?.toLowerCase() || 'low']: (prev.bySeverity[data.severity?.toLowerCase() || 'low'] || 0) + 1,
        },
      }));
    }
  });

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-950 border-b border-zinc-900 px-8 py-6 z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Analytics</h1>
            <p className="text-zinc-400">Threat intelligence & attack patterns</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-semibold transition-colors">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartPlaceholder title="Threats by Severity" icon={TrendingUp} />
          <ChartPlaceholder title="Attack Distribution" icon={PieChart} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPlaceholder title="Top Techniques" icon={BarChart3} />
          <ChartPlaceholder title="Timeline" icon={BarChart3} />
        </div>

        {/* Summary Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(threatStats.bySeverity).map(([severity, count]) => (
            <div key={severity} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <p className="text-zinc-400 text-sm capitalize mb-1">{severity}</p>
              <p className="text-2xl font-bold text-white">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
