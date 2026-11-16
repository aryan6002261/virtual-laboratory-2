import React, { useState } from 'react';
import { ExperimentMeta, ExperimentPedagogy } from '../types/lab';
import { BookOpen, Copy, Check, X } from 'lucide-react';
import { labAudio } from '../utils/audio';

interface Props {
  exp: ExperimentMeta;
  pedagogy: ExperimentPedagogy;
  onClose: () => void;
}

export const FormulaSheetModal: React.FC<Props> = ({ exp, pedagogy, onClose }) => {
  const [copiedEq, setCopiedEq] = useState<string | null>(null);

  const handleCopy = (expression: string) => {
    navigator.clipboard.writeText(expression);
    setCopiedEq(expression);
    labAudio.playClick();
    setTimeout(() => setCopiedEq(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-panel-elevated rounded-lg max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-white/15 bg-[#0e1321]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090e1c]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--lab-accent)]" />
            <h2 className="font-display text-lg font-bold text-[#dee2f6]">
              Formula Reference & Mathematical Derivations
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#89929b] hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 flex flex-col gap-6 text-sm">
          {/* Main Primary Formula Banner */}
          <div className="p-4 rounded-md bg-[var(--lab-accent)]/10 border border-[var(--lab-accent)]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs text-[var(--lab-accent)] block mb-1">
                Primary Governing Relationship:
              </span>
              <code className="font-mono text-lg font-bold text-[#93ccff]">
                {exp.formula}
              </code>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(exp.formula)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-white/10 hover:bg-white/20 text-[#dee2f6] transition cursor-pointer shrink-0"
            >
              {copiedEq === exp.formula ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedEq === exp.formula ? 'Copied' : 'Copy Formula'}
            </button>
          </div>

          {/* Derivation Overview */}
          {exp.derivationOverview && (
            <div className="p-4 rounded bg-[#090e1c] border border-white/10 flex flex-col gap-2">
              <h3 className="text-xs font-mono font-semibold text-[#89929b] uppercase tracking-wider">
                Derivation & Physical Context
              </h3>
              <p className="text-xs sm:text-sm text-[#bfc7d2] leading-relaxed">
                {exp.derivationOverview}
              </p>
            </div>
          )}

          {/* All Equations Table */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-mono font-semibold text-[#89929b] uppercase tracking-wider">
              Constitutive Equations & Analytical Relations
            </h3>

            <div className="flex flex-col gap-3">
              {pedagogy.equations.map((eq) => (
                <div
                  key={eq.name}
                  className="rounded bg-[#090e1c] border border-white/10 p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#dee2f6]">{eq.name}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(eq.expression)}
                      className="text-[#89929b] hover:text-white p-1 rounded transition cursor-pointer"
                    >
                      {copiedEq === eq.expression ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <code className="font-mono text-base font-bold text-[#93ccff] bg-white/[0.03] p-2.5 rounded border border-white/5">
                    {eq.expression}
                  </code>
                  <p className="text-xs text-[#89929b] leading-relaxed">{eq.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#090e1c] flex justify-end">
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

