import React from 'react';
import { WorkerMobileView } from '../worker/WorkerMobileView';
import { EmployerDashboard } from '../employer/EmployerDashboard';
import { Columns, Smartphone, LayoutDashboard } from 'lucide-react';

export const SplitView: React.FC = () => {
  return (
    <div className="w-full px-2 py-4">
      {/* Split View Header */}
      <div className="max-w-7xl mx-auto mb-4 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-200">
        <div className="flex items-center gap-2">
          <Columns className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-white">Live Reactive Dual View:</span>
          <span className="hidden sm:inline">
            Perform an action on the Worker Mobile App (Left) and see it immediately propagate into the Employer Command Center (Right).
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Zero-Latency Bus</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Worker Mobile View Mockup Frame */}
        <div className="xl:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-2 px-3 text-xs text-slate-400">
              <span className="font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                Worker Mobile App
              </span>
              <span className="text-[10px] text-amber-400 font-medium">Touch-Optimized</span>
            </div>
            <WorkerMobileView />
          </div>
        </div>

        {/* Right Column: Employer SaaS Dashboard */}
        <div className="xl:col-span-7 bg-slate-950/40 border border-slate-800 rounded-3xl p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-2 px-2 text-xs text-slate-400">
            <span className="font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
              Employer Command Center
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Real-Time Sync</span>
          </div>
          <EmployerDashboard />
        </div>
      </div>
    </div>
  );
};
