import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { labAudio } from '../../utils/audio';

interface OpticalElement {
  id: string;
  type: 'laser' | 'convex_lens' | 'concave_lens' | 'mirror' | 'prism';
  x: number;
  y: number;
  angle: number; // degrees
  focalLength: number; // cm
  label: string;
}

export const OpticsSandbox: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [elements, setElements] = useState<OpticalElement[]>([
    { id: 'las1', type: 'laser', x: 80, y: 200, angle: 0, focalLength: 0, label: 'Laser Source' },
    { id: 'lens1', type: 'convex_lens', x: 300, y: 200, angle: 0, focalLength: 150, label: 'Convex Lens (f=15cm)' },
    { id: 'mir1', type: 'mirror', x: 550, y: 200, angle: 45, focalLength: 0, label: '45° Plane Mirror' },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(400, rect.width);
    const h = 420;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#090e1c';
    ctx.fillRect(0, 0, w, h);

    // Optical Bench Axis
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(w, 200);
    ctx.stroke();
    ctx.setLineDash([]);

    // Trace Ray from Laser
    const laser = elements.find((e) => e.type === 'laser');
    if (laser) {
      let rayX = laser.x + 20;
      let rayY = laser.y;
      let rayAngleRad = (laser.angle * Math.PI) / 180;

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(rayX, rayY);

      // Simple ray marching across elements sorted by x
      const sorted = elements
        .filter((e) => e.type !== 'laser' && e.x > laser.x)
        .sort((a, b) => a.x - b.x);

      for (const el of sorted) {
        ctx.lineTo(el.x, rayY);

        if (el.type === 'convex_lens') {
          // Bends ray towards axis
          const dy = rayY - el.y;
          rayY -= dy * 0.4;
        } else if (el.type === 'concave_lens') {
          // Diverges ray away from axis
          const dy = rayY - el.y;
          rayY += (dy === 0 ? 10 : dy) * 0.3;
        } else if (el.type === 'mirror') {
          // Reflects ray
          const reflectAngle = (el.angle * 2 * Math.PI) / 180;
          const endY = el.angle > 0 ? 30 : 380;
          ctx.lineTo(el.x, el.y);
          ctx.lineTo(el.x + 80, endY);
          break;
        }
      }

      if (sorted.length === 0 || sorted[sorted.length - 1].type !== 'mirror') {
        ctx.lineTo(w, rayY);
      }
      ctx.stroke();

      // Laser glow
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.beginPath();
      ctx.arc(laser.x + 20, laser.y, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Elements
    elements.forEach((el) => {
      const isSelected = el.id === selectedId;

      ctx.save();
      ctx.translate(el.x, el.y);

      if (isSelected) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 36, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (el.type === 'laser') {
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-24, -14, 48, 28, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('LASER', 0, 3);
      } else if (el.type === 'convex_lens') {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 50, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (el.type === 'concave_lens') {
        ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-10, -50);
        ctx.lineTo(10, -50);
        ctx.lineTo(4, 0);
        ctx.lineTo(10, 50);
        ctx.lineTo(-10, 50);
        ctx.lineTo(-4, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (el.type === 'mirror') {
        ctx.rotate((el.angle * Math.PI) / 180);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, -45);
        ctx.lineTo(0, 45);
        ctx.stroke();
      } else if (el.type === 'prism') {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -40);
        ctx.lineTo(35, 30);
        ctx.lineTo(-35, 30);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.fillStyle = '#89929b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(el.label, 0, 65);

      ctx.restore();
    });
  }, [elements, selectedId]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clicked = elements.find((el) => Math.hypot(el.x - x, el.y - y) <= 35);
    if (clicked) {
      setSelectedId(clicked.id);
      setIsDragging(true);
      setDragOffset({ x: clicked.x - x, y: clicked.y - y });
      labAudio.playClick();
    } else {
      setSelectedId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left + dragOffset.x;
    const y = e.clientY - rect.top + dragOffset.y;

    setElements((prev) =>
      prev.map((el) =>
        el.id === selectedId
          ? { ...el, x: Math.max(30, Math.min(rect.width - 30, x)), y: Math.max(40, Math.min(380, y)) }
          : el
      )
    );
  };

  const handleAdd = (type: OpticalElement['type']) => {
    labAudio.playClick();
    const id = `opt_${Date.now()}`;
    const labels: Record<OpticalElement['type'], string> = {
      laser: 'Laser Emitter',
      convex_lens: 'Convex Lens (+f)',
      concave_lens: 'Concave Lens (-f)',
      mirror: '45° Mirror',
      prism: 'Glass Prism',
    };

    const newEl: OpticalElement = {
      id,
      type,
      x: 200 + Math.random() * 250,
      y: 200,
      angle: type === 'mirror' ? 45 : 0,
      focalLength: 150,
      label: labels[type],
    };

    setElements((prev) => [...prev, newEl]);
    setSelectedId(id);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-panel rounded-md p-4 flex flex-wrap items-center justify-between gap-3 bg-[#090e1c]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-400" />
          <div>
            <h3 className="font-display text-sm font-bold text-[#dee2f6]">
              Interactive Optical Bench & Ray Tracing Sandbox
            </h3>
            <p className="text-xs text-[#89929b]">
              Drag lenses, mirrors, and prisms along the optical track to observe ray propagation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedId && (
            <button
              type="button"
              onClick={() => {
                setElements((prev) => prev.filter((e) => e.id !== selectedId));
                setSelectedId(null);
                labAudio.playClick();
              }}
              className="px-2.5 py-1.5 rounded text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Delete
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setElements([
                { id: 'las1', type: 'laser', x: 80, y: 200, angle: 0, focalLength: 0, label: 'Laser Source' },
                { id: 'lens1', type: 'convex_lens', x: 300, y: 200, angle: 0, focalLength: 150, label: 'Convex Lens (f=15cm)' },
                { id: 'mir1', type: 'mirror', x: 550, y: 200, angle: 45, focalLength: 0, label: '45° Plane Mirror' },
              ]);
              labAudio.playClick();
            }}
            className="p-1.5 rounded text-[#89929b] hover:text-white bg-white/5 border border-white/10 cursor-pointer"
            title="Reset Bench"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs font-mono bg-white/[0.02] p-3 rounded border border-white/5">
        <span className="text-[#89929b] mr-1">Add Optical Element:</span>
        <button
          type="button"
          onClick={() => handleAdd('convex_lens')}
          className="px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 cursor-pointer"
        >
          + Convex Lens
        </button>
        <button
          type="button"
          onClick={() => handleAdd('concave_lens')}
          className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 cursor-pointer"
        >
          + Concave Lens
        </button>
        <button
          type="button"
          onClick={() => handleAdd('mirror')}
          className="px-2.5 py-1 rounded bg-slate-500/10 border border-slate-500/30 text-slate-300 hover:bg-slate-500/20 cursor-pointer"
        >
          + Plane Mirror
        </button>
        <button
          type="button"
          onClick={() => handleAdd('prism')}
          className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 cursor-pointer"
        >
          + Triangular Prism
        </button>
      </div>

      <div className="rounded-md border border-white/15 overflow-hidden bg-[#090e1c] shadow-xl">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          className="w-full h-[420px] cursor-grab active:cursor-grabbing block"
        />
      </div>
    </div>
  );
};

