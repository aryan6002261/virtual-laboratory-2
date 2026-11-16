import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  Atom,
  BookOpen,
  CheckCircle2,
  Code2,
  Cog,
  Cpu,
  Search,
  Sparkles,
  Volume2,
  Zap,
  Filter,
} from 'lucide-react';
import { EXPERIMENTS, LAB_SUITES } from '../data/labs';
import { LabId, QuizProgressMap, DifficultyLevel } from '../types/lab';
import { useHiDpiCanvas } from './simulations/SimShared';

interface PortalHubProps {
  quizProgress: QuizProgressMap;
  onSelectLab: (labId: LabId) => void;
  onSelectExperiment: (labId: LabId, expId: string) => void;
  onOpenSandbox?: (labId?: LabId) => void;
}

const LAB_ICONS: Record<LabId, React.ReactNode> = {
  optics: <Sparkles className="w-5 h-5" />,
  chemistry: <Atom className="w-5 h-5" />,
  electrical: <Zap className="w-5 h-5" />,
  electronics: <Cpu className="w-5 h-5" />,
  mechanical: <Cog className="w-5 h-5" />,
  programming: <Code2 className="w-5 h-5" />,
};

const DIFFICULTY_STYLES: Record<DifficultyLevel, string> = {
  Beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  Advanced: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
};

