/**
 * Main App Component
 * Entry point with routing and layout
 */

import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import './App.css';

import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './components/Home';
import ClassificationDashboard from './components/ClassificationDashboard';
import HoneypotConfig from './components/HoneypotConfig';

// Page imports
import Dashboard from './pages/Dashboard';
import Updates from './pages/Updates';
import Analytics from './pages/Analytics';
import Projects from './pages/Projects';
import Settings from './pages/Settings';

const NavigationItem = ({ icon: Icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 mb-1 
      ${active ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/20' : 'text-zinc-400 hover:bg-zinc-900'}`}
  >
    <Icon size={18} className={active ? 'text-white' : 'text-zinc-500'} />
    <span className="text-sm">{label}</span>
  </div>
);

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'updates':
        return <Updates />;
      case 'analytics':
        return <Analytics />;
      case 'projects':
        return <Projects />;
      case 'settings':
        return <Settings />;
      case 'home':
        return <Home />;
      case 'classification':
        return <ClassificationDashboard />;
      case 'honeypot':
        return <HoneypotConfig />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-black text-zinc-300 font-sans selection:bg-blue-500/30">
        {/* Sidebar */}
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        {/* Main Content */}
        <main className="flex-grow flex flex-col overflow-hidden min-w-0">
          <div className="flex-grow overflow-auto bg-zinc-950">
            {renderContent()}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
