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
} from 'lucide-react';
import { EXPERIMENTS, LAB_SUITES } from '../data/labs';
import { LabId, QuizProgressMap } from '../types/lab';
import { useHiDpiCanvas } from './simulations/SimShared';

interface PortalHubProps {
  quizProgress: QuizProgressMap;
  onSelectLab: (labId: LabId) => void;
  onSelectExperiment: (labId: LabId, expId: string) => void;
}

const LAB_ICONS: Record<LabId, React.ReactNode> = {
  optics: <Sparkles className="w-5 h-5" />,
  chemistry: <Atom className="w-5 h-5" />,
  electrical: <Zap className="w-5 h-5" />,
  electronics: <Cpu className="w-5 h-5" />,
  mechanical: <Cog className="w-5 h-5" />,
  programming: <Code2 className="w-5 h-5" />,
};

export const PortalHub: React.FC<PortalHubProps> = ({
  quizProgress,
  onSelectLab,
  onSelectExperiment,
}) => {
  const [filterLab, setFilterLab] = useState<'all' | LabId>('all');
  const [query, setQuery] = useState('');

  const filteredExperiments = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXPERIMENTS.filter((exp) => {
      if (filterLab !== 'all' && exp.labId !== filterLab) return false;
      if (!q) return true;
      return (
        exp.title.toLowerCase().includes(q) ||
        exp.summary.toLowerCase().includes(q) ||
        exp.formula.toLowerCase().includes(q) ||
        exp.concepts.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [filterLab, query]);

  const totalQuestions = 228;
  const totalAnswered = Object.values(quizProgress).reduce(
    (sum, expMap) => sum + Object.keys(expMap).length,
    0
  );
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
      // Multi-discipline harmonic interference waveforms
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
              Launch Optics Workbench
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#directory"
              className="inline-flex items-center gap-2 px-5 py-3 rounded text-sm font-medium text-[#dee2f6] bg-white/[0.04] border border-white/15 hover:border-white/30 transition whitespace-nowrap"
            >
              Browse 38 Practicals
            </a>
          </div>
        </div>

        {/* Hero Live Interactive Canvas Frame */}
        <div className="lg:col-span-5 glass-panel rounded-md p-3 flex flex-col">
          <div className="relative flex-1 min-h-[260px] lg:h-full rounded bg-[#090e1c] overflow-hidden cursor-crosshair">
            <canvas ref={heroCanvasRef} className="w-full h-full block" />
            <span className="pointer-events-none absolute top-2.5 left-2.5 w-3 h-3 border-t border-l border-white/30" />
            <span className="pointer-events-none absolute top-2.5 right-2.5 w-3 h-3 border-t border-r border-white/30" />
            <span className="pointer-events-none absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l border-white/30" />
            <span className="pointer-events-none absolute bottom-2.5 right-2.5 w-3 h-3 border-b border-r border-white/30" />
          </div>
        </div>
      </section>

      {/* 4-Column Quantitative Strip directly under Hero */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-md p-4">
          <span className="text-xs font-mono text-[#89929b]">LABORATORY SUITES</span>
          <div className="mt-1 text-2xl font-mono font-semibold tabular-nums text-[#dee2f6]">6 Suites</div>
          <p className="text-xs text-[#bfc7d2] mt-1">Optics, Chemistry, Electrical, Electronics, Mechanical, CS</p>
        </div>
        <div className="glass-panel rounded-md p-4">
          <span className="text-xs font-mono text-[#89929b]">INTERACTIVE PRACTICALS</span>
          <div className="mt-1 text-2xl font-mono font-semibold tabular-nums text-[#dee2f6]">38 Simulations</div>
          <p className="text-xs text-[#bfc7d2] mt-1">High-DPI canvas models with empirical CSV logging</p>
        </div>
        <div className="glass-panel rounded-md p-4">
          <span className="text-xs font-mono text-[#89929b]">VECTOR SCHEMATICS</span>
          <div className="mt-1 text-2xl font-mono font-semibold tabular-nums text-[#dee2f6]">38 SVG Diagrams</div>
          <p className="text-xs text-[#bfc7d2] mt-1">Resolution-independent diagrams and procedural flowcharts</p>
        </div>
        <div className="glass-panel rounded-md p-4">
          <span className="text-xs font-mono text-[#89929b]">MASTERY PROGRESS</span>
          <div className="mt-1 text-2xl font-mono font-semibold tabular-nums text-emerald-400">
            {totalCorrect} / {totalQuestions}
          </div>
          <p className="text-xs text-[#bfc7d2] mt-1">{totalAnswered} questions attempted across 38 quizzes</p>
        </div>
      </section>

      {/* 6 Laboratory Suites Directory */}
      <section id="suites" className="flex flex-col gap-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#dee2f6]">
              Laboratory Suites
            </h2>
            <p className="text-sm text-[#bfc7d2] mt-1">
              Enter any discipline portal or jump directly into an individual experiment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {LAB_SUITES.map((suite) => {
            const suiteExps = EXPERIMENTS.filter((e) => e.labId === suite.id);
            const suiteScore = suiteExps.reduce(
              (acc, e) =>
                acc +
                Object.values(quizProgress[e.id] ?? {}).filter((x) => x.isCorrect).length,
              0
            );

            return (
              <div
                key={suite.id}
                className="glass-panel rounded-md p-5 sm:p-6 flex flex-col justify-between gap-5 hover:border-white/25 transition-colors"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center justify-center w-9 h-9 rounded border"
                      style={{
                        backgroundColor: suite.accentSoft,
                        borderColor: `${suite.accentHex}55`,
                        color: suite.accentHex,
                      }}
                    >
                      {LAB_ICONS[suite.id]}
                    </span>
                    <span className="text-xs font-mono tabular-nums text-[#89929b]">
                      {suite.experimentCount} Practicals · {suiteScore}/{suite.questionCount} Quiz
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-semibold text-[#dee2f6]">
                      {suite.name}
                    </h3>
                    <p className="text-xs font-mono text-[#89929b] mt-0.5">
                      {suite.discipline}
                    </p>
                  </div>

                  <p className="text-sm text-[#bfc7d2] leading-relaxed">
                    {suite.summary}
                  </p>

                  {/* Quick-jump list of first 3 + open suite */}
                  <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5">
                    {suiteExps.slice(0, 3).map((exp) => (
                      <button
                        key={exp.id}
                        type="button"
                        onClick={() => onSelectExperiment(suite.id, exp.id)}
                        className="text-left text-xs text-[#bfc7d2] hover:text-white flex items-center justify-between py-0.5 cursor-pointer"
                      >
                        <span className="truncate">
                          0{exp.index}. {exp.shortTitle}
                        </span>
                        <span className="font-mono text-[11px] text-[#89929b] shrink-0 ml-2">
                          Open →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectLab(suite.id)}
                  className="w-full py-2.5 px-4 rounded text-xs font-medium text-white transition cursor-pointer hover:brightness-110"
                  style={{ backgroundColor: suite.accentHex }}
                >
                  Open {suite.name} ({suite.experimentCount} Experiments)
                </button>
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
              Filter by laboratory discipline or search by formula, law, or topic.
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

        {/* Interactive Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-md bg-[#090e1c] border border-white/10 w-fit">
          <button
            type="button"
            onClick={() => setFilterLab('all')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              filterLab === 'all'
                ? 'bg-[#252a39] text-white'
                : 'text-[#89929b] hover:text-white'
            }`}
          >
            All (38)
          </button>
          {LAB_SUITES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setFilterLab(s.id)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filterLab === s.id
                  ? 'bg-[#252a39] text-white'
                  : 'text-[#89929b] hover:text-white'
              }`}
            >
              {s.shortName} ({s.experimentCount})
            </button>
          ))}
        </div>

        {/* Table / Grid of Practicals */}
        <div className="glass-panel rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-[#090e1c]/70 text-xs font-mono text-[#89929b]">
                  <th className="py-3 px-4 font-medium">Lab</th>
                  <th className="py-3 px-4 font-medium">Practical</th>
                  <th className="py-3 px-4 font-medium hidden md:table-cell">Key Formulations</th>
                  <th className="py-3 px-4 font-medium">Quiz</th>
                  <th className="py-3 px-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredExperiments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 px-4 text-center text-[#89929b]">
                      No experiments match "{query}". Try clearing your filter.
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

      {/* 5-Stage Pedagogical Architecture & Web Audio Overview */}
      <section id="pedagogy" className="grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-24">
        <div className="lg:col-span-7 glass-panel rounded-md p-6 sm:p-8 flex flex-col gap-5">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#dee2f6]">
              5-Stage Pedagogical Architecture
            </h2>
            <p className="text-sm text-[#bfc7d2] mt-1">
              Every single one of the 38 practicals follows an identical five-part scientific workflow.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              ['01. Interactive Canvas Simulation', 'High-DPI 60 FPS physical models with live control dials, telemetry readouts, and CSV trial logging.'],
              ['02. Inline Vector SVG Concept Architecture', 'Handcrafted, scale-free vector schematics illustrating rays, circuits, orbitals, and data structures.'],
              ['03. Procedural Step-by-Step Flowchart', 'Clear decision thresholds and experimental protocols guiding empirical verification.'],
              ['04. Theoretical & Mathematical Equations', 'Formal derivations, variable notes, and real-world engineering applications.'],
              ['05. 6-Question Mastery Quiz Suite', '228 total questions across the platform with animated progress tracking and scientific rationales.'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded bg-[#090e1c]/80 border border-white/10 p-3.5">
                <div className="font-mono text-xs font-semibold text-[#93ccff]">{title}</div>
                <p className="text-xs sm:text-sm text-[#bfc7d2] mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel rounded-md p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-[#93ccff]">
              <Volume2 className="w-5 h-5" />
              <h3 className="font-display text-lg font-semibold text-[#dee2f6]">
                Synthesized Web Audio Engine
              </h3>
            </div>
            <p className="text-sm text-[#bfc7d2] leading-relaxed">
              Built directly on the browser AudioContext without external audio assets. Correct quiz answers synthesize an ascending harmonic triad chord (C5 → E5 → G5), incorrect selections emit a low sawtooth retry tone, and simulations modulate frequencies dynamically.
            </p>
          </div>

          <div className="glass-panel rounded-md p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <Activity className="w-5 h-5" />
              <h3 className="font-display text-lg font-semibold text-[#dee2f6]">
                Empirical Observation Logging
              </h3>
            </div>
            <p className="text-sm text-[#bfc7d2] leading-relaxed">
              Every workbench includes a live observation log where students capture trial parameters and telemetry snapshots, then export datasets directly to CSV for lab reports.
            </p>
          </div>

          <div className="glass-panel rounded-md p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-violet-400">
              <BookOpen className="w-5 h-5" />
              <h3 className="font-display text-lg font-semibold text-[#dee2f6]">
                Zero-Dependency Design Precision
              </h3>
            </div>
            <p className="text-sm text-[#bfc7d2] leading-relaxed">
              Each laboratory suite applies dedicated thematic CSS variables across dark-field glassmorphic surfaces with tabular monospace numerals for flicker-free instrument telemetry.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};
