import React from 'react';
import { useApp } from '../../context/AppContext';
import { industryConfigs } from '../../data/seedData';
import {
  Brain,
  Flame,
  Activity,
  Sparkles,
} from 'lucide-react';

export const WorkforceIntelligence: React.FC = () => {
  const {
    workers,
    currentIndustry,
    sentimentClusters,
    stats,
    liveEvents,
  } = useApp();

  const indConfig = industryConfigs[currentIndustry];

  // Group workers by work zone to generate Fatigue & Overtime Heatmap
  const zoneStats = indConfig.zones.map((zone) => {
    const workersInZone = workers.filter((w) => w.currentZone === zone);
    const avgWeeklyHours =
      workersInZone.length > 0
        ? Math.round(
            (workersInZone.reduce((acc, w) => acc + w.weeklyHours, 0) /
              workersInZone.length) *
              10
          ) / 10
        : 0;

    const highFatigueInZone = workersInZone.filter((w) => w.fatigueRisk === 'HIGH').length;
    const activeCount = workersInZone.filter((w) => w.status === 'active').length;

    let riskLevel = 'Normal';
    let riskColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (avgWeeklyHours > 48 || highFatigueInZone > 0) {
      riskLevel = 'High Risk';
      riskColor = 'bg-red-500/20 text-red-300 border-red-500/40';
    } else if (avgWeeklyHours > 42) {
      riskLevel = 'Moderate';
      riskColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }

    return {
      zone,
      workersCount: workersInZone.length,
      activeCount,
      avgWeeklyHours,
      highFatigueInZone,
      riskLevel,
      riskColor,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top AI Intelligence Summary Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 shrink-0">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white">
                Decent Work & Retention Intelligence Engine
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                SDG 8 Active Monitor
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Synthesizes real-time geofence attendance logs, itemized overtime payments, and anonymous voice grievance reports into proactive retention interventions.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
            Retention Health Score
          </span>
          <div className="text-3xl font-black text-emerald-400 flex items-center justify-end gap-1">
            <span>{stats.retentionHealthScore}</span>
            <span className="text-sm font-normal text-slate-400">/ 100</span>
          </div>
          <span className="text-[11px] text-emerald-300 font-semibold">Healthy Labor Index</span>
        </div>
      </div>

      {/* Department / Zone Fatigue Heatmap */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Zone-by-Zone Fatigue & Burnout Risk Heatmap
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies hotspots where overtime spikes correlate with physical hazard reports.
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Real-Time Refresh</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {zoneStats.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-1">
                <span className="font-bold text-xs text-slate-200 line-clamp-1">
                  {item.zone}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${item.riskColor}`}
                >
                  {item.riskLevel}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Average Weekly Hours:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {item.avgWeeklyHours}h
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>On-Duty Workforce:</span>
                  <span className="font-mono text-emerald-400">
                    {item.activeCount} / {item.workersCount} active
                  </span>
                </div>
                {item.highFatigueInZone > 0 && (
                  <div className="flex justify-between text-red-400 font-bold">
                    <span>High Fatigue Workers:</span>
                    <span>{item.highFatigueInZone} flagged</span>
                  </div>
                )}
              </div>

              {/* Mini Heat Meter */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    item.avgWeeklyHours > 48
                      ? 'bg-red-500'
                      : item.avgWeeklyHours > 42
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, (item.avgWeeklyHours / 55) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anonymous Sentiment & Attrition Risk Analyzer */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-400" />
              Automated Sentiment & Attrition Risk Analyzer (NLP Clustered)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Clusters anonymous frontline reports into systemic themes with prescriptive mitigation actions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sentimentClusters.map((cluster, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-bold text-xs text-slate-100">{cluster.theme}</h5>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {cluster.category}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cluster.riskScore === 'High'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : cluster.riskScore === 'Moderate'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    Risk: {cluster.riskScore}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {cluster.count} feedback mentions
                  </span>
                </div>
              </div>

              {/* Prescriptive Recommendation Pill */}
              <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-[11px] text-indigo-200">
                <span className="font-bold text-indigo-300 block mb-0.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  Prescriptive AI Action:
                </span>
                {cluster.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-Time Live Action Feed */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
        <h4 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          Live Platform Audit Stream (Decent Work Ledger)
        </h4>
        <div className="divide-y divide-slate-800 max-h-60 overflow-y-auto">
          {liveEvents.map((ev) => (
            <div key={ev.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-200">{ev.title}</span>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{ev.message}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-500 shrink-0">{ev.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
