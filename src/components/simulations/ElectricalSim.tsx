import React, { useState } from 'react';
import { ParamSlider, SimShell, useHiDpiCanvas } from './SimShared';
import { TelemetryMetric } from '../../types/lab';

interface Props {
  expId: string;
  onRecord: (values: Record<string, string>) => void;
}

export const ElectricalSim: React.FC<Props> = ({ expId, onRecord }) => {
  // 1. Ohm's Law
  const [ohmV, setOhmV] = useState(12);
  const [ohmR, setOhmR] = useState(100);

  // 2. Kirchhoff's Laws
  const [kV1, setKV1] = useState(12);
  const [kV2, setKV2] = useState(6);
  const [kR1, setKR1] = useState(100);
  const [kR2, setKR2] = useState(200);
  const [kR3, setKR3] = useState(150);

  // 3. Series & Parallel
  const [topology, setTopology] = useState<'series' | 'parallel'>('series');
  const [spV, setSpV] = useState(12);
  const [spR1, setSpR1] = useState(100);
  const [spR2, setSpR2] = useState(200);
  const [spR3, setSpR3] = useState(300);

  // 4. RC Circuits
  const [rcMode, setRcMode] = useState<'charge' | 'discharge'>('charge');
  const [rcV0, setRcV0] = useState(10);
  const [rcR, setRcR] = useState(10); // kOhm
  const [rcC, setRcC] = useState(47); // uF

  // 5. Multimeter
  const [meterMode, setMeterMode] = useState<'ammeter' | 'voltmeter' | 'ohmmeter'>('ammeter');
  const [meterRange, setMeterRange] = useState(50); // mA or V

  // 6. RLC Resonance
  const [rlcFreq, setRlcFreq] = useState(500);
  const [rlcR, setRlcR] = useState(25);
  const [rlcL, setRlcL] = useState(10); // mH
  const [rlcC, setRlcC] = useState(10); // uF

  // 7. Wheatstone Bridge
  const [wbR1, setWbR1] = useState(100);
  const [wbR2, setWbR2] = useState(200);
  const [wbR3, setWbR3] = useState(240);
  const [wbRx] = useState(480);

  const [running, setRunning] = useState(true);

  // Calculations
  const kNodeV = (kV1 / kR1 + kV2 / kR3) / (1 / kR1 + 1 / kR2 + 1 / kR3);
  const kI1 = (kV1 - kNodeV) / kR1;
  const kI3 = (kV2 - kNodeV) / kR3;
  const kI2 = kNodeV / kR2;

  const tauMs = rcR * rcC; // kOhm * uF = ms
  const xl = 2 * Math.PI * rlcFreq * (rlcL * 1e-3);
  const xc = 1 / (2 * Math.PI * rlcFreq * (rlcC * 1e-6));
  const zTotal = Math.sqrt(rlcR * rlcR + Math.pow(xl - xc, 2));
  const f0 = 1 / (2 * Math.PI * Math.sqrt(rlcL * 1e-3 * (rlcC * 1e-6)));
  const phaseDeg = (Math.atan2(xl - xc, rlcR) * 180) / Math.PI;

  const wbDiffV = 10 * (wbR2 / (wbR1 + wbR2) - wbRx / (wbR3 + wbRx));

  const canvasRef = useHiDpiCanvas(
    (ctx, w, h, t) => {
      ctx.clearRect(0, 0, w, h);

      if (expId === 'ohms-law') {
        // Left: circuit loop with drifting charges
        const lx = 48, ly = 56, lw = w * 0.38, lh = h - 112;
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(lx, ly, lw, lh);

        // Animated charge dots proportional to current I = V/R
        const currentA = ohmV / ohmR;
        const speed = Math.min(2.2, 0.25 + currentA * 1.4);
        const perim = 2 * (lw + lh);
        for (let k = 0; k < 12; k++) {
          const dist = ((t * speed * 110 + (k * perim) / 12) % perim);
          let px = lx, py = ly;
          if (dist < lw) { px = lx + dist; py = ly; }
          else if (dist < lw + lh) { px = lx + lw; py = ly + (dist - lw); }
          else if (dist < 2 * lw + lh) { px = lx + lw - (dist - lw - lh); py = ly + lh; }
          else { px = lx; py = ly + lh - (dist - 2 * lw - lh); }
          ctx.fillStyle = '#fde047';
          ctx.beginPath(); ctx.arc(px, py, 3.8, 0, Math.PI * 2); ctx.fill();
        }

        // Battery & Resistor symbols
        ctx.fillStyle = '#090e1c';
        ctx.fillRect(lx - 14, ly + lh / 2 - 18, 28, 36);
        ctx.strokeStyle = '#fbbf24';
        ctx.beginPath(); ctx.moveTo(lx - 12, ly + lh / 2 - 6); ctx.lineTo(lx + 12, ly + lh / 2 - 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(lx - 6, ly + lh / 2 + 6); ctx.lineTo(lx + 6, ly + lh / 2 + 6); ctx.stroke();

        ctx.fillStyle = '#161b2a';
        ctx.fillRect(lx + lw - 14, ly + lh / 2 - 28, 28, 56);
        ctx.strokeRect(lx + lw - 14, ly + lh / 2 - 28, 28, 56);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(`${ohmR}Ω`, lx + lw - 11, ly + lh / 2 + 4);

        // Right: Live I-V Characteristic Plot
        const gx0 = w * 0.54, gx1 = w - 30, gy0 = 38, gy1 = h - 42;
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx0, gy1); ctx.lineTo(gx1, gy1); ctx.stroke();

        const maxV = 24, maxI = 0.5; // 500 mA
        ctx.strokeStyle = '#4edea3';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(gx0, gy1);
        const endI = Math.min(maxI, maxV / ohmR);
        const endV = endI * ohmR;
        ctx.lineTo(gx0 + (endV / maxV) * (gx1 - gx0), gy1 - (endI / maxI) * (gy1 - gy0));
        ctx.stroke();

        const dotX = gx0 + (ohmV / maxV) * (gx1 - gx0);
        const dotY = Math.max(gy0, gy1 - (currentA / maxI) * (gy1 - gy0));
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(dotX, dotY, 5.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.fillText('I (0–500 mA)', gx0 + 8, gy0 + 12);
        ctx.fillText('V (0–24 V)', gx1 - 76, gy1 + 18);
      } else if (expId === 'kirchhoffs-laws') {
        const bx = 70, by = 60, bw = w - 140, bh = h - 120;
        const midX = bx + bw / 2;
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, bw, bh);
        ctx.beginPath(); ctx.moveTo(midX, by); ctx.lineTo(midX, by + bh); ctx.stroke();

        // Animate branch currents
        const drawDots = (x1: number, y1: number, x2: number, y2: number, current: number, color: string) => {
          const dir = current >= 0 ? 1 : -1;
          const spd = Math.min(2, 0.2 + Math.abs(current) * 8);
          for (let k = 0; k < 4; k++) {
            let p = ((t * spd * dir + k / 4) % 1);
            if (p < 0) p += 1;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x1 + (x2 - x1) * p, y1 + (y2 - y1) * p, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        };
        drawDots(bx, by, midX, by, kI1, '#fbbf24');
        drawDots(bx + bw, by, midX, by, kI3, '#38bdf8');
        drawDots(midX, by, midX, by + bh, kI2, '#4edea3');

        // Node A badge
        ctx.fillStyle = '#10b981';
        ctx.beginPath(); ctx.arc(midX, by, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#dee2f6';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(`NODE A: ${kNodeV.toFixed(2)}V`, midX - 54, by - 14);
        ctx.fillText(`V₁=${kV1}V`, bx - 46, by + bh / 2);
        ctx.fillText(`V₂=${kV2}V`, bx + bw + 10, by + bh / 2);
        ctx.fillText(`R₁=${kR1}Ω`, (bx + midX) / 2 - 24, by - 10);
        ctx.fillText(`R₃=${kR3}Ω`, (midX + bx + bw) / 2 - 24, by - 10);
        ctx.fillText(`R₂=${kR2}Ω`, midX + 12, by + bh / 2);
      } else if (expId === 'series-parallel') {
        const rs = [spR1, spR2, spR3];
        if (topology === 'series') {
          const req = spR1 + spR2 + spR3;
          const iTot = spV / req;
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(70, 80, w - 140, h - 160);
          rs.forEach((r, idx) => {
            const rx = 140 + idx * ((w - 280) / 2) - 34;
            const pwr = iTot * iTot * r;
            ctx.fillStyle = `rgba(245, 158, 11, ${Math.min(0.8, 0.15 + pwr * 1.2)})`;
            ctx.strokeStyle = '#fbbf24';
            ctx.fillRect(rx, 62, 68, 36);
            ctx.strokeRect(rx, 62, 68, 36);
            ctx.fillStyle = '#dee2f6';
            ctx.font = '11px "JetBrains Mono", monospace';
            ctx.fillText(`R${idx + 1}:${r}Ω`, rx + 6, 84);
            ctx.fillText(`${(iTot * r).toFixed(1)}V`, rx + 14, 118);
          });
        } else {
          const yBranches = [70, h / 2, h - 70];
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(90, 70); ctx.lineTo(90, h - 70); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(w - 90, 70); ctx.lineTo(w - 90, h - 70); ctx.stroke();
          rs.forEach((r, idx) => {
            const yb = yBranches[idx];
            const iBr = spV / r;
            const pwr = (spV * spV) / r;
            ctx.strokeStyle = '#10b981';
            ctx.beginPath(); ctx.moveTo(90, yb); ctx.lineTo(w - 90, yb); ctx.stroke();
            ctx.fillStyle = `rgba(16, 185, 129, ${Math.min(0.85, 0.15 + pwr * 0.45)})`;
            ctx.strokeStyle = '#4edea3';
            ctx.fillRect(w / 2 - 44, yb - 16, 88, 32);
            ctx.strokeRect(w / 2 - 44, yb - 16, 88, 32);
            ctx.fillStyle = '#dee2f6';
            ctx.font = '11px "JetBrains Mono", monospace';
            ctx.fillText(`R${idx + 1}:${r}Ω`, w / 2 - 34, yb + 4);
            ctx.fillText(`${(iBr * 1000).toFixed(0)}mA`, w / 2 + 60, yb + 4);
          });
        }
      } else if (expId === 'rc-circuits') {
        const gx0 = 60, gx1 = w - 34, gy0 = 36, gy1 = h - 46;
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx0, gy1); ctx.lineTo(gx1, gy1); ctx.stroke();

        // Plot 0 to 5 tau
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        for (let px = 0; px <= 200; px++) {
          const tauFrac = (px / 200) * 5;
          const vRatio = rcMode === 'charge' ? 1 - Math.exp(-tauFrac) : Math.exp(-tauFrac);
          const x = gx0 + (px / 200) * (gx1 - gx0);
          const y = gy1 - vRatio * (gy1 - gy0 - 16);
          if (px === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // 1-tau marker
        const x1t = gx0 + (1 / 5) * (gx1 - gx0);
        const y1t = gy1 - (rcMode === 'charge' ? 0.632 : 0.368) * (gy1 - gy0 - 16);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#4edea3';
        ctx.beginPath(); ctx.moveTo(x1t, gy1); ctx.lineTo(x1t, y1t); ctx.lineTo(gx0, y1t); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#4edea3';
        ctx.beginPath(); ctx.arc(x1t, y1t, 5, 0, Math.PI * 2); ctx.fill();

        // Live animated cursor
        const cycle = (t * 0.45) % 1;
        const cx = gx0 + cycle * (gx1 - gx0);
        const vRat = rcMode === 'charge' ? 1 - Math.exp(-cycle * 5) : Math.exp(-cycle * 5);
        const cy = gy1 - vRat * (gy1 - gy0 - 16);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(cx, cy, 5.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(`V_C(t) · 1τ = ${tauMs.toFixed(0)} ms`, gx0 + 14, gy0 + 16);
        ctx.fillText('5τ', gx1 - 18, gy1 + 18);
      } else if (expId === 'electrical-measurements') {
        const cx = w / 2, cy = h * 0.68, rad = Math.min(w, h) * 0.48;
        // Analog meter scale arc
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, rad, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();

        for (let tick = 0; tick <= 10; tick++) {
          const ang = Math.PI * 1.15 + (tick / 10) * Math.PI * 0.7;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(ang) * (rad - 10), cy + Math.sin(ang) * (rad - 10));
          ctx.lineTo(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad);
          ctx.stroke();
        }
        // Deflection needle
        const frac = Math.min(0.92, Math.max(0.1, (meterRange % 85) / 100 + Math.sin(t * 2) * 0.015));
        const nAng = Math.PI * 1.15 + frac * Math.PI * 0.7;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.8;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(nAng) * (rad - 16), cy + Math.sin(nAng) * (rad - 16)); ctx.stroke();
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#dee2f6';
        ctx.font = '600 13px "JetBrains Mono", monospace';
        ctx.fillText(`${meterMode.toUpperCase()} MODE · FULL SCALE ${meterRange}`, cx - 128, h - 22);
      } else if (expId === 'rlc-circuits') {
        // Dual oscilloscope: Voltage (amber) & Current (cyan) with phase shift
        const gx0 = 36, gx1 = w - 24, midY = h * 0.5;
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.beginPath(); ctx.moveTo(gx0, midY); ctx.lineTo(gx1, midY); ctx.stroke();

        const phiRad = (phaseDeg * Math.PI) / 180;
        const iAmp = Math.min(1, rlcR / zTotal);

        // Voltage wave
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let i = 0; i <= 180; i++) {
          const x = gx0 + (i / 180) * (gx1 - gx0);
          const ang = (i / 180) * Math.PI * 4 - t * 4;
          const y = midY - Math.sin(ang) * (h * 0.34);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Current wave (phase shifted)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i <= 180; i++) {
          const x = gx0 + (i / 180) * (gx1 - gx0);
          const ang = (i / 180) * Math.PI * 4 - t * 4 - phiRad;
          const y = midY - Math.sin(ang) * (h * 0.34 * iAmp);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText('V_source(t)', 42, 26);
        ctx.fillStyle = '#7dd3fc';
        ctx.fillText(`I(t) · φ = ${phaseDeg.toFixed(1)}°`, 145, 26);
      } else {
        // Wheatstone Bridge diamond + Galvanometer needle
        const cx = w / 2, cy = h / 2, dx = 150, dy = 105;
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(cx, cy - dy); ctx.lineTo(cx - dx, cy);
        ctx.lineTo(cx, cy + dy); ctx.lineTo(cx + dx, cy);
        ctx.closePath();
        ctx.stroke();

        const isBalanced = Math.abs(wbDiffV) < 0.05;
        ctx.strokeStyle = isBalanced ? '#10b981' : '#38bdf8';
        ctx.beginPath(); ctx.moveTo(cx - dx, cy); ctx.lineTo(cx + dx, cy); ctx.stroke();

        // Galvanometer circle
        ctx.fillStyle = '#161b2a';
        ctx.strokeStyle = isBalanced ? '#10b981' : '#f59e0b';
        ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        const needleAng = -Math.PI / 2 + Math.max(-1.1, Math.min(1.1, wbDiffV * 0.6));
        ctx.strokeStyle = isBalanced ? '#4edea3' : '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(cx, cy + 8); ctx.lineTo(cx + Math.cos(needleAng) * 22, cy + Math.sin(needleAng) * 22); ctx.stroke();

        ctx.fillStyle = '#dee2f6';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(`R₁=${wbR1}Ω`, cx - dx / 2 - 44, cy - dy / 2);
        ctx.fillText(`R₂=${wbR2}Ω`, cx + dx / 2 + 12, cy - dy / 2);
        ctx.fillText(`R₃=${wbR3}Ω`, cx - dx / 2 - 48, cy + dy / 2 + 10);
        ctx.fillText(`R_x=?`, cx + dx / 2 + 14, cy + dy / 2 + 10);
      }
    },
    [
      expId, ohmV, ohmR, kV1, kV2, kR1, kR2, kR3, topology, spV, spR1, spR2, spR3,
      rcMode, rcV0, rcR, rcC, meterMode, meterRange, rlcFreq, rlcR, rlcL, rlcC,
      wbR1, wbR2, wbR3, wbRx, running,
    ],
    running
  );

  let telemetry: TelemetryMetric[] = [];
  let recordSnapshot: Record<string, string> = {};

  if (expId === 'ohms-law') {
    const iMa = (ohmV / ohmR) * 1000;
    const pW = (ohmV * ohmV) / ohmR;
    telemetry = [
      { label: 'Current I', value: iMa.toFixed(1), unit: 'mA', tone: 'nominal' },
      { label: 'Power P', value: pW.toFixed(2), unit: 'W' },
      { label: 'Conductance G', value: ((1 / ohmR) * 1000).toFixed(2), unit: 'mS' },
      { label: 'Resistance R', value: `${ohmR}`, unit: 'Ω' },
    ];
    recordSnapshot = { 'V (V)': `${ohmV}`, 'R (Ω)': `${ohmR}`, 'I (mA)': iMa.toFixed(1), 'P (W)': pW.toFixed(2), 'G (mS)': ((1 / ohmR) * 1000).toFixed(2) };
  } else if (expId === 'kirchhoffs-laws') {
    telemetry = [
      { label: 'Node V_A', value: kNodeV.toFixed(2), unit: 'V', tone: 'nominal' },
      { label: 'Branch I₁', value: (kI1 * 1000).toFixed(1), unit: 'mA' },
      { label: 'Center I₂', value: (kI2 * 1000).toFixed(1), unit: 'mA' },
      { label: 'Branch I₃', value: (kI3 * 1000).toFixed(1), unit: 'mA' },
    ];
    recordSnapshot = { 'V₁ (V)': `${kV1}`, 'V₂ (V)': `${kV2}`, 'I₁ (mA)': (kI1 * 1000).toFixed(1), 'I₂ (mA)': (kI2 * 1000).toFixed(1), 'I₃ (mA)': (kI3 * 1000).toFixed(1) };
  } else if (expId === 'series-parallel') {
    const req = topology === 'series' ? spR1 + spR2 + spR3 : 1 / (1 / spR1 + 1 / spR2 + 1 / spR3);
    const iTot = spV / req;
    telemetry = [
      { label: 'Equiv R_eq', value: req.toFixed(1), unit: 'Ω', tone: 'nominal' },
      { label: 'Total Current', value: (iTot * 1000).toFixed(1), unit: 'mA' },
      { label: 'Total Power', value: (spV * iTot).toFixed(2), unit: 'W' },
      { label: 'Topology', value: topology.toUpperCase() },
    ];
    recordSnapshot = { Topology: topology, 'V_s (V)': `${spV}`, 'R_eq (Ω)': req.toFixed(1), 'I_total (mA)': (iTot * 1000).toFixed(1), 'P_total (W)': (spV * iTot).toFixed(2) };
  } else if (expId === 'rc-circuits') {
    const v1tau = rcMode === 'charge' ? rcV0 * 0.6321 : rcV0 * 0.3679;
    telemetry = [
      { label: 'Time Const τ', value: tauMs.toFixed(1), unit: 'ms', tone: 'nominal' },
      { label: 'Settling 5τ', value: (tauMs * 5).toFixed(0), unit: 'ms' },
      { label: 'V_C @ t=τ', value: v1tau.toFixed(2), unit: 'V' },
      { label: 'Peak Current I₀', value: (rcV0 / rcR).toFixed(2), unit: 'mA' },
    ];
    recordSnapshot = { Mode: rcMode, 'R (kΩ)': `${rcR}`, 'C (μF)': `${rcC}`, 'τ (ms)': tauMs.toFixed(1), 'V_C (V)': v1tau.toFixed(2) };
  } else if (expId === 'electrical-measurements') {
    const ig = 0.001, rg = 50;
    const rCalc = meterMode === 'ammeter' ? (ig * rg) / Math.max(0.002, meterRange / 1000 - ig) : meterMode === 'voltmeter' ? meterRange / ig - rg : 1000;
    telemetry = [
      { label: 'Meter Mode', value: meterMode.toUpperCase() },
      { label: 'Scale Max', value: `${meterRange}`, unit: meterMode === 'ammeter' ? 'mA' : meterMode === 'voltmeter' ? 'V' : 'Ω' },
      { label: meterMode === 'ammeter' ? 'Shunt R_sh' : 'Multiplier R_m', value: rCalc.toFixed(2), unit: 'Ω', tone: 'nominal' },
      { label: 'Coil Spec', value: '1 mA / 50 Ω' },
    ];
    recordSnapshot = { Mode: meterMode, Range: `${meterRange}`, R_internal: `${rCalc.toFixed(2)} Ω`, Measured: `${(meterRange * 0.65).toFixed(1)}`, 'Loading Err': '0.2%' };
  } else if (expId === 'rlc-circuits') {
    const iRms = 10 / zTotal;
    const qFactor = (1 / rlcR) * Math.sqrt((rlcL * 1e-3) / (rlcC * 1e-6));
    telemetry = [
      { label: 'Resonant f₀', value: f0.toFixed(1), unit: 'Hz', tone: Math.abs(rlcFreq - f0) < 25 ? 'nominal' : 'accent' },
      { label: 'Impedance Z', value: zTotal.toFixed(1), unit: 'Ω' },
      { label: 'Phase φ', value: phaseDeg.toFixed(1), unit: 'deg' },
      { label: 'Q Factor', value: qFactor.toFixed(2) },
    ];
    recordSnapshot = { 'f (Hz)': `${rlcFreq}`, 'X_L (Ω)': xl.toFixed(1), 'X_C (Ω)': xc.toFixed(1), 'Z (Ω)': zTotal.toFixed(1), 'φ (°)': phaseDeg.toFixed(1) };
  } else {
    const calcRx = wbR3 * (wbR2 / wbR1);
    const balanced = Math.abs(wbDiffV) < 0.05;
    telemetry = [
      { label: 'Bridge ΔV_BD', value: (wbDiffV * 1000).toFixed(0), unit: 'mV', tone: balanced ? 'nominal' : 'warning' },
      { label: 'Ratio R₂/R₁', value: (wbR2 / wbR1).toFixed(2) },
      { label: 'Calc R_x', value: calcRx.toFixed(1), unit: 'Ω' },
      { label: 'Null Status', value: balanced ? 'BALANCED' : 'DEFLECTED', tone: balanced ? 'nominal' : 'warning' },
    ];
    recordSnapshot = { 'R₁ (Ω)': `${wbR1}`, 'R₂ (Ω)': `${wbR2}`, 'R₃ (Ω)': `${wbR3}`, 'V_BD (mV)': (wbDiffV * 1000).toFixed(0), 'Calc R_x (Ω)': calcRx.toFixed(1) };
  }

  const controls = (
    <div className="flex flex-col gap-4">
      {expId === 'ohms-law' && (
        <>
          <ParamSlider label="DC Voltage (V)" value={ohmV} min={0} max={24} step={0.5} unit="V" onChange={setOhmV} />
          <ParamSlider label="Load Resistance (R)" value={ohmR} min={20} max={500} step={10} unit="Ω" onChange={setOhmR} />
        </>
      )}
      {expId === 'kirchhoffs-laws' && (
        <>
          <ParamSlider label="Left Source (V₁)" value={kV1} min={2} max={24} step={1} unit="V" onChange={setKV1} />
          <ParamSlider label="Right Source (V₂)" value={kV2} min={2} max={24} step={1} unit="V" onChange={setKV2} />
          <ParamSlider label="R₁ (Left)" value={kR1} min={50} max={500} step={10} unit="Ω" onChange={setKR1} />
          <ParamSlider label="R₂ (Center)" value={kR2} min={50} max={500} step={10} unit="Ω" onChange={setKR2} />
          <ParamSlider label="R₃ (Right)" value={kR3} min={50} max={500} step={10} unit="Ω" onChange={setKR3} />
        </>
      )}
      {expId === 'series-parallel' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {(['series', 'parallel'] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTopology(t)} className={`py-1.5 text-xs font-medium rounded border cursor-pointer capitalize ${topology === t ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>
                {t}
              </button>
            ))}
          </div>
          <ParamSlider label="Supply Voltage (V)" value={spV} min={3} max={24} step={1} unit="V" onChange={setSpV} />
          <ParamSlider label="R₁" value={spR1} min={50} max={500} step={25} unit="Ω" onChange={setSpR1} />
          <ParamSlider label="R₂" value={spR2} min={50} max={500} step={25} unit="Ω" onChange={setSpR2} />
          <ParamSlider label="R₃" value={spR3} min={50} max={500} step={25} unit="Ω" onChange={setSpR3} />
        </>
      )}
      {expId === 'rc-circuits' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {(['charge', 'discharge'] as const).map((m) => (
              <button key={m} type="button" onClick={() => setRcMode(m)} className={`py-1.5 text-xs font-medium rounded border cursor-pointer capitalize ${rcMode === m ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>
                {m}
              </button>
            ))}
          </div>
          <ParamSlider label="Supply V₀" value={rcV0} min={2} max={20} step={1} unit="V" onChange={setRcV0} />
          <ParamSlider label="Resistor R" value={rcR} min={1} max={100} step={1} unit="kΩ" onChange={setRcR} />
          <ParamSlider label="Capacitor C" value={rcC} min={1} max={100} step={1} unit="μF" onChange={setRcC} />
        </>
      )}
      {expId === 'electrical-measurements' && (
        <>
          <div className="grid grid-cols-3 gap-1.5">
            {(['ammeter', 'voltmeter', 'ohmmeter'] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMeterMode(m)} className={`py-1.5 text-xs font-medium rounded border cursor-pointer capitalize ${meterMode === m ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>
                {m}
              </button>
            ))}
          </div>
          <ParamSlider label="Target Range" value={meterRange} min={5} max={200} step={5} onChange={setMeterRange} />
        </>
      )}
      {expId === 'rlc-circuits' && (
        <>
          <ParamSlider label="Drive Frequency (f)" value={rlcFreq} min={100} max={1500} step={10} unit="Hz" onChange={setRlcFreq} />
          <ParamSlider label="Resistance (R)" value={rlcR} min={5} max={150} step={5} unit="Ω" onChange={setRlcR} />
          <ParamSlider label="Inductance (L)" value={rlcL} min={2} max={50} step={1} unit="mH" onChange={setRlcL} />
          <ParamSlider label="Capacitance (C)" value={rlcC} min={1} max={50} step={1} unit="μF" onChange={setRlcC} />
        </>
      )}
      {expId === 'wheatstone-bridge' && (
        <>
          <ParamSlider label="Ratio Arm R₁" value={wbR1} min={50} max={300} step={50} unit="Ω" onChange={setWbR1} />
          <ParamSlider label="Ratio Arm R₂" value={wbR2} min={50} max={400} step={50} unit="Ω" onChange={setWbR2} />
          <ParamSlider label="Decade Standard R₃" value={wbR3} min={50} max={600} step={5} unit="Ω" onChange={setWbR3} />
          <p className="text-xs text-[#89929b]">Hint: Tune R₃ until ΔV_BD = 0 mV to deduce unknown R_x.</p>
        </>
      )}
    </div>
  );

  return (
    <SimShell
      canvasRef={canvasRef}
      telemetry={telemetry}
      controls={controls}
      running={running}
      onToggleRun={() => setRunning((r) => !r)}
      onReset={() => {
        setOhmV(12); setOhmR(100); setRlcFreq(500); setWbR3(240);
      }}
      onRecordTrial={() => onRecord(recordSnapshot)}
    />
  );
};
