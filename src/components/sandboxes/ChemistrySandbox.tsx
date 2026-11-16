import React, { useState, useRef, useEffect } from 'react';
import { FlaskConical, RotateCcw, Flame, Droplets, Plus } from 'lucide-react';
import { labAudio } from '../../utils/audio';

export const ChemistrySandbox: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [volumeMl, setVolumeMl] = useState(100);
  const [pH, setPH] = useState(7.0);
  const [tempC, setTempC] = useState(22.0);
  const [solutionColor, setSolutionColor] = useState('rgba(56, 189, 248, 0.15)');
  const [precipitate, setPrecipitate] = useState<string | null>(null);
  const [hasIndicator, setHasIndicator] = useState(false);
  const [burnerActive, setBurnerActive] = useState(false);
  const [reactionsLog, setReactionsLog] = useState<string[]>([
    'Prepared 100 mL neutral distilled water (pH 7.0, 22.0 °C).',
  ]);

  // Heat simulation when burner is active
  useEffect(() => {
    if (!burnerActive) return;
    const interval = setInterval(() => {
      setTempC((t) => Math.min(100, +(t + 1.2).toFixed(1)));
    }, 400);
    return () => clearInterval(interval);
  }, [burnerActive]);

  // Color updates based on chemicals & indicators
  const addReagent = (name: string) => {
    labAudio.playClick();
    setVolumeMl((v) => Math.min(300, v + 15));

    if (name === 'HCl') {
      const nextPh = Math.max(0.5, +(pH - 2.1).toFixed(2));
      setPH(nextPh);
      setReactionsLog((prev) => [
        `Added 15 mL 1.0M HCl. Hydronium ions increased. (pH: ${nextPh})`,
        ...prev.slice(0, 5),
      ]);
      if (hasIndicator && nextPh < 8.2) {
        setSolutionColor('rgba(255, 255, 255, 0.1)'); // Colorless
      }
    } else if (name === 'NaOH') {
      const nextPh = Math.min(13.8, +(pH + 2.2).toFixed(2));
      setPH(nextPh);
      setReactionsLog((prev) => [
        `Added 15 mL 1.0M NaOH. Hydroxide ions increased. (pH: ${nextPh})`,
        ...prev.slice(0, 5),
      ]);
      if (hasIndicator && nextPh >= 8.2) {
        setSolutionColor('rgba(236, 72, 153, 0.65)'); // Intense pink
      }
    } else if (name === 'Phenolphthalein') {
      setHasIndicator(true);
      const color = pH >= 8.2 ? 'rgba(236, 72, 153, 0.65)' : 'rgba(255, 255, 255, 0.1)';
      setSolutionColor(color);
      setReactionsLog((prev) => [
        `Added Phenolphthalein indicator. (Active threshold pH 8.2)`,
        ...prev.slice(0, 5),
      ]);
    } else if (name === 'CuSO4') {
      setSolutionColor('rgba(14, 165, 233, 0.6)');
      if (pH > 8.0) {
        setPrecipitate('Cu(OH)₂ (Gelatinous Light Blue)');
      }
      setReactionsLog((prev) => [
        `Added Cu²⁺ ions. Solution turned deep azure blue.`,
        ...prev.slice(0, 5),
      ]);
    } else if (name === 'FeCl3') {
      setSolutionColor('rgba(217, 119, 6, 0.6)');
      if (pH > 7.0) {
        setPrecipitate('Fe(OH)₃ (Reddish-Brown Rust)');
      }
      setReactionsLog((prev) => [
        `Added Fe³⁺ ions. Amber-yellow complex formed.`,
        ...prev.slice(0, 5),
      ]);
    } else if (name === 'AgNO3') {
      if (pH < 4.0) {
        setPrecipitate('AgCl (Dense Curdy White)');
        setReactionsLog((prev) => [
          `Ag⁺ reacted with Cl⁻: Immediate AgCl precipitate formed!`,
          ...prev.slice(0, 5),
        ]);
      } else {
        setReactionsLog((prev) => [`Added AgNO₃ solution.`, ...prev.slice(0, 5)]);
      }
    }
  };

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(300, rect.width);
    const h = 380;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#090e1c';
    ctx.fillRect(0, 0, w, h);

    const bx = w / 2 - 90;
    const by = 80;
    const bw = 180;
    const bh = 220;

    // Bunsen Flame if active
    if (burnerActive) {
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(w / 2 - 20, 350);
      ctx.quadraticCurveTo(w / 2, 305, w / 2 + 20, 350);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(w / 2 - 10, 350);
      ctx.quadraticCurveTo(w / 2, 320, w / 2 + 10, 350);
      ctx.fill();
    }

    // Beaker Glass outline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx - 10, by);
    ctx.lineTo(bx, by);
    ctx.lineTo(bx, by + bh);
    ctx.lineTo(bx + bw, by + bh);
    ctx.lineTo(bx + bw, by);
    ctx.stroke();

    // Volume level calculation
    const fillHeight = (volumeMl / 300) * (bh - 20);
    const fillY = by + bh - fillHeight;

    // Liquid in Beaker
    ctx.fillStyle = solutionColor;
    ctx.fillRect(bx + 2, fillY, bw - 4, fillHeight);

    // Liquid surface meniscus
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bx + 2, fillY);
    ctx.lineTo(bx + bw - 2, fillY);
    ctx.stroke();

    // Precipitate particles at bottom
    if (precipitate) {
      ctx.fillStyle = precipitate.includes('White') ? '#ffffff' : precipitate.includes('Brown') ? '#92400e' : '#38bdf8';
      for (let i = 0; i < 28; i++) {
        const px = bx + 10 + (i * 5.5) % (bw - 20);
        const py = by + bh - 4 - Math.sin(i * 3) * 6;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Graduation scale ticks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#89929b';
    ctx.font = '9px monospace';
    ctx.textAlign = 'right';
    for (let ml = 50; ml <= 250; ml += 50) {
      const ty = by + bh - (ml / 300) * (bh - 20);
      ctx.beginPath();
      ctx.moveTo(bx, ty);
      ctx.lineTo(bx + 15, ty);
      ctx.stroke();
      ctx.fillText(`${ml}mL`, bx - 6, ty + 3);
    }
  }, [volumeMl, solutionColor, precipitate, burnerActive]);

  const handleReset = () => {
    setVolumeMl(100);
    setPH(7.0);
    setTempC(22.0);
    setSolutionColor('rgba(56, 189, 248, 0.15)');
    setPrecipitate(null);
    setHasIndicator(false);
    setBurnerActive(false);
    setReactionsLog(['Bench reset. Beaker rinsed with pure deionized water.']);
    labAudio.playClick();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-panel rounded-md p-4 flex flex-wrap items-center justify-between gap-3 bg-[#090e1c]">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="font-display text-sm font-bold text-[#dee2f6]">
              Interactive Wet Chemistry & Reaction Bench Sandbox
            </h3>
            <p className="text-xs text-[#89929b]">
              Mix acids, bases, transition metal salts, indicators, and heat with Bunsen burner
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setBurnerActive((b) => !b);
              labAudio.playClick();
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition ${
              burnerActive
                ? 'bg-amber-600 text-white'
                : 'bg-white/5 border border-white/10 text-[#dee2f6] hover:bg-white/15'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Bunsen Burner: {burnerActive ? 'HEATING' : 'OFF'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded text-[#89929b] hover:text-white bg-white/5 border border-white/10 cursor-pointer"
            title="Clean Beaker"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reagent Shelf */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono bg-white/[0.02] p-3 rounded border border-white/5">
        <span className="text-[#89929b] mr-1">Reagent Shelf:</span>
        <button
          type="button"
          onClick={() => addReagent('HCl')}
          className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 cursor-pointer"
        >
          + 1.0M HCl (Acid)
        </button>
        <button
          type="button"
          onClick={() => addReagent('NaOH')}
          className="px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 cursor-pointer"
        >
          + 1.0M NaOH (Base)
        </button>
        <button
          type="button"
          onClick={() => addReagent('Phenolphthalein')}
          className="px-2.5 py-1 rounded bg-pink-500/10 border border-pink-500/30 text-pink-300 hover:bg-pink-500/20 cursor-pointer"
        >
          + Phenolphthalein (Indicator)
        </button>
        <button
          type="button"
          onClick={() => addReagent('CuSO4')}
          className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
        >
          + CuSO₄ (Cu²⁺)
        </button>
        <button
          type="button"
          onClick={() => addReagent('FeCl3')}
          className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 cursor-pointer"
        >
          + FeCl₃ (Fe³⁺)
        </button>
        <button
          type="button"
          onClick={() => addReagent('AgNO3')}
          className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 cursor-pointer"
        >
          + AgNO₃ (Ag⁺)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 rounded-md border border-white/15 overflow-hidden bg-[#090e1c] shadow-xl">
          <canvas ref={canvasRef} className="w-full h-[380px] block" />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-[#090e1c] p-3.5 rounded border border-white/10">
              <span className="text-[#89929b] block">Beaker Volume:</span>
              <span className="text-lg font-bold text-[#93ccff]">{volumeMl} mL</span>
            </div>
            <div className="bg-[#090e1c] p-3.5 rounded border border-white/10">
              <span className="text-[#89929b] block">Digital pH Meter:</span>
              <span className={`text-lg font-bold ${pH < 6.5 ? 'text-rose-400' : pH > 7.5 ? 'text-sky-400' : 'text-emerald-400'}`}>
                {pH.toFixed(2)}
              </span>
            </div>
            <div className="bg-[#090e1c] p-3.5 rounded border border-white/10">
              <span className="text-[#89929b] block">Temperature:</span>
              <span className="text-lg font-bold text-amber-400">{tempC.toFixed(1)} °C</span>
            </div>
            <div className="bg-[#090e1c] p-3.5 rounded border border-white/10">
              <span className="text-[#89929b] block">Precipitate State:</span>
              <span className="text-xs font-bold text-[#dee2f6] block mt-1">
                {precipitate ? precipitate : 'Homogeneous Solution'}
              </span>
            </div>
          </div>

          <div className="bg-[#090e1c] p-4 rounded border border-white/10 flex flex-col gap-2">
            <span className="font-mono text-xs font-semibold text-[#89929b] uppercase tracking-wider">
              Reaction Chemistry Log
            </span>
            <div className="flex flex-col gap-1.5 font-mono text-[11px]">
              {reactionsLog.map((log, i) => (
                <div key={i} className="text-[#bfc7d2] leading-tight flex items-start gap-1.5">
                  <span className="text-[var(--lab-accent)]">›</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

