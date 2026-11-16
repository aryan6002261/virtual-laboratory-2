import React, { useState } from 'react';
import { ParamSlider, SimShell, useHiDpiCanvas } from './SimShared';
import { TelemetryMetric } from '../../types/lab';
import { labAudio } from '../../utils/audio';

interface Props {
  expId: string;
  onRecord: (values: Record<string, string>) => void;
}

type GateKind = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

function evalGate(g: GateKind, a: number, b: number): number {
  switch (g) {
    case 'AND': return a & b;
    case 'OR': return a | b;
    case 'NOT': return a ? 0 : 1;
    case 'NAND': return (a & b) ? 0 : 1;
    case 'NOR': return (a | b) ? 0 : 1;
    case 'XOR': return a ^ b;
    case 'XNOR': return (a ^ b) ? 0 : 1;
  }
}

export const ElectronicsSim: React.FC<Props> = ({ expId, onRecord }) => {
  // 1. Logic Gates
  const [gate, setGate] = useState<GateKind>('XOR');
  const [inA, setInA] = useState(1);
  const [inB, setInB] = useState(0);

  // 2. Half & Full Adder
  const [adderMode, setAdderMode] = useState<'half' | 'full'>('full');
  const [addA, setAddA] = useState(1);
  const [addB, setAddB] = useState(1);
  const [addCin, setAddCin] = useState(0);

  // 3. MUX / Decoder
  const [combType, setCombType] = useState<'mux' | 'decoder'>('mux');
  const [sel1, setSel1] = useState(1);
  const [sel0, setSel0] = useState(0);
  const [muxData, setMuxData] = useState<[number, number, number, number]>([0, 1, 1, 0]);
  const [decEnable, setDecEnable] = useState(1);

  // 4. Flip-Flops
  const [ffType, setFfType] = useState<'JK' | 'D' | 'SR' | 'T'>('JK');
  const [ffIn1, setFfIn1] = useState(1);
  const [ffIn2, setFfIn2] = useState(1);
  const [ffQ, setFfQ] = useState(0);
  const [ffHistory, setFfHistory] = useState<number[]>([0, 0, 1, 0, 1, 1]);

  // 5. Binary Logic
  const [bits, setBits] = useState<number[]>([1, 0, 1, 1, 0, 1, 0, 1]);
  const [signedMode, setSignedMode] = useState(false);

  // 6. PN Diode
  const [diodeType, setDiodeType] = useState<'Si' | 'Ge' | 'Zener'>('Si');
  const [diodeBias, setDiodeBias] = useState(0.75);

  // 7. Op-Amp
  const [opMode, setOpMode] = useState<'inverting' | 'non-inverting'>('inverting');
  const [opVin, setOpVin] = useState(1.5);
  const [opRin, setOpRin] = useState(10); // kOhm
  const [opRf, setOpRf] = useState(33); // kOhm
  const [opRail, setOpRail] = useState(12);

  const [running, setRunning] = useState(true);

  const pulseClock = () => {
    let nextQ = ffQ;
    if (ffType === 'D') nextQ = ffIn1;
    else if (ffType === 'T') nextQ = ffIn1 ? (ffQ ? 0 : 1) : ffQ;
    else if (ffType === 'SR') {
      if (ffIn1 === 1 && ffIn2 === 0) nextQ = 1;
      else if (ffIn1 === 0 && ffIn2 === 1) nextQ = 0;
    } else {
      // JK
      if (ffIn1 === 1 && ffIn2 === 0) nextQ = 1;
      else if (ffIn1 === 0 && ffIn2 === 1) nextQ = 0;
      else if (ffIn1 === 1 && ffIn2 === 1) nextQ = ffQ ? 0 : 1;
    }
    setFfQ(nextQ);
    setFfHistory((h) => [...h.slice(-9), nextQ]);
    labAudio.playTelemetryTone(nextQ ? 660 : 330, 0.08);
  };

  const byteUnsigned = bits.reduce((acc, b, idx) => acc + b * (1 << (7 - idx)), 0);
  const byteSigned = byteUnsigned >= 128 ? byteUnsigned - 256 : byteUnsigned;

  const canvasRef = useHiDpiCanvas(
    (ctx, w, h, t) => {
      ctx.clearRect(0, 0, w, h);

      if (expId === 'logic-gates') {
        const outY = evalGate(gate, inA, inB);
        const gx = w * 0.48, gy = h / 2;

        // Input wires
        ctx.strokeStyle = inA ? '#10b981' : '#475569';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(65, gy - 28); ctx.lineTo(gx - 55, gy - 28); ctx.stroke();

        if (gate !== 'NOT') {
          ctx.strokeStyle = inB ? '#10b981' : '#475569';
          ctx.beginPath(); ctx.moveTo(65, gy + 28); ctx.lineTo(gx - 55, gy + 28); ctx.stroke();
        }

        // Gate block
        ctx.fillStyle = '#161b2a';
        ctx.strokeStyle = outY ? '#10b981' : '#64748b';
        ctx.lineWidth = 2.5;
        ctx.fillRect(gx - 55, gy - 50, 110, 100);
        ctx.strokeRect(gx - 55, gy - 50, 110, 100);

        ctx.fillStyle = '#dee2f6';
        ctx.font = '700 18px "JetBrains Mono", monospace';
        ctx.fillText(gate, gx - gate.length * 6, gy + 6);

        // Output wire & LED
        ctx.strokeStyle = outY ? '#10b981' : '#475569';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(gx + 55, gy); ctx.lineTo(w - 95, gy); ctx.stroke();

        ctx.fillStyle = outY ? '#10b981' : '#1e293b';
        ctx.beginPath(); ctx.arc(w - 72, gy, 18, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = outY ? '#6ffbbe' : '#475569';
        ctx.stroke();

        ctx.fillStyle = '#dee2f6';
        ctx.font = '600 12px "JetBrains Mono", monospace';
        ctx.fillText(`A=${inA}`, 24, gy - 24);
        if (gate !== 'NOT') ctx.fillText(`B=${inB}`, 24, gy + 32);
        ctx.fillText(`Y=${outY}`, w - 85, gy + 38);
      } else if (expId === 'half-adder') {
        const sum = adderMode === 'half' ? addA ^ addB : addA ^ addB ^ addCin;
        const carry = adderMode === 'half' ? addA & addB : (addA & addB) | (addCin & (addA ^ addB));
        const cx = w / 2, cy = h / 2;

        ctx.fillStyle = '#161b2a';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.fillRect(cx - 80, cy - 75, 160, 150);
        ctx.strokeRect(cx - 80, cy - 75, 160, 150);

        ctx.fillStyle = '#6ffbbe';
        ctx.font = '600 14px "JetBrains Mono", monospace';
        ctx.fillText(adderMode === 'half' ? 'HALF ADDER' : 'FULL ADDER', cx - 48, cy + 5);

        const ins = adderMode === 'half' ? [['A', addA, -40], ['B', addB, 40]] : [['A', addA, -48], ['B', addB, 0], ['Cin', addCin, 48]];
        ins.forEach(([lbl, val, dy]) => {
          ctx.strokeStyle = val ? '#10b981' : '#475569';
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(60, cy + Number(dy)); ctx.lineTo(cx - 80, cy + Number(dy)); ctx.stroke();
          ctx.fillStyle = '#dee2f6';
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillText(`${lbl}=${val}`, 20, cy + Number(dy) + 4);
        });

        // Outputs
        [[sum, -35, 'SUM'], [carry, 35, 'CARRY']].forEach(([val, dy, lbl]) => {
          ctx.strokeStyle = val ? '#10b981' : '#475569';
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(cx + 80, cy + Number(dy)); ctx.lineTo(w - 110, cy + Number(dy)); ctx.stroke();
          ctx.fillStyle = val ? '#10b981' : '#1e293b';
          ctx.beginPath(); ctx.arc(w - 86, cy + Number(dy), 14, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#dee2f6';
          ctx.fillText(`${lbl}=${val}`, w - 62, cy + Number(dy) + 4);
        });
      } else if (expId === 'digital-circuits') {
        const selIdx = sel1 * 2 + sel0;
        const cx = w / 2, cy = h / 2;
        if (combType === 'mux') {
          ctx.fillStyle = '#161b2a';
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx - 65, cy - 110); ctx.lineTo(cx + 65, cy - 72);
          ctx.lineTo(cx + 65, cy + 72); ctx.lineTo(cx - 65, cy + 110);
          ctx.closePath(); ctx.fill(); ctx.stroke();

          muxData.forEach((bit, idx) => {
            const y = cy - 75 + idx * 50;
            const active = idx === selIdx;
            ctx.strokeStyle = active ? (bit ? '#10b981' : '#f59e0b') : '#334155';
            ctx.lineWidth = active ? 3 : 1.5;
            ctx.beginPath(); ctx.moveTo(75, y); ctx.lineTo(cx - 65, y); ctx.stroke();
            ctx.fillStyle = active ? '#dee2f6' : '#64748b';
            ctx.font = '12px "JetBrains Mono", monospace';
            ctx.fillText(`D${idx}=${bit}`, 24, y + 4);
          });
          const outVal = muxData[selIdx];
          ctx.strokeStyle = outVal ? '#10b981' : '#f59e0b';
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(cx + 65, cy); ctx.lineTo(w - 80, cy); ctx.stroke();
          ctx.fillStyle = '#6ffbbe';
          ctx.fillText(`Y = D${selIdx} = ${outVal}`, w - 165, cy - 14);
        } else {
          ctx.fillStyle = '#161b2a';
          ctx.strokeStyle = '#10b981';
          ctx.fillRect(cx - 65, cy - 95, 130, 190);
          ctx.strokeRect(cx - 65, cy - 95, 130, 190);
          ctx.fillStyle = '#6ffbbe';
          ctx.font = '13px "JetBrains Mono", monospace';
          ctx.fillText('2:4 DEC', cx - 32, cy + 5);

          [0, 1, 2, 3].forEach((idx) => {
            const y = cy - 75 + idx * 50;
            const active = decEnable === 1 && idx === selIdx;
            ctx.strokeStyle = active ? '#10b981' : '#334155';
            ctx.lineWidth = active ? 3 : 1.5;
            ctx.beginPath(); ctx.moveTo(cx + 65, y); ctx.lineTo(w - 85, y); ctx.stroke();
            ctx.fillStyle = active ? '#10b981' : '#1e293b';
            ctx.beginPath(); ctx.arc(w - 65, y, 10, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = active ? '#6ffbbe' : '#64748b';
            ctx.fillText(`Y${idx}=${active ? 1 : 0}`, w - 46, y + 4);
          });
        }
      } else if (expId === 'flip-flops') {
        // Timing diagram of Q history
        const gx0 = 50, gx1 = w - 35, stepW = (gx1 - gx0) / ffHistory.length;
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillText(`${ffType} FLIP-FLOP TIMING TRACE (Q = ${ffQ}, Q̄ = ${ffQ ? 0 : 1})`, gx0, 38);

        // CLK trace
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ffHistory.forEach((_, idx) => {
          const x = gx0 + idx * stepW;
          const mid = x + stepW * 0.5;
          if (idx === 0) ctx.moveTo(x, 125);
          ctx.lineTo(x, 85); ctx.lineTo(mid, 85); ctx.lineTo(mid, 125); ctx.lineTo(x + stepW, 125);
        });
        ctx.stroke();

        // Q trace
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ffHistory.forEach((val, idx) => {
          const x = gx0 + idx * stepW;
          const y = val ? 175 : 225;
          if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          ctx.lineTo(x + stepW, y);
        });
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.fillText('CLK', 12, 110);
        ctx.fillStyle = '#6ffbbe';
        ctx.fillText('Q', 20, 205);
      } else if (expId === 'binary-logic') {
        const cellW = Math.min(62, (w - 80) / 8);
        const startX = (w - cellW * 8) / 2;
        bits.forEach((b, i) => {
          const x = startX + i * cellW;
          const y = h / 2 - 42;
          ctx.fillStyle = b ? 'rgba(16, 185, 129, 0.28)' : '#161b2a';
          ctx.strokeStyle = i === 0 && signedMode ? '#f59e0b' : b ? '#10b981' : '#334155';
          ctx.lineWidth = 2;
          ctx.fillRect(x + 3, y, cellW - 6, 72);
          ctx.strokeRect(x + 3, y, cellW - 6, 72);

          ctx.fillStyle = '#dee2f6';
          ctx.font = '700 22px "JetBrains Mono", monospace';
          ctx.fillText(`${b}`, x + cellW / 2 - 7, y + 44);
          ctx.fillStyle = '#89929b';
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText(`${1 << (7 - i)}`, x + cellW / 2 - 10, y - 10);
        });
        ctx.fillStyle = '#6ffbbe';
        ctx.font = '13px "JetBrains Mono", monospace';
        ctx.fillText(`DEC: ${signedMode ? byteSigned : byteUnsigned}  ·  HEX: 0x${byteUnsigned.toString(16).toUpperCase().padStart(2, '0')}  ·  OCT: ${byteUnsigned.toString(8)}`, startX, h - 42);
      } else if (expId === 'diode-characteristics') {
        const vk = diodeType === 'Si' ? 0.7 : diodeType === 'Ge' ? 0.3 : 0.7;
        const vz = diodeType === 'Zener' ? -5.1 : -8.5;
        // Left: PN junction depletion bar
        const depW = Math.max(8, Math.min(72, 26 - diodeBias * 24));
        ctx.fillStyle = 'rgba(239,68,68,0.18)';
        ctx.fillRect(36, 95, 110, 90);
        ctx.fillStyle = 'rgba(148,163,184,0.22)';
        ctx.fillRect(146 - depW / 2, 95, depW, 90);
        ctx.fillStyle = 'rgba(56,189,248,0.18)';
        ctx.fillRect(146 + depW / 2, 95, 110, 90);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(`Depletion: ${depW.toFixed(0)} nm`, 76, 208);

        // Right: Shockley I-V curve
        const gx0 = w * 0.48, gx1 = w - 28, gy0 = 32, gy1 = h - 38;
        const zeroX = gx0 + (gx1 - gx0) * 0.7;
        const zeroY = gy0 + (gy1 - gy0) * 0.65;
        ctx.strokeStyle = '#475569';
        ctx.beginPath(); ctx.moveTo(gx0, zeroY); ctx.lineTo(gx1, zeroY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(zeroX, gy0); ctx.lineTo(zeroX, gy1); ctx.stroke();

        const evalI = (v: number) => {
          if (v >= 0) return Math.min(50, 0.0005 * (Math.exp(Math.min(11.5, v / (vk * 0.065))) - 1));
          if (v < vz) return -Math.min(40, (vz - v) * 28);
          return -0.02;
        };

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let v = -9; v <= 1.2; v += 0.05) {
          const px = zeroX + (v < 0 ? (v / 9) * (zeroX - gx0) : (v / 1.2) * (gx1 - zeroX));
          const cur = evalI(v);
          const py = zeroY - (cur / 50) * (zeroY - gy0);
          if (v === -9) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        const curI = evalI(diodeBias);
        const dx = zeroX + (diodeBias < 0 ? (diodeBias / 9) * (zeroX - gx0) : (diodeBias / 1.2) * (gx1 - zeroX));
        const dy = zeroY - (curI / 50) * (zeroY - gy0);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(dx, dy, 5.5, 0, Math.PI * 2); ctx.fill();
      } else {
        // Op-Amp oscilloscope
        const midY = h / 2;
        const gain = opMode === 'inverting' ? -opRf / opRin : 1 + opRf / opRin;
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.beginPath(); ctx.moveTo(30, midY); ctx.lineTo(w - 30, midY); ctx.stroke();

        // Rail limit dashed lines
        const pxPerV = (h * 0.42) / 15;
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
        ctx.beginPath(); ctx.moveTo(30, midY - opRail * pxPerV); ctx.lineTo(w - 30, midY - opRail * pxPerV); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(30, midY + opRail * pxPerV); ctx.lineTo(w - 30, midY + opRail * pxPerV); ctx.stroke();
        ctx.setLineDash([]);

        // Input sine
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 180; i++) {
          const x = 30 + (i / 180) * (w - 60);
          const v = opVin * Math.sin((i / 180) * Math.PI * 4 - t * 3.5);
          const y = midY - v * pxPerV;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Output clipped sine
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        for (let i = 0; i <= 180; i++) {
          const x = 30 + (i / 180) * (w - 60);
          const rawV = gain * opVin * Math.sin((i / 180) * Math.PI * 4 - t * 3.5);
          const clipped = Math.max(-opRail, Math.min(opRail, rawV));
          const y = midY - clipped * pxPerV;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    },
    [
      expId, gate, inA, inB, adderMode, addA, addB, addCin,
      combType, sel1, sel0, muxData, decEnable,
      ffType, ffIn1, ffIn2, ffQ, ffHistory,
      bits, signedMode, diodeType, diodeBias,
      opMode, opVin, opRin, opRf, opRail, running,
    ],
    running
  );

  let telemetry: TelemetryMetric[] = [];
  let recordSnapshot: Record<string, string> = {};

  if (expId === 'logic-gates') {
    const outY = evalGate(gate, inA, inB);
    telemetry = [
      { label: 'Active Gate', value: gate },
      { label: 'Inputs (A, B)', value: gate === 'NOT' ? `${inA}` : `${inA}, ${inB}` },
      { label: 'Output Y', value: `${outY}`, tone: outY ? 'nominal' : 'accent' },
      { label: 'Voltage Level', value: outY ? '5.0 V (HIGH)' : '0.0 V (LOW)' },
    ];
    recordSnapshot = { Gate: gate, 'Input A': `${inA}`, 'Input B': gate === 'NOT' ? '—' : `${inB}`, 'Output Y': `${outY}`, Expression: gate };
  } else if (expId === 'half-adder') {
    const sum = adderMode === 'half' ? addA ^ addB : addA ^ addB ^ addCin;
    const carry = adderMode === 'half' ? addA & addB : (addA & addB) | (addCin & (addA ^ addB));
    telemetry = [
      { label: 'Adder Mode', value: adderMode.toUpperCase() },
      { label: 'Sum Bit (S)', value: `${sum}`, tone: 'nominal' },
      { label: 'Carry Out', value: `${carry}`, tone: carry ? 'warning' : 'accent' },
      { label: 'Decimal Sum', value: `${carry * 2 + sum}` },
    ];
    recordSnapshot = { Mode: adderMode, A: `${addA}`, B: `${addB}`, C_in: adderMode === 'half' ? '—' : `${addCin}`, 'C_out Sum': `${carry}${sum}` };
  } else if (expId === 'digital-circuits') {
    const selIdx = sel1 * 2 + sel0;
    const outVal = combType === 'mux' ? muxData[selIdx] : decEnable ? `Y${selIdx}=1` : 'ALL 0';
    telemetry = [
      { label: 'Circuit', value: combType === 'mux' ? '4:1 MUX' : '2:4 DECODER' },
      { label: 'Address (S₁S₀)', value: `${sel1}${sel0}₂ (${selIdx})` },
      { label: 'Output', value: `${outVal}`, tone: 'nominal' },
      { label: 'Enable Pin', value: combType === 'mux' ? 'ACTIVE' : decEnable ? 'HIGH' : 'LOW' },
    ];
    recordSnapshot = { Block: combType, 'Select (S₁S₀)': `${sel1}${sel0}`, Enable: `${decEnable}`, 'Inputs/Data': muxData.join(''), Output: `${outVal}` };
  } else if (expId === 'flip-flops') {
    telemetry = [
      { label: 'Flip-Flop', value: ffType },
      { label: 'State Q', value: `${ffQ}`, tone: ffQ ? 'nominal' : 'accent' },
      { label: 'Complement Q̄', value: `${ffQ ? 0 : 1}` },
      { label: 'Clock Cycles', value: `${ffHistory.length}` },
    ];
    recordSnapshot = { Type: ffType, Inputs: `${ffIn1},${ffIn2}`, 'Prev Q': `${ffHistory[ffHistory.length - 2] ?? 0}`, CLK: '↑', 'Next Q': `${ffQ}` };
  } else if (expId === 'binary-logic') {
    telemetry = [
      { label: 'Binary', value: bits.join('') },
      { label: 'Hexadecimal', value: `0x${byteUnsigned.toString(16).toUpperCase().padStart(2, '0')}` },
      { label: signedMode ? "Two's Comp" : 'Unsigned', value: `${signedMode ? byteSigned : byteUnsigned}`, tone: 'nominal' },
      { label: 'Octal', value: `${byteUnsigned.toString(8).padStart(3, '0')}₈` },
    ];
    recordSnapshot = { 'Binary (8-bit)': bits.join(''), Hex: `0x${byteUnsigned.toString(16).toUpperCase().padStart(2, '0')}`, Octal: byteUnsigned.toString(8), Unsigned: `${byteUnsigned}`, Signed: `${byteSigned}` };
  } else if (expId === 'diode-characteristics') {
    const vk = diodeType === 'Si' ? 0.7 : diodeType === 'Ge' ? 0.3 : 0.7;
    const cur = diodeBias >= 0 ? Math.min(50, 0.0005 * (Math.exp(Math.min(11.5, diodeBias / (vk * 0.065))) - 1)) : diodeBias < -5.1 && diodeType === 'Zener' ? (-5.1 - diodeBias) * -28 : -0.02;
    const state = diodeBias >= vk ? 'FORWARD ON' : diodeBias < -5.1 && diodeType === 'Zener' ? 'ZENER BREAKDOWN' : 'BLOCKING';
    telemetry = [
      { label: 'Bias V_D', value: diodeBias.toFixed(2), unit: 'V' },
      { label: 'Current I_D', value: cur.toFixed(2), unit: 'mA', tone: Math.abs(cur) > 1 ? 'nominal' : 'accent' },
      { label: 'Knee V_k', value: `${vk}`, unit: 'V' },
      { label: 'Regime', value: state },
    ];
    recordSnapshot = { Diode: diodeType, 'Bias (V)': diodeBias.toFixed(2), 'Current (mA)': cur.toFixed(2), Depletion: `${Math.max(8, 26 - diodeBias * 24).toFixed(0)} nm`, State: state };
  } else {
    const gain = opMode === 'inverting' ? -opRf / opRin : 1 + opRf / opRin;
    const rawOut = gain * opVin;
    const clipped = Math.abs(rawOut) > opRail;
    telemetry = [
      { label: 'Closed Gain A_v', value: gain.toFixed(2), unit: 'V/V' },
      { label: 'Peak V_out', value: Math.max(-opRail, Math.min(opRail, rawOut)).toFixed(2), unit: 'V', tone: clipped ? 'alert' : 'nominal' },
      { label: 'Rail Limit', value: `±${opRail}`, unit: 'V' },
      { label: 'Saturation', value: clipped ? 'CLIPPED' : 'LINEAR', tone: clipped ? 'warning' : 'nominal' },
    ];
    recordSnapshot = { Topology: opMode, 'V_in (V)': opVin.toFixed(1), 'Gain A_v': gain.toFixed(2), 'V_out Peak': Math.max(-opRail, Math.min(opRail, rawOut)).toFixed(2), Clipping: clipped ? 'Yes' : 'No' };
  }

  const controls = (
    <div className="flex flex-col gap-4">
      {expId === 'logic-gates' && (
        <>
          <div className="grid grid-cols-4 gap-1.5">
            {(['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'] as GateKind[]).map((g) => (
              <button key={g} type="button" onClick={() => setGate(g)} className={`py-1.5 text-xs font-mono rounded border cursor-pointer ${gate === g ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>
                {g}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setInA((a) => (a ? 0 : 1))} className={`py-2 text-xs font-mono rounded border cursor-pointer ${inA ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>Input A = {inA}</button>
            {gate !== 'NOT' && (
              <button type="button" onClick={() => setInB((b) => (b ? 0 : 1))} className={`py-2 text-xs font-mono rounded border cursor-pointer ${inB ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>Input B = {inB}</button>
            )}
          </div>
        </>
      )}
      {expId === 'half-adder' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {(['half', 'full'] as const).map((m) => (
              <button key={m} type="button" onClick={() => setAdderMode(m)} className={`py-1.5 text-xs font-medium rounded border cursor-pointer capitalize ${adderMode === m ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>
                {m} Adder
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={() => setAddA((x) => (x ? 0 : 1))} className="py-2 text-xs font-mono rounded bg-white/5 border border-white/15 cursor-pointer">A = {addA}</button>
            <button type="button" onClick={() => setAddB((x) => (x ? 0 : 1))} className="py-2 text-xs font-mono rounded bg-white/5 border border-white/15 cursor-pointer">B = {addB}</button>
            {adderMode === 'full' && (
              <button type="button" onClick={() => setAddCin((x) => (x ? 0 : 1))} className="py-2 text-xs font-mono rounded bg-white/5 border border-white/15 cursor-pointer">Cin = {addCin}</button>
            )}
          </div>
        </>
      )}
      {expId === 'digital-circuits' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setCombType('mux')} className={`py-1.5 text-xs font-medium rounded border cursor-pointer ${combType === 'mux' ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>4:1 MUX</button>
            <button type="button" onClick={() => setCombType('decoder')} className={`py-1.5 text-xs font-medium rounded border cursor-pointer ${combType === 'decoder' ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>2:4 Decoder</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setSel1((x) => (x ? 0 : 1))} className="py-1.5 text-xs font-mono rounded bg-white/5 border border-white/15 cursor-pointer">S₁ = {sel1}</button>
            <button type="button" onClick={() => setSel0((x) => (x ? 0 : 1))} className="py-1.5 text-xs font-mono rounded bg-white/5 border border-white/15 cursor-pointer">S₀ = {sel0}</button>
          </div>
          {combType === 'mux' ? (
            <div className="grid grid-cols-4 gap-1.5">
              {muxData.map((d, i) => (
                <button key={i} type="button" onClick={() => setMuxData((prev) => prev.map((v, j) => (j === i ? (v ? 0 : 1) : v)) as [number, number, number, number])} className="py-1.5 text-xs font-mono rounded bg-white/5 border border-white/15 cursor-pointer">D{i}:{d}</button>
              ))}
            </div>
          ) : (
            <button type="button" onClick={() => setDecEnable((e) => (e ? 0 : 1))} className="py-2 text-xs font-mono rounded bg-white/5 border border-white/15 cursor-pointer">Enable (EN) = {decEnable}</button>
          )}
        </>
      )}
      {expId === 'flip-flops' && (
        <>
          <div className="grid grid-cols-4 gap-1.5">
            {(['JK', 'D', 'SR', 'T'] as const).map((t) => (
              <button key={t} type="button" onClick={() => setFfType(t)} className={`py-1.5 text-xs font-mono rounded border cursor-pointer ${ffType === t ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>{t}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setFfIn1((x) => (x ? 0 : 1))} className="py-1.5 text-xs font-mono rounded bg-white/5 border border-white/15 cursor-pointer">{ffType === 'D' ? 'D' : ffType === 'T' ? 'T' : ffType[0]} = {ffIn1}</button>
            {(ffType === 'JK' || ffType === 'SR') && (
              <button type="button" onClick={() => setFfIn2((x) => (x ? 0 : 1))} className="py-1.5 text-xs font-mono rounded bg-white/5 border border-white/15 cursor-pointer">{ffType[1]} = {ffIn2}</button>
            )}
          </div>
          <button type="button" onClick={pulseClock} className="py-2 text-xs font-mono font-semibold rounded bg-[var(--lab-accent)] text-white hover:brightness-110 cursor-pointer">
            Trigger Clock Pulse (↑ CLK)
          </button>
        </>
      )}
      {expId === 'binary-logic' && (
        <>
          <div className="grid grid-cols-4 gap-1.5">
            {bits.map((b, i) => (
              <button key={i} type="button" onClick={() => setBits((prev) => prev.map((v, j) => (j === i ? (v ? 0 : 1) : v)))} className={`py-1.5 text-xs font-mono rounded border cursor-pointer ${b ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>
                b{7 - i}:{b}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setSignedMode((s) => !s)} className="py-2 text-xs font-medium rounded bg-white/5 border border-white/15 cursor-pointer">
            Mode: {signedMode ? "Two's Complement (Signed)" : 'Unsigned Byte'}
          </button>
        </>
      )}
      {expId === 'diode-characteristics' && (
        <>
          <div className="grid grid-cols-3 gap-1.5">
            {(['Si', 'Ge', 'Zener'] as const).map((d) => (
              <button key={d} type="button" onClick={() => setDiodeType(d)} className={`py-1.5 text-xs font-medium rounded border cursor-pointer ${diodeType === d ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>{d}</button>
            ))}
          </div>
          <ParamSlider label="Bias Voltage V_D" value={diodeBias} min={-8.0} max={1.1} step={0.05} unit="V" onChange={setDiodeBias} />
        </>
      )}
      {expId === 'operational-amplifier' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {(['inverting', 'non-inverting'] as const).map((m) => (
              <button key={m} type="button" onClick={() => setOpMode(m)} className={`py-1.5 text-xs font-medium rounded border cursor-pointer capitalize ${opMode === m ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>{m}</button>
            ))}
          </div>
          <ParamSlider label="Input Amplitude V_in" value={opVin} min={0.2} max={5.0} step={0.1} unit="V" onChange={setOpVin} />
          <ParamSlider label="Input R_in / R₁" value={opRin} min={1} max={50} step={1} unit="kΩ" onChange={setOpRin} />
          <ParamSlider label="Feedback R_f" value={opRf} min={5} max={100} step={1} unit="kΩ" onChange={setOpRf} />
          <ParamSlider label="Supply Rails (±V)" value={opRail} min={5} max={15} step={1} unit="V" onChange={setOpRail} />
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
        setInA(1); setInB(0); setDiodeBias(0.75); setOpVin(1.5); setFfQ(0);
      }}
      onRecordTrial={() => onRecord(recordSnapshot)}
    />
  );
};
