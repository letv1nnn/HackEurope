import React, { useState } from 'react';
import { Github, Link, ArrowRight, ShieldCheck, Server, Code, ShieldAlert, Cpu, Share2, Globe, Activity } from 'lucide-react';

const ConfigSection = ({ icon: Icon, title, children }) => (
  <div className="space-y-4 pt-6 first:pt-0 border-t border-zinc-900 first:border-0">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-zinc-900 rounded-lg">
        <Icon size={18} className="text-blue-500" />
      </div>
      <h3 className="text-md font-bold text-white">{title}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-1">
      {children}
    </div>
  </div>
);

const FormField = ({ label, id, placeholder, type = "text", value, onChange, required = false }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-[13px] font-medium text-zinc-400 ml-0.5">
      {label}
    </label>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-zinc-700 outline-none"
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

const SelectField = ({ label, id, options, value, onChange }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-[13px] font-medium text-zinc-400 ml-0.5">
      {label}
    </label>
    <select
      id={id}
      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none"
      value={value}
      onChange={onChange}
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

export default function HoneypotConfig() {
  const [formData, setFormData] = useState({
    repoUrl: '',
    serverType: 'web',
    os: 'ubuntu-22.04',
    techStack: '',
    ports: '22, 80, 443',
    dbType: 'postgres',
    endpoints: '',
    authMethod: 'jwt',
    vulns: 'sql-injection, xss',
    logLevel: 'info',
    requestRate: '100',
    geoDistribution: 'global'
  });

  const [isLinking, setIsLinking] = useState(false);
  const [linked, setLinked] = useState(false);

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleLink = (e) => {
    e.preventDefault();
    setIsLinking(true);
    setTimeout(() => {
      setIsLinking(false);
      setLinked(true);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mb-12">
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-5 mb-8">
          <div className="p-4 bg-blue-600/10 rounded-xl border border-blue-600/20">
            <ShieldCheck className="text-blue-500" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Configure Honey Pot</h2>
            <p className="text-zinc-500 text-sm mt-1">Define the environment and behavior for your security agent.</p>
          </div>
        </div>

        {!linked ? (
          <form onSubmit={handleLink} className="space-y-8">
            {/* GitHub Section */}
            <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800/50 space-y-4">
              <div className="flex items-center gap-3">
                <Github size={20} className="text-white" />
                <h3 className="text-md font-bold text-white">Source Code</h3>
              </div>
              <FormField 
                label="Repository URL" 
                id="repoUrl" 
                placeholder="https://github.com/username/repo" 
                value={formData.repoUrl}
                onChange={(e) => updateField('repoUrl', e.target.value)}
                required
              />
            </div>

            {/* Infrastructure & Environment */}
            <ConfigSection icon={Server} title="Infrastructure & Environment">
              <SelectField 
                label="Server Type" 
                id="serverType" 
                options={[
                  { label: 'Web Server', value: 'web' },
                  { label: 'API Server', value: 'api' },
                  { label: 'Database', value: 'db' },
                  { label: 'Microservice', value: 'micro' }
                ]}
                value={formData.serverType}
                onChange={(e) => updateField('serverType', e.target.value)}
              />
              <FormField 
                label="Operating System" 
                id="os" 
                placeholder="e.g. Ubuntu 22.04" 
                value={formData.os}
                onChange={(e) => updateField('os', e.target.value)}
              />
              <FormField 
                label="Technology Stack" 
                id="techStack" 
                placeholder="e.g. Node.js, Python/Django" 
                value={formData.techStack}
                onChange={(e) => updateField('techStack', e.target.value)}
              />
              <FormField 
                label="Open Ports" 
                id="ports" 
                placeholder="e.g. 2222, 8080" 
                value={formData.ports}
                onChange={(e) => updateField('ports', e.target.value)}
              />
            </ConfigSection>

            {/* Application Details */}
            <ConfigSection icon={Code} title="Application Details">
              <SelectField 
                label="Database Type" 
                id="dbType" 
                options={[
                  { label: 'PostgreSQL', value: 'postgres' },
                  { label: 'MySQL', value: 'mysql' },
                  { label: 'MongoDB', value: 'mongo' },
                  { label: 'Redis', value: 'redis' }
                ]}
                value={formData.dbType}
                onChange={(e) => updateField('dbType', e.target.value)}
              />
              <FormField 
                label="API Endpoints to Simulate" 
                id="endpoints" 
                placeholder="e.g. /api/v1/auth, /api/v1/users" 
                value={formData.endpoints}
                onChange={(e) => updateField('endpoints', e.target.value)}
              />
              <SelectField 
                label="Authentication Method" 
                id="authMethod" 
                options={[
                  { label: 'JWT', value: 'jwt' },
                  { label: 'OAuth 2.0', value: 'oauth' },
                  { label: 'Session-based', value: 'session' },
                  { label: 'API Keys', value: 'apikey' }
                ]}
                value={formData.authMethod}
                onChange={(e) => updateField('authMethod', e.target.value)}
              />
            </ConfigSection>

            {/* Security & Monitoring */}
            <ConfigSection icon={ShieldAlert} title="Security & Monitoring">
              <FormField 
                label="Intentional Vulnerabilities" 
                id="vulns" 
                placeholder="e.g. SQLi, XSS, RCE" 
                value={formData.vulns}
                onChange={(e) => updateField('vulns', e.target.value)}
              />
              <SelectField 
                label="Logging Level" 
                id="logLevel" 
                options={[
                  { label: 'Debug', value: 'debug' },
                  { label: 'Info', value: 'info' },
                  { label: 'Warning', value: 'warn' },
                  { label: 'Critical', value: 'critical' }
                ]}
                value={formData.logLevel}
                onChange={(e) => updateField('logLevel', e.target.value)}
              />
            </ConfigSection>

            {/* Traffic & Deployment */}
            <ConfigSection icon={Activity} title="Traffic & Deployment">
              <FormField 
                label="Expected Request Rate (req/min)" 
                id="requestRate" 
                placeholder="e.g. 500" 
                value={formData.requestRate}
                onChange={(e) => updateField('requestRate', e.target.value)}
              />
              <FormField 
                label="Geographic Distribution" 
                id="geoDistribution" 
                placeholder="e.g. US, EU, Global" 
                value={formData.geoDistribution}
                onChange={(e) => updateField('geoDistribution', e.target.value)}
              />
            </ConfigSection>

            <div className="pt-8 pt-6 border-t border-zinc-900">
              <button
                type="submit"
                disabled={isLinking || !formData.repoUrl}
                className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-md transition-all duration-200 shadow-xl 
                  ${isLinking || !formData.repoUrl 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/10'}`}
              >
                {isLinking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Initializing Environment...
                  </>
                ) : (
                  <>
                    Launch Secure Honeypot
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-12 space-y-6">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-inner">
              <ShieldCheck className="text-emerald-500" size={40} />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">Environment Deployed</h3>
            <p className="text-zinc-400 max-w-md mx-auto leading-relaxed">
              Successfully configured Cowrie honeypot for <span className="text-blue-400 font-bold">{formData.repoUrl}</span>. 
              The monitoring agent is now active on <span className="text-white font-mono bg-zinc-900 px-1.5 py-0.5 rounded">ports {formData.ports}</span>.
            </p>
            <div className="flex justify-center gap-4 mt-8 pt-8 border-t border-zinc-900">
              <button 
                onClick={() => setLinked(false)}
                className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-sm font-semibold transition-all"
              >
                Modify Config
              </button>
              <button 
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
              >
                View Live Logs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
