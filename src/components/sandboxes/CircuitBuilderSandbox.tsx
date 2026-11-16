import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Zap, Plus, Trash2, HelpCircle } from 'lucide-react';
import { labAudio } from '../../utils/audio';

interface CircuitComponent {
  id: string;
  type: 'battery' | 'resistor' | 'bulb' | 'switch' | 'capacitor' | 'and_gate' | 'or_gate' | 'not_gate';
  x: number;
  y: number;
  value: number; // Volts for battery, Ohms for resistor, etc.
  state?: boolean; // For switch or logic gate
  label: string;
}

export const CircuitBuilderSandbox: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initial starter circuit on the breadboard
  const [components, setComponents] = useState<CircuitComponent[]>([
    { id: 'bat1', type: 'battery', x: 80, y: 160, value: 12, label: '12V DC Supply' },
    { id: 'sw1', type: 'switch', x: 220, y: 80, value: 0, state: true, label: 'Power Switch' },
    { id: 'res1', type: 'resistor', x: 380, y: 80, value: 100, label: '100 Ω Resistor' },
    { id: 'bulb1', type: 'bulb', x: 520, y: 160, value: 50, label: 'Filament Lamp' },
  ]);

  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Real-time Circuit Solver
  const battery = components.find((c) => c.type === 'battery');
  const sw = components.find((c) => c.type === 'switch');
  const isClosed = sw ? !!sw.state : true;

  const totalResistance = components
    .filter((c) => c.type === 'resistor' || c.type === 'bulb')
    .reduce((sum, c) => sum + (c.value || 10), 0);

  const voltage = battery ? battery.value : 0;
  const currentAmps = isClosed && totalResistance > 0 ? voltage / totalResistance : 0;
  const powerWatts = currentAmps * voltage;

  // Render Canvas
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

    // Background Grid
    ctx.fillStyle = '#090e1c';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Connect components in a continuous schematic loop
    if (components.length >= 2) {
      ctx.strokeStyle = isClosed && currentAmps > 0 ? '#38bdf8' : 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(components[0].x, components[0].y);
      for (let i = 1; i < components.length; i++) {
        ctx.lineTo(components[i].x, components[i].y);
      }
      // Close loop
      ctx.lineTo(components[0].x, components[0].y);
      ctx.stroke();

      // Animate current flow electron dots if circuit is closed
      if (isClosed && currentAmps > 0) {
        const time = Date.now() / 200;
        ctx.fillStyle = '#38bdf8';
        for (let i = 0; i < components.length; i++) {
          const c1 = components[i];
          const c2 = components[(i + 1) % components.length];
          const tNorm = ((time + i * 0.25) % 1);
          const dotX = c1.x + (c2.x - c1.x) * tNorm;
          const dotY = c1.y + (c2.y - c1.y) * tNorm;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Draw individual components
    components.forEach((c) => {
      const isSelected = c.id === selectedCompId;

      ctx.save();
      ctx.translate(c.x, c.y);

      // Component selection halo
      if (isSelected) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 32, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw component body
      if (c.type === 'battery') {
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-24, -18, 48, 36, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#dee2f6';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${c.value}V`, 0, 4);
      } else if (c.type === 'resistor') {
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-26, -14, 52, 28, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${c.value}Ω`, 0, 4);
      } else if (c.type === 'bulb') {
        const glowIntensity = Math.min(1, currentAmps * 2);
        if (glowIntensity > 0.05) {
          ctx.fillStyle = `rgba(250, 204, 21, ${0.15 + glowIntensity * 0.35})`;
          ctx.beginPath();
          ctx.arc(0, 0, 28 + glowIntensity * 12, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = glowIntensity > 0.1 ? '#fef08a' : '#1e293b';
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#ca8a04';
        ctx.beginPath();
        ctx.moveTo(-6, -6);
        ctx.lineTo(6, 6);
        ctx.moveTo(6, -6);
        ctx.lineTo(-6, 6);
        ctx.stroke();
      } else if (c.type === 'switch') {
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(-14, 0, 5, 0, Math.PI * 2);
        ctx.arc(14, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = c.state ? '#10b981' : '#f43f5e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-14, 0);
        ctx.lineTo(c.state ? 14 : 6, c.state ? 0 : -18);
        ctx.stroke();
      } else if (c.type === 'capacitor') {
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-6, -16);
        ctx.lineTo(-6, 16);
        ctx.moveTo(6, -16);
        ctx.lineTo(6, 16);
        ctx.stroke();
      }

      // Component label
      ctx.fillStyle = '#89929b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(c.label, 0, 36);

      ctx.restore();
    });
  }, [components, selectedCompId, currentAmps, isClosed]);

  // Mouse / Touch handlers for dragging components
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clicked = components.find((c) => Math.hypot(c.x - x, c.y - y) <= 30);
    if (clicked) {
      setSelectedCompId(clicked.id);
      setIsDragging(true);
      setDragOffset({ x: clicked.x - x, y: clicked.y - y });
      labAudio.playClick();
    } else {
      setSelectedCompId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedCompId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left + dragOffset.x;
    const y = e.clientY - rect.top + dragOffset.y;

    setComponents((prev) =>
      prev.map((c) => (c.id === selectedCompId ? { ...c, x: Math.max(30, Math.min(rect.width - 30, x)), y: Math.max(30, Math.min(390, y)) } : c))
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleAddComponent = (type: CircuitComponent['type']) => {
    labAudio.playClick();
    const id = `comp_${Date.now()}`;
    const labels: Record<CircuitComponent['type'], string> = {
      battery: '9V Battery',
      resistor: '220 Ω Resistor',
      bulb: 'Indicator Bulb',
      switch: 'SPST Switch',
      capacitor: '100 µF Cap',
      and_gate: 'AND Logic Gate',
      or_gate: 'OR Logic Gate',
      not_gate: 'NOT Inverter',
    };
    const defaultVals: Record<CircuitComponent['type'], number> = {
      battery: 9,
      resistor: 220,
      bulb: 40,
      switch: 0,
      capacitor: 100,
      and_gate: 0,
      or_gate: 0,
      not_gate: 0,
    };

    const newComp: CircuitComponent = {
      id,
      type,
      x: 150 + Math.random() * 200,
      y: 150 + Math.random() * 150,
      value: defaultVals[type],
      state: type === 'switch' ? true : false,
      label: labels[type],
    };

    setComponents((prev) => [...prev, newComp]);
    setSelectedCompId(id);
  };

  const handleDeleteSelected = () => {
    if (!selectedCompId) return;
    setComponents((prev) => prev.filter((c) => c.id !== selectedCompId));
    setSelectedCompId(null);
    labAudio.playClick();
  };

  const handleToggleSwitch = () => {
    setComponents((prev) =>
      prev.map((c) => (c.type === 'switch' ? { ...c, state: !c.state } : c))
    );
    labAudio.playClick();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Sandbox Controls Toolbar */}
      <div className="glass-panel rounded-md p-4 flex flex-wrap items-center justify-between gap-3 bg-[#090e1c]">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-display text-sm font-bold text-[#dee2f6]">
              Interactive Breadboard & Circuit Builder Sandbox
            </h3>
            <p className="text-xs text-[#89929b]">
              Drag components on the canvas to rewire · Click switch to toggle power
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleSwitch}
            className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition ${
              isClosed
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            Switch: {isClosed ? 'CLOSED (ON)' : 'OPEN (OFF)'}
          </button>

          {selectedCompId && (
            <button
              type="button"
              onClick={handleDeleteSelected}
              className="px-2.5 py-1.5 rounded text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Delete
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setComponents([
                { id: 'bat1', type: 'battery', x: 80, y: 160, value: 12, label: '12V DC Supply' },
                { id: 'sw1', type: 'switch', x: 220, y: 80, value: 0, state: true, label: 'Power Switch' },
                { id: 'res1', type: 'resistor', x: 380, y: 80, value: 100, label: '100 Ω Resistor' },
                { id: 'bulb1', type: 'bulb', x: 520, y: 160, value: 50, label: 'Filament Lamp' },
              ]);
              labAudio.playClick();
            }}
            className="p-1.5 rounded text-[#89929b] hover:text-white bg-white/5 border border-white/10 cursor-pointer"
            title="Reset Circuit"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Component Palette */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono bg-white/[0.02] p-3 rounded border border-white/5">
        <span className="text-[#89929b] mr-1">Add Component:</span>
        <button
          type="button"
          onClick={() => handleAddComponent('battery')}
          className="px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 cursor-pointer"
        >
          + Battery (DC)
        </button>
        <button
          type="button"
          onClick={() => handleAddComponent('resistor')}
          className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 cursor-pointer"
        >
          + Resistor
        </button>
        <button
          type="button"
          onClick={() => handleAddComponent('bulb')}
          className="px-2.5 py-1 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20 cursor-pointer"
        >
          + Lamp / Bulb
        </button>
        <button
          type="button"
          onClick={() => handleAddComponent('switch')}
          className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 cursor-pointer"
        >
          + SPST Switch
        </button>
        <button
          type="button"
          onClick={() => handleAddComponent('capacitor')}
          className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 cursor-pointer"
        >
          + Capacitor
        </button>
      </div>

      {/* Main Canvas Viewport */}
      <div className="rounded-md border border-white/15 overflow-hidden bg-[#090e1c] shadow-xl">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-[420px] cursor-grab active:cursor-grabbing block"
        />
      </div>

      {/* Real-time Electrical Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-[#090e1c] p-3.5 rounded border border-white/10">
          <span className="text-[#89929b] block">DC Loop Potential (V):</span>
          <span className="text-lg font-bold text-sky-400">{voltage.toFixed(1)} V</span>
        </div>
        <div className="bg-[#090e1c] p-3.5 rounded border border-white/10">
          <span className="text-[#89929b] block">Total Loop Resistance (R_eq):</span>
          <span className="text-lg font-bold text-amber-400">{totalResistance.toFixed(1)} Ω</span>
        </div>
        <div className="bg-[#090e1c] p-3.5 rounded border border-white/10">
          <span className="text-[#89929b] block">Branch Current (I = V/R):</span>
          <span className={`text-lg font-bold ${isClosed ? 'text-emerald-400' : 'text-[#89929b]'}`}>
            {(currentAmps * 1000).toFixed(1)} mA
          </span>
        </div>
        <div className="bg-[#090e1c] p-3.5 rounded border border-white/10">
          <span className="text-[#89929b] block">Power Dissipated (P = I·V):</span>
          <span className="text-lg font-bold text-purple-400">
            {isClosed ? (powerWatts * 1000).toFixed(1) : '0.0'} mW
          </span>
        </div>
      </div>
    </div>
  );
};

