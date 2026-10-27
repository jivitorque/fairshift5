import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertOctagon,
  Lock,
  Play,
  Square,
} from 'lucide-react';
import type { GrievanceTicket, TicketSeverity, TicketStatus } from '../../types';

export const GrievanceManagementQueue: React.FC = () => {
  const { tickets, updateTicketStatus } = useApp();

  const [severityFilter, setSeverityFilter] = useState<'ALL' | TicketSeverity>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TicketStatus>('ALL');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Resolution note state
  const [activeTicketForNote, setActiveTicketForNote] = useState<GrievanceTicket | null>(null);
  const [resolutionNoteText, setResolutionNoteText] = useState('');
  const [assignedOfficerText, setAssignedOfficerText] = useState('Safety Lead S. Rathore');

  const filteredTickets = tickets.filter((t) => {
    const matchesSeverity = severityFilter === 'ALL' || t.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSeverity && matchesStatus;
  });

  const criticalCount = tickets.filter((t) => t.severity === 'CRITICAL' && t.status !== 'resolved').length;

  const handleOpenResolutionModal = (ticket: GrievanceTicket) => {
    setActiveTicketForNote(ticket);
    setResolutionNoteText(ticket.resolutionNote || '');
    setAssignedOfficerText(ticket.assignedOfficer || 'Safety Inspector');
  };

  const handleSaveResolution = (status: TicketStatus) => {
    if (!activeTicketForNote) return;
    updateTicketStatus(
      activeTicketForNote.id,
      status,
      resolutionNoteText,
      assignedOfficerText
    );
    setActiveTicketForNote(null);
  };

  const toggleAudio = (ticketId: string) => {
    if (playingAudioId === ticketId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(ticketId);
      setTimeout(() => {
        setPlayingAudioId(null);
      }, 7000);
    }
  };

  return (
    <div className="space-y-5">
      {/* Critical Safety Notice Banner */}
      {criticalCount > 0 && (
        <div className="p-4 rounded-2xl bg-red-950/40 border-2 border-red-500/60 text-red-200 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-6 h-6 text-red-400 shrink-0 animate-bounce" />
            <div>
              <h4 className="font-extrabold text-sm text-red-300">
                {criticalCount} Critical Safety Hazard(s) Requiring Immediate Ground Triage
              </h4>
              <p className="text-xs text-red-200/80 mt-0.5">
                Frontline hazard reports trigger immediate priority dispatch. Worker identity is shielded by Zero-Knowledge hashing.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 font-bold text-xs uppercase tracking-wider border border-red-500/40 whitespace-nowrap">
            Priority Queue
          </span>
        </div>
      )}

      {/* Filter and Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-300">
            Zero-Knowledge Queue: Whistleblower PII Stripped
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">🔴 Critical Only</option>
            <option value="HIGH">🟠 High</option>
            <option value="MEDIUM">🟡 Medium</option>
            <option value="LOW">🟢 Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="submitted">Submitted (New)</option>
            <option value="under_review">Under Review</option>
            <option value="action_taken">Action Taken</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Ticket Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTickets.map((ticket) => {
          const isCritical = ticket.severity === 'CRITICAL';
          const isPlayingThis = playingAudioId === ticket.id;

          return (
            <div
              key={ticket.id}
              className={`p-5 rounded-2xl border transition-all duration-200 shadow-xl space-y-3.5 ${
                isCritical
                  ? 'bg-slate-900/90 border-red-500/40 hover:border-red-500'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header: Token, Severity, Type, Timestamp */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-black text-amber-300">
                    {ticket.token}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      ticket.severity === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : ticket.severity === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}
                  >
                    {ticket.severity}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    {ticket.type === 'hazard'
                      ? '🚨 Hazard'
                      : ticket.type === 'wage_dispute'
                      ? '💵 Wage Dispute'
                      : '💬 Feedback'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{ticket.timestamp}</span>
              </div>

              {/* Category & Work Zone */}
              <div>
                <h4 className="font-extrabold text-sm text-slate-100">{ticket.category}</h4>
                <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                  📍 {ticket.zone}
                </p>
              </div>

              {/* Transcript */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
                "{ticket.transcript}"
              </div>

              {/* Voice Note Audio Playback Bar */}
              {ticket.hasVoiceAudio && (
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3">
                  <button
                    onClick={() => toggleAudio(ticket.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isPlayingThis
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {isPlayingThis ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlayingThis ? 'Playing Voice Recording...' : `Play Audio Note (${ticket.audioDurationSeconds || 14}s)`}</span>
                  </button>

                  {/* Simulated Waveform while playing */}
                  {isPlayingThis ? (
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-3 bg-amber-400 animate-bounce"></span>
                      <span className="w-1 h-6 bg-amber-300 animate-bounce [animation-delay:0.1s]"></span>
                      <span className="w-1 h-4 bg-amber-400 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1 h-7 bg-amber-200 animate-bounce [animation-delay:0.15s]"></span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">Simulated Web Speech</span>
                  )}
                </div>
              )}

              {/* Resolution Note if available */}
              {ticket.resolutionNote && (
                <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-indigo-300 block">
                    Resolution Status: {ticket.assignedOfficer}
                  </span>
                  <p className="text-[11px] leading-relaxed">{ticket.resolutionNote}</p>
                </div>
              )}

              {/* Pizza Tracker Mini Indicator */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      ticket.status === 'resolved'
                        ? 'bg-emerald-400'
                        : ticket.status === 'action_taken'
                        ? 'bg-amber-400'
                        : ticket.status === 'under_review'
                        ? 'bg-blue-400'
                        : 'bg-slate-400'
                    }`}
                  ></span>
                  <span className="font-bold text-slate-300 uppercase">
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenResolutionModal(ticket)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
                  >
                    Update & Resolve
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Update Resolution Modal */}
      {activeTicketForNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-white">
                  Triage & Resolve Ticket {activeTicketForNote.token}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Updates propagate immediately to the worker's pizza tracker.
                </p>
              </div>
              <button
                onClick={() => setActiveTicketForNote(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">
                  Assigned Safety Officer / Dept Lead
                </label>
                <input
                  type="text"
                  value={assignedOfficerText}
                  onChange={(e) => setAssignedOfficerText(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">
                  Corrective Action & Resolution Notes
                </label>
                <textarea
                  rows={4}
                  value={resolutionNoteText}
                  onChange={(e) => setResolutionNoteText(e.target.value)}
                  placeholder="Describe inspection results, replacement parts dispatched, or shift adjustments made..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                ></textarea>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveResolution('under_review')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Mark Under Review
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveResolution('action_taken')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Dispatch Action
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveResolution('resolved')}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  Resolve & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
