import React, { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ClipboardPlus } from 'lucide-react';
import { TelemetryMetric } from '../../types/lab';
import { labAudio } from '../../utils/audio';

export function useHiDpiCanvas(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, timeSec: number) => void,
  deps: React.DependencyList,
  running: boolean = true
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let rafId = 0;
    const start = performance.now();

    const renderFrame = (now: number) => {
      const parent = canvas.parentElement;
      const rect = parent ? parent.getBoundingClientRect() : canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(320, Math.floor(rect.width));
      const h = Math.max(260, Math.floor(rect.height));

      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.scale(dpr, dpr);
        drawRef.current(ctx, w, h, (now - start) / 1000);
        ctx.restore();
      }
      if (running) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    rafId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, ...deps]);

  return canvasRef;
}

export function wavelengthToRgb(nm: number): string {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = -(nm - 440) / 60; b = 1; }
  else if (nm >= 440 && nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm >= 490 && nm < 510) { g = 1; b = -(nm - 510) / 20; }
  else if (nm >= 510 && nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm >= 580 && nm < 645) { r = 1; g = -(nm - 645) / 65; }
  else if (nm >= 645 && nm <= 780) { r = 1; }
  const factor = nm < 420 ? 0.35 + (0.65 * (nm - 380)) / 40 : nm > 700 ? 0.35 + (0.65 * (780 - nm)) / 80 : 1;
  return `rgb(${Math.round(r * factor * 255)}, ${Math.round(g * factor * 255)}, ${Math.round(b * factor * 255)})`;
}

export const SimShell: React.FC<{
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  telemetry: TelemetryMetric[];
  controls: React.ReactNode;
  running?: boolean;
  onToggleRun?: () => void;
  onReset?: () => void;
  onRecordTrial: () => void;
  toolbarExtra?: React.ReactNode;
  heightClass?: string;
}> = ({
  canvasRef,
  telemetry,
  controls,
  running,
  onToggleRun,
  onReset,
  onRecordTrial,
  toolbarExtra,
  heightClass = 'h-[360px] sm:h-[410px]',
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left 8-col Simulation Viewport + Telemetry */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="glass-panel rounded-md overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-white/10 bg-[#090e1c]/70">
            <div className="flex items-center gap-2">
              {onToggleRun && (
                <button
                  type="button"
                  onClick={() => {
                    labAudio.playClick();
                    onToggleRun();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-[var(--lab-accent)] text-white hover:brightness-110 transition cursor-pointer whitespace-nowrap"
                >
                  {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {running ? 'Pause' : 'Play'}
                </button>
              )}
              {onReset && (
                <button
                  type="button"
                  onClick={() => {
                    labAudio.playClick();
                    onReset();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-white/5 border border-white/10 text-[#dee2f6] hover:border-white/25 transition cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
              {toolbarExtra}
            </div>
            <button
              type="button"
              onClick={() => {
                labAudio.playTelemetryTone(620, 0.08);
                onRecordTrial();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-emerald-500/15 border border-emerald-400/35 text-emerald-300 hover:bg-emerald-500/25 transition cursor-pointer whitespace-nowrap"
            >
              <ClipboardPlus className="w-3.5 h-3.5" />
              Record Trial
            </button>
          </div>

          {/* Canvas Frame with L-shaped crosshair registration ticks */}
          <div className={`relative w-full ${heightClass} bg-[#090e1c] cursor-crosshair`}>
            <canvas ref={canvasRef} className="w-full h-full block" />
            {/* Corner crosshair ticks */}
            <span className="pointer-events-none absolute top-2.5 left-2.5 w-3 h-3 border-t border-l border-white/30" />
            <span className="pointer-events-none absolute top-2.5 right-2.5 w-3 h-3 border-t border-r border-white/30" />
            <span className="pointer-events-none absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l border-white/30" />
            <span className="pointer-events-none absolute bottom-2.5 right-2.5 w-3 h-3 border-b border-r border-white/30" />
          </div>
        </div>

        {/* Live Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {telemetry.map((m) => (
            <div
              key={m.label}
              className="glass-panel rounded-md px-3.5 py-2.5 flex flex-col justify-between"
            >
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#89929b] truncate">
                {m.label}
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span
                  className={`text-lg sm:text-xl font-mono font-semibold tabular-nums ${
                    m.tone === 'alert'
                      ? 'text-rose-400'
                      : m.tone === 'warning'
                      ? 'text-amber-400'
                      : m.tone === 'nominal'
                      ? 'text-emerald-400'
                      : 'text-[#dee2f6]'
                  }`}
                >
                  {m.value}
                </span>
                {m.unit && (
                  <span className="text-[11px] font-mono text-[#89929b]">{m.unit}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right 4-col Control Deck */}
      <div className="lg:col-span-4 glass-panel rounded-md p-4 sm:p-5 flex flex-col gap-4">
        <div className="pb-2.5 border-b border-white/10">
          <h3 className="text-sm font-semibold text-[#dee2f6]">Instrument Controls</h3>
          <p className="text-xs text-[#89929b] mt-0.5">
            Adjust parameters to observe real-time physical telemetry.
          </p>
        </div>
        {controls}
      </div>
    </div>
  );
};

export const ParamSlider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}> = ({ label, value, min, max, step = 1, unit = '', onChange }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between text-xs">
      <label className="text-[#bfc7d2] font-medium">{label}</label>
      <span className="font-mono tabular-nums text-[#dee2f6] font-medium">
        {value}
        {unit ? ` ${unit}` : ''}
      </span>
    </div>
    <input
      type="range"
      className="lab-slider"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
    />
  </div>
);
