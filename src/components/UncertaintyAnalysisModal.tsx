import React, { useState } from 'react';
import { ObservationEntry } from '../types/lab';
import { Calculator, X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  logs: ObservationEntry[];
  columns: string[];
  onClose: () => void;
}

export const UncertaintyAnalysisModal: React.FC<Props> = ({ logs, columns, onClose }) => {
  // Numeric columns
  const numCols = columns.filter((col) => {
    return logs.some((l) => !isNaN(parseFloat(l.values[col])));
  });

  const [targetCol, setTargetCol] = useState<string>(numCols[0] || '');
  const [theoreticalVal, setTheoreticalVal] = useState<string>('');

  const values = logs
    .map((l) => parseFloat(l.values[targetCol]))
    .filter((v) => !isNaN(v));

  const n = values.length;
  const mean = n > 0 ? values.reduce((a, b) => a + b, 0) / n : 0;

  // Sample Standard Deviation
  const variance =
    n > 1
      ? values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n - 1)
      : 0;
  const stdDev = Math.sqrt(variance);

  // Standard Error of Mean
  const stdError = n > 0 ? stdDev / Math.sqrt(n) : 0;

  // Relative Standard Deviation (RSD / CV%)
  const rsd = mean !== 0 ? (stdDev / Math.abs(mean)) * 100 : 0;

  // Percent Error vs Theoretical
  const theo = parseFloat(theoreticalVal);
  const percentError =
    !isNaN(theo) && theo !== 0
      ? (Math.abs(mean - theo) / Math.abs(theo)) * 100
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-panel-elevated rounded-lg max-w-2xl w-full overflow-hidden flex flex-col border border-white/15 bg-[#0e1321]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090e1c]">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[var(--lab-accent)]" />
            <h2 className="font-display text-lg font-bold text-[#dee2f6]">
              Statistical Uncertainty & Error Analysis
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

        <div className="p-6 flex flex-col gap-5 text-xs font-mono">
          {/* Target column selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#89929b] block mb-1">Observation Metric:</label>
              <select
                value={targetCol}
                onChange={(e) => setTargetCol(e.target.value)}
                className="w-full bg-[#090e1c] border border-white/15 rounded px-3 py-2 text-[#dee2f6] outline-none"
              >
                {numCols.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[#89929b] block mb-1">
                Accepted / Theoretical Standard Value (Optional):
              </label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 9.81, 1.52, 100"
                value={theoreticalVal}
                onChange={(e) => setTheoreticalVal(e.target.value)}
                className="w-full bg-[#090e1c] border border-white/15 rounded px-3 py-2 text-[#dee2f6] outline-none placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#090e1c] p-3 rounded border border-white/10">
              <span className="text-[#89929b] block text-[11px]">Sample Size (N)</span>
              <span className="text-[#93ccff] text-base font-bold">{n} trials</span>
            </div>

            <div className="bg-[#090e1c] p-3 rounded border border-white/10">
              <span className="text-[#89929b] block text-[11px]">Mean Value (x̄)</span>
              <span className="text-[#dee2f6] text-base font-bold">{mean.toFixed(4)}</span>
            </div>

            <div className="bg-[#090e1c] p-3 rounded border border-white/10">
              <span className="text-[#89929b] block text-[11px]">Sample Std Dev (s)</span>
              <span className="text-amber-300 text-base font-bold">±{stdDev.toFixed(4)}</span>
            </div>

            <div className="bg-[#090e1c] p-3 rounded border border-white/10">
              <span className="text-[#89929b] block text-[11px]">Std Error (SE = s/√N)</span>
              <span className="text-sky-300 text-base font-bold">±{stdError.toFixed(4)}</span>
            </div>

            <div className="bg-[#090e1c] p-3 rounded border border-white/10">
              <span className="text-[#89929b] block text-[11px]">Relative Uncertainty (CV%)</span>
              <span className="text-purple-300 text-base font-bold">{rsd.toFixed(2)}%</span>
            </div>

            <div className="bg-[#090e1c] p-3 rounded border border-white/10">
              <span className="text-[#89929b] block text-[11px]">Reported Result</span>
              <span className="text-emerald-300 text-xs font-bold leading-relaxed block mt-1">
                {mean.toFixed(3)} ± {stdError.toFixed(3)}
              </span>
            </div>
          </div>

          {/* Percent Error evaluation */}
          {percentError !== null && (
            <div className="p-3.5 rounded border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-200">
                  Percentage Error vs Theoretical ({theo}):
                </span>
              </div>
              <span className="text-emerald-300 font-bold text-sm">
                {percentError.toFixed(2)}%
              </span>
            </div>
          )}

          {/* Educational Note */}
          <div className="p-3 rounded bg-white/[0.02] border border-white/5 text-[#89929b] text-[11px] leading-relaxed">
            <span className="text-amber-300 font-semibold block mb-0.5">
              Experimental Best Practice:
            </span>
            Standard Error of the Mean (SE) quantifies precision and random fluctuations. A lower SE indicates higher repeatability. When % Error is significantly higher than CV%, systematic errors (such as calibration offsets or paraxial approximations) dominate over random errors.
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

