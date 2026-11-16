import React, { useEffect, useRef, useState } from 'react';
import { ParamSlider, SimShell, useHiDpiCanvas } from './SimShared';
import { TelemetryMetric } from '../../types/lab';
import { labAudio } from '../../utils/audio';

interface Props {
  expId: string;
  onRecord: (values: Record<string, string>) => void;
}

const FLAME_SALTS: Record<string, { name: string; color: string; glow: string; peakNm: number; lines: number[] }> = {
  Li: { name: 'Lithium (Li⁺)', color: '#f43f5e', glow: 'rgba(244,63,94,0.55)', peakNm: 671, lines: [610, 671] },
  Na: { name: 'Sodium (Na⁺)', color: '#fbbf24', glow: 'rgba(251,191,36,0.65)', peakNm: 589, lines: [589, 590] },
  K: { name: 'Potassium (K⁺)', color: '#c084fc', glow: 'rgba(192,132,252,0.55)', peakNm: 404, lines: [404, 766] },
  Ca: { name: 'Calcium (Ca²⁺)', color: '#fb923c', glow: 'rgba(251,146,60,0.6)', peakNm: 616, lines: [423, 616] },
  Cu: { name: 'Copper (Cu²⁺)', color: '#10b981', glow: 'rgba(16,185,129,0.6)', peakNm: 515, lines: [490, 515, 522] },
  Ba: { name: 'Barium (Ba²⁺)', color: '#a3e635', glow: 'rgba(163,230,53,0.55)', peakNm: 524, lines: [493, 524, 553] },
};

function computeTitrationPh(acidType: 'strong' | 'weak', vb: number): number {
  const va = 25.0; // mL
  const ma = 0.1;
  const mb = 0.1;
  const totalV = va + vb;
  const molesAcid = ma * va;
  const molesBase = mb * vb;

  if (acidType === 'strong') {
    if (Math.abs(molesAcid - molesBase) < 1e-4) return 7.0;
    if (molesAcid > molesBase) {
      const h = (molesAcid - molesBase) / totalV;
      return Math.max(0.5, -Math.log10(h));
    } else {
      const oh = (molesBase - molesAcid) / totalV;
      return Math.min(13.5, 14 + Math.log10(oh));
    }
  } else {
    // Weak acid Ka = 1.75e-5 (pKa = 4.76)
    const pKa = 4.76;
    const ka = 1.75e-5;
    if (vb <= 0.05) {
      return 0.5 * (pKa - Math.log10(ma));
    } else if (molesBase < molesAcid - 0.02) {
      return pKa + Math.log10(molesBase / (molesAcid - molesBase));
    } else if (Math.abs(molesBase - molesAcid) <= 0.02) {
      const concConj = molesAcid / totalV;
      const kb = 1e-14 / ka;
      const oh = Math.sqrt(kb * concConj);
      return 14 + Math.log10(oh);
    } else {
      const oh = (molesBase - molesAcid) / totalV;
      return Math.min(13.5, 14 + Math.log10(oh));
    }
  }
}

