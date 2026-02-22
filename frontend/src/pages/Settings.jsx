/**
 * Settings Page
 * Application configuration and preferences
 */

import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, AlertCircle } from 'lucide-react';

const SettingSection = ({ title, description, children }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-6">
    <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
    {description && <p className="text-sm text-zinc-400 mb-4">{description}</p>}
    {children}
  </div>
);

const SettingInput = ({ label, value, onChange, type = 'text' }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-zinc-300 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors"
    />
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-sm font-medium text-zinc-300">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-zinc-700'}`}
    >
      <div
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : ''}`}
      />
    </button>
  </div>
);

export default function Settings() {
  const [settings, setSettings] = useState({
    apiUrl: 'http://localhost:8000',
    apiKey: '***',
    enableNotifications: true,
    enableDarkMode: true,
    autoRefresh: true,
    refreshInterval: 5,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-950 border-b border-zinc-900 px-8 py-6 z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Settings</h1>
            <p className="text-zinc-400">Configure application preferences</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold text-white transition-colors"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-2xl">
        {saved && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400 text-sm">
            <AlertCircle size={16} />
            Settings saved successfully
          </div>
        )}

        {/* API Configuration */}
        <SettingSection
          title="API Configuration"
          description="Backend API settings and authentication"
        >
          <SettingInput
            label="API URL"
            value={settings.apiUrl}
            onChange={(e) => handleChange('apiUrl', e.target.value)}
          />
          <SettingInput
            label="API Key"
            value={settings.apiKey}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            type="password"
          />
        </SettingSection>

        {/* Preferences */}
        <SettingSection
          title="Preferences"
          description="Customize application behavior"
        >
          <Toggle
            label="Enable Notifications"
            checked={settings.enableNotifications}
            onChange={(val) => handleChange('enableNotifications', val)}
          />
          <Toggle
            label="Dark Mode"
            checked={settings.enableDarkMode}
            onChange={(val) => handleChange('enableDarkMode', val)}
          />
          <Toggle
            label="Auto Refresh"
            checked={settings.autoRefresh}
            onChange={(val) => handleChange('autoRefresh', val)}
          />
          {settings.autoRefresh && (
            <SettingInput
              label="Refresh Interval (seconds)"
              value={settings.refreshInterval}
              onChange={(e) => handleChange('refreshInterval', parseInt(e.target.value))}
              type="number"
            />
          )}
        </SettingSection>

        {/* About */}
        <SettingSection title="About">
          <div className="space-y-2 text-sm text-zinc-400">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Build:</strong> 2026.02</p>
            <p><strong>Environment:</strong> Production</p>
          </div>
        </SettingSection>
      </div>
    </div>
  );
}
