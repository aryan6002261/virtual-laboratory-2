import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ObservationEntry } from '../types/lab';
import { Download, TrendingUp, BarChart2 } from 'lucide-react';
import { labAudio } from '../utils/audio';

interface Props {
  logs: ObservationEntry[];
  columns: string[];
}

export const DataAnalysisPlotter: React.FC<Props> = ({ logs, columns }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Identify numeric columns
  const numericCols = useMemo(() => {
    if (logs.length === 0) return columns;
    return columns.filter((col) => {
      const val = logs[0]?.values[col];
      return val !== undefined && !isNaN(parseFloat(val));
    });
  }, [logs, columns]);

  const [xCol, setXCol] = useState<string>(numericCols[0] || 'Trial');
  const [yCol, setYCol] = useState<string>(numericCols[1] || numericCols[0] || 'Value');

  // Parse points
  const points = useMemo(() => {
    return logs
      .map((entry) => {
        const xVal = xCol === 'Trial' ? entry.trial : parseFloat(entry.values[xCol]);
        const yVal = parseFloat(entry.values[yCol]);
        if (isNaN(xVal) || isNaN(yVal)) return null;
        return { x: xVal, y: yVal, trial: entry.trial };
      })
      .filter((p): p is { x: number; y: number; trial: number } => p !== null);
  }, [logs, xCol, yCol]);

  // Linear Regression
  const stats = useMemo(() => {
    const n = points.length;
    if (n < 2) return null;

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
    for (const p of points) {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumX2 += p.x * p.x;
      sumY2 += p.y * p.y;
    }

    const meanX = sumX / n;
    const meanY = sumY / n;
    const denominator = n * sumX2 - sumX * sumX;

    if (Math.abs(denominator) < 1e-12) return null;

    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = meanY - slope * meanX;

    // R^2
    const ssTotal = sumY2 - (sumY * sumY) / n;
    const ssRes = points.reduce((acc, p) => {
      const pred = slope * p.x + intercept;
      return acc + Math.pow(p.y - pred, 2);
    }, 0);

    const r2 = ssTotal > 0 ? Math.max(0, Math.min(1, 1 - ssRes / ssTotal)) : 1.0;

    return { slope, intercept, r2, meanX, meanY, n };
  }, [points]);

  // Render on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(300, rect.width);
    const h = 260;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#090e1c';
    ctx.fillRect(0, 0, w, h);

    if (points.length === 0) {
      ctx.fillStyle = '#89929b';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('No numerical trials recorded yet to plot.', w / 2, h / 2);
      return;
    }

    const padL = 55, padR = 25, padT = 30, padB = 40;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    let minX = Math.min(...points.map((p) => p.x));
    let maxX = Math.max(...points.map((p) => p.x));
    let minY = Math.min(...points.map((p) => p.y));
    let maxY = Math.max(...points.map((p) => p.y));

    if (minX === maxX) { minX -= 1; maxX += 1; }
    if (minY === maxY) { minY -= 1; maxY += 1; }

    const spanX = maxX - minX;
    const spanY = maxY - minY;
    minX -= spanX * 0.05; maxX += spanX * 0.05;
    minY -= spanY * 0.05; maxY += spanY * 0.05;

    const toPxX = (x: number) => padL + ((x - minX) / (maxX - minX)) * plotW;
    const toPxY = (y: number) => padT + plotH - ((y - minY) / (maxY - minY)) * plotH;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
      const gx = padL + (i / gridCount) * plotW;
      ctx.beginPath();
      ctx.moveTo(gx, padT);
      ctx.lineTo(gx, padT + plotH);
      ctx.stroke();

      const gy = padT + (i / gridCount) * plotH;
      ctx.beginPath();
      ctx.moveTo(padL, gy);
      ctx.lineTo(padL + plotW, gy);
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#89929b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      const xVal = minX + (i / gridCount) * (maxX - minX);
      ctx.fillText(xVal.toFixed(1), gx, padT + plotH + 16);

      ctx.textAlign = 'right';
      const yVal = maxY - (i / gridCount) * (maxY - minY);
      ctx.fillText(yVal.toFixed(1), padL - 8, gy + 3);
    }

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    // Axis titles
    ctx.fillStyle = '#bfc7d2';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${xCol} (X)`, padL + plotW / 2, h - 10);

    ctx.save();
    ctx.translate(14, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${yCol} (Y)`, 0, 0);
    ctx.restore();

    // Regression Line
    if (stats) {
      const x1 = minX;
      const y1 = stats.slope * x1 + stats.intercept;
      const x2 = maxX;
      const y2 = stats.slope * x2 + stats.intercept;

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(toPxX(x1), toPxY(y1));
      ctx.lineTo(toPxX(x2), toPxY(y2));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Plot Points
    for (const p of points) {
      const px = toPxX(p.x);
      const py = toPxY(p.y);

      // Glow
      ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fill();

      // Center
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [points, stats, xCol, yCol]);

  const handleDownloadPlot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `plot-${xCol}-vs-${yCol}.png`;
    a.click();
    labAudio.playClick();
  };

  return (
    <div className="glass-panel rounded-md p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[var(--lab-accent)]" />
          <h3 className="text-sm font-semibold text-[#dee2f6]">Dynamic Graph & Linear Regression</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPlot}
            disabled={points.length === 0}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-white/5 border border-white/10 text-[#bfc7d2] hover:text-white disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Save PNG
          </button>
        </div>
      </div>

      {/* Axis Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[#89929b] shrink-0">X-Axis:</span>
          <select
            value={xCol}
            onChange={(e) => setXCol(e.target.value)}
            className="flex-1 bg-[#090e1c] border border-white/15 rounded px-2.5 py-1.5 text-[#dee2f6] font-mono outline-none"
          >
            <option value="Trial">Trial #</option>
            {numericCols.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[#89929b] shrink-0">Y-Axis:</span>
          <select
            value={yCol}
            onChange={(e) => setYCol(e.target.value)}
            className="flex-1 bg-[#090e1c] border border-white/15 rounded px-2.5 py-1.5 text-[#dee2f6] font-mono outline-none"
          >
            {numericCols.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Canvas */}
      <div className="w-full rounded border border-white/10 overflow-hidden bg-[#090e1c]">
        <canvas ref={canvasRef} className="w-full h-[260px] block" />
      </div>

      {/* Statistics readout */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-[#090e1c]/80 border border-white/10 rounded p-3">
          <div>
            <span className="text-[#89929b] block">Equation:</span>
            <span className="text-sky-300 font-semibold">
              y = {stats.slope.toFixed(3)}x {stats.intercept >= 0 ? '+' : '-'} {Math.abs(stats.intercept).toFixed(3)}
            </span>
          </div>
          <div>
            <span className="text-[#89929b] block">Slope (m):</span>
            <span className="text-[#dee2f6]">{stats.slope.toExponential(3)}</span>
          </div>
          <div>
            <span className="text-[#89929b] block">Intercept (c):</span>
            <span className="text-[#dee2f6]">{stats.intercept.toFixed(3)}</span>
          </div>
          <div>
            <span className="text-[#89929b] block">Fit Quality (R²):</span>
            <span className={`font-semibold ${stats.r2 > 0.9 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {(stats.r2 * 100).toFixed(1)}% (R²={stats.r2.toFixed(3)})
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

