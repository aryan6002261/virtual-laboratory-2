import React from 'react';
import { ExperimentMeta, ExperimentPedagogy, QuizQuestion } from '../types/lab';
import { FileText, Printer, X, Download } from 'lucide-react';
import { labAudio } from '../utils/audio';

interface Props {
  exp: ExperimentMeta;
  pedagogy: ExperimentPedagogy;
  questions: QuizQuestion[];
  onClose: () => void;
}

export const LabManualModal: React.FC<Props> = ({ exp, pedagogy, questions, onClose }) => {
  const handlePrint = () => {
    labAudio.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-elevated rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/20 bg-[#0e1321]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090e1c] no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--lab-accent)]" />
            <div>
              <h2 className="font-display text-lg font-bold text-[#dee2f6]">
                Academic Laboratory Manual & Protocol Sheet
              </h2>
              <p className="text-xs text-[#89929b]">
                Standard Academic Format (Print / PDF Ready)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[var(--lab-accent)] text-white hover:brightness-110 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
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

        {/* Printable Manual Content */}
        <div className="flex-1 overflow-auto p-8 flex flex-col gap-8 bg-[#0b101d] text-[#dee2f6] text-xs leading-relaxed font-sans">
          {/* Header Title Banner */}
          <div className="border-b-2 border-white/20 pb-4 text-center">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#93ccff] block">
              Department of STEM Experimental Sciences · Virtual Laboratory Manual
            </span>
            <h1 className="font-display text-2xl font-bold text-white mt-1">
              EXPERIMENT 0{exp.index}: {exp.title.toUpperCase()}
            </h1>
            <p className="font-mono text-xs text-[#89929b] mt-1">
              Standard Formulation: {exp.formula} · Difficulty: {exp.difficulty}
            </p>
          </div>

          {/* Section 1: Aim & Objective */}
          <div>
            <h3 className="font-bold text-sm text-[#38bdf8] uppercase tracking-wider mb-2 font-mono">
              1. AIM & LEARNING OBJECTIVES
            </h3>
            <p className="text-[#bfc7d2]">
              To experimentally verify and validate <strong>{exp.title}</strong> by observing physical relationships, taking empirical measurements of telemetry parameters, plotting response graphs, and conducting quantitative uncertainty analysis.
            </p>
          </div>

          {/* Section 2: Theoretical Background */}
          <div>
            <h3 className="font-bold text-sm text-[#38bdf8] uppercase tracking-wider mb-2 font-mono">
              2. THEORETICAL FOUNDATION & DERIVATIONS
            </h3>
            <div className="flex flex-col gap-2.5 text-[#bfc7d2]">
              {pedagogy.theoryParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="mt-4 p-3 bg-white/[0.03] rounded border border-white/10 flex flex-col gap-2">
              <span className="font-mono text-xs font-semibold text-white">Governing Analytical Equations:</span>
              {pedagogy.equations.map((eq) => (
                <div key={eq.name} className="font-mono text-xs">
                  <span className="text-[#93ccff] font-bold">{eq.name}: </span>
                  <code className="text-emerald-300 font-semibold">{eq.expression}</code>
                  <span className="text-[#89929b] ml-2">({eq.notes})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Apparatus */}
          <div>
            <h3 className="font-bold text-sm text-[#38bdf8] uppercase tracking-wider mb-2 font-mono">
              3. VIRTUAL APPARATUS & SIMULATION INSTRUMENTS
            </h3>
            <ul className="list-disc list-inside text-[#bfc7d2] flex flex-col gap-1">
              {exp.concepts.map((c) => (
                <li key={c}>{c} Component / Measurement Sensor</li>
              ))}
              <li>60 FPS HiDPI Dynamic Canvas Bench with Parametric Slider Controls</li>
              <li>Real-time telemetry indicators and observation trial logger</li>
            </ul>
          </div>

          {/* Section 4: Procedural Flow */}
          <div>
            <h3 className="font-bold text-sm text-[#38bdf8] uppercase tracking-wider mb-2 font-mono">
              4. EXPERIMENTAL PROCEDURE
            </h3>
            <ol className="list-decimal list-inside text-[#bfc7d2] flex flex-col gap-2">
              {pedagogy.flowchart.map((st) => (
                <li key={st.step}>
                  <strong>{st.title}:</strong> {st.detail}
                  {st.condition && <span className="text-amber-300 font-mono ml-2">[{st.condition}]</span>}
                </li>
              ))}
            </ol>
          </div>

          {/* Section 5: Precautions */}
          <div>
            <h3 className="font-bold text-sm text-[#f59e0b] uppercase tracking-wider mb-2 font-mono">
              5. PRECAUTIONS & ERROR MINIMIZATION
            </h3>
            <ul className="list-disc list-inside text-[#bfc7d2] flex flex-col gap-1">
              {exp.precautions.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
              {exp.commonErrors.map((e, i) => (
                <li key={`err-${i}`} className="text-amber-200/90">Error Source: {e}</li>
              ))}
            </ul>
          </div>

          {/* Section 6: Observation Table Structure */}
          <div>
            <h3 className="font-bold text-sm text-[#38bdf8] uppercase tracking-wider mb-2 font-mono">
              6. OBSERVATION DATA PROTOCOL
            </h3>
            <table className="w-full border-collapse border border-white/20 text-center text-xs font-mono">
              <thead>
                <tr className="bg-white/10 text-white font-semibold">
                  <th className="border border-white/20 p-2">Trial #</th>
                  {pedagogy.logColumns.map((col) => (
                    <th key={col} className="border border-white/20 p-2">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((tr) => (
                  <tr key={tr} className="border border-white/20">
                    <td className="border border-white/20 p-2 text-[#93ccff]">#{tr}</td>
                    {pedagogy.logColumns.map((col) => (
                      <td key={col} className="border border-white/20 p-2 text-[#89929b]">—</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 7: Viva Voce Questions */}
          <div>
            <h3 className="font-bold text-sm text-[#38bdf8] uppercase tracking-wider mb-2 font-mono">
              7. VIVA VOCE & ASSESSMENT QUESTIONS
            </h3>
            <div className="flex flex-col gap-2 text-[#bfc7d2]">
              {questions.slice(0, 3).map((q, i) => (
                <div key={q.id}>
                  <p className="font-semibold text-white">Q{i + 1}. {q.prompt}</p>
                  <p className="text-[#89929b] text-[11px] italic mt-0.5">Answer Key / Explanation: {q.explanation}</p>
                </div>
              ))}
            </div>
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

