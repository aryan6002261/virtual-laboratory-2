import React, { useState } from 'react';
import { ExperimentMeta, ExperimentPedagogy, ObservationEntry } from '../types/lab';
import { BookOpen, Printer, Download, X, Save } from 'lucide-react';
import { labAudio } from '../utils/audio';

interface Props {
  studentName: string;
  exp: ExperimentMeta;
  pedagogy: ExperimentPedagogy;
  logs: ObservationEntry[];
  quizScore?: { score: number; total: number };
  onClose: () => void;
}

export const LabNotebookModal: React.FC<Props> = ({
  studentName,
  exp,
  pedagogy,
  logs,
  quizScore,
  onClose,
}) => {
  const [studentNotes, setStudentNotes] = useState<string>(() => {
    return window.localStorage.getItem(`vsl_notebook_notes_${exp.id}`) ||
      'Hypothesis: As input parameters increase, the resultant telemetry scales in direct accordance with the governing physical law. Systematic zero-offsets were minimized prior to trial logging.';
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveNotes = () => {
    window.localStorage.setItem(`vsl_notebook_notes_${exp.id}`, studentNotes);
    setSavedSuccess(true);
    labAudio.playClick();
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handlePrint = () => {
    labAudio.playClick();
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const md = `# VIRTUAL LAB NOTEBOOK: ${exp.title}
Student: ${studentName}
Date: ${new Date().toLocaleDateString()}
Formula: ${exp.formula}

## 1. Objectives & Summary
${exp.summary}

## 2. Student Notes & Observations
${studentNotes}

## 3. Empirical Trials Logged (${logs.length} Total)
| Trial | Time | ${pedagogy.logColumns.join(' | ')} |
|---|---|${pedagogy.logColumns.map(() => '---').join('|')}|
${logs.map((l) => `| #${l.trial} | ${l.timestamp} | ${pedagogy.logColumns.map((c) => l.values[c] ?? '').join(' | ')} |`).join('\n')}

## 4. Mastery Evaluation
Score: ${quizScore ? `${quizScore.score} / ${quizScore.total}` : 'N/A'}
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lab-Notebook-${exp.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
    labAudio.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-elevated rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/20 bg-[#0e1321]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090e1c] no-print">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--lab-accent)]" />
            <div>
              <h2 className="font-display text-lg font-bold text-[#dee2f6]">
                Virtual Laboratory Notebook
              </h2>
              <p className="text-xs text-[#89929b]">
                Student: {studentName} · Practical 0{exp.index}: {exp.shortTitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-white/5 border border-white/15 hover:bg-white/15 text-[#dee2f6] transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export Markdown
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[var(--lab-accent)] text-white hover:brightness-110 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print Notebook
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[#89929b] hover:text-white p-1 rounded cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notebook Content */}
        <div className="flex-1 overflow-auto p-8 flex flex-col gap-6 bg-[#090e1c] text-[#dee2f6] text-xs font-sans">
          {/* Notebook Header */}
          <div className="border-b border-white/15 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono text-[#93ccff] block">
                EXPERIMENTAL RESEARCH LOG · NOTEBOOK ENTRY
              </span>
              <h1 className="font-display text-2xl font-bold text-white mt-1">
                {exp.title}
              </h1>
              <p className="font-mono text-xs text-[#89929b] mt-0.5">
                Investigator: <strong>{studentName}</strong> · Date: {new Date().toLocaleDateString()}
              </p>
            </div>
            {quizScore && (
              <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-right">
                <span className="text-[11px] text-emerald-300 block font-mono">Quiz Verified</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {quizScore.score} / {quizScore.total}
                </span>
              </div>
            )}
          </div>

          {/* Theoretical Law */}
          <div className="p-3.5 rounded bg-white/[0.02] border border-white/10 font-mono">
            <span className="text-[#89929b] text-[11px] block mb-1">Governing Physical Relation:</span>
            <code className="text-[#93ccff] text-sm font-bold">{exp.formula}</code>
          </div>

          {/* Student Observations & Notes */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-display text-sm font-semibold text-white">
                Investigator Observations, Analysis & Notes:
              </label>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="no-print inline-flex items-center gap-1 text-[11px] font-mono text-sky-400 hover:text-sky-300 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> {savedSuccess ? 'Saved to Browser!' : 'Save Notes'}
              </button>
            </div>
            <textarea
              rows={4}
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              className="w-full bg-[#0e1321] border border-white/15 rounded p-3 text-xs text-[#dee2f6] leading-relaxed outline-none"
              placeholder="Record your observations, hypotheses, deviations, and conclusions here..."
            />
          </div>

          {/* Recorded Empirical Trials */}
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-sm font-semibold text-white">
              Recorded Empirical Trials ({logs.length} Total Captured)
            </h3>

            {logs.length === 0 ? (
              <p className="text-[#89929b] italic py-4">
                No trials recorded during this session yet. Return to the simulation and click Record Trial.
              </p>
            ) : (
              <div className="overflow-x-auto rounded border border-white/10">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-white/10 text-white font-semibold">
                      <th className="p-2.5">Trial</th>
                      <th className="p-2.5">Timestamp</th>
                      {pedagogy.logColumns.map((c) => (
                        <th key={c} className="p-2.5">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((row) => (
                      <tr key={row.trial} className="border-t border-white/5">
                        <td className="p-2 text-[#93ccff]">#{row.trial}</td>
                        <td className="p-2 text-[#89929b]">{row.timestamp}</td>
                        {pedagogy.logColumns.map((c) => (
                          <td key={c} className="p-2 text-[#dee2f6]">
                            {row.values[c] ?? '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#090e1c] flex justify-end no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

