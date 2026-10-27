import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import { industryConfigs } from '../../data/seedData';
import {
  Mic,
  MicOff,
  AlertTriangle,
  MessageSquare,
  CheckCircle2,
  Send,
  Lock,
  Search,
  FileCheck,
} from 'lucide-react';
import type { GrievanceTicket, TicketSeverity, TicketStatus, TicketType } from '../../types';

export const VoiceHazardReporter: React.FC = () => {
  const {
    currentIndustry,
    currentLanguage,
    currentWorker,
    submitGrievance,
    tickets,
    outdoorMode,
  } = useApp();

  const t = translations[currentLanguage];
  const indConfig = industryConfigs[currentIndustry];

  const [activeTab, setActiveTab] = useState<'report' | 'track'>('report');
  const [reportType, setReportType] = useState<TicketType>('hazard');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    indConfig.hazardCategories[0]?.label || 'Unsafe Scaffolding'
  );
  const [selectedSeverity, setSelectedSeverity] = useState<TicketSeverity>('CRITICAL');
  const [selectedZone, setSelectedZone] = useState<string>(
    currentWorker.currentZone || indConfig.zones[0]
  );
  const [transcript, setTranscript] = useState<string>('');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<any>(null);

  // Submitted ticket receipt modal
  const [submittedTicket, setSubmittedTicket] = useState<GrievanceTicket | null>(null);

  // Track ticket state
  const [lookupToken, setLookupToken] = useState<string>('');
  const [trackedTicket, setTrackedTicket] = useState<GrievanceTicket | null>(null);

  const handleSelectReportType = (type: TicketType) => {
    setReportType(type);
    if (type === 'hazard') {
      setSelectedCategory(indConfig.hazardCategories[0]?.label || '');
    } else {
      setSelectedCategory(indConfig.feedbackCategories[0]?.label || '');
    }
  };

  // Voice recording simulation & Web Speech Recognition fallback
  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setTranscript('');

    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    // Provide natural starter transcript for demo
    setTimeout(() => {
      if (currentIndustry === 'construction') {
        setTranscript(
          reportType === 'hazard'
            ? 'Safety clamps loose on 5th floor scaffolding tower. Immediate vibration risk during concrete pump run.'
            : 'Water refill cooler at Zone A excavation has been dry since 11 AM.'
        );
      } else {
        setTranscript(
          reportType === 'hazard'
            ? 'Chemistry Lab 3 acid exhaust fan stopped. Strong solvent odor in corridor.'
            : 'Groundkeeping protective puncture-proof gloves out of stock in central hostel store.'
        );
      }
    }, 2500);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) {
      setTranscript('Hazard noticed near work platform requiring urgent inspection.');
    }

    const finalTranscript = transcript.trim() || 'Hazard noticed near work platform requiring urgent inspection.';
    const ticket = submitGrievance(
      reportType,
      selectedCategory,
      selectedZone,
      selectedSeverity,
      finalTranscript,
      true
    );

    setSubmittedTicket(ticket);
    setTrackedTicket(ticket);
    setTranscript('');
    setIsRecording(false);
  };

  // Lookup existing ticket
  const handleLookup = () => {
    const found = tickets.find(
      (t) => t.token.toLowerCase() === lookupToken.trim().toLowerCase()
    );
    setTrackedTicket(found || null);
  };

  const renderStatusTracker = (ticket: GrievanceTicket) => {
    const steps: { key: TicketStatus; label: string; desc: string }[] = [
      { key: 'submitted', label: t.statusSubmitted, desc: 'Identity stripped via ZK-token' },
      { key: 'under_review', label: t.statusReview, desc: ticket.assignedOfficer || 'Safety Lead Reviewing' },
      { key: 'action_taken', label: t.statusAction, desc: 'Correction crew deployed' },
      { key: 'resolved', label: t.statusResolved, desc: ticket.resolvedAt ? `Closed at ${ticket.resolvedAt}` : 'Signed off' },
    ];

    const currentIdx = steps.findIndex((s) => s.key === ticket.status);

    return (
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-extrabold text-amber-300">{ticket.token}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                ticket.severity === 'CRITICAL'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {ticket.severity}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">{ticket.timestamp}</span>
        </div>

        {/* Visual Pizza Tracker Bar */}
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-1 relative">
            {steps.map((step, idx) => {
              const isPastOrCurrent = idx <= currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div key={step.key} className="flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/20'
                        : isPastOrCurrent
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-semibold line-clamp-1 ${
                      isPastOrCurrent ? 'text-slate-200' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Current Status Box */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-1">
            <p className="font-bold text-slate-200">
              {steps[currentIdx]?.label || ticket.status}
            </p>
            <p className="text-[11px] text-slate-300">
              {ticket.resolutionNote || steps[currentIdx]?.desc || 'Awaiting response.'}
            </p>
            <p className="text-[10px] font-mono text-slate-400 pt-1">
              Protected ZK-Hash: {ticket.anonymousHash.substring(0, 18)}...
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-4 pb-20 ${outdoorMode ? 'text-black' : 'text-slate-100'}`}>
      {/* Sub Tabs: Report vs Track Existing */}
      <div className="flex rounded-xl bg-slate-800/90 border border-slate-700 p-1">
        <button
          onClick={() => setActiveTab('report')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'report'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.reportHazard}
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'track'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.checkStatus}
        </button>
      </div>

      {activeTab === 'track' ? (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 space-y-3">
            <label className="text-xs font-bold text-slate-300 block">{t.enterReceiptCode}</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="#FS-8942"
                value={lookupToken}
                onChange={(e) => setLookupToken(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
              />
              <button
                onClick={handleLookup}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {trackedTicket ? (
            renderStatusTracker(trackedTicket)
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 space-y-2">
              <FileCheck className="w-8 h-8 mx-auto text-slate-500" />
              <p className="text-xs">
                Enter your anonymous receipt token (e.g. <span className="font-mono text-amber-400">#FS-8942</span>) to view real-time resolution status.
              </p>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Zero-Knowledge Identity Protection Trust Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-bold text-emerald-300 block mb-0.5">
                {t.zeroKnowledgeProtected}
              </span>
              {t.zeroKnowledgeDesc}
            </div>
          </div>

          {/* Toggle Type: Safety Hazard vs Feedback */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSelectReportType('hazard')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                reportType === 'hazard'
                  ? 'bg-red-500/20 border-red-500 text-red-300 shadow-md'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>{t.reportHazard}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectReportType('feedback')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                reportType === 'feedback'
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-md'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>{t.anonymousFeedback}</span>
            </button>
          </div>

          {/* Big Voice Note Recorder Hero */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 text-center shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">{t.recordVoice}</span>
              {isRecording && (
                <span className="flex items-center gap-1.5 text-red-400 font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  00:{recordingSeconds.toString().padStart(2, '0')}
                </span>
              )}
            </div>

            {/* Audio Waveform Bars Simulation */}
            <div className="h-12 flex items-center justify-center gap-1.5 my-2">
              {[8, 22, 14, 30, 42, 28, 16, 36, 44, 20, 10, 26, 38, 18].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    isRecording
                      ? 'bg-amber-400 wave-bar'
                      : 'bg-slate-700 h-2'
                  }`}
                  style={{
                    height: isRecording ? `${Math.max(6, (h * (i % 2 === 0 ? 1.2 : 0.8)))}px` : '6px',
                    animationDelay: `${i * 0.08}s`,
                  }}
                ></div>
              ))}
            </div>

            {/* Hold/Tap Record Button */}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-95 ${
                isRecording
                  ? 'bg-red-500 text-white ring-8 ring-red-500/25 animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
            <p className="text-[11px] text-slate-400 font-medium">
              {isRecording ? t.listening : 'Tap to speak your report in Hindi, Tamil or English'}
            </p>

            {/* Speech-to-Text Transcription Box */}
            <div className="text-left mt-2">
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                Audio Transcription (Simulated Speech Recognition)
              </label>
              <textarea
                rows={3}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Tap mic to speak, or type details here..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-slate-600"
              ></textarea>
            </div>
          </div>

          {/* Category Quick Chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">{t.selectCategory}</label>
            <div className="grid grid-cols-2 gap-2">
              {(reportType === 'hazard'
                ? indConfig.hazardCategories
                : indConfig.feedbackCategories
              ).map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all truncate ${
                    selectedCategory === cat.label
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Severity & Zone row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                {t.selectSeverity}
              </label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value as TicketSeverity)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="CRITICAL">Critical (Stop Work Hazard)</option>
                <option value="HIGH">High (Urgent Attention)</option>
                <option value="MEDIUM">Medium (General Hazard)</option>
                <option value="LOW">Low (Minor Advisory)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                {t.zone}
              </label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
              >
                {indConfig.zones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full min-h-[52px] py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>{t.submitTicket}</span>
          </button>
        </form>
      )}

      {/* Ticket Generated Receipt Modal */}
      {submittedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl text-slate-100 space-y-4">
            <div className="text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-extrabold text-lg text-white">Report Safely Submitted!</h3>
              <p className="text-xs text-slate-300">
                Your PII was removed. Save your tracking token below to check progress:
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 text-center font-mono">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
                {t.ticketReceipt}
              </span>
              <span className="text-2xl font-black text-amber-300 tracking-wider">
                {submittedTicket.token}
              </span>
            </div>

            {renderStatusTracker(submittedTicket)}

            <button
              onClick={() => {
                setSubmittedTicket(null);
                setActiveTab('track');
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 font-bold text-xs text-white shadow-md"
            >
              View on Pizza Tracker
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
