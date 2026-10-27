import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, Sparkles, X } from 'lucide-react';

interface IssueBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IssueBadgeModal: React.FC<IssueBadgeModalProps> = ({ isOpen, onClose }) => {
  const { workers, issueBadge, currentIndustry } = useApp();

  const [selectedWorkerId, setSelectedWorkerId] = useState(workers[0]?.id || '');
  const [title, setTitle] = useState(
    currentIndustry === 'construction'
      ? 'Structural Fall Arrest & Anchor Point Specialist'
      : 'Campus Bio-Waste Autoclave & Spill Responder'
  );
  const [issuer, setIssuer] = useState(
    currentIndustry === 'construction'
      ? 'National Skill Development Corporation (NSDC)'
      : "St. Xavier's Safety & Health Cell"
  );
  const [category, setCategory] = useState(
    currentIndustry === 'construction' ? 'Height Safety' : 'Lab Hygiene'
  );
  const [level, setLevel] = useState('Advanced');
  const [skillsText, setSkillsText] = useState(
    'Anchor Pull Testing, Double Lanyard Rigging, Emergency Descent'
  );
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsAcquired = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    issueBadge(selectedWorkerId, {
      title,
      issuer,
      category,
      level,
      skillsAcquired,
      iconName: 'Award',
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Issue Verified Skill Badge</h3>
              <p className="text-xs text-slate-400">
                Adds a verifiable credential to the worker's portable passport.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-extrabold text-lg text-white">Skill Badge Issued Successfully!</h4>
            <p className="text-xs text-slate-300">
              Cryptographic verification hash stamped onto worker's passport.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">
                Select Frontline Worker
              </label>
              <select
                value={selectedWorkerId}
                onChange={(e) => setSelectedWorkerId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                required
              >
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} — {w.role} ({w.cumulativeExperienceHours}h exp)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">
                  Certification Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">
                  Issuing Authority / Agency
                </label>
                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">
                  Credential Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Master">Master</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Certified">Certified</option>
                  <option value="Apprentice">Apprentice</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">
                Verified Competencies Acquired (Comma separated)
              </label>
              <textarea
                rows={2}
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              ></textarea>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Issue & Sign Badge</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