export const PortalHub: React.FC<PortalHubProps> = ({
  quizProgress,
  onSelectLab,
  onSelectExperiment,
  onOpenSandbox,
}) => {
  const [filterLab, setFilterLab] = useState<'all' | LabId>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | DifficultyLevel>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [query, setQuery] = useState('');

  const filteredExperiments = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXPERIMENTS.filter((exp) => {
      if (filterLab !== 'all' && exp.labId !== filterLab) return false;
      if (filterDifficulty !== 'all' && exp.difficulty !== filterDifficulty) return false;

      const p = quizProgress[exp.id] ?? {};
      const isCompleted = Object.values(p).filter((a) => a.isCorrect).length >= 4;
      if (filterStatus === 'completed' && !isCompleted) return false;
      if (filterStatus === 'incomplete' && isCompleted) return false;

      if (!q) return true;
      return (
        exp.title.toLowerCase().includes(q) ||
        exp.summary.toLowerCase().includes(q) ||
        exp.formula.toLowerCase().includes(q) ||
        exp.concepts.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [filterLab, filterDifficulty, filterStatus, query, quizProgress]);

  const totalQuestions = EXPERIMENTS.length * 6;
  const totalCorrect = Object.values(quizProgress).reduce(
    (sum, expMap) =>
      sum + Object.values(expMap).filter((a) => a.isCorrect).length,
    0
  );

  // Interactive Hero Physics & Wave Canvas Preview
  const heroCanvasRef = useHiDpiCanvas(
    (ctx, w, h, t) => {
      ctx.clearRect(0, 0, w, h);
      // Coordinate grid
      ctx.strokeStyle = 'rgba(255,255,255,0.035)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 28) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 28) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      const midY = h * 0.5;
      // Multi-discipline harmonic waveforms
      const waves = [
        { amp: h * 0.24, freq: 2.2, spd: 1.8, col: '#0284c7' },
        { amp: h * 0.16, freq: 3.6, spd: -1.4, col: '#10b981' },
        { amp: h * 0.12, freq: 5.0, spd: 2.3, col: '#8b5cf6' },
      ];
      waves.forEach((wv) => {
        ctx.strokeStyle = wv.col;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 140; i++) {
          const u = i / 140;
          const x = 24 + u * (w - 48);
          const env = Math.sin(u * Math.PI);
          const y = midY + Math.sin(u * Math.PI * wv.freq - t * wv.spd) * wv.amp * env;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // Superposition envelope nodes
      for (let k = 1; k <= 5; k++) {
        const u = k / 6;
        const x = 24 + u * (w - 48);
        const y =
          midY +
          waves.reduce(
            (s, wv) => s + Math.sin(u * Math.PI * wv.freq - t * wv.spd) * wv.amp * Math.sin(u * Math.PI),
            0
          ) *
            0.55;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('MULTI-DISCIPLINE SIMULATION ENGINE · 60 FPS', 20, h - 16);
    },
    [],
    true
  );

  return (
    <main className="max-w-[1440px] mx-auto px-5 sm:px-10 py-10 sm:py-14 flex flex-col gap-16">
      {/* Hero Split Stage */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-mono text-[#93ccff]">
              6 Laboratories · 38 Interactive Practicals · 228 Mastery Questions
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#dee2f6] leading-[1.12] text-balance">
              Virtual Science Laboratory for Hands-On STEM Mastery
            </h1>
            <p className="text-base sm:text-lg text-[#bfc7d2] leading-relaxed max-w-2xl">
              Bridge abstract textbook equations and physical intuition through real-time simulations across Optics, Chemistry, Electrical Engineering, Electronics, Mechanics, and Computer Science.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <button
              type="button"
              onClick={() => onSelectExperiment('optics', 'snells-law')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded text-sm font-semibold text-white bg-gradient-to-r from-[#0284c7] to-[#2563eb] shadow-[0_0_16px_rgba(2,132,199,0.35)] hover:brightness-110 transition cursor-pointer whitespace-nowrap"
            >
              Start First Practical: Snell&apos;s Law
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenSandbox && (
              <button
                type="button"
                onClick={() => onOpenSandbox('electrical')}
                className="inline-flex items-center gap-2 px-4 py-3 rounded text-sm font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition cursor-pointer whitespace-nowrap"
              >
                <Zap className="w-4 h-4" />
                Open Free-Form Sandbox
              </button>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs font-mono">
            <div>
              <span className="text-[#89929b] block">Total Practicals</span>
              <span className="text-lg font-bold text-white">38</span>
            </div>
            <div>
              <span className="text-[#89929b] block">Quiz Questions</span>
              <span className="text-lg font-bold text-[#93ccff]">228</span>
            </div>
            <div>
              <span className="text-[#89929b] block">Verified Correct</span>
              <span className="text-lg font-bold text-emerald-400">{totalCorrect}</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Canvas Card */}
        <div className="lg:col-span-5 glass-panel rounded-lg p-5 flex flex-col justify-between gap-4 border border-white/15 bg-[#090e1c]/80 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-[#dee2f6]">
              HARMONIC OSCILLATION TELEMETRY
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded">
              Active Loop
            </span>
          </div>

          <div className="w-full h-56 rounded border border-white/10 overflow-hidden bg-[#090e1c]">
            <canvas ref={heroCanvasRef} className="w-full h-full block" />
          </div>

          <div className="text-xs text-[#89929b] leading-relaxed">
            Real-time multi-frequency interference and phase portrait calculation computed at 60 FPS in pure TypeScript.
          </div>
        </div>
      </section>

      {/* 6 Laboratory Suites */}
      <section id="suites" className="flex flex-col gap-6 scroll-mt-24">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#dee2f6]">
            The 6 Laboratory Suites
          </h2>
          <p className="text-sm text-[#bfc7d2] mt-1">
            Choose a scientific discipline to access its specialized curriculum, simulations, and experimental apparatus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LAB_SUITES.map((suite) => {
            const suiteExps = EXPERIMENTS.filter((e) => e.labId === suite.id);

            return (
              <div
                key={suite.id}
                className="glass-panel rounded-lg p-6 flex flex-col justify-between gap-5 border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: suite.accentHex }}
                    >
                      {LAB_ICONS[suite.id]}
                    </div>
                    <span className="text-xs font-mono text-[#89929b]">
                      {suite.experimentCount} Practicals
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold text-[#dee2f6]">
                      {suite.name}
                    </h3>
                    <p className="text-xs font-mono text-[#93ccff] mt-0.5">
                      {suite.discipline}
                    </p>
                  </div>

                  <p className="text-xs text-[#bfc7d2] leading-relaxed">
                    {suite.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => onSelectLab(suite.id)}
                    className="flex-1 py-2 px-3 rounded text-xs font-semibold text-white transition cursor-pointer hover:brightness-110 text-center"
                    style={{ backgroundColor: suite.accentHex }}
                  >
                    Open {suite.shortName} Lab
                  </button>
                  {onOpenSandbox && (
                    <button
                      type="button"
                      onClick={() => onOpenSandbox(suite.id)}
                      className="py-2 px-3 rounded text-xs font-mono font-semibold bg-white/5 border border-white/10 text-amber-300 hover:bg-white/15 transition cursor-pointer"
                      title={`Open ${suite.shortName} Sandbox`}
                    >
                      Sandbox
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Complete 38-Practical Search & Filter Directory */}
      <section id="directory" className="flex flex-col gap-6 scroll-mt-24">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#dee2f6]">
              All 38 Interactive Practicals
            </h2>
            <p className="text-sm text-[#bfc7d2] mt-1">
              Filter by laboratory discipline, difficulty level, or search by formula and topic.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-[#89929b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Snell, Titration, Op-Amp, BST..."
              className="w-full pl-9 pr-3.5 py-2 rounded bg-[#090e1c] border border-white/15 text-sm text-[#dee2f6] placeholder:text-[#89929b] focus:outline-none focus:border-[#0284c7]"
            />
          </div>
        </div>

        {/* Multi-Facet Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Discipline tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-md bg-[#090e1c] border border-white/10">
            <button
              type="button"
              onClick={() => setFilterLab('all')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer ${
                filterLab === 'all'
                  ? 'bg-[#252a39] text-white font-semibold'
                  : 'text-[#89929b] hover:text-white'
              }`}
            >
              All Labs
            </button>
            {LAB_SUITES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setFilterLab(s.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer ${
                  filterLab === s.id
                    ? 'bg-[#252a39] text-white font-semibold'
                    : 'text-[#89929b] hover:text-white'
                }`}
              >
                {s.shortName}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-1.5 text-xs font-mono bg-[#090e1c] border border-white/10 rounded px-2.5 py-1.5">
            <span className="text-[#89929b]">Difficulty:</span>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value as 'all' | DifficultyLevel)}
              className="bg-transparent text-[#dee2f6] outline-none cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5 text-xs font-mono bg-[#090e1c] border border-white/10 rounded px-2.5 py-1.5">
            <span className="text-[#89929b]">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'completed' | 'incomplete')}
              className="bg-transparent text-[#dee2f6] outline-none cursor-pointer"
            >
              <option value="all">All Practicals</option>
              <option value="completed">Completed Only</option>
              <option value="incomplete">Incomplete Only</option>
            </select>
          </div>
        </div>

        {/* Table of Practicals */}
        <div className="glass-panel rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-[#090e1c]/70 text-xs font-mono text-[#89929b]">
                  <th className="py-3 px-4 font-medium">Lab</th>
                  <th className="py-3 px-4 font-medium">Difficulty</th>
                  <th className="py-3 px-4 font-medium">Practical</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Key Formulations</th>
                  <th className="py-3 px-4 font-medium">Quiz</th>
                  <th className="py-3 px-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredExperiments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 px-4 text-center text-[#89929b]">
                      No experiments match &quot;{query}&quot;. Try clearing filters.
                    </td>
                  </tr>
                ) : (
                  filteredExperiments.map((exp) => {
                    const suite = LAB_SUITES.find((s) => s.id === exp.labId)!;
                    const p = quizProgress[exp.id] ?? {};
                    const correct = Object.values(p).filter((x) => x.isCorrect).length;

                    return (
                      <tr
                        key={exp.id}
                        className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-xs whitespace-nowrap" style={{ color: suite.accentHex }}>
                          {suite.shortName} 0{exp.index}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${DIFFICULTY_STYLES[exp.difficulty] || DIFFICULTY_STYLES.Beginner}`}>
                            {exp.difficulty}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-[#dee2f6]">{exp.title}</div>
                          <div className="text-xs text-[#89929b] mt-0.5 line-clamp-1">{exp.summary}</div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <code className="text-xs font-mono text-[#93ccff]">{exp.formula}</code>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs tabular-nums whitespace-nowrap text-[#bfc7d2]">
                          <span className="inline-flex items-center gap-1">
                            {correct === 6 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                            {correct}/6
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onSelectExperiment(exp.labId, exp.id)}
                            className="px-3 py-1.5 rounded text-xs font-medium bg-white/5 border border-white/15 text-[#dee2f6] hover:bg-white/10 cursor-pointer"
                          >
                            Launch
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5-Stage Pedagogical Architecture */}
      <section id="pedagogy" className="glass-panel rounded-md p-6 sm:p-8 flex flex-col gap-5 scroll-mt-24">
        <div>
          <h2 className="font-display text-2xl font-bold text-[#dee2f6]">
            5-Stage Pedagogical Architecture
          </h2>
          <p className="text-sm text-[#bfc7d2] mt-1">
            Every single one of the 38 practicals follows an identical five-part scientific workflow:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded bg-[#090e1c] border border-white/10 flex flex-col gap-1.5">
            <span className="font-mono text-xs font-bold text-[var(--lab-accent)]">STAGE 01</span>
            <h4 className="font-display text-sm font-bold text-white">Interactive Simulation</h4>
            <p className="text-xs text-[#89929b]">60 FPS Canvas with parameter sliders and live telemetry readouts.</p>
          </div>
          <div className="p-4 rounded bg-[#090e1c] border border-white/10 flex flex-col gap-1.5">
            <span className="font-mono text-xs font-bold text-[var(--lab-accent)]">STAGE 02</span>
            <h4 className="font-display text-sm font-bold text-white">Observation Logging</h4>
            <p className="text-xs text-[#89929b]">Record dynamic trials with regression graph fitting and CSV/Excel export.</p>
          </div>
          <div className="p-4 rounded bg-[#090e1c] border border-white/10 flex flex-col gap-1.5">
            <span className="font-mono text-xs font-bold text-[var(--lab-accent)]">STAGE 03</span>
            <h4 className="font-display text-sm font-bold text-white">Vector Schematics</h4>
            <p className="text-xs text-[#89929b]">Hand-crafted SVG hardware diagrams with active signal animations.</p>
          </div>
          <div className="p-4 rounded bg-[#090e1c] border border-white/10 flex flex-col gap-1.5">
            <span className="font-mono text-xs font-bold text-[var(--lab-accent)]">STAGE 04</span>
            <h4 className="font-display text-sm font-bold text-white">Theoretical Derivations</h4>
            <p className="text-xs text-[#89929b]">Constitutive laws, error analysis, safety precautions, and applications.</p>
          </div>
          <div className="p-4 rounded bg-[#090e1c] border border-white/10 flex flex-col gap-1.5">
            <span className="font-mono text-xs font-bold text-[var(--lab-accent)]">STAGE 05</span>
            <h4 className="font-display text-sm font-bold text-white">Mastery Assessment</h4>
            <p className="text-xs text-[#89929b]">6-question quiz bank with hint reveals and synthesized Web Audio.</p>
          </div>
        </div>
      </section>
    </main>
  );
};
