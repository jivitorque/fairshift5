import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { industryConfigs } from '../../data/seedData';
import {
  ShieldAlert,
  Search,
  CheckCircle,
  Coffee,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import type { FatigueLevel } from '../../types';

export const AttendanceFatigueRoster: React.FC = () => {
  const {
    workers,
    currentIndustry,
    assignMandatoryRest,
    setSelectedWorkerId,
    setRole,
  } = useApp();

  const indConfig = industryConfigs[currentIndustry];
  const [searchQuery, setSearchQuery] = useState('');
  const [fatigueFilter, setFatigueFilter] = useState<'ALL' | FatigueLevel>('ALL');
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.currentZone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFatigue = fatigueFilter === 'ALL' || worker.fatigueRisk === fatigueFilter;
    const matchesZone = zoneFilter === 'ALL' || worker.currentZone === zoneFilter;

    return matchesSearch && matchesFatigue && matchesZone;
  });

  const highFatigueCount = workers.filter((w) => w.fatigueRisk === 'HIGH').length;

  return (
    <div className="space-y-5">
      {/* Automated Fatigue Risk Engine Alert Callout */}
      {highFatigueCount > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 to-slate-900 border-2 border-red-500/50 text-red-200 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="font-extrabold text-sm text-red-300">
                  Automated Fatigue Risk Engine: {highFatigueCount} Frontline Worker(s) Over Threshold
                </h4>
                <p className="text-xs text-red-200/80 mt-0.5 leading-relaxed">
                  Flagged for exceeding 50h/week or &gt;3 consecutive double shifts. SDG 8.8 compliance mandates immediate 16h rest turnaround to avert machinery accidents and heat exhaustion.
                </p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-xs font-bold text-red-300 whitespace-nowrap">
              Action Required
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search workers by name, role, or work zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Fatigue Filter */}
          <select
            value={fatigueFilter}
            onChange={(e) => setFatigueFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Fatigue Levels</option>
            <option value="HIGH">🚨 High Risk Only</option>
            <option value="MEDIUM">⚠️ Medium Risk</option>
            <option value="LOW">✅ Low Risk</option>
          </select>

          {/* Zone Filter */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer max-w-[170px] truncate"
          >
            <option value="ALL">All Work Zones</option>
            {indConfig.zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Frontline Roster Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Worker Profile</th>
              <th className="py-3 px-4">Zone / Geofence</th>
              <th className="py-3 px-4">Shift Status</th>
              <th className="py-3 px-4">Shift Hours</th>
              <th className="py-3 px-4">Weekly Cumulative</th>
              <th className="py-3 px-4">Fatigue Assessment</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredWorkers.map((worker) => {
              const isHighFatigue = worker.fatigueRisk === 'HIGH';
              const isMediumFatigue = worker.fatigueRisk === 'MEDIUM';

              return (
                <tr
                  key={worker.id}
                  className={`hover:bg-slate-800/50 transition-colors ${
                    isHighFatigue ? 'bg-red-950/15' : ''
                  }`}
                >
                  {/* Worker Name & Role */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          {worker.name}
                          <button
                            onClick={() => {
                              setSelectedWorkerId(worker.id);
                              setRole('worker');
                            }}
                            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-normal hover:underline ml-1"
                            title="Open Worker Mobile View as this worker"
                          >
                            [Open App]
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400">{worker.role}</p>
                      </div>
                    </div>
                  </td>

                  {/* Zone & Accuracy */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-medium text-slate-200 truncate max-w-[170px]">
                        {worker.currentZone}
                      </span>
                    </div>
                    {worker.currentShift && (
                      <span className="text-[10px] text-emerald-400 block font-mono pl-5">
                        {worker.currentShift.gpsAccuracy}
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {worker.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        ON DUTY
                      </span>
                    ) : worker.status === 'on-break' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Coffee className="w-3 h-3" />
                        ON BREAK
                      </span>
                    ) : worker.status === 'mandatory-rest' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        MANDATORY REST
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400">
                        OFF DUTY
                      </span>
                    )}
                  </td>

                  {/* Shift Hours Today */}
                  <td className="py-3.5 px-4 font-mono">
                    {worker.currentShift ? (
                      <div>
                        <span className="text-slate-100 font-bold">
                          {Math.floor(worker.currentShift.durationMinutes / 60)}h{' '}
                          {worker.currentShift.durationMinutes % 60}m
                        </span>
                        {worker.currentShift.overtimeMinutes > 0 && (
                          <span className="text-amber-400 block text-[10px] font-semibold">
                            +{Math.round((worker.currentShift.overtimeMinutes / 60) * 10) / 10}h OT (1.5x)
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>

                  {/* Weekly Hours */}
                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={`font-bold ${
                        worker.weeklyHours > 50
                          ? 'text-red-400'
                          : worker.weeklyHours > 44
                          ? 'text-amber-400'
                          : 'text-slate-200'
                      }`}
                    >
                      {worker.weeklyHours} hrs
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {worker.consecutiveDoubleShifts} dbl-shifts
                    </span>
                  </td>

                  {/* Fatigue Risk Badge & Reason */}
                  <td className="py-3.5 px-4">
                    {isHighFatigue ? (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black bg-red-500/20 text-red-300 border border-red-500/40">
                          <AlertTriangle className="w-3 h-3 text-red-400" />
                          HIGH BURNOUT RISK
                        </span>
                        {worker.fatigueAlertReason && (
                          <p className="text-[10px] text-red-300/80 mt-1 max-w-[210px] line-clamp-2">
                            {worker.fatigueAlertReason}
                          </p>
                        )}
                      </div>
                    ) : isMediumFatigue ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        MEDIUM WATCH
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold text-emerald-400">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        SAFE / NORMAL
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    {isHighFatigue || worker.weeklyHours > 48 ? (
                      <button
                        onClick={() =>
                          assignMandatoryRest(
                            worker.id,
                            `Fatigue protection protocol enforced for ${worker.name}. Shift rebalanced with full base pay protection.`
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] shadow-md transition-all active:scale-95 whitespace-nowrap"
                        title="Enforce 16h mandatory rest window and rebalance shift"
                      >
                        Assign Mandatory Rest
                      </button>
                    ) : (
                      <span className="text-slate-500 text-[11px]">In Compliance</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
