import React from 'react';
import { 
  Activity, 
  Database,
  Cpu,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
<<<<<<< HEAD
import { useSSE } from '../hooks/useSSE';
import { formatTimestamp, getSeverityColor, truncateText } from '../utils/formatters';

const Panel = ({ title, icon: Icon, children, color, glowColor }) => (
  <div className={`bg-zinc-950 border border-zinc-900 rounded-xl flex flex-col h-full shadow-lg overflow-hidden group/panel`}>
    <div className="px-5 py-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/20">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color} bg-opacity-20 relative`}>
          <div className={`absolute inset-0 rounded-lg ${glowColor} opacity-0 group-hover/panel:opacity-40 blur-md transition-opacity duration-500`} />
          <Icon className={`${color.replace('bg-', 'text-').replace('-600', '-400').replace('-500', '-400')} relative z-10`} size={18} />
        </div>
        <h3 className="font-bold text-white tracking-tight group-hover/panel:text-blue-400 transition-colors duration-300">{title}</h3>
      </div>
    </div>
    <div className="flex-grow overflow-auto p-4 custom-scrollbar bg-black/20">
      {children}
    </div>
  </div>
);

const LogItem = ({ data }) => (
  <div className="mb-2 p-3 font-mono text-[11px] bg-black/40 rounded border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/40 transition-all duration-200 group/item">
    <div className="flex justify-between mb-1">
      <span className="text-blue-400/80">[{data?.timestamp}]</span>
      <span className="text-zinc-600 flex items-center gap-1 uppercase">{data?.eventid}</span>
    </div>
    <div className="text-zinc-400">{data?.message || data?.input}</div>
    {data?.src_ip && (
      <div className="text-zinc-500 mt-2 flex items-center gap-2">
        <span className="px-1.5 py-0.5 bg-zinc-900 rounded text-[9px] uppercase font-bold">IP</span>
        <span>{data?.src_ip}</span>
      </div>
    )}
  </div>
);

const RiskItem = ({ data }) => (
  <div className="mb-3 p-3 bg-zinc-900/20 rounded-lg flex flex-col gap-3 border border-zinc-900 group hover:bg-zinc-800/20 transition-all duration-300">
    <div className="flex items-center gap-4">
      <div className="relative w-10 h-10 flex-shrink-0">
        <div className={`absolute inset-0 rounded-full border-2 border-zinc-800`} />
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
          {data?.confidence ? Math.round(data.confidence * 100) : data?.score || 50}
        </div>
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] font-bold px-2 py-1 rounded ${getSeverityColor(data?.severity)}`}>
            {data?.severity?.toUpperCase() || 'MEDIUM'}
          </span>
          <span className="text-[9px] text-zinc-600 truncate">{formatTimestamp(data?.timestamp)}</span>
        </div>
        <h4 className="text-xs font-bold text-white truncate uppercase">{data?.technique_name || data?.eventid || 'THREAT-ANALYSIS'}</h4>
      </div>
    </div>
    {data?.summary && (
      <div className="text-[10px] text-zinc-400 leading-relaxed border-l-2 border-zinc-800 pl-3 py-1 italic bg-black/20 rounded-r">
        {truncateText(data.summary, 150)}
      </div>
    )}
  </div>
);

const AttackChainItem = ({ data }) => (
  <div className="mb-4 bg-zinc-950/40 border border-zinc-900 rounded-xl overflow-hidden group/chain hover:border-zinc-700 transition-all duration-300">
    <div className="p-3 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/20">
      <h4 className="text-[10px] font-black text-white uppercase">{data?.chain_id || 'ATTACK-CHAIN'}</h4>
      <span className="text-[9px] text-zinc-600 uppercase">{data?.detected_at}</span>
    </div>
    <div className="p-3">
       <div className="text-[11px] text-blue-400 mb-1 font-bold uppercase">{data?.technique}</div>
       <div className="text-[10px] text-zinc-500 mb-4">{data?.attacker_ip}</div>
       
       {data?.stages && (
         <div className="space-y-4 relative before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">
           {data.stages.map((stage, idx) => (
             <div key={idx} className="relative pl-6">
               <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700 group-hover/chain:bg-blue-600 group-hover/chain:border-blue-400 transition-colors duration-500" />
               <div className="text-[10px] font-black text-zinc-300 uppercase mb-1 tracking-wider">{stage.name}</div>
               <div className="text-[9px] text-zinc-500 leading-relaxed font-medium capitalize">{stage.desc}</div>
             </div>
           ))}
         </div>
       )}
    </div>
  </div>
);

