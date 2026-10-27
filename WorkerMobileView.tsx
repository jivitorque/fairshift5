import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { ShiftTracker } from './ShiftTracker';
import { TransparentPayslip } from './TransparentPayslip';
import { VoiceHazardReporter } from './VoiceHazardReporter';
import { SkillPassportView } from './SkillPassportView';
import {
  Clock,
  IndianRupee,
  AlertTriangle,
  Award,
  Sun,
  Wifi,
  Battery,
  MapPin,
} from 'lucide-react';

type WorkerTab = 'shift' | 'payslip' | 'safety' | 'passport';

export const WorkerMobileView: React.FC = () => {
  const {
    currentWorker,
    currentLanguage,
    outdoorMode,
    setOutdoorMode,
  } = useApp();

  const t = translations[currentLanguage];
  const [activeTab, setActiveTab] = useState<WorkerTab>('shift');

  return (
    <div className="w-full flex justify-center py-4 px-2 sm:px-4">
      {/* Mobile Device Mockup Frame */}
      <div
        className={`w-full max-w-md rounded-[36px] shadow-2xl border-4 transition-all duration-300 relative overflow-hidden flex flex-col min-h-[820px] ${
          outdoorMode
            ? 'bg-amber-50 border-amber-400 outdoor-contrast text-slate-950'
            : 'bg-slate-950 border-slate-700/80 text-slate-100'
        }`}
      >
        {/* Simulated Smartphone Notch & Status Bar */}
        <div className="pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-400 select-none border-b border-slate-800/40">
          <span>09:41 AM</span>
          <div className="w-24 h-4 bg-slate-900 rounded-full border border-slate-800/60 mx-auto"></div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Worker Header Card */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={currentWorker.avatar}
                  alt={currentWorker.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500/80 shadow"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                    currentWorker.status === 'active'
                      ? 'bg-emerald-500'
                      : currentWorker.status === 'on-break'
                      ? 'bg-amber-400'
                      : 'bg-slate-500'
                  }`}
                ></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-extrabold text-sm text-white tracking-tight">
                    {currentWorker.name}
                  </h2>
                </div>
                <p className="text-[11px] text-indigo-300 font-medium leading-tight">
                  {currentWorker.role}
                </p>
                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span className="truncate max-w-[190px]">
                    {currentWorker.currentZone}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Outdoor Sun Mode Toggle on Mobile */}
            <button
              onClick={() => setOutdoorMode((prev) => !prev)}
              className={`p-2 rounded-xl border text-xs transition-colors ${
                outdoorMode
                  ? 'bg-amber-400 text-slate-950 font-bold border-amber-500'
                  : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
              }`}
              title="Toggle Outdoor Sunlight Mode"
            >
              <Sun className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Scrollable Content Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'shift' && <ShiftTracker />}
          {activeTab === 'payslip' && <TransparentPayslip />}
          {activeTab === 'safety' && <VoiceHazardReporter />}
          {activeTab === 'passport' && <SkillPassportView />}
        </div>

        {/* Bottom Mobile Tab Bar (Large touch targets: min 52px for frontline workers) */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800/90 backdrop-blur-md px-2 py-1.5 grid grid-cols-4 gap-1 z-30">
          <button
            onClick={() => setActiveTab('shift')}
            className={`min-h-[52px] py-1.5 flex flex-col items-center justify-center rounded-xl transition-all ${
              activeTab === 'shift'
                ? 'text-amber-400 font-bold bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">{t.tabShift}</span>
          </button>

          <button
            onClick={() => setActiveTab('payslip')}
            className={`min-h-[52px] py-1.5 flex flex-col items-center justify-center rounded-xl transition-all ${
              activeTab === 'payslip'
                ? 'text-emerald-400 font-bold bg-emerald-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <IndianRupee className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">{t.tabPayslip}</span>
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`min-h-[52px] py-1.5 flex flex-col items-center justify-center rounded-xl transition-all ${
              activeTab === 'safety'
                ? 'text-red-400 font-bold bg-red-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">{t.tabSafety}</span>
          </button>

          <button
            onClick={() => setActiveTab('passport')}
            className={`min-h-[52px] py-1.5 flex flex-col items-center justify-center rounded-xl transition-all ${
              activeTab === 'passport'
                ? 'text-indigo-400 font-bold bg-indigo-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">{t.tabPassport}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
