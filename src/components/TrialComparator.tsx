import React, { useState } from 'react';
import { ObservationEntry } from '../types/lab';
import { Columns3, X } from 'lucide-react';

interface Props {
  logs: ObservationEntry[];
  columns: string[];
  onClose: () => void;
}

export const TrialComparator: React.FC<Props> = ({ logs, columns, onClose }) => {
  const [selectedTrials, setSelectedTrials] = useState<number[]>(() => {
    return logs.slice(-2).map((l) => l.trial);
  });

  const toggleTrial = (t: number) => {
    if (selectedTrials.includes(t)) {
      if (selectedTrials.length > 2) {
        setSelectedTrials(selectedTrials.filter((id) => id !== t));
      }
    } else {
      if (selectedTrials.length < 4) {
        setSelectedTrials([...selectedTrials, t]);
      }
    }
  };

  const comparedLogs = logs.filter((l) => selectedTrials.includes(l.trial));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-panel-elevated rounded-lg max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-white/15 bg-[#0e1321]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090e1c]">
          <div className="flex items-center gap-2">
            <Columns3 className="w-5 h-5 text-[var(--lab-accent)]" />
            <h2 className="font-display text-lg font-bold text-[#dee2f6]">
              Side-by-Side Experimental Trial Comparator
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

        {/* Trial Selectors */}
        <div className="px-6 py-3 border-b border-white/10 bg-white/[0.02] flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#89929b] font-mono">Select 2 to 4 trials to compare:</span>
          {logs.map((l) => {
            const isSelected = selectedTrials.includes(l.trial);
            return (
              <button
                key={l.trial}
                type="button"
                onClick={() => toggleTrial(l.trial)}
                className={`px-3 py-1 rounded font-mono transition cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--lab-accent)] text-white font-semibold'
                    : 'bg-white/5 border border-white/10 text-[#bfc7d2] hover:border-white/25'
                }`}
              >
                Trial #{l.trial}
              </button>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-auto p-6">
          {comparedLogs.length < 2 ? (
            <p className="text-center text-[#89929b] py-8 font-mono text-sm">
              Please select at least 2 trials above to compute variance and deltas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-[#89929b] bg-[#090e1c]">
                    <th className="py-2.5 px-4 font-semibold">Parameter / Metric</th>
                    {comparedLogs.map((c) => (
                      <th key={c.trial} className="py-2.5 px-4 font-semibold text-[#93ccff]">
                        Trial #{c.trial} ({c.timestamp})
                      </th>
                    ))}
                    {comparedLogs.length === 2 && (
                      <>
                        <th className="py-2.5 px-4 font-semibold text-amber-300">Delta (Δ)</th>
                        <th className="py-2.5 px-4 font-semibold text-emerald-300">% Variance</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {columns.map((col) => {
                    const val0 = parseFloat(comparedLogs[0]?.values[col] || '');
                    const val1 = parseFloat(comparedLogs[1]?.values[col] || '');
                    const hasTwoNum = !isNaN(val0) && !isNaN(val1);
                    const delta = hasTwoNum ? (val1 - val0).toFixed(3) : '—';
                    const pctVar = hasTwoNum && Math.abs(val0) > 1e-6
                      ? `${(((val1 - val0) / Math.abs(val0)) * 100).toFixed(1)}%`
                      : '—';

                    return (
                      <tr key={col} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-2.5 px-4 text-[#bfc7d2] font-semibold">{col}</td>
                        {comparedLogs.map((c) => (
                          <td key={c.trial} className="py-2.5 px-4 text-[#dee2f6]">
                            {c.values[col] ?? '—'}
                          </td>
                        ))}
                        {comparedLogs.length === 2 && (
                          <>
                            <td className="py-2.5 px-4 text-amber-300 font-bold">{delta}</td>
                            <td className="py-2.5 px-4 text-emerald-300 font-bold">{pctVar}</td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#090e1c] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