export default function ClassificationDashboard() {
  const [liveLogs, setLiveLogs] = useState([]);
  const [riskScores, setRiskScores] = useState([]);
  const [attackChains, setAttackChains] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Use custom SSE hook for dashboard stream
  const dashboardSSE = useSSE('/dashboard/stream', (data) => {
    const type = data.type || (data.eventid ? 'cowrie_log' : null);

    if (type === 'cowrie_log') {
      setLiveLogs(prev => [data, ...prev].slice(0, 20));
    } else if (type === 'mitre_classification' || type === 'risk_score') {
      setRiskScores(prev => [data, ...prev].slice(0, 15));
    } else if (type === 'attack_chain') {
      setAttackChains(prev => [data, ...prev].slice(0, 5));
    }
  });

  useEffect(() => {
    setConnectionStatus(dashboardSSE.isConnected ? 'connected' : 'disconnected');
  }, [dashboardSSE.isConnected]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 grid-rows-2 gap-6 h-full p-6 animate-in fade-in duration-1000 slide-in-from-bottom-2">
      {/* Connection Status Indicator */}
      <div className="absolute top-2 right-2 flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full text-xs">
        <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-zinc-400">{connectionStatus}</span>
      </div>

      <Panel title="Real-time Feed" icon={Cpu} color="bg-blue-600" glowColor="bg-blue-500">
        {liveLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 uppercase font-black text-[10px]">
            Waiting for Uplink...
          </div>
        ) : (
          liveLogs.map((log, i) => <LogItem key={i} data={log} />)
        )}
      </Panel>
=======
import { Panel, LogItem, RiskItem, AttackChainItem } from './DashboardComponents';

export default function ClassificationDashboard({ 
  liveLogs, 
  riskScores, 
  attackChains, 
  latestRisk, 
  setLatestRisk, 
  isProcessing 
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Mini status bar */}
      {isProcessing && (
        <div className="mx-6 mt-4 p-2 bg-blue-600/10 border border-blue-500/20 rounded-lg flex items-center justify-center gap-3 animate-pulse">
           <Cpu className="text-blue-400 animate-spin" size={12} />
           <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
             AI Agents analyzing threat landscape...
           </span>
        </div>
      )}
>>>>>>> a597997001e951c2dfeb0cfbf6d5f9ce0d6bd528

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow p-6 h-full overflow-auto animate-in fade-in duration-1000 slide-in-from-bottom-2">
        
        {/* COLUMN 1: LIVE FEED */}
        <div className="flex flex-col gap-6 h-full">
          <Panel title="Real-time Feed" icon={Cpu} color="bg-blue-600" glowColor="bg-blue-500">
            {liveLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500 uppercase font-black text-[10px]">
                Waiting for Uplink...
              </div>
            ) : (
              liveLogs.map((log, i) => <LogItem key={i} data={log} />)
            )}
          </Panel>
        </div>

        {/* COLUMN 2: DIAGNOSTICS & CORRELATION */}
        <div className="flex flex-col gap-6 h-full">
          <div className="h-1/2 min-h-[300px]">
            <Panel title="Live Diagnostics" icon={Activity} color="bg-orange-600" glowColor="bg-orange-500">
              {riskScores.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 uppercase font-black text-[10px]">
                  Awaiting Data...
                </div>
              ) : (
                riskScores.map((score, i) => (
                  <RiskItem 
                    key={i} 
                    data={score} 
                    active={latestRisk?.timestamp === score.timestamp}
                    onClick={() => setLatestRisk(score)}
                  />
                ))
              )}
            </Panel>
          </div>
          <div className="h-1/2 min-h-[300px]">
            <Panel title="Attack Correlation" icon={Database} color="bg-emerald-600" glowColor="bg-emerald-500">
              {attackChains.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 uppercase font-black text-[10px]">
                  Monitoring Patterns...
                </div>
              ) : (
                attackChains.map((chain, i) => <AttackChainItem key={i} data={chain} />)
              )}
            </Panel>
          </div>
        </div>

      </div>
    </div>
  );
}
