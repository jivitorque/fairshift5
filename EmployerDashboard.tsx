import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { industryConfigs } from '../../data/seedData';
import { AttendanceFatigueRoster } from './AttendanceFatigueRoster';
import { GrievanceManagementQueue } from './GrievanceManagementQueue';
import { WorkforceIntelligence } from './WorkforceIntelligence';
import { IssueBadgeModal } from './IssueBadgeModal';
import {
  Users,
  ShieldAlert,
  Clock,
  Award,
  TrendingUp,
  AlertTriangle,
  HardHat,
  GraduationCap,
  Activity,
} from 'lucide-react';

type EmployerTab = 'roster' | 'grievances' | 'intelligence';

export const EmployerDashboard: React.FC = () => {
  const { currentIndustry, stats, tickets, workers } = useApp();
  const indConfig = industryConfigs[currentIndustry];

  const [activeTab, setActiveTab] = useState<EmployerTab>('roster');
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  const criticalTicketCount = tickets.filter(
    (t) => t.severity === 'CRITICAL' && t.status !== 'resolved'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-slate-100">
      {/* Top Industry & Org Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-3xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
              currentIndustry === 'construction'
                ? 'bg-amber-500 shadow-amber-500/20 text-slate-950 font-bold'
                : 'bg-blue-600 shadow-blue-500/20 text-white'
            }`}
          >
            {currentIndustry === 'construction' ? (
              <HardHat className="w-7 h-7" />
            ) : (
              <GraduationCap className="w-7 h-7" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">
                {indConfig.name}
              </h1>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${indConfig.badgeAccent}`}>
                Enterprise SaaS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{indConfig.tagline}</p>
            <p className="text-[11px] text-slate-500">📍 {indConfig.location}</p>
          </div>
        </div>

        {/* Action Button: Issue Skill Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBadgeModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Award className="w-4 h-4" />
            <span>Issue Skill Badge</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {/* Active Workforce */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              On-Site Roster
            </span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">
              {stats.activeOnSite}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              / {stats.totalWorkers} active
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            100% Geofence Verified
          </span>
        </div>

        {/* Fatigue Risk Flags */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Fatigue Guard Alerts
            </span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-2xl font-black ${stats.highFatigueCount > 0 ? 'text-red-400' : 'text-slate-100'}`}>
              {stats.highFatigueCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">critical flags</span>
          </div>
          <span className="text-[10px] text-red-300 block mt-1">
            {stats.highFatigueCount > 0 ? '&gt;50h or 3x Double Shifts' : 'All Rosters Balanced'}
          </span>
        </div>

        {/* Open Safety Tickets */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Open Safety Tickets
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-300">
              {stats.openTicketsCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">pending</span>
          </div>
          <span className="text-[10px] text-amber-400/90 block mt-1 font-medium">
            {criticalTicketCount} Critical Stop-Work
          </span>
        </div>

        {/* Overtime Transparency */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Transparency Index
            </span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-indigo-300">
              98.4%
            </span>
          </div>
          <span className="text-[10px] text-indigo-400 block mt-1">
            {stats.totalOvertimeHours}h Total Overtime
          </span>
        </div>

        {/* Retention Health Score */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-md col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Retention Health
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-400">
              {stats.retentionHealthScore}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 100</span>
          </div>
          <span className="text-[10px] text-emerald-300 block mt-1 font-semibold">
            UN SDG 8.5 Aligned
          </span>
        </div>
      </div>

      {/* Main SaaS Tabs */}
      <div className="border-b border-slate-800">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('roster')}
            className={`py-3 px-4 font-extrabold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'roster'
                ? 'border-indigo-500 text-white bg-slate-900/50 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Attendance & Fatigue Guard ({workers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('grievances')}
            className={`py-3 px-4 font-extrabold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'grievances'
                ? 'border-indigo-500 text-white bg-slate-900/50 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Safety & Grievance Resolution Desk ({tickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('intelligence')}
            className={`py-3 px-4 font-extrabold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'intelligence'
                ? 'border-indigo-500 text-white bg-slate-900/50 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Workforce Intelligence & AI Attrition</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'roster' && <AttendanceFatigueRoster />}
        {activeTab === 'grievances' && <GrievanceManagementQueue />}
        {activeTab === 'intelligence' && <WorkforceIntelligence />}
      </div>

      {/* Modal to Issue Skill Badge */}
      <IssueBadgeModal
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
      />
    </div>
  );
};
