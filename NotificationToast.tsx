import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { liveEvents, dismissEvent } = useApp();

  if (liveEvents.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {liveEvents.slice(0, 3).map((event) => {
        let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;
        let borderClass = 'border-blue-500/30 bg-slate-900/95';

        if (event.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
          borderClass = 'border-emerald-500/40 bg-slate-900/95';
        } else if (event.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
          borderClass = 'border-amber-500/40 bg-slate-900/95';
        } else if (event.type === 'critical') {
          icon = <AlertOctagon className="w-5 h-5 text-red-400 shrink-0" />;
          borderClass = 'border-red-500/50 bg-slate-900/95 animate-pulse';
        }

        return (
          <div
            key={event.id}
            className={`pointer-events-auto flex items-start gap-3 p-3 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 text-slate-100 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-semibold text-slate-200 truncate">{event.title}</p>
                <span className="text-[10px] text-slate-400">{event.timestamp}</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">{event.message}</p>
            </div>
            <button
              onClick={() => dismissEvent(event.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors shrink-0"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
