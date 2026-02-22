/**
 * Projects Page
 * Manage monitored projects and honeypots
 */

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Server, Shield, Activity } from 'lucide-react';

const ProjectCard = ({ project, onEdit, onDelete }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors group">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-start gap-3">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <Server className="text-blue-400" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-white">{project.name}</h3>
          <p className="text-xs text-zinc-500">{project.host}</p>
        </div>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(project)}
          className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
        >
          <Edit2 size={16} className="text-zinc-400" />
        </button>
        <button
          onClick={() => onDelete(project.id)}
          className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
        >
          <Trash2 size={16} className="text-red-400" />
        </button>
      </div>
    </div>

    <div className="space-y-2 mb-4 text-sm">
      <div className="flex items-center justify-between text-zinc-400">
        <span>Status</span>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${project.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
          {project.status?.toUpperCase()}
        </span>
      </div>
      <div className="flex items-center justify-between text-zinc-400">
        <span>Type</span>
        <span className="text-zinc-300">{project.type || 'Honeypot'}</span>
      </div>
      <div className="flex items-center justify-between text-zinc-400">
        <span>Port</span>
        <span className="text-zinc-300">{project.port || '22'}</span>
      </div>
    </div>

    <div className="flex gap-2 text-[11px] text-zinc-500">
      <span className="flex items-center gap-1">
        <Activity size={12} />
        {project.events || 0} events
      </span>
      <span className="flex items-center gap-1">
        <Shield size={12} />
        {project.threats || 0} threats
      </span>
    </div>
  </div>
);

export default function Projects() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Main Honeypot',
      host: 'honeypot.local',
      port: 2222,
      type: 'SSH',
      status: 'active',
      events: 1243,
      threats: 47,
    },
    {
      id: 2,
      name: 'Web Server',
      host: 'web.local',
      port: 8000,
      type: 'HTTP',
      status: 'active',
      events: 892,
      threats: 23,
    },
    {
      id: 3,
      name: 'Database Server',
      host: 'db.local',
      port: 5432,
      type: 'PostgreSQL',
      status: 'inactive',
      events: 421,
      threats: 5,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleCreate = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-950 border-b border-zinc-900 px-8 py-6 z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Projects</h1>
            <p className="text-zinc-400">Manage monitored honeypots and servers</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold text-white transition-colors"
          >
            <Plus size={16} />
            New Project
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {showForm && (
          <div className="mb-8 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Project Name"
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Host/IP"
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Port"
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
              />
              <select className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-blue-500 focus:outline-none">
                <option>SSH</option>
                <option>HTTP</option>
                <option>FTP</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold text-white transition-colors">
                {editingProject ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-semibold text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <Server className="mx-auto mb-2 opacity-30" size={32} />
            <p className="text-sm">No projects yet</p>
            <button
              onClick={handleCreate}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold text-white transition-colors inline-block"
            >
              Create your first project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
