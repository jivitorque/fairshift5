import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HardHat,
  GraduationCap,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  Play,
  Volume2,
  Lock,
  Layers,
} from 'lucide-react';

export const SDG8PitchTab: React.FC = () => {
  const {
    setRole,
    setIndustry,
    punchIn,
    speakPayslip,
    submitGrievance,
    assignMandatoryRest,
    workers,
  } = useApp();

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  // Automated 60-Second Judge Actions
  const runStep1 = () => {
    setIndustry('construction');
    punchIn('w-c1');
    setRole('worker');
    if (!completedSteps.includes(1)) setCompletedSteps((prev) => [...prev, 1]);
  };

  const runStep2 = () => {
    setRole('worker');
    speakPayslip(workers[0]);
    if (!completedSteps.includes(2)) setCompletedSteps((prev) => [...prev, 2]);
  };

  const runStep3 = () => {
    setIndustry('construction');
    submitGrievance(
      'hazard',
      'Unsafe Scaffolding / Loose Clamps',
      'Zone B - Scaffolding Tower 4',
      'CRITICAL',
      'Emergency loose cross-brace on 7th floor scaffolding. High wind hazard.',
      true
    );
    setRole('worker');
    if (!completedSteps.includes(3)) setCompletedSteps((prev) => [...prev, 3]);
  };

  const runStep4 = () => {
    setRole('employer');
    if (!completedSteps.includes(4)) setCompletedSteps((prev) => [...prev, 4]);
  };

  const runStep5 = () => {
    // Find high fatigue worker (e.g. Muthuvel S. or Mohammad Irfan)
    const highFatigueWorker = workers.find((w) => w.fatigueRisk === 'HIGH') || workers[1];
    assignMandatoryRest(
      highFatigueWorker.id,
      'Judge Demo: Fatigue protection protocol enforced. 16-hour paid rest turnaround assigned.'
    );
    setRole('employer');
    if (!completedSteps.includes(5)) setCompletedSteps((prev) => [...prev, 5]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 text-slate-100">
      {/* Hero Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950/30 border border-indigo-500/30 shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
          <HeartHandshake className="w-4 h-4" />
          Hackathon Theme: UN SDG 8 – Decent Work and Economic Growth
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          FairShift: The Decent Work Platform for Employee-Intensive Organisations
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Frontline and blue-collar workers form the backbone of physical infrastructure and campus operations, yet they suffer from opaque overtime accounting, retaliation fears for reporting hazards, and high burnout attrition. 
          <strong className="text-white"> FairShift bridges this gap through real-time transparent wage calculation, zero-knowledge anonymous voice reporting, and portable digital skill passports.</strong>
        </p>
      </div>

      {/* Interactive 60-Second Judge Demo Flow Checklist */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border-2 border-indigo-500/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              "Try This Judge Demo Flow" (Test in &lt; 60 Seconds)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Follow this 5-step guided path or click "Run Step Now" to watch instant reactive state sync across screens.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {completedSteps.length} of 5 Completed
          </span>
        </div>

        <div className="space-y-3">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleStep(1)}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  completedSteps.includes(1)
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {completedSteps.includes(1) ? '✓' : '1'}
              </button>
              <div>
                <h4 className="font-bold text-xs text-slate-100">
                  Step 1: Punch In with Geofence Lock
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Punches in as Ramesh Kumar at Zone B Scaffolding. Initiates live digital shift timer and real-time wage counter.
                </p>
              </div>
            </div>
            <button
              onClick={runStep1}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Step 1 & View</span>
            </button>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleStep(2)}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  completedSteps.includes(2)
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {completedSteps.includes(2) ? '✓' : '2'}
              </button>
              <div>
                <h4 className="font-bold text-xs text-slate-100">
                  Step 2: Listen to Transparent Voice Payslip
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Tests Web Speech API read-aloud in Hindi or Tamil with statutory 1.5x overtime multiplier math.
                </p>
              </div>
            </div>
            <button
              onClick={runStep2}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Run Step 2 & Listen</span>
            </button>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleStep(3)}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  completedSteps.includes(3)
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {completedSteps.includes(3) ? '✓' : '3'}
              </button>
              <div>
                <h4 className="font-bold text-xs text-slate-100">
                  Step 3: Submit Voice Safety Hazard with Zero-Knowledge Token
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Generates cryptographic tracking token (e.g. #FS-8942) with PII completely stripped.
                </p>
              </div>
            </div>
            <button
              onClick={runStep3}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Run Step 3 & Generate</span>
            </button>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleStep(4)}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  completedSteps.includes(4)
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {completedSteps.includes(4) ? '✓' : '4'}
              </button>
              <div>
                <h4 className="font-bold text-xs text-slate-100">
                  Step 4: Switch to Employer View & Resolve Ticket
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Opens Employer Command Center, plays voice note audio, and updates resolution note, which instantly updates worker's pizza tracker.
                </p>
              </div>
            </div>
            <button
              onClick={runStep4}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Switch to Employer</span>
            </button>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleStep(5)}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  completedSteps.includes(5)
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {completedSteps.includes(5) ? '✓' : '5'}
              </button>
              <div>
                <h4 className="font-bold text-xs text-slate-100">
                  Step 5: Enforce Fatigue Guard Mandatory Rest
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Rebalances shift for overworked frontline worker (&gt;50h/wk) with zero wage penalty.
                </p>
              </div>
            </div>
            <button
              onClick={runStep5}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
            >
              <span>Assign Mandatory Rest</span>
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Multi-Industry Comparison Matrix */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Side-by-Side Multi-Industry Adaptation Matrix
        </h3>
        <p className="text-xs text-slate-400">
          How FairShift seamlessly pivots between high-risk physical construction sites and institutional educational campuses.
        </p>

        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-5">Operational Dimension</th>
                <th className="py-4 px-5 text-amber-300">
                  <div className="flex items-center gap-1.5">
                    <HardHat className="w-4 h-4 text-amber-400" />
                    <span>Apex BuildCorp (Construction Site)</span>
                  </div>
                </th>
                <th className="py-4 px-5 text-blue-300">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-blue-400" />
                    <span>St. Xavier's Institute (College Campus)</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr>
                <td className="py-4 px-5 font-bold text-slate-200">Worker Demographics</td>
                <td className="py-4 px-5">
                  Migrant daily-wage laborers, masons, crane operators, structural welders, bar benders.
                </td>
                <td className="py-4 px-5">
                  Housekeeping leads, lab technicians, night security guards, campus bus drivers, cafeteria stewards.
                </td>
              </tr>
              <tr>
                <td className="py-4 px-5 font-bold text-slate-200">Primary Safety Hazards</td>
                <td className="py-4 px-5">
                  Scaffolding detachment, crane blindspots, harness failures, 40°C heat exhaustion in foundation pits.
                </td>
                <td className="py-4 px-5">
                  Organic solvent lab spills, biohazard waste disposal, dark perimeter parking, exam cycle night-guard fatigue.
                </td>
              </tr>
              <tr>
                <td className="py-4 px-5 font-bold text-slate-200">Wage & Overtime Dynamics</td>
                <td className="py-4 px-5">
                  Daily wage + hourly overtime during night concrete pours. 1.5x statutory multiplier and canteen deductions.
                </td>
                <td className="py-4 px-5">
                  Monthly institutional contract with overtime surge during admissions, tech festivals, and semester exams.
                </td>
              </tr>
              <tr>
                <td className="py-4 px-5 font-bold text-slate-200">Geofence & Zones</td>
                <td className="py-4 px-5">
                  Zone A Foundation Pit, Zone B Scaffolding Tower 4, Zone C Batching Plant, Zone D Tower Crane.
                </td>
                <td className="py-4 px-5">
                  Science Block Chem Lab 3, North Gatepost, Central Dining Hall, Hostel Block B, Bus Depot.
                </td>
              </tr>
              <tr>
                <td className="py-4 px-5 font-bold text-slate-200">Verifiable Skill Badges</td>
                <td className="py-4 px-5">
                  High-Altitude Scaffolding Level 3, Heavy Crane Operator, 6G Pipe Welder, First Aid.
                </td>
                <td className="py-4 px-5">
                  OSHA Chemical Spill Neutralization, Fire Drill Marshal, HPV Heavy Bus License, FSSAI Food Hygiene.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* UN SDG 8 Targets Deep-Dive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 font-extrabold text-sm border border-emerald-500/30">
              SDG 8.5
            </span>
            <h4 className="font-extrabold text-sm text-white">
              Full Employment & Decent Work with Equal Pay
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Eliminates wage theft and delayed overtime disputes by displaying a visual, voice-narrated mathematical formula (`Base Hours × Base Rate + Overtime Hours × 1.5x Multiplier`). Frontline workers with limited text literacy can listen to their exact salary in their native mother tongue (Hindi, Tamil, English).
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 font-extrabold text-sm border border-amber-500/30">
              SDG 8.8
            </span>
            <h4 className="font-extrabold text-sm text-white">
              Protect Labor Rights & Promote Safe Working Environments
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Protects precarious workers through Zero-Knowledge anonymous hazard reporting (worker PII is cryptographically removed before reaching management). The Fatigue Risk Engine automatically halts burnout cycles by enforcing 16-hour mandatory rest windows for workers exceeding 50 hours/week.
          </p>
        </div>
      </div>
    </div>
  );
};
