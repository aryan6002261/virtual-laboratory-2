import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Download, Trash2 } from 'lucide-react';
import { getExperimentById, getExperimentsByLab, getLabById } from '../data/labs';
import { getPedagogyForExperiment } from '../data/curriculum';
import { getQuizForExperiment } from '../data/quizzes';
import { LabId, ObservationEntry, QuizProgressMap } from '../types/lab';
import { SimulationStage } from './simulations/SimulationStage';
import { ConceptSchematic } from './schematics/ConceptSchematic';
import { QuizSuite } from './QuizSuite';
import { labAudio } from '../utils/audio';

interface PracticalWorkbenchProps {
  labId: LabId;
  expId: string;
  quizProgress: QuizProgressMap;
  onAnswerQuiz: (expId: string, qIndex: number, selectedIndex: number, isCorrect: boolean) => void;
  onResetQuiz: (expId: string) => void;
  onBackHome: () => void;
  onBackToLab: (labId: LabId) => void;
  onSelectExperiment: (labId: LabId, expId: string) => void;
}

export const PracticalWorkbench: React.FC<PracticalWorkbenchProps> = ({
  labId,
  expId,
  quizProgress,
  onAnswerQuiz,
  onResetQuiz,
  onBackHome,
  onBackToLab,
  onSelectExperiment,
}) => {
  const lab = getLabById(labId);
  const exp = getExperimentById(expId);
  const suiteExperiments = getExperimentsByLab(labId);
  const pedagogy = getPedagogyForExperiment(expId);
  const questions = getQuizForExperiment(expId);

  const [logs, setLogs] = useState<ObservationEntry[]>([]);

  useEffect(() => {
    setLogs([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [expId]);

  if (!exp || !pedagogy) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 py-16 text-center">
        <p className="text-[#bfc7d2]">Experiment not found.</p>
        <button
          type="button"
          onClick={onBackHome}
          className="mt-4 px-4 py-2 rounded bg-[var(--lab-accent)] text-white text-sm cursor-pointer"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  const currentIdx = suiteExperiments.findIndex((e) => e.id === exp.id);
  const prevExp = currentIdx > 0 ? suiteExperiments[currentIdx - 1] : null;
  const nextExp = currentIdx >= 0 && currentIdx < suiteExperiments.length - 1 ? suiteExperiments[currentIdx + 1] : null;

  const handleRecord = (values: Record<string, string>) => {
    setLogs((prev) => [
      ...prev,
      {
        trial: prev.length + 1,
        timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        values,
      },
    ]);
  };

  const handleExportCsv = () => {
    if (logs.length === 0) return;
    const cols = ['Trial', 'Time', ...pedagogy.logColumns];
    const rows = logs.map((entry) => [
      entry.trial,
      entry.timestamp,
      ...pedagogy.logColumns.map((col) => entry.values[col] ?? ''),
    ]);
    const csv = [cols.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exp.id}-observations.csv`;
    a.click();
    URL.revokeObjectURL(url);
    labAudio.playClick();
  };

  return (
    <main className="max-w-[1440px] mx-auto px-5 sm:px-10 py-8 flex flex-col gap-10">
      {/* Breadcrumb + Practical Header */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#89929b]">
          <div className="flex items-center gap-2">
            <button type="button" onClick={onBackHome} className="hover:text-white transition-colors cursor-pointer">
              Hub
            </button>
            <span>/</span>
            <button type="button" onClick={() => onBackToLab(labId)} className="hover:text-white transition-colors cursor-pointer">
              {lab.name}
            </button>
            <span>/</span>
            <span className="text-[#dee2f6]">Practical 0{exp.index}</span>
          </div>

          <div className="flex items-center gap-2">
            {prevExp && (
              <button
                type="button"
                onClick={() => onSelectExperiment(labId, prevExp.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[#bfc7d2] hover:text-white cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" /> Prev
              </button>
            )}
            {nextExp && (
              <button
                type="button"
                onClick={() => onSelectExperiment(labId, nextExp.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[#bfc7d2] hover:text-white cursor-pointer"
              >
                Next <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#dee2f6] text-balance">
              {exp.title}
            </h1>
            <p className="text-sm sm:text-base text-[#bfc7d2] mt-1.5 max-w-3xl">
              {exp.summary}
            </p>
          </div>
          <code className="px-3.5 py-2 rounded bg-[#090e1c] border border-white/10 font-mono text-xs sm:text-sm text-[#93ccff] shrink-0">
            {exp.formula}
          </code>
        </div>
      </div>

      {/* Stage 1: Interactive Simulation & Telemetry */}
      <section className="flex flex-col gap-5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-[#dee2f6]">
            01. Interactive Simulation & Live Telemetry
          </h2>
          <span className="text-xs font-mono text-[#89929b] hidden sm:inline">
            60 FPS Canvas Engine
          </span>
        </div>

        <SimulationStage labId={labId} expId={exp.id} onRecord={handleRecord} />

        {/* Empirical Observation Log Table */}
        <div className="glass-panel rounded-md overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-[#090e1c]/60">
            <div>
              <h3 className="text-sm font-semibold text-[#dee2f6]">Empirical Observation Log</h3>
              <p className="text-xs text-[#89929b]">
                Click Record Trial in the simulation toolbar to capture live readings.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={logs.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-white/5 border border-white/10 text-[#dee2f6] hover:border-white/25 disabled:opacity-40 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
              <button
                type="button"
                onClick={() => { setLogs([]); labAudio.playClick(); }}
                disabled={logs.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-white/5 border border-white/10 text-[#bfc7d2] hover:text-rose-300 disabled:opacity-40 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono tabular-nums">
              <thead>
                <tr className="border-b border-white/10 text-[#89929b] bg-[#090e1c]/40">
                  <th className="py-2.5 px-4 font-medium">Trial</th>
                  <th className="py-2.5 px-4 font-medium">Time</th>
                  {pedagogy.logColumns.map((col) => (
                    <th key={col} className="py-2.5 px-4 font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={pedagogy.logColumns.length + 2}
                      className="py-6 px-4 text-center text-[#89929b] font-sans"
                    >
                      No trials recorded yet. Adjust simulation controls and click Record Trial to log data.
                    </td>
                  </tr>
                ) : (
                  logs.map((row) => (
                    <tr key={row.trial} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-2 px-4 text-[#93ccff]">#{row.trial}</td>
                      <td className="py-2 px-4 text-[#89929b]">{row.timestamp}</td>
                      {pedagogy.logColumns.map((col) => (
                        <td key={col} className="py-2 px-4 text-[#dee2f6]">
                          {row.values[col] ?? '—'}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Stage 2 & Stage 3 Split: Vector SVG Concept Diagram + Procedural Flowchart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 glass-panel rounded-md p-5 sm:p-6 flex flex-col gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#dee2f6]">
              02. Vector Concept Architecture
            </h2>
            <p className="text-xs sm:text-sm text-[#89929b] mt-0.5">
              High-resolution vector schematic illustrating underlying physical geometries and signal flows.
            </p>
          </div>
          <div className="rounded border border-white/10 bg-[#090e1c] overflow-hidden p-2">
            <ConceptSchematic labId={labId} expId={exp.id} />
          </div>
        </section>

        <section className="lg:col-span-5 glass-panel rounded-md p-5 sm:p-6 flex flex-col gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#dee2f6]">
              03. Procedural Execution Flowchart
            </h2>
            <p className="text-xs sm:text-sm text-[#89929b] mt-0.5">
              Step-by-step experimental protocol and decision thresholds.
            </p>
          </div>

          <div className="flowchart-container flex flex-col gap-2">
            {pedagogy.flowchart.map((st, idx) => (
              <React.Fragment key={st.step}>
                <div className="flow-step rounded bg-[#090e1c]/90 border border-white/10 p-3.5 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[var(--lab-accent)]">
                      Step 0{st.step} · {st.title}
                    </span>
                  </div>
                  <p className="text-xs text-[#bfc7d2] leading-relaxed">{st.detail}</p>
                  {st.condition && (
                    <p className="mt-1 font-mono text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/25 rounded px-2 py-1">
                      {st.condition}
                    </p>
                  )}
                </div>
                {idx < pedagogy.flowchart.length - 1 && (
                  <div className="flow-arrow text-center font-mono text-xs text-[#89929b] leading-none py-0.5">
                    ↓
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>
      </div>

      {/* Stage 4: Comprehensive Theory, Mathematical Formulations & Engineering Notes */}
      <section className="glass-panel rounded-md p-6 sm:p-8 flex flex-col gap-6">
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#dee2f6] border-b border-white/10 pb-3">
          04. Theoretical Foundations & Mathematical Formulations
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 flex flex-col gap-4">
            {pedagogy.theoryParagraphs.map((para, idx) => (
              <p key={idx} className="text-sm sm:text-base text-[#bfc7d2] leading-relaxed">
                {para}
              </p>
            ))}

            <div className="pt-2">
              <h3 className="text-sm font-semibold text-[#dee2f6] mb-2">
                Real-World Engineering Applications
              </h3>
              <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#bfc7d2]">
                {pedagogy.realWorldApplications.map((app, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-mono text-[var(--lab-accent)] shrink-0">0{i + 1}.</span>
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-[#dee2f6]">Key Mathematical Equations</h3>
            {pedagogy.equations.map((eq) => (
              <div
                key={eq.name}
                className="rounded bg-[#090e1c]/90 border border-white/10 p-4 flex flex-col gap-1.5"
              >
                <span className="text-xs font-medium text-[#89929b]">{eq.name}</span>
                <code className="font-mono text-sm sm:text-base font-semibold text-[#93ccff]">
                  {eq.expression}
                </code>
                <p className="text-xs text-[#bfc7d2] leading-relaxed">{eq.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stage 5: 6-Question Mastery Quiz Suite */}
      <QuizSuite
        expId={exp.id}
        questions={questions}
        progress={quizProgress}
        onAnswer={onAnswerQuiz}
        onResetQuiz={onResetQuiz}
      />
    </main>
  );
};
