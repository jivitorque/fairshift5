import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  HardHat,
  GraduationCap,
  Smartphone,
  LayoutDashboard,
  Columns,
  BookOpen,
  Sun,
  RotateCcw,
  Radio,
} from 'lucide-react';
import type { Language } from '../../types';

export const TopControlBar: React.FC = () => {
  const {
    currentIndustry,
    setIndustry,
    currentRole,
    setRole,
    currentLanguage,
    setLanguage,
    outdoorMode,
    setOutdoorMode,
    workers,
    selectedWorkerId,
    setSelectedWorkerId,
    resetAllData,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md text-white px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & SDG Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 font-black text-white text-lg">
              FS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  FairShift
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live Sync
                  </span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                UN SDG 8 Decent Work Platform
              </p>
            </div>
          </div>

          {/* Reactive Sync Live Pulse */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-medium text-emerald-300">Real-Time State Bus</span>
          </div>
        </div>

        {/* Industry Switcher & Role Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Industry Preset Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-800/90 border border-slate-700">
            <button
              onClick={() => setIndustry('construction')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentIndustry === 'construction'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Construction</span>
            </button>
            <button
              onClick={() => setIndustry('college')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentIndustry === 'college'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>College Campus</span>
            </button>
          </div>

          {/* Role Switcher Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-800/90 border border-slate-700">
            <button
              onClick={() => setRole('worker')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentRole === 'worker'
                  ? 'bg-indigo-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Worker Mobile</span>
              <span className="md:hidden">Worker</span>
            </button>
            <button
              onClick={() => setRole('employer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentRole === 'employer'
                  ? 'bg-indigo-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Employer SaaS</span>
              <span className="md:hidden">Employer</span>
            </button>
            <button
              onClick={() => setRole('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentRole === 'split'
                  ? 'bg-indigo-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              title="View Worker and Employer side-by-side to watch live syncing"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Side-by-Side</span>
            </button>
            <button
              onClick={() => setRole('pitch')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                currentRole === 'pitch'
                  ? 'bg-emerald-600 text-white shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">SDG 8 & Pitch</span>
              <span className="md:hidden">Pitch</span>
            </button>
          </div>
        </div>

        {/* Worker Selector, Language, Outdoor mode & Reset */}
        <div className="flex items-center gap-2">
          {/* Worker Persona Dropdown */}
          <div className="relative">
            <select
              value={selectedWorkerId}
              onChange={(e) => setSelectedWorkerId(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none pr-7 cursor-pointer max-w-[140px] sm:max-w-[180px] truncate"
              title="Switch active frontline worker persona"
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.role.split(' ')[0]}) {w.status === 'active' ? '🟢' : '⚪'}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center rounded-lg bg-slate-800 border border-slate-700 p-0.5 text-xs">
            {(['en', 'hi', 'ta'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  currentLanguage === lang
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी (Hindi)' : 'தமிழ் (Tamil)'}
              >
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिं' : 'தமி'}
              </button>
            ))}
          </div>

          {/* Sunlight Outdoor High Contrast Mode */}
          <button
            onClick={() => setOutdoorMode((prev) => !prev)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              outdoorMode
                ? 'bg-amber-400 border-amber-300 text-slate-950 font-bold'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="High contrast mode for direct sunlight reading on construction sites / fields"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">{outdoorMode ? 'Outdoor ON' : 'Sunlight'}</span>
          </button>

          {/* Quick Demo Reset */}
          <button
            onClick={resetAllData}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
            title="Reset to default seed state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
