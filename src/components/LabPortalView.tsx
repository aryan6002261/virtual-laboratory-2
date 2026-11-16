import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getExperimentsByLab, getLabById } from '../data/labs';
import { LabId, QuizProgressMap } from '../types/lab';

interface LabPortalViewProps {
  labId: LabId;
  quizProgress: QuizProgressMap;
  onBackHome: () => void;
  onSelectExperiment: (labId: LabId, expId: string) => void;
}

export const LabPortalView: React.FC<LabPortalViewProps> = ({
  labId,
  quizProgress,
  onBackHome,
  onSelectExperiment,
}) => {
  const lab = getLabById(labId);
  const experiments = getExperimentsByLab(labId);

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

      {/* Experiments List */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {experiments.map((exp) => {
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
                  <span>Practical 0{exp.index}</span>
                  <span className="tabular-nums flex items-center gap-1">
                    {correct === 6 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    Quiz: {correct}/6 {answered > 0 && answered < 6 ? `(${answered} done)` : ''}
                  </span>
                </div>

                <h2 className="font-display text-lg font-semibold text-[#dee2f6] group-hover:text-white transition-colors">
                  {exp.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#bfc7d2] leading-relaxed">
                  {exp.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
                <code className="text-xs font-mono text-[#93ccff] truncate">
                  {exp.formula}
                </code>
                <div className="flex items-center justify-between text-xs text-[#89929b]">
                  <span className="truncate">{exp.concepts.join(' · ')}</span>
                  <span className="font-medium text-[#dee2f6] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                    Open →
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </section>
    </main>
  );
};
