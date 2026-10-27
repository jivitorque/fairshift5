import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../utils/translations';
import {
  Award,
  QrCode,
  ShieldCheck,
  Building2,
  Star,
} from 'lucide-react';

export const SkillPassportView: React.FC = () => {
  const { currentWorker, currentLanguage, outdoorMode } = useApp();
  const t = translations[currentLanguage];

  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const copyHash = (hash: string) => {
    navigator.clipboard?.writeText?.(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className={`space-y-4 pb-20 ${outdoorMode ? 'text-black' : 'text-slate-100'}`}>
      {/* Portable Holographic Digital ID Credential Card */}
      <div
        className={`p-5 rounded-3xl border shadow-2xl relative overflow-hidden ${
          outdoorMode
            ? 'bg-amber-100 border-amber-400 text-slate-900'
            : 'bg-gradient-to-br from-indigo-900 via-slate-900 to-amber-950/40 border-indigo-500/40'
        }`}
      >
        {/* Holographic Glare Overlay */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-gradient-to-tr from-amber-400/10 via-indigo-500/20 to-transparent blur-2xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentWorker.avatar}
              alt={currentWorker.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-lg text-white tracking-tight">
                  {currentWorker.name}
                </h3>
              </div>
              <p className="text-xs text-amber-300 font-semibold">{currentWorker.role}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: #FS-IN-{currentWorker.id.toUpperCase()}</p>
            </div>
          </div>
          <button
            onClick={() => setShowQrModal(true)}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-amber-300 transition-all shadow-md active:scale-95"
            title="Scan to Verify ID"
          >
            <QrCode className="w-5 h-5" />
          </button>
        </div>

        {/* High-Impact Credential Metrics */}
        <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              {t.experienceHours}
            </span>
            <div className="text-xl font-black text-amber-400 mt-0.5">
              {currentWorker.cumulativeExperienceHours.toLocaleString('en-IN')}{' '}
              <span className="text-xs font-normal text-slate-300">hrs</span>
            </div>
            <p className="text-[10px] text-emerald-400 mt-0.5">Portable Across Employers</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              {t.safetyScore}
            </span>
            <div className="text-xl font-black text-emerald-400 mt-0.5 flex items-center gap-1">
              <span>{currentWorker.safetyRating}</span>
              <span className="text-xs font-normal text-slate-400">/ 5.0</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 ml-1" />
            </div>
            <p className="text-[10px] text-indigo-300 mt-0.5">Zero Major Incidents</p>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1.5 text-indigo-300 hover:text-white font-semibold transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically Verified</span>
          </button>
          <span className="text-[10px] text-slate-400 font-mono">
            Active Since {currentWorker.joinDate}
          </span>
        </div>
      </div>

      {/* Verified Skill Badges List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            {t.verifiedBadges} ({currentWorker.skillBadges.length})
          </h4>
          <span className="text-[11px] text-indigo-400 font-medium">Verifiable on Blockchain/Ledger</span>
        </div>

        <div className="space-y-2.5">
          {currentWorker.skillBadges.map((badge) => (
            <div
              key={badge.id}
              className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all shadow-md space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-100">{badge.title}</h5>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-slate-500" />
                      {badge.issuer}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                  {badge.level}
                </span>
              </div>

              {/* Skills Acquired Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {badge.skillsAcquired.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                <span>Issued: {badge.issuedDate}</span>
                <span className="text-amber-400/80 font-mono truncate max-w-[140px]">
                  {badge.verificationHash}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Verification Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">Portable Credential Verification</h3>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Simulated Scannable QR Graphic */}
            <div className="p-4 bg-white rounded-2xl mx-auto w-52 h-52 flex flex-col items-center justify-center shadow-lg relative">
              {/* QR Pattern visual */}
              <div className="w-full h-full border-4 border-slate-950 p-2 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-10 h-10 bg-slate-950 p-1"><div className="w-full h-full bg-white p-1"><div className="w-full h-full bg-slate-950"></div></div></div>
                  <div className="w-10 h-10 bg-slate-950 p-1"><div className="w-full h-full bg-white p-1"><div className="w-full h-full bg-slate-950"></div></div></div>
                </div>
                {/* Center logo */}
                <div className="flex items-center justify-center my-auto">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                    FS
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-10 h-10 bg-slate-950 p-1"><div className="w-full h-full bg-white p-1"><div className="w-full h-full bg-slate-950"></div></div></div>
                  <div className="grid grid-cols-2 gap-1 w-10 h-10">
                    <div className="bg-slate-950"></div>
                    <div className="bg-slate-950"></div>
                    <div className="bg-slate-950"></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="font-bold text-sm text-slate-100">{currentWorker.name}</p>
              <p className="text-xs text-slate-400">{currentWorker.role}</p>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                {currentWorker.cumulativeExperienceHours} Hours Verified
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 break-all">
              {currentWorker.skillBadges[0]?.verificationHash}
            </div>

            <button
              onClick={() => copyHash(currentWorker.skillBadges[0]?.verificationHash || '0x99281a')}
              className="w-full py-2.5 rounded-xl bg-indigo-600 font-bold text-xs text-white hover:bg-indigo-500 transition-colors"
            >
              {copiedHash ? '✓ Hash Copied to Clipboard' : 'Copy Verification Hash'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
