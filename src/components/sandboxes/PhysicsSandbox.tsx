import React, { useState, useRef, useEffect } from 'react';
import { Cog, RotateCcw, Play, Pause, Flame } from 'lucide-react';
import { labAudio } from '../../utils/audio';

export const PhysicsSandbox: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [planet, setPlanet] = useState<'earth' | 'moon' | 'mars' | 'jupiter' | 'zerog'>('earth');
  const [velocity, setVelocity] = useState(25);
  const [angleDeg, setAngleDeg] = useState(45);
  const [running, setRunning] = useState(true);

  const gravities: Record<typeof planet, { name: string; g: number }> = {
    earth: { name: 'Earth (9.81 m/s²)', g: 9.81 },
    moon: { name: 'Moon (1.62 m/s²)', g: 1.62 },
    mars: { name: 'Mars (3.72 m/s²)', g: 3.72 },
    jupiter: { name: 'Jupiter (24.79 m/s²)', g: 24.79 },
    zerog: { name: 'Zero Gravity (0 m/s²)', g: 0 },
  };

  const g = gravities[planet].g;

  // Ballistic analytical properties
  const rad = (angleDeg * Math.PI) / 180;
  const timeOfFlight = g > 0 ? (2 * velocity * Math.sin(rad)) / g : 10;
  const maxRange = g > 0 ? (Math.pow(velocity, 2) * Math.sin(2 * rad)) / g : velocity * 10;
  const maxHeight = g > 0 ? Math.pow(velocity * Math.sin(rad), 2) / (2 * g) : velocity * 5;

  // Animation frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const start = performance.now();

    const render = (now: number) => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(400, rect.width);
      const h = 400;

      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Background
      ctx.fillStyle = '#090e1c';
      ctx.fillRect(0, 0, w, h);

      // Ground plane
      const groundY = h - 60;
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(w, groundY);
      ctx.stroke();

      // Cannon apparatus at (60, groundY)
      const cx = 60, cy = groundY;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-rad);
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.fillRect(-5, -12, 45, 24);
      ctx.strokeRect(-5, -12, 45, 24);
      ctx.restore();

      // Cannon Base Wheel
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Scaling factor: map max range to canvas width
      const scale = Math.min((w - 120) / Math.max(20, maxRange), (groundY - 60) / Math.max(10, maxHeight));

      // Draw Trajectory curve
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();

      const steps = 60;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * timeOfFlight;
        const xPhys = velocity * Math.cos(rad) * t;
        const yPhys = velocity * Math.sin(rad) * t - 0.5 * g * Math.pow(t, 2);
        const px = cx + xPhys * scale;
        const py = cy - yPhys * scale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw moving projectile along trajectory
      const loopSec = Math.max(1.5, timeOfFlight * 0.7);
      const curT = ((now - start) / 1000) % loopSec;
      const simT = (curT / loopSec) * timeOfFlight;
      const xCur = velocity * Math.cos(rad) * simT;
      const yCur = Math.max(0, velocity * Math.sin(rad) * simT - 0.5 * g * Math.pow(simT, 2));
      const curPx = cx + xCur * scale;
      const curPy = cy - yCur * scale;

      // Glow & Ball
      ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.beginPath();
      ctx.arc(curPx, curPy, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(curPx, curPy, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      if (running) {
        raf = requestAnimationFrame(render);
      }
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [planet, velocity, angleDeg, running, maxRange, maxHeight, timeOfFlight, g, rad]);

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-panel rounded-md p-4 flex flex-wrap items-center justify-between gap-3 bg-[#090e1c]">
        <div className="flex items-center gap-2">
          <Cog className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="font-display text-sm font-bold text-[#dee2f6]">
              Kinematics, Celestial Gravity & Dynamics Sandbox
            </h3>
            <p className="text-xs text-[#89929b]">
              Switch gravity environments from Earth to Moon or Zero-G and fire ballistic projectiles
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setRunning((r) => !r);
              labAudio.playClick();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[var(--lab-accent)] text-white hover:brightness-110 cursor-pointer"
          >
            {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {running ? 'Pause' : 'Play'}
          </button>

          <button
            type="button"
            onClick={() => {
              setVelocity(25);
              setAngleDeg(45);
              setPlanet('earth');
              labAudio.playClick();
            }}
            className="p-1.5 rounded text-[#89929b] hover:text-white bg-white/5 border border-white/10 cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Planetary Gravity Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono bg-white/[0.02] p-3 rounded border border-white/5">
        <span className="text-[#89929b] mr-1">Gravity Field:</span>
        {(Object.keys(gravities) as Array<keyof typeof gravities>).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setPlanet(key);
              labAudio.playClick();
            }}
            className={`px-3 py-1 rounded cursor-pointer transition ${
              planet === key
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-white/5 border border-white/10 text-[#bfc7d2] hover:border-white/25'
            }`}
          >
            {gravities[key].name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 rounded-md border border-white/15 overflow-hidden bg-[#090e1c] shadow-xl">
          <canvas ref={canvasRef} className="w-full h-[400px] block" />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="glass-panel p-4 rounded-md flex flex-col gap-4 bg-[#090e1c]">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#89929b]">Muzzle Speed (v₀):</span>
                <span className="text-white font-bold">{velocity} m/s</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                step={1}
                value={velocity}
                onChange={(e) => setVelocity(parseFloat(e.target.value))}
                className="lab-slider"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#89929b]">Launch Angle (θ):</span>
                <span className="text-white font-bold">{angleDeg}°</span>
              </div>
              <input
                type="range"
                min={10}
                max={85}
                step={1}
                value={angleDeg}
                onChange={(e) => setAngleDeg(parseFloat(e.target.value))}
                className="lab-slider"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-[#090e1c] p-3.5 rounded border border-white/10">
              <span className="text-[#89929b] block">Flight Time (t_f):</span>
              <span className="text-base font-bold text-[#93ccff]">
                {timeOfFlight.toFixed(2)} s
              </span>
            </div>
            <div className="bg-[#090e1c] p-3.5 rounded border border-white/10">
              <span className="text-[#89929b] block">Max Apogee (H):</span>
              <span className="text-base font-bold text-amber-300">
                {maxHeight.toFixed(1)} m
              </span>
            </div>
            <div className="col-span-2 bg-[#090e1c] p-3.5 rounded border border-white/10">
              <span className="text-[#89929b] block">Horizontal Range (R):</span>
              <span className="text-lg font-bold text-emerald-400">
                {maxRange.toFixed(1)} meters
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