export const ChemistrySim: React.FC<Props> = ({ expId, onRecord }) => {
  // 1. Titration
  const [acidType, setAcidType] = useState<'strong' | 'weak'>('weak');
  const [baseAdded, setBaseAdded] = useState(12.5);
  const [indicator, setIndicator] = useState<'phenolphthalein' | 'methyl-orange'>('phenolphthalein');

  // 2. Gas Laws
  const [gasTemp, setGasTemp] = useState(300); // K
  const [gasVol, setGasVol] = useState(10); // L
  const [gasMoles, setGasMoles] = useState(1.0);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number }[]>([]);

  // 3. Kinetics
  const [kinTemp, setKinTemp] = useState(350);
  const [ea, setEa] = useState(45); // kJ/mol
  const [catalyzed, setCatalyzed] = useState(false);
  const [reactedFrac, setReactedFrac] = useState(0);
  const kinParticlesRef = useRef<{ x: number; y: number; vx: number; vy: number; kind: 'A' | 'B' | 'C' }[]>([]);

  // 4. Flame Test
  const [salt, setSalt] = useState<keyof typeof FLAME_SALTS>('Na');

  // 5. Electrochemistry
  const [znConc, setZnConc] = useState(1.0);
  const [cuConc, setCuConc] = useState(1.0);

  const [running, setRunning] = useState(true);

  useEffect(() => {
    particlesRef.current = Array.from({ length: 42 }, () => {
      const ang = Math.random() * Math.PI * 2;
      return { x: 0.2 + Math.random() * 0.6, y: 0.35 + Math.random() * 0.55, vx: Math.cos(ang), vy: Math.sin(ang) };
    });
    kinParticlesRef.current = Array.from({ length: 36 }, (_, i) => {
      const ang = Math.random() * Math.PI * 2;
      return { x: Math.random(), y: Math.random(), vx: Math.cos(ang), vy: Math.sin(ang), kind: i % 2 === 0 ? 'A' : 'B' };
    });
    setReactedFrac(0);
  }, [expId]);

  const canvasRef = useHiDpiCanvas(
    (ctx, w, h, t) => {
      ctx.clearRect(0, 0, w, h);

      if (expId === 'acid-base-titration') {
        const ph = computeTitrationPh(acidType, baseAdded);
        // Flask solution color
        let flaskColor = 'rgba(226,232,240,0.22)';
        if (indicator === 'phenolphthalein') {
          if (ph >= 8.2) {
            const alpha = Math.min(0.75, 0.2 + ((ph - 8.2) / 2.0) * 0.55);
            flaskColor = `rgba(236, 72, 153, ${alpha})`;
          }
        } else {
          flaskColor = ph < 3.4 ? 'rgba(239, 68, 68, 0.55)' : ph > 4.4 ? 'rgba(250, 204, 21, 0.45)' : 'rgba(249, 115, 22, 0.5)';
        }

        // Burette & Flask on left 35%
        const bx = w * 0.17;
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bx - 12, 24, 24, 105);
        const fillH = Math.max(8, 98 * (1 - baseAdded / 50));
        ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.fillRect(bx - 10, 24 + (103 - fillH), 20, fillH);

        // Animated droplet
        const dropY = 132 + ((t * 95) % 48);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.arc(bx, dropY, 3, 0, Math.PI * 2); ctx.fill();

        // Erlenmeyer flask
        ctx.beginPath();
        ctx.moveTo(bx - 16, 180);
        ctx.lineTo(bx + 16, 180);
        ctx.lineTo(bx + 54, h - 38);
        ctx.lineTo(bx - 54, h - 38);
        ctx.closePath();
        ctx.fillStyle = flaskColor;
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // pH Curve on right 60%
        const gx0 = w * 0.36;
        const gx1 = w - 26;
        const gy0 = 32;
        const gy1 = h - 42;
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(gx0, gy0); ctx.lineTo(gx0, gy1); ctx.lineTo(gx1, gy1); ctx.stroke();

        // pH 7 dashed line
        const y7 = gy1 - (7 / 14) * (gy1 - gy0);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(255,255,255,0.16)';
        ctx.beginPath(); ctx.moveTo(gx0, y7); ctx.lineTo(gx1, y7); ctx.stroke();
        ctx.setLineDash([]);

        // Full reference curve (faint) + traced curve (vivid)
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let v = 0; v <= 50; v += 0.5) {
          const px = gx0 + (v / 50) * (gx1 - gx0);
          const py = gy1 - (computeTitrationPh(acidType, v) / 14) * (gy1 - gy0);
          if (v === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let v = 0; v <= baseAdded; v += 0.25) {
          const px = gx0 + (v / 50) * (gx1 - gx0);
          const py = gy1 - (computeTitrationPh(acidType, v) / 14) * (gy1 - gy0);
          if (v === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        const curX = gx0 + (baseAdded / 50) * (gx1 - gx0);
        const curY = gy1 - (ph / 14) * (gy1 - gy0);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(curX, curY, 5.5, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText('pH 14', gx0 - 38, gy0 + 8);
        ctx.fillText('pH 7', gx0 - 32, y7 + 4);
        ctx.fillText('0 mL', gx0, gy1 + 18);
        ctx.fillText('25 mL (Eq)', gx0 + (gx1 - gx0) * 0.45, gy1 + 18);
        ctx.fillText('50 mL', gx1 - 36, gy1 + 18);
      } else if (expId === 'gas-laws') {
        const boxX = 48;
        const boxW = w - 96;
        const maxBoxH = h - 76;
        const pistonTop = 38 + (1 - gasVol / 20) * (maxBoxH * 0.72);
        const boxBottom = h - 38;

        // Cylinder walls
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(boxX, 38, boxW, maxBoxH);

        // Movable piston head
        ctx.fillStyle = '#334155';
        ctx.fillRect(boxX + 2, pistonTop, boxW - 4, 14);
        ctx.strokeStyle = '#94a3b8';
        ctx.strokeRect(boxX + 2, pistonTop, boxW - 4, 14);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(boxX + boxW / 2 - 6, 10, 12, pistonTop - 10);

        const speedScale = Math.sqrt(gasTemp / 300) * 0.009;
        const activeCount = Math.round(gasMoles * 18);

        particlesRef.current.slice(0, activeCount).forEach((p) => {
          if (running) {
            p.x += p.vx * speedScale;
            p.y += p.vy * speedScale;
            if (p.x < 0.03) { p.x = 0.03; p.vx = Math.abs(p.vx); }
            if (p.x > 0.97) { p.x = 0.97; p.vx = -Math.abs(p.vx); }
            if (p.y < 0.05) { p.y = 0.05; p.vy = Math.abs(p.vy); }
            if (p.y > 0.96) { p.y = 0.96; p.vy = -Math.abs(p.vy); }
          }
          const px = boxX + 8 + p.x * (boxW - 16);
          const py = pistonTop + 20 + p.y * Math.max(20, boxBottom - pistonTop - 26);

          ctx.fillStyle = gasTemp > 450 ? '#f59e0b' : gasTemp < 220 ? '#38bdf8' : '#10b981';
          ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
        });
      } else if (expId === 'reaction-kinetics') {
        const effEa = catalyzed ? ea * 0.62 : ea;
        const k = 1e6 * Math.exp(-(effEa * 1000) / (8.314 * kinTemp));
        const prob = Math.min(0.85, k * 0.025);
        const speed = Math.sqrt(kinTemp / 300) * 0.011;

        const chamberW = w * 0.52;
        ctx.strokeStyle = '#334155';
        ctx.strokeRect(20, 24, chamberW, h - 48);

        let countC = 0;
        const pts = kinParticlesRef.current;
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          if (running) {
            p.x += p.vx * speed;
            p.y += p.vy * speed;
            if (p.x < 0.04 || p.x > 0.96) p.vx *= -1;
            if (p.y < 0.04 || p.y > 0.96) p.vy *= -1;
            // Collisions
            for (let j = i + 1; j < pts.length; j++) {
              const q = pts[j];
              const dx = p.x - q.x;
              const dy = p.y - q.y;
              if (dx * dx + dy * dy < 0.0025 && ((p.kind === 'A' && q.kind === 'B') || (p.kind === 'B' && q.kind === 'A'))) {
                if (Math.random() < prob * 0.06) {
                  p.kind = 'C';
                  q.kind = 'C';
                }
              }
            }
          }
          if (p.kind === 'C') countC++;
          const px = 28 + p.x * (chamberW - 16);
          const py = 32 + p.y * (h - 64);
          ctx.fillStyle = p.kind === 'A' ? '#38bdf8' : p.kind === 'B' ? '#f59e0b' : '#10b981';
          ctx.beginPath(); ctx.arc(px, py, p.kind === 'C' ? 6.5 : 5, 0, Math.PI * 2); ctx.fill();
        }
        const frac = Math.round((countC / pts.length) * 100);
        if (frac !== reactedFrac) setReactedFrac(frac);

        // Energy barrier plot on right
        const ex0 = chamberW + 46;
        const ex1 = w - 26;
        const eyBase = h - 46;
        ctx.strokeStyle = '#475569';
        ctx.beginPath(); ctx.moveTo(ex0, 32); ctx.lineTo(ex0, eyBase); ctx.lineTo(ex1, eyBase); ctx.stroke();

        const peakY = Math.max(46, eyBase - 90 - (effEa / 80) * 110);
        ctx.strokeStyle = catalyzed ? '#10b981' : '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(ex0 + 10, eyBase - 55);
        ctx.bezierCurveTo(ex0 + 60, eyBase - 55, (ex0 + ex1) / 2 - 20, peakY, (ex0 + ex1) / 2, peakY);
        ctx.bezierCurveTo((ex0 + ex1) / 2 + 20, peakY, ex1 - 60, eyBase - 25, ex1 - 10, eyBase - 25);
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(`Eₐ = ${effEa.toFixed(0)} kJ/mol`, ex0 + 16, 48);
        ctx.fillText(`Reactants A+B`, 28, h - 8);
      } else if (expId === 'flame-test') {
        const s = FLAME_SALTS[salt];
        const bx = w * 0.28;
        const by = h - 45;

        // Bunsen burner barrel
        ctx.fillStyle = '#475569';
        ctx.fillRect(bx - 16, by - 75, 32, 75);
        ctx.fillStyle = '#334155';
        ctx.fillRect(bx - 42, by, 84, 14);

        // Animated turbulent colored flame
        const flicker = Math.sin(t * 14) * 5 + Math.cos(t * 23) * 3;
        const grad = ctx.createRadialGradient(bx, by - 145, 8, bx, by - 135, 95);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.28, s.color);
        grad.addColorStop(0.7, s.glow);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(bx - 24, by - 75);
        ctx.quadraticCurveTo(bx - 38, by - 155, bx + flicker, by - 255);
        ctx.quadraticCurveTo(bx + 38, by - 155, bx + 24, by - 75);
        ctx.closePath();
        ctx.fill();

        // Platinum wire loop
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(bx - 130, by - 115); ctx.lineTo(bx - 8, by - 135); ctx.stroke();
        ctx.beginPath(); ctx.arc(bx, by - 136, 7, 0, Math.PI * 2); ctx.stroke();

        // Emission Spectroscope Panel on right
        const sx0 = w * 0.52;
        const sw = w * 0.43;
        ctx.fillStyle = '#020617';
        ctx.strokeStyle = '#334155';
        ctx.fillRect(sx0, 80, sw, 96);
        ctx.strokeRect(sx0, 80, sw, 96);

        s.lines.forEach((nm) => {
          const lx = sx0 + ((nm - 380) / (780 - 380)) * sw;
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 3.5;
          ctx.beginPath(); ctx.moveTo(lx, 84); ctx.lineTo(lx, 172); ctx.stroke();
          ctx.fillStyle = '#dee2f6';
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText(`${nm}nm`, lx - 14, 194);
        });
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText('ATOMIC EMISSION SPECTRUM (380–780nm)', sx0, 66);
      } else {
        // Electrochemistry Daniell Cell
        const lx = w * 0.25;
        const rx = w * 0.75;
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(59,130,246,0.12)';
        ctx.fillRect(lx - 70, 120, 140, h - 150);
        ctx.strokeRect(lx - 70, 120, 140, h - 150);

        ctx.fillStyle = `rgba(6, 182, 212, ${0.08 + cuConc * 0.16})`;
        ctx.fillRect(rx - 70, 120, 140, h - 150);
        ctx.strokeRect(rx - 70, 120, 140, h - 150);

        // Electrodes
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(lx - 45, 92, 20, h - 140);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(rx + 25, 92, 20, h - 140);

        // Salt Bridge
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 14;
        ctx.globalAlpha = 0.28;
        ctx.beginPath();
        ctx.moveTo(lx + 40, 165); ctx.lineTo(lx + 40, 95); ctx.lineTo(rx - 40, 95); ctx.lineTo(rx - 40, 165);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Wire & animated electrons
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(lx - 35, 92); ctx.lineTo(lx - 35, 38); ctx.lineTo(rx + 35, 38); ctx.lineTo(rx + 35, 92);
        ctx.stroke();

        for (let k = 0; k < 6; k++) {
          const frac = ((t * 0.35 + k / 6) % 1);
          const ex = lx - 35 + frac * (rx + 35 - (lx - 35));
          ctx.fillStyle = '#fde047';
          ctx.beginPath(); ctx.arc(ex, 38, 4, 0, Math.PI * 2); ctx.fill();
        }

        // Voltmeter dial
        ctx.fillStyle = '#161b2a';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(w / 2, 38, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        const q = znConc / cuConc;
        const eCell = 1.1 - (0.0592 / 2) * Math.log10(q);
        ctx.fillStyle = '#fbbf24';
        ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillText(`${eCell.toFixed(2)}V`, w / 2 - 17, 42);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(`Zn | Zn²⁺ (${znConc.toFixed(2)}M)`, lx - 58, h - 12);
        ctx.fillText(`Cu²⁺ (${cuConc.toFixed(2)}M) | Cu`, rx - 58, h - 12);
      }
    },
    [expId, acidType, baseAdded, indicator, gasTemp, gasVol, gasMoles, kinTemp, ea, catalyzed, salt, znConc, cuConc, running],
    running
  );

  let telemetry: TelemetryMetric[] = [];
  let recordSnapshot: Record<string, string> = {};

  if (expId === 'acid-base-titration') {
    const ph = computeTitrationPh(acidType, baseAdded);
    const state = Math.abs(baseAdded - 25) < 0.3 ? 'EQUIVALENCE' : baseAdded < 25 ? 'ACIDIC / BUFFER' : 'EXCESS BASE';
    telemetry = [
      { label: 'Volume NaOH', value: baseAdded.toFixed(1), unit: 'mL' },
      { label: 'Solution pH', value: ph.toFixed(2), tone: Math.abs(baseAdded - 25) < 0.5 ? 'nominal' : 'accent' },
      { label: 'pOH', value: (14 - ph).toFixed(2) },
      { label: 'Regime', value: state },
    ];
    recordSnapshot = { 'Acid Type': acidType, 'V_added (mL)': baseAdded.toFixed(1), 'Live pH': ph.toFixed(2), Indicator: indicator, State: state };
  } else if (expId === 'gas-laws') {
    const P = (gasMoles * 0.08206 * gasTemp) / gasVol;
    const vRms = Math.sqrt((3 * 8.314 * gasTemp) / 0.028); // N2 molar mass
    telemetry = [
      { label: 'Pressure P', value: P.toFixed(2), unit: 'atm', tone: P > 6 ? 'warning' : 'nominal' },
      { label: 'Volume V', value: gasVol.toFixed(1), unit: 'L' },
      { label: 'Temp T', value: `${gasTemp}`, unit: 'K' },
      { label: 'v_rms (N₂)', value: vRms.toFixed(0), unit: 'm/s' },
    ];
    recordSnapshot = { 'n (mol)': gasMoles.toFixed(1), 'V (L)': gasVol.toFixed(1), 'T (K)': `${gasTemp}`, 'P (atm)': P.toFixed(2), 'v_rms (m/s)': vRms.toFixed(0) };
  } else if (expId === 'reaction-kinetics') {
    const effEa = catalyzed ? ea * 0.62 : ea;
    const k = 1e6 * Math.exp(-(effEa * 1000) / (8.314 * kinTemp));
    telemetry = [
      { label: 'Rate Const k', value: k.toExponential(2), unit: 's⁻¹', tone: 'nominal' },
      { label: 'Barrier Eₐ', value: effEa.toFixed(1), unit: 'kJ/mol' },
      { label: 'Temp T', value: `${kinTemp}`, unit: 'K' },
      { label: 'Product Yield', value: `${reactedFrac}`, unit: '%' },
    ];
    recordSnapshot = { 'T (K)': `${kinTemp}`, 'Eₐ (kJ/mol)': effEa.toFixed(1), Catalyst: catalyzed ? 'Yes' : 'No', 'k (s⁻¹)': k.toExponential(2), '% Converted': `${reactedFrac}%` };
  } else if (expId === 'flame-test') {
    const s = FLAME_SALTS[salt];
    const eEv = 1240 / s.peakNm;
    telemetry = [
      { label: 'Dominant λ', value: `${s.peakNm}`, unit: 'nm', tone: 'nominal' },
      { label: 'Photon Energy', value: eEv.toFixed(2), unit: 'eV' },
      { label: 'Frequency ν', value: (3e8 / (s.peakNm * 1e-9) / 1e14).toFixed(2), unit: '×10¹⁴ Hz' },
      { label: 'Cation', value: s.name },
    ];
    recordSnapshot = { Ion: s.name, 'Flame Color': s.color, 'Peak λ (nm)': `${s.peakNm}`, 'Energy (eV)': eEv.toFixed(2), Transition: `${s.lines.join('/')} nm` };
  } else {
    const q = znConc / cuConc;
    const eCell = 1.1 - (0.0592 / 2) * Math.log10(q);
    const dg = -2 * 96.485 * eCell;
    telemetry = [
      { label: 'Cell EMF E_cell', value: eCell.toFixed(3), unit: 'V', tone: 'nominal' },
      { label: 'Quotient Q', value: q.toFixed(2) },
      { label: 'ΔG Free Energy', value: dg.toFixed(1), unit: 'kJ/mol' },
      { label: 'Anode / Cathode', value: 'Zn → Cu' },
    ];
    recordSnapshot = { '[Zn²⁺] (M)': znConc.toFixed(2), '[Cu²⁺] (M)': cuConc.toFixed(2), 'T (K)': '298', 'Q Ratio': q.toFixed(2), 'E_cell (V)': eCell.toFixed(3) };
  }

  const controls = (
    <div className="flex flex-col gap-4">
      {expId === 'acid-base-titration' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {(['strong', 'weak'] as const).map((a) => (
              <button key={a} type="button" onClick={() => setAcidType(a)} className={`py-1.5 text-xs font-medium rounded border cursor-pointer capitalize ${acidType === a ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>
                {a === 'strong' ? 'Strong (HCl)' : 'Weak (CH₃COOH)'}
              </button>
            ))}
          </div>
          <ParamSlider label="NaOH Added (0.10 M)" value={baseAdded} min={0} max={50} step={0.5} unit="mL" onChange={setBaseAdded} />
          <div className="grid grid-cols-2 gap-2">
            {(['phenolphthalein', 'methyl-orange'] as const).map((ind) => (
              <button key={ind} type="button" onClick={() => setIndicator(ind)} className={`py-1.5 text-xs font-medium rounded border cursor-pointer capitalize ${indicator === ind ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>
                {ind === 'phenolphthalein' ? 'Phenolphthalein' : 'Methyl Orange'}
              </button>
            ))}
          </div>
        </>
      )}
      {expId === 'gas-laws' && (
        <>
          <ParamSlider label="Temperature (T)" value={gasTemp} min={150} max={700} step={10} unit="K" onChange={setGasTemp} />
          <ParamSlider label="Container Volume (V)" value={gasVol} min={3} max={20} step={0.5} unit="L" onChange={setGasVol} />
          <ParamSlider label="Gas Moles (n)" value={gasMoles} min={0.5} max={2.0} step={0.1} unit="mol" onChange={setGasMoles} />
        </>
      )}
      {expId === 'reaction-kinetics' && (
        <>
          <ParamSlider label="Temperature (T)" value={kinTemp} min={250} max={650} step={10} unit="K" onChange={setKinTemp} />
          <ParamSlider label="Activation Energy (Eₐ)" value={ea} min={20} max={80} step={1} unit="kJ/mol" onChange={setEa} />
          <button
            type="button"
            onClick={() => setCatalyzed((c) => !c)}
            className={`py-2 px-3 rounded text-xs font-medium border cursor-pointer ${catalyzed ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}
          >
            {catalyzed ? 'Catalyst Active (Lowered Eₐ)' : 'Enable Catalyst'}
          </button>
        </>
      )}
      {expId === 'flame-test' && (
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(FLAME_SALTS) as Array<keyof typeof FLAME_SALTS>).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setSalt(key);
                labAudio.playTelemetryTone(350 + (800 - FLAME_SALTS[key].peakNm) * 1.4, 0.11);
              }}
              className={`py-2 px-2.5 text-xs font-medium rounded border cursor-pointer ${salt === key ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}
            >
              {FLAME_SALTS[key].name}
            </button>
          ))}
        </div>
      )}
      {expId === 'electrochemistry' && (
        <>
          <ParamSlider label="Anode [Zn²⁺]" value={znConc} min={0.01} max={2.0} step={0.05} unit="M" onChange={setZnConc} />
          <ParamSlider label="Cathode [Cu²⁺]" value={cuConc} min={0.01} max={2.0} step={0.05} unit="M" onChange={setCuConc} />
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
        setBaseAdded(12.5); setGasTemp(300); setGasVol(10); setGasMoles(1.0);
        setKinTemp(350); setEa(45); setCatalyzed(false);
        setZnConc(1.0); setCuConc(1.0);
        kinParticlesRef.current.forEach((p, i) => { p.kind = i % 2 === 0 ? 'A' : 'B'; });
        setReactedFrac(0);
      }}
      onRecordTrial={() => onRecord(recordSnapshot)}
    />
  );
};
