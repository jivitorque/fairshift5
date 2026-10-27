import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import {
  Volume2,
  VolumeX,
  IndianRupee,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export const TransparentPayslip: React.FC = () => {
  const {
    currentWorker,
    currentLanguage,
    speakPayslip,
    stopSpeaking,
    isSpeaking,
    speakingText,
    raiseWageDispute,
    outdoorMode,
  } = useApp();

  const t = translations[currentLanguage];
  const { payslip } = currentWorker;

  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeHours, setDisputeHours] = useState(4);
  const [disputeReason, setDisputeReason] = useState('Unrecorded night overtime hours on concrete pour / campus event.');
  const [disputeSuccessTicket, setDisputeSuccessTicket] = useState<string | null>(null);

  const handleRaiseDispute = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket = raiseWageDispute(currentWorker.id, disputeHours, disputeReason);
    setDisputeSuccessTicket(ticket.token);
  };

  // Math breakdown items
  const earningsPercentage = Math.round((payslip.netPay / payslip.grossPay) * 100);
  const deductionsPercentage = 100 - earningsPercentage;

  return (
    <div className={`space-y-4 pb-20 ${outdoorMode ? 'text-black' : 'text-slate-100'}`}>
      {/* Header & Pay Period */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base text-slate-100">{t.payslipTitle}</h3>
          <p className="text-xs text-slate-400">Pay Period: {payslip.payPeriod}</p>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {t.paymentVerified}
        </span>
      </div>

      {/* Main Net Pay Hero Card */}
      <div
        className={`p-5 rounded-2xl border shadow-xl relative overflow-hidden ${
          outdoorMode
            ? 'bg-amber-100 border-amber-400 text-slate-950'
            : 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border-indigo-500/30'
        }`}
      >
        <span className="text-xs uppercase font-bold tracking-wider text-indigo-300 block">
          {t.netPayable}
        </span>
        <div className="flex items-baseline gap-1 my-2">
          <IndianRupee className="w-8 h-8 text-emerald-400" />
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            {payslip.netPay.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-400 ml-2 font-medium">Direct Bank Transfer</span>
        </div>

        {/* Voice-First Read Aloud Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
              } else {
                speakPayslip();
              }
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 ${
              isSpeaking
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? t.stopAudio : t.listenPayslip}</span>
          </button>

          {isSpeaking && (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-5 bg-indigo-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-8 bg-indigo-300 rounded-full animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-1.5 h-4 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
              <span className="w-1.5 h-7 bg-indigo-200 rounded-full animate-bounce [animation-delay:0.1s]"></span>
            </div>
          )}
        </div>

        {/* Live Speaking Text Subtitle */}
        {isSpeaking && speakingText && (
          <div className="mt-3 p-2.5 rounded-lg bg-slate-950/80 border border-indigo-500/40 text-[11px] text-slate-200 leading-relaxed italic">
            "{speakingText}"
          </div>
        )}
      </div>

      {/* Visual Mathematical Formula Card */}
      <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-3 shadow-md">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          The Transparent Math (Statutory Guaranteed)
        </h4>

        {/* Visual Formula Pill */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5">
          <div className="flex justify-between items-center text-emerald-400 font-semibold">
            <span>Base Pay ({payslip.regularHours}h × ₹{payslip.regularRate}/h)</span>
            <span>+ ₹{payslip.baseEarnings.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-amber-400 font-semibold">
            <span>Overtime Pay ({payslip.overtimeHours}h × 1.5x Premium)</span>
            <span>+ ₹{payslip.overtimeEarnings.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-rose-400 font-semibold border-t border-slate-800 pt-1">
            <span>Statutory Deductions (PF + ESI + Canteen)</span>
            <span>- ₹{payslip.totalDeductions.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-white font-bold border-t border-slate-700 pt-1 text-xs">
            <span>= Net Take-Home Wage</span>
            <span>₹{payslip.netPay.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Ratio Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Take-Home: {earningsPercentage}%</span>
            <span>Statutory Welfare & Meals: {deductionsPercentage}%</span>
          </div>
          <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: `${earningsPercentage}%` }}></div>
            <div className="bg-rose-500 h-full" style={{ width: `${deductionsPercentage}%` }}></div>
          </div>
        </div>
      </div>

      {/* Itemized Deductions & Allowances Table */}
      <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-2.5 text-xs">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">
          Itemized Earnings & Statutory Breakdown
        </h4>
        <div className="divide-y divide-slate-700/60">
          {payslip.items.map((item, idx) => (
            <div key={idx} className="py-2 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-200">{item.label}</p>
                {item.calculation && (
                  <p className="text-[10px] text-slate-400 font-mono">{item.calculation}</p>
                )}
              </div>
              <span
                className={`font-mono font-bold ${
                  item.type === 'earning' ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {item.type === 'earning' ? '+' : '-'} ₹{item.amount.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Raise Wage Dispute Button */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
        <p className="text-xs text-slate-300 font-medium">{t.disputeSubtitle}</p>
        <button
          onClick={() => {
            setDisputeSuccessTicket(null);
            setIsDisputeModalOpen(true);
          }}
          className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>{t.disputeWage}</span>
        </button>
      </div>

      {/* Raise Wage Dispute Modal */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-100">{t.disputeWage}</h3>
              </div>
              <button
                onClick={() => setIsDisputeModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {disputeSuccessTicket ? (
              <div className="space-y-3 text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-base text-slate-100">Dispute Ticket Created!</h4>
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 font-mono text-lg font-extrabold text-amber-300">
                  {disputeSuccessTicket}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your wage discrepancy has been logged under Zero-Knowledge anonymity. Site Payroll Coordinator has been notified for RFID reconciliation.
                </p>
                <button
                  onClick={() => setIsDisputeModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 font-bold text-xs text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRaiseDispute} className="space-y-3.5">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Flag an unpaid overtime discrepancy or unjustified statutory deduction. Under SDG 8.5, frontline workers have full protection against retaliation.
                </p>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
                    Disputed Overtime Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={disputeHours}
                    onChange={(e) => setDisputeHours(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
                    Explanation / Shift Date
                  </label>
                  <textarea
                    rows={3}
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDisputeModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                  >
                    Submit Dispute
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
