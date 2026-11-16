import React, { useEffect, useRef, useState } from 'react';
import { ParamSlider, SimShell, useHiDpiCanvas } from './SimShared';
import { TelemetryMetric } from '../../types/lab';
import { labAudio } from '../../utils/audio';

interface Props {
  expId: string;
  onRecord: (values: Record<string, string>) => void;
}

export const MechanicalSim: React.FC<Props> = ({ expId, onRecord }) => {
  // 1. Projectile
  const [projV0, setProjV0] = useState(32);
  const [projAngle, setProjAngle] = useState(45);
  const [projG, setProjG] = useState(9.81);
  const [projDrag, setProjDrag] = useState(false);

  // 2. Newton's Laws
  const [nwMass, setNwMass] = useState(5);
  const [nwForce, setNwForce] = useState(25);
  const [nwMu, setNwMu] = useState(0.15);

  // 3. Inclined Friction
  const [frAngle, setFrAngle] = useState(24);
  const [frMus, setFrMus] = useState(0.45);
  const [frMuk, setFrMuk] = useState(0.30);
  const [frMass, setFrMass] = useState(4);

  // 4. Simple Pendulum
  const [penL, setPenL] = useState(1.5);
  const [penG, setPenG] = useState(9.81);
  const [penTheta0, setPenTheta0] = useState(22);
  const [penDamp, setPenDamp] = useState(false);
  const penPhaseRef = useRef<{ theta: number; omega: number; trail: [number, number][] }>({
    theta: (22 * Math.PI) / 180,
    omega: 0,
    trail: [],
  });

  // 5. Work & Energy
  const [weTrack, setWeTrack] = useState<'valley' | 'double'>('valley');
  const [weH0, setWeH0] = useState(12);
  const [weFriction, setWeFriction] = useState(false);

  // 6. Hooke's Law
  const [hkK, setHkK] = useState(120);
  const [hkM, setHkM] = useState(2.0);
  const [hkAmp, setHkAmp] = useState(0.45);

  // 7. 1D Collisions
  const [colM1, setColM1] = useState(3.0);
  const [colV1, setColV1] = useState(4.0);
  const [colM2, setColM2] = useState(2.0);
  const [colV2, setColV2] = useState(-2.0);
  const [colE, setColE] = useState(1.0);
  const colStateRef = useRef<{ x1: number; x2: number; v1: number; v2: number; collided: boolean }>({
    x1: 0.2, x2: 0.8, v1: 4, v2: -2, collided: false,
  });

  const [running, setRunning] = useState(true);
  const [simSeed, setSimSeed] = useState(0);

  useEffect(() => {
    penPhaseRef.current = { theta: (penTheta0 * Math.PI) / 180, omega: 0, trail: [] };
  }, [penTheta0, penL, penG, simSeed]);

  useEffect(() => {
    colStateRef.current = { x1: 0.2, x2: 0.8, v1: colV1, v2: colV2, collided: false };
  }, [colM1, colV1, colM2, colV2, colE, simSeed]);

  // Derived kinematics
  const radProj = (projAngle * Math.PI) / 180;
  const projT = (2 * projV0 * Math.sin(radProj)) / projG;
  const projH = (projV0 * projV0 * Math.sin(radProj) * Math.sin(radProj)) / (2 * projG);
  const projR = (projV0 * projV0 * Math.sin(2 * radProj)) / projG;

  const frCritDeg = (Math.atan(frMus) * 180) / Math.PI;
  const frSliding = frAngle > frCritDeg;
  const frNormal = frMass * 9.81 * Math.cos((frAngle * Math.PI) / 180);
  const frPull = frMass * 9.81 * Math.sin((frAngle * Math.PI) / 180);
  const frForce = frSliding ? frMuk * frNormal : frPull;
  const frAccel = frSliding ? 9.81 * (Math.sin((frAngle * Math.PI) / 180) - frMuk * Math.cos((frAngle * Math.PI) / 180)) : 0;

  const nwFric = nwMu * nwMass * 9.81;
  const nwFnet = Math.max(0, nwForce - nwFric);
  const nwA = nwFnet / nwMass;

  // Post collision velocities
  const v1Post = (colM1 * colV1 + colM2 * colV2 + colM2 * colE * (colV2 - colV1)) / (colM1 + colM2);
  const v2Post = (colM1 * colV1 + colM2 * colV2 + colM1 * colE * (colV1 - colV2)) / (colM1 + colM2);

  const canvasRef = useHiDpiCanvas(
    (ctx, w, h, t) => {
      ctx.clearRect(0, 0, w, h);

      if (expId === 'projectile-motion') {
        const groundY = h - 42;
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(24, groundY); ctx.lineTo(w - 24, groundY); ctx.stroke();

        const maxWorldX = Math.max(110, projR * 1.15);
        const maxWorldY = Math.max(55, projH * 1.3);
        const scaleX = (w - 80) / maxWorldX;
        const scaleY = (groundY - 40) / maxWorldY;

        // Trajectory path
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.55)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        let x = 0, y = 0;
        let vx = projV0 * Math.cos(radProj), vy = projV0 * Math.sin(radProj);
        const dt = 0.04;
        const pts: { x: number; y: number; vx: number; vy: number }[] = [{ x, y, vx, vy }];
        for (let step = 0; step < 300; step++) {
          if (projDrag) {
            const spd = Math.hypot(vx, vy);
            vx -= 0.008 * spd * vx * dt;
            vy -= (projG + 0.008 * spd * vy) * dt;
          } else {
            vy -= projG * dt;
          }
          x += vx * dt;
          y += vy * dt;
          pts.push({ x, y, vx, vy });
          if (y < 0) break;
        }
        pts.forEach((pt, idx) => {
          const px = 44 + pt.x * scaleX;
          const py = groundY - Math.max(0, pt.y) * scaleY;
          if (idx === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();

        // Moving projectile ball
        const idx = Math.floor((t * 28) % pts.length);
        const cur = pts[idx];
        const bx = 44 + cur.x * scaleX;
        const by = groundY - Math.max(0, cur.y) * scaleY;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(bx, by, 7, 0, Math.PI * 2); ctx.fill();
        // Velocity vector
        ctx.strokeStyle = '#4edea3';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + cur.vx * 1.4, by - cur.vy * 1.4); ctx.stroke();
      } else if (expId === 'newtons-laws') {
        const groundY = h - 72;
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(24, groundY); ctx.lineTo(w - 24, groundY); ctx.stroke();

        const pos = nwA > 0 ? ((0.5 * nwA * Math.pow((t * 1.2) % 4, 2)) * 22) % (w - 140) : 0;
        const bx = 64 + pos;
        ctx.fillStyle = '#1e3a8a';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.fillRect(bx, groundY - 56, 76, 56);
        ctx.strokeRect(bx, groundY - 56, 76, 56);
        ctx.fillStyle = '#dee2f6';
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillText(`${nwMass} kg`, bx + 16, groundY - 24);

        // Force arrows
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(bx + 76, groundY - 28); ctx.lineTo(bx + 76 + nwForce * 1.5, groundY - 28); ctx.stroke();
        ctx.fillStyle = '#7dd3fc';
        ctx.fillText(`F=${nwForce}N`, bx + 84, groundY - 38);

        if (nwFric > 0) {
          ctx.strokeStyle = '#ef4444';
          ctx.beginPath(); ctx.moveTo(bx, groundY - 12); ctx.lineTo(bx - Math.min(nwForce, nwFric) * 1.5, groundY - 12); ctx.stroke();
        }
      } else if (expId === 'friction') {
        const baseX = w * 0.2, baseY = h - 46;
        const rampLen = Math.min(w * 0.62, 360);
        const rad = (frAngle * Math.PI) / 180;
        const topX = baseX + Math.cos(rad) * rampLen;
        const topY = baseY - Math.sin(rad) * rampLen;

        ctx.fillStyle = 'rgba(59, 130, 246, 0.12)';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(baseX, baseY); ctx.lineTo(topX, baseY); ctx.lineTo(topX, topY);
        ctx.closePath(); ctx.fill(); ctx.stroke();

        // Block sliding down ramp from top toward base
        const slideFrac = frSliding ? ((0.5 * frAccel * Math.pow((t * 1.1) % 3, 2)) * 0.14) % 0.72 : 0.25;
        const dist = (0.2 + slideFrac) * rampLen;
        const cx = topX - Math.cos(rad) * dist;
        const cy = topY + Math.sin(rad) * dist;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-rad);
        ctx.fillStyle = frSliding ? '#b45309' : '#1e3a8a';
        ctx.strokeStyle = frSliding ? '#fbbf24' : '#3b82f6';
        ctx.fillRect(-26, -38, 52, 38);
        ctx.strokeRect(-26, -38, 52, 38);
        ctx.restore();

        ctx.fillStyle = frSliding ? '#fbbf24' : '#4edea3';
        ctx.font = '600 12px "JetBrains Mono", monospace';
        ctx.fillText(frSliding ? `SLIDING (θ > θ_c=${frCritDeg.toFixed(1)}°)` : `STATIC EQUILIBRIUM (θ ≤ θ_c=${frCritDeg.toFixed(1)}°)`, 28, 32);
      } else if (expId === 'simple-pendulum') {
        const pivotX = w * 0.34, pivotY = 44;
        const lenPx = Math.min(h - 90, 90 + penL * 55);
        const state = penPhaseRef.current;

        if (running) {
          const dt = 0.016;
          const b = penDamp ? 0.18 : 0;
          const acc = -(penG / penL) * Math.sin(state.theta) - b * state.omega;
          state.omega += acc * dt;
          state.theta += state.omega * dt;
          state.trail.push([state.theta, state.omega]);
          if (state.trail.length > 140) state.trail.shift();
        }

        const bobX = pivotX + Math.sin(state.theta) * lenPx;
        const bobY = pivotY + Math.cos(state.theta) * lenPx;

        ctx.strokeStyle = '#475569';
        ctx.beginPath(); ctx.moveTo(pivotX - 70, pivotY); ctx.lineTo(pivotX + 70, pivotY); ctx.stroke();
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(pivotX, pivotY); ctx.lineTo(pivotX, pivotY + lenPx + 15); ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = '#93ccff';
        ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(pivotX, pivotY); ctx.lineTo(bobX, bobY); ctx.stroke();

        ctx.fillStyle = '#3b82f6';
        ctx.beginPath(); ctx.arc(bobX, bobY, 15, 0, Math.PI * 2); ctx.fill();

        // Phase Space Portrait on right
        const px0 = w * 0.78, py0 = h / 2;
        ctx.strokeStyle = '#334155';
        ctx.beginPath(); ctx.moveTo(px0 - 85, py0); ctx.lineTo(px0 + 85, py0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px0, py0 - 85); ctx.lineTo(px0, py0 + 85); ctx.stroke();
        ctx.strokeStyle = '#4edea3';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        state.trail.forEach(([th, om], i) => {
          const sx = px0 + th * 95;
          const sy = py0 - om * 26;
          if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        });
        ctx.stroke();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText('PHASE SPACE (θ, ω)', px0 - 66, 32);
      } else if (expId === 'work-energy') {
        const gx0 = 36, gx1 = w - 150, groundY = h - 42;
        const evalH = (u: number) => {
          if (weTrack === 'valley') return 4 * Math.pow(u - 0.5, 2) * weH0;
          return (0.55 + 0.45 * Math.cos(u * Math.PI * 3)) * weH0 * (1 - 0.2 * u);
        };
        const scaleY = (groundY - 50) / 16;

        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const u = i / 100;
          const px = gx0 + u * (gx1 - gx0);
          const py = groundY - evalH(u) * scaleY;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        const uPos = 0.5 - 0.48 * Math.cos(t * 1.8);
        const hCur = evalH(uPos);
        const dampLoss = weFriction ? Math.min(0.65, ((t * 0.08) % 0.65)) : 0;
        const eTotal = weH0 * 9.81;
        const uEnergy = hCur * 9.81;
        const thEnergy = eTotal * dampLoss;
        const kEnergy = Math.max(0, eTotal - uEnergy - thEnergy);

        const mx = gx0 + uPos * (gx1 - gx0);
        const my = groundY - hCur * scaleY - 8;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath(); ctx.arc(mx, my, 9, 0, Math.PI * 2); ctx.fill();

        // Energy bar gauges on right
        const bx = w - 122;
        const bars = [
          { lbl: 'U', val: uEnergy / eTotal, col: '#38bdf8' },
          { lbl: 'K', val: kEnergy / eTotal, col: '#10b981' },
          { lbl: 'Th', val: thEnergy / eTotal, col: '#f43f5e' },
        ];
        bars.forEach((b, i) => {
          const x = bx + i * 36;
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(x, 55, 24, 180);
          const bh = Math.max(0, Math.min(1, b.val)) * 180;
          ctx.fillStyle = b.col;
          ctx.fillRect(x, 235 - bh, 24, bh);
          ctx.fillStyle = '#dee2f6';
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillText(b.lbl, x + 6, 254);
        });
      } else if (expId === 'hookes-law') {
        const omega = Math.sqrt(hkK / hkM);
        const xDisp = hkAmp * Math.cos(omega * t);
        const eqX = w * 0.42;
        const massX = eqX + xDisp * 180;
        const cy = h / 2;

        // Wall + Spring coils
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(38, cy - 55); ctx.lineTo(38, cy + 55); ctx.stroke();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(38, cy);
        const coils = 10;
        for (let i = 1; i < coils; i++) {
          const sx = 38 + (i / coils) * (massX - 38);
          const sy = cy + (i % 2 === 0 ? -16 : 16);
          ctx.lineTo(sx, sy);
        }
        ctx.lineTo(massX, cy);
        ctx.stroke();

        ctx.fillStyle = '#1e3a8a';
        ctx.strokeStyle = '#3b82f6';
        ctx.fillRect(massX, cy - 28, 56, 56);
        ctx.strokeRect(massX, cy - 28, 56, 56);

        // Parabolic Us on right
        const px0 = w * 0.72, px1 = w - 26, py1 = h - 42;
        ctx.strokeStyle = '#475569';
        ctx.beginPath(); ctx.moveTo(px0, py1); ctx.lineTo(px1, py1); ctx.stroke();
        ctx.strokeStyle = '#4edea3';
        ctx.beginPath();
        for (let i = -20; i <= 20; i++) {
          const u = i / 20;
          const px = (px0 + px1) / 2 + u * ((px1 - px0) * 0.45);
          const py = py1 - u * u * 150;
          if (i === -20) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        const curPx = (px0 + px1) / 2 + (xDisp / hkAmp) * ((px1 - px0) * 0.45);
        const curPy = py1 - Math.pow(xDisp / hkAmp, 2) * 150;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(curPx, curPy, 5, 0, Math.PI * 2); ctx.fill();
      } else {
        // 1D Collisions
        const trackY = h * 0.62;
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(24, trackY); ctx.lineTo(w - 24, trackY); ctx.stroke();

        const st = colStateRef.current;
        if (running) {
          const dt = 0.008;
          st.x1 += st.v1 * dt * 0.09;
          st.x2 += st.v2 * dt * 0.09;
          if (!st.collided && st.x1 + 0.06 >= st.x2 - 0.06) {
            st.collided = true;
            st.v1 = v1Post;
            st.v2 = v2Post;
            labAudio.playTelemetryTone(300 + colE * 350, 0.09);
          }
          if (st.x1 < 0.06 || st.x2 > 0.94 || st.x1 > 0.94 || st.x2 < 0.06) {
            st.x1 = 0.2; st.x2 = 0.8; st.v1 = colV1; st.v2 = colV2; st.collided = false;
          }
        }

        const c1x = 40 + st.x1 * (w - 80);
        const c2x = 40 + st.x2 * (w - 80);

        ctx.fillStyle = '#1e3a8a';
        ctx.strokeStyle = '#3b82f6';
        ctx.fillRect(c1x - 28, trackY - 42, 56, 42);
        ctx.strokeRect(c1x - 28, trackY - 42, 56, 42);

        ctx.fillStyle = '#065f46';
        ctx.strokeStyle = '#10b981';
        ctx.fillRect(c2x - 28, trackY - 42, 56, 42);
        ctx.strokeRect(c2x - 28, trackY - 42, 56, 42);

        ctx.fillStyle = '#dee2f6';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(`${colM1}kg`, c1x - 14, trackY - 16);
        ctx.fillText(`${colM2}kg`, c2x - 14, trackY - 16);
        ctx.fillText(`v₁=${st.v1.toFixed(1)}`, c1x - 18, trackY - 52);
        ctx.fillText(`v₂=${st.v2.toFixed(1)}`, c2x - 18, trackY - 52);
      }
    },
    [
      expId, projV0, projAngle, projG, projDrag, nwMass, nwForce, nwMu,
      frAngle, frMus, frMuk, frMass, penL, penG, penTheta0, penDamp,
      weTrack, weH0, weFriction, hkK, hkM, hkAmp,
      colM1, colV1, colM2, colV2, colE, running,
    ],
    running
  );

  let telemetry: TelemetryMetric[] = [];
  let recordSnapshot: Record<string, string> = {};

  if (expId === 'projectile-motion') {
    telemetry = [
      { label: 'Range R (Vac)', value: projR.toFixed(1), unit: 'm', tone: 'nominal' },
      { label: 'Max Height H', value: projH.toFixed(1), unit: 'm' },
      { label: 'Flight Time', value: projT.toFixed(2), unit: 's' },
      { label: 'Air Drag', value: projDrag ? 'ON' : 'VACUUM' },
    ];
    recordSnapshot = { 'v₀ (m/s)': `${projV0}`, 'θ (°)': `${projAngle}`, Drag: projDrag ? 'On' : 'Off', 'Height H (m)': projH.toFixed(1), 'Range R (m)': projR.toFixed(1) };
  } else if (expId === 'newtons-laws') {
    telemetry = [
      { label: 'Net Force', value: nwFnet.toFixed(1), unit: 'N', tone: 'nominal' },
      { label: 'Acceleration a', value: nwA.toFixed(2), unit: 'm/s²' },
      { label: 'Friction f_k', value: nwFric.toFixed(1), unit: 'N' },
      { label: 'Normal N', value: (nwMass * 9.81).toFixed(1), unit: 'N' },
    ];
    recordSnapshot = { 'Mass (kg)': `${nwMass}`, 'F_app (N)': `${nwForce}`, 'Friction (N)': nwFric.toFixed(1), 'F_net (N)': nwFnet.toFixed(1), 'a (m/s²)': nwA.toFixed(2) };
  } else if (expId === 'friction') {
    telemetry = [
      { label: 'Angle of Repose θ_c', value: frCritDeg.toFixed(1), unit: 'deg' },
      { label: 'Normal N', value: frNormal.toFixed(1), unit: 'N' },
      { label: 'Friction f', value: frForce.toFixed(1), unit: 'N' },
      { label: 'Accel a', value: frAccel.toFixed(2), unit: 'm/s²', tone: frSliding ? 'warning' : 'nominal' },
    ];
    recordSnapshot = { 'Angle θ (°)': `${frAngle}`, 'θ_c (°)': frCritDeg.toFixed(1), 'N (N)': frNormal.toFixed(1), 'f (N)': frForce.toFixed(1), 'a (m/s²)': frAccel.toFixed(2) };
  } else if (expId === 'simple-pendulum') {
    const T = 2 * Math.PI * Math.sqrt(penL / penG);
    const wMax = (penTheta0 * Math.PI) / 180 * Math.sqrt(penG / penL);
    telemetry = [
      { label: 'Period T', value: T.toFixed(3), unit: 's', tone: 'nominal' },
      { label: 'Frequency f', value: (1 / T).toFixed(2), unit: 'Hz' },
      { label: 'Peak ω_max', value: wMax.toFixed(2), unit: 'rad/s' },
      { label: 'Gravity g', value: penG.toFixed(2), unit: 'm/s²' },
    ];
    recordSnapshot = { 'Length L (m)': penL.toFixed(1), 'g (m/s²)': penG.toFixed(2), 'θ₀ (°)': `${penTheta0}`, 'Period T (s)': T.toFixed(3), 'ω_max (rad/s)': wMax.toFixed(2) };
  } else if (expId === 'work-energy') {
    const vMax = Math.sqrt(2 * 9.81 * weH0);
    const eMax = weH0 * 9.81;
    telemetry = [
      { label: 'Total Energy (1kg)', value: eMax.toFixed(1), unit: 'J', tone: 'nominal' },
      { label: 'Peak Valley Speed', value: vMax.toFixed(2), unit: 'm/s' },
      { label: 'Release Height', value: `${weH0}`, unit: 'm' },
      { label: 'Friction', value: weFriction ? 'ACTIVE' : 'CONSERVED' },
    ];
    recordSnapshot = { Track: weTrack, 'Height h (m)': `${weH0}`, 'Speed v (m/s)': vMax.toFixed(2), 'U (J)': eMax.toFixed(1), 'K (J)': eMax.toFixed(1) };
  } else if (expId === 'hookes-law') {
    const fMax = hkK * hkAmp;
    const usMax = 0.5 * hkK * hkAmp * hkAmp;
    const T = 2 * Math.PI * Math.sqrt(hkM / hkK);
    telemetry = [
      { label: 'Max Force |F|', value: fMax.toFixed(1), unit: 'N' },
      { label: 'Elastic U_s', value: usMax.toFixed(2), unit: 'J', tone: 'nominal' },
      { label: 'Period T', value: T.toFixed(2), unit: 's' },
      { label: 'Angular ω₀', value: Math.sqrt(hkK / hkM).toFixed(2), unit: 'rad/s' },
    ];
    recordSnapshot = { 'k (N/m)': `${hkK}`, 'm (kg)': hkM.toFixed(1), 'x (m)': hkAmp.toFixed(2), 'Force F (N)': fMax.toFixed(1), 'U_s (J)': usMax.toFixed(2) };
  } else {
    const keI = 0.5 * colM1 * colV1 * colV1 + 0.5 * colM2 * colV2 * colV2;
    const keF = 0.5 * colM1 * v1Post * v1Post + 0.5 * colM2 * v2Post * v2Post;
    const retained = keI > 0 ? (keF / keI) * 100 : 100;
    const pTot = colM1 * colV1 + colM2 * colV2;
    telemetry = [
      { label: 'Total Momentum', value: pTot.toFixed(1), unit: 'kg·m/s', tone: 'nominal' },
      { label: "Post v₁', v₂'", value: `${v1Post.toFixed(1)}, ${v2Post.toFixed(1)}`, unit: 'm/s' },
      { label: 'KE Retained', value: retained.toFixed(1), unit: '%' },
      { label: 'Restitution e', value: colE.toFixed(2) },
    ];
    recordSnapshot = { e: colE.toFixed(2), 'm₁ / m₂': `${colM1}/${colM2}`, 'v₁, v₂ (m/s)': `${colV1},${colV2}`, "v₁', v₂' (m/s)": `${v1Post.toFixed(1)},${v2Post.toFixed(1)}`, 'KE Retained %': `${retained.toFixed(1)}%` };
  }

  const controls = (
    <div className="flex flex-col gap-4">
      {expId === 'projectile-motion' && (
        <>
          <ParamSlider label="Launch Speed (v₀)" value={projV0} min={10} max={60} step={1} unit="m/s" onChange={setProjV0} />
          <ParamSlider label="Launch Angle (θ)" value={projAngle} min={5} max={85} step={1} unit="°" onChange={setProjAngle} />
          <ParamSlider label="Gravity (g)" value={projG} min={1.6} max={24.8} step={0.2} unit="m/s²" onChange={setProjG} />
          <button type="button" onClick={() => setProjDrag((d) => !d)} className={`py-2 text-xs font-medium rounded border cursor-pointer ${projDrag ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>
            Air Drag: {projDrag ? 'Enabled' : 'Disabled (Vacuum)'}
          </button>
        </>
      )}
      {expId === 'newtons-laws' && (
        <>
          <ParamSlider label="Cart Mass (m)" value={nwMass} min={1} max={20} step={0.5} unit="kg" onChange={setNwMass} />
          <ParamSlider label="Applied Force (F_app)" value={nwForce} min={0} max={80} step={1} unit="N" onChange={setNwForce} />
          <ParamSlider label="Kinetic Friction (μ_k)" value={nwMu} min={0} max={0.5} step={0.05} onChange={setNwMu} />
        </>
      )}
      {expId === 'friction' && (
        <>
          <ParamSlider label="Ramp Angle (θ)" value={frAngle} min={0} max={60} step={1} unit="°" onChange={setFrAngle} />
          <ParamSlider label="Static Coeff (μ_s)" value={frMus} min={0.1} max={0.9} step={0.05} onChange={setFrMus} />
          <ParamSlider label="Kinetic Coeff (μ_k)" value={frMuk} min={0.05} max={frMus} step={0.05} onChange={setFrMuk} />
          <ParamSlider label="Block Mass (m)" value={frMass} min={1} max={15} step={1} unit="kg" onChange={setFrMass} />
        </>
      )}
      {expId === 'simple-pendulum' && (
        <>
          <ParamSlider label="String Length (L)" value={penL} min={0.4} max={4.0} step={0.1} unit="m" onChange={setPenL} />
          <ParamSlider label="Release Angle (θ₀)" value={penTheta0} min={5} max={60} step={1} unit="°" onChange={setPenTheta0} />
          <div className="grid grid-cols-3 gap-1.5">
            {[['Earth', 9.81], ['Moon', 1.62], ['Mars', 3.72]].map(([lbl, g]) => (
              <button key={String(lbl)} type="button" onClick={() => setPenG(Number(g))} className={`py-1.5 text-xs rounded border cursor-pointer ${Math.abs(penG - Number(g)) < 0.1 ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>{lbl}</button>
            ))}
          </div>
          <button type="button" onClick={() => setPenDamp((d) => !d)} className={`py-1.5 text-xs rounded border cursor-pointer ${penDamp ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>
            Air Damping: {penDamp ? 'On' : 'Off'}
          </button>
        </>
      )}
      {expId === 'work-energy' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {(['valley', 'double'] as const).map((tr) => (
              <button key={tr} type="button" onClick={() => setWeTrack(tr)} className={`py-1.5 text-xs font-medium rounded border cursor-pointer capitalize ${weTrack === tr ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>{tr} Track</button>
            ))}
          </div>
          <ParamSlider label="Start Height (h₀)" value={weH0} min={4} max={15} step={1} unit="m" onChange={setWeH0} />
          <button type="button" onClick={() => setWeFriction((f) => !f)} className={`py-2 text-xs rounded border cursor-pointer ${weFriction ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>
            Track Friction: {weFriction ? 'Active' : 'Frictionless'}
          </button>
        </>
      )}
      {expId === 'hookes-law' && (
        <>
          <ParamSlider label="Spring Constant (k)" value={hkK} min={20} max={300} step={10} unit="N/m" onChange={setHkK} />
          <ParamSlider label="Mass (m)" value={hkM} min={0.5} max={8.0} step={0.5} unit="kg" onChange={setHkM} />
          <ParamSlider label="Amplitude (x₀)" value={hkAmp} min={0.1} max={0.8} step={0.05} unit="m" onChange={setHkAmp} />
        </>
      )}
      {expId === 'collisions' && (
        <>
          <ParamSlider label="Restitution (e)" value={colE} min={0} max={1} step={0.05} onChange={setColE} />
          <ParamSlider label="Mass m₁" value={colM1} min={1} max={8} step={0.5} unit="kg" onChange={setColM1} />
          <ParamSlider label="Initial v₁" value={colV1} min={1} max={8} step={0.5} unit="m/s" onChange={setColV1} />
          <ParamSlider label="Mass m₂" value={colM2} min={1} max={8} step={0.5} unit="kg" onChange={setColM2} />
          <ParamSlider label="Initial v₂" value={colV2} min={-6} max={2} step={0.5} unit="m/s" onChange={setColV2} />
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
      onReset={() => setSimSeed((s) => s + 1)}
      onRecordTrial={() => onRecord(recordSnapshot)}
    />
  );
};
