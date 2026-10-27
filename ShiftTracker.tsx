import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import {
  MapPin,
  Clock,
  Play,
  Square,
  Coffee,
  AlertTriangle,
  IndianRupee,
  ShieldCheck,
} from 'lucide-react';
import { industryConfigs } from '../../data/seedData';

export const ShiftTracker: React.FC = () => {
  const {
    currentWorker,
    currentLanguage,
    currentIndustry,
    punchIn,
    punchOut,
    toggleBreak,
    outdoorMode,
  } = useApp();

  const t = translations[currentLanguage];
  const indConfig = industryConfigs[currentIndustry];
  const [selectedZone, setSelectedZone] = useState<string>(
    currentWorker.currentZone || indConfig.zones[0]
  );

  const currentShift = currentWorker.currentShift;
  const isShiftActive = currentWorker.status === 'active' && !!currentShift;
  const baseMinutes = currentShift ? currentShift.durationMinutes : 0;
  const [elapsedSecs, setElapsedSecs] = useState(0);

  useEffect(() => {
    if (!isShiftActive) {
      return;
    }
    const timer = setInterval(() => {
      setElapsedSecs((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isShiftActive, currentShift?.id]);

  const totalSeconds = isShiftActive ? baseMinutes * 60 + elapsedSecs : 0;

  const formatStopwatch = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const regularHoursWorked = Math.min(8, Number((totalSeconds / 3600).toFixed(2)));
  const overtimeHoursWorked = Math.max(0, Number(((totalSeconds - 8 * 3600) / 3600).toFixed(2)));

  // Accrued daily pay: regular + 1.5x OT
  const regularPayEarned = regularHoursWorked * currentWorker.hourlyRate;
  const overtimePayEarned = overtimeHoursWorked * (currentWorker.hourlyRate * 1.5);
  const totalAccruedToday = Math.round(regularPayEarned + overtimePayEarned);

  const isActive = currentWorker.status === 'active';
  const isOnBreak = currentWorker.status === 'on-break';
  const isMandatoryRest = currentWorker.status === 'mandatory-rest';

  return (
    <div className={`space-y-4 pb-20 ${outdoorMode ? 'text-black' : 'text-slate-100'}`}>
      {/* Mandatory Rest Alert Banner if employer rebalanced shift */}
      {isMandatoryRest && (
        <div className="p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-500 text-amber-200 shadow-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm text-amber-300">{t.mandatoryRest}</h3>
              <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                Your employer flagged high fatigue risk and granted a 16-hour paid recovery rest window. You do not need to punch in until tomorrow morning.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Geofence & GPS Radar Status Card */}
      <div
        className={`p-4 rounded-2xl border shadow-lg transition-all ${
          outdoorMode
            ? 'bg-amber-100 border-amber-400 text-slate-900'
            : 'bg-slate-800/90 border-slate-700/80 text-slate-100'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500"></span>
              <span className="absolute w-6 h-6 rounded-full bg-emerald-500/40 animate-ping"></span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {t.geofenceVerified}
            </span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono">
            {currentWorker.currentShift?.gpsAccuracy || '±2.4m High Precision'}
          </span>
        </div>

        {/* Work Zone Selector */}
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex-1">
            <label className="text-[10px] text-slate-400 uppercase font-semibold block">
              {t.zone}
            </label>
            {isActive ? (
              <p className="text-xs font-bold text-slate-100">{currentWorker.currentZone}</p>
            ) : (
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer mt-0.5"
              >
                {indConfig.zones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Primary Shift Stopwatch & Status Banner */}
      <div
        className={`p-5 rounded-2xl border text-center shadow-xl relative overflow-hidden ${
          outdoorMode
            ? 'bg-white border-slate-400 text-slate-950'
            : 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 text-white'
        }`}
      >
        {/* Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3">
          {isActive ? (
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {t.onDuty}
            </span>
          ) : isOnBreak ? (
            <span className="flex items-center gap-1.5 text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
              <Coffee className="w-3.5 h-3.5" />
              {t.onBreak}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-slate-400 bg-slate-700/50 border border-slate-600 px-3 py-1 rounded-full">
              {t.offDuty}
            </span>
          )}
        </div>

        {/* Big Live Digital Stopwatch */}
        <div className="font-mono font-black text-4xl sm:text-5xl tracking-tight text-slate-100 my-2">
          {isActive || isOnBreak ? formatStopwatch(totalSeconds) : '00:00:00'}
        </div>
        <p className="text-xs text-slate-400 font-medium">{t.shiftTimer}</p>

        {/* Real-time Earnings Accrual Ticker */}
        <div className="mt-4 pt-4 border-t border-slate-700/80 flex items-center justify-around text-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {t.dailyEarnings}
            </span>
            <div className="text-lg font-bold text-emerald-400 flex items-center justify-center gap-0.5">
              <IndianRupee className="w-4 h-4" />
              <span>{isActive || isOnBreak ? totalAccruedToday.toLocaleString('en-IN') : '0'}</span>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-700"></div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {t.regularHours}
            </span>
            <span className="text-sm font-semibold text-slate-200">
              {regularHoursWorked}h / 8h
            </span>
          </div>
          <div className="w-px h-8 bg-slate-700"></div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {t.overtimeHours}
            </span>
            <span className={`text-sm font-semibold ${overtimeHoursWorked > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
              {overtimeHoursWorked}h
            </span>
          </div>
        </div>
      </div>

      {/* Main Big Punch Button (Min 56px touch target for frontline accessibility) */}
      <div className="space-y-3">
        {!isActive && !isOnBreak ? (
          <button
            onClick={() => punchIn(currentWorker.id, selectedZone)}
            disabled={isMandatoryRest}
            className={`w-full min-h-[56px] py-4 px-6 rounded-2xl font-black text-lg tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-xl transform active:scale-95 ${
              isMandatoryRest
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25 border-2 border-emerald-400'
            }`}
          >
            <Play className="w-6 h-6 fill-current" />
            <span>{t.punchIn}</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => toggleBreak(currentWorker.id)}
              className={`min-h-[54px] py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border transition-all ${
                isOnBreak
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/40'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>{isOnBreak ? t.resumeShift : t.takeBreak}</span>
            </button>
            <button
              onClick={() => punchOut(currentWorker.id)}
              className="min-h-[54px] py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white border border-rose-500 shadow-md shadow-rose-900/40 active:scale-95 transition-all"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>{t.punchOut}</span>
            </button>
          </div>
        )}
      </div>

      {/* Worker Safety & Transparency Trust Card */}
      <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Statutory 1.5x Overtime Rate Protected</span>
        </div>
        <span className="font-bold text-slate-100">₹{(currentWorker.hourlyRate * 1.5).toFixed(2)}/hr</span>
      </div>

      {/* Shift Summary Breakdown Card */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-2.5">
        <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          Weekly Fatigue Guard Meter
        </h4>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Total Hours This Week:</span>
            <span className={`font-bold ${currentWorker.weeklyHours > 50 ? 'text-red-400' : 'text-slate-200'}`}>
              {currentWorker.weeklyHours}h / 48h Safe Limit
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                currentWorker.weeklyHours > 50
                  ? 'bg-red-500'
                  : currentWorker.weeklyHours > 44
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, (currentWorker.weeklyHours / 55) * 100)}%` }}
            ></div>
          </div>
          {currentWorker.fatigueRisk === 'HIGH' && (
            <p className="text-[11px] text-red-300 flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
              Approaching burnout limit. Employer fatigue alert active.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
