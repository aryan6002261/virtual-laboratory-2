import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Zap, Search, Filter } from 'lucide-react';
import { getExperimentsByLab, getLabById } from '../data/labs';
import { LabId, QuizProgressMap, DifficultyLevel } from '../types/lab';

interface LabPortalViewProps {
  labId: LabId;
  quizProgress: QuizProgressMap;
  onBackHome: () => void;
  onSelectExperiment: (labId: LabId, expId: string) => void;
  onOpenSandbox?: (labId: LabId) => void;
}

const DIFFICULTY_STYLES: Record<DifficultyLevel, string> = {
  Beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  Advanced: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
};

export const LabPortalView: React.FC<LabPortalViewProps> = ({
  labId,
  quizProgress,
  onBackHome,
  onSelectExperiment,
  onOpenSandbox,
}) => {
  const lab = getLabById(labId);
  const experiments = getExperimentsByLab(labId);

  const [query, setQuery] = useState('');
  const [filterDiff, setFilterDiff] = useState<'all' | DifficultyLevel>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return experiments.filter((e) => {
      if (filterDiff !== 'all' && e.difficulty !== filterDiff) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        e.formula.toLowerCase().includes(q)
      );
    });
  }, [experiments, query, filterDiff]);

  const labTotalCorrect = experiments.reduce((sum, exp) => {
    const p = quizProgress[exp.id] ?? {};
    return sum + Object.values(p).filter((x) => x.isCorrect).length;
  }, 0);

  return (
    <main className="max-w-[1440px] mx-auto px-5 sm:px-10 py-10 flex flex-col gap-10">
      {/* Breadcrumb + Header */}
      <div className="flex flex-col gap-5">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#89929b] hover:text-white transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Laboratory Hub
        </button>

        <div
          className="glass-panel rounded-md p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          style={{
            backgroundImage: `linear-gradient(135deg, ${lab.gradientFrom}44, rgba(14,19,33,0.9))`,
          }}
        >
          <div className="max-w-2xl">
            <p className="text-xs font-mono text-[#93ccff] mb-2">
              {lab.discipline} · {lab.experimentCount} Practicals · {lab.questionCount} Questions
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#dee2f6] text-balance">
              {lab.name}
            </h1>
            <p className="text-sm sm:text-base text-[#bfc7d2] mt-3 leading-relaxed">
              {lab.summary}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded bg-[#090e1c]/80 border border-white/10 font-mono text-xs tabular-nums text-[#dee2f6]">
              Suite Mastery: {labTotalCorrect} / {lab.questionCount}
            </div>

            <div className="flex items-center gap-2">
              {onOpenSandbox && (
                <button
                  type="button"
                  onClick={() => onOpenSandbox(labId)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded text-sm font-medium bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition cursor-pointer"
                >
                  <Zap className="w-4 h-4" /> Open Sandbox
                </button>
              )}
              <button
                type="button"
                onClick={() => onSelectExperiment(labId, experiments[0].id)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium bg-[var(--lab-accent)] text-white hover:brightness-110 transition cursor-pointer whitespace-nowrap"
              >
                Start Practical 01
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#89929b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${lab.name}...`}
            className="w-full pl-9 pr-3.5 py-2 rounded bg-[#090e1c] border border-white/15 text-xs text-[#dee2f6] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono self-start sm:self-auto">
          <span className="text-[#89929b]">Filter Difficulty:</span>
          {(['all', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setFilterDiff(lvl)}
              className={`px-3 py-1 rounded capitalize transition cursor-pointer ${
                filterDiff === lvl
                  ? 'bg-white/15 text-white font-semibold'
                  : 'bg-white/5 border border-white/10 text-[#bfc7d2] hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Experiments List */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((exp) => {
          const p = quizProgress[exp.id] ?? {};
          const correct = Object.values(p).filter((x) => x.isCorrect).length;
          const answered = Object.keys(p).length;

          return (
            <button
              key={exp.id}
              type="button"
              onClick={() => onSelectExperiment(labId, exp.id)}
              className="text-left glass-panel rounded-md p-5 hover:border-white/25 transition-all flex flex-col justify-between gap-4 cursor-pointer group"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-[#89929b]">
                  <div className="flex items-center gap-2">
                    <span>Practical 0{exp.index}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${DIFFICULTY_STYLES[exp.difficulty] || DIFFICULTY_STYLES.Beginner}`}>
                      {exp.difficulty}
                    </span>
                  </div>
                  <span className="tabular-nums flex items-center gap-1">
                    {correct === 6 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    Quiz: {correct}/6 {answered > 0 && answered < 6 ? `(${answered} done)` : ''}
                  </span>
                </div>

                <h2 className="font-display text-lg font-semibold text-[#dee2f6] group-hover:text-white transition-colors">
                  {exp.title}
                </h2>

                <p className="text-xs text-[#bfc7d2] line-clamp-2 leading-relaxed">
                  {exp.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <code className="text-xs font-mono text-[#93ccff] truncate max-w-[70%]">
                  {exp.formula}
                </code>
                <span className="text-xs font-mono text-[var(--lab-accent)] group-hover:translate-x-1 transition-transform">
                  Launch →
                </span>
              </div>
            </button>
          );
        })}
      </section>
    </main>
  );
};
