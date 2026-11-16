import React, { useState } from 'react';
import { ParamSlider, SimShell, useHiDpiCanvas, wavelengthToRgb } from './SimShared';
import { TelemetryMetric } from '../../types/lab';

interface Props {
  expId: string;
  onRecord: (values: Record<string, string>) => void;
}

const SPECTRAL_SOURCES: Record<
  string,
  { name: string; lines: { nm: number; label: string }[] }
> = {
  hydrogen: {
    name: 'Hydrogen (H)',
    lines: [
      { nm: 410, label: 'H-δ 410' },
      { nm: 434, label: 'H-γ 434' },
      { nm: 486, label: 'H-β 486' },
      { nm: 656, label: 'H-α 656' },
    ],
  },
  helium: {
    name: 'Helium (He)',
    lines: [
      { nm: 447, label: '447' },
      { nm: 502, label: '502' },
      { nm: 588, label: '588' },
      { nm: 668, label: '668' },
    ],
  },
  sodium: {
    name: 'Sodium (Na)',
    lines: [
      { nm: 589, label: 'D1 589.0' },
      { nm: 590, label: 'D2 589.6' },
    ],
  },
  mercury: {
    name: 'Mercury (Hg)',
    lines: [
      { nm: 405, label: '405' },
      { nm: 436, label: '436' },
      { nm: 546, label: '546' },
      { nm: 579, label: '579' },
    ],
  },
};

export const OpticsSim: React.FC<Props> = ({ expId, onRecord }) => {
  // 1. Snell's Law state
  const [n1, setN1] = useState(1.52);
  const [n2, setN2] = useState(1.0);
  const [theta1, setTheta1] = useState(32);

  // 2. Thin Lenses state
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex');
  const [focalLen, setFocalLen] = useState(12);
  const [objDist, setObjDist] = useState(26);
  const [objHeight, setObjHeight] = useState(5);

  // 3. Double Slit state
  const [wavelength, setWavelength] = useState(532);
  const [slitSep, setSlitSep] = useState(0.25); // mm
  const [screenDist, setScreenDist] = useState(1.5); // m

  // 4. Prism Dispersion state
  const [glassType, setGlassType] = useState<'crown' | 'flint'>('flint');
  const [apexAngle, setApexAngle] = useState(60);
  const [prismIncidence, setPrismIncidence] = useState(48);

  // 5. Diffraction Grating state
  const [sourceKey, setSourceKey] = useState<'hydrogen' | 'helium' | 'sodium' | 'mercury'>('hydrogen');
  const [linesPerMm, setLinesPerMm] = useState(600);

  const [running, setRunning] = useState(true);

  const canvasRef = useHiDpiCanvas(
    (ctx, w, h, t) => {
      ctx.clearRect(0, 0, w, h);

      // Subtle background grid
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 32) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += 32) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
      }

      if (expId === 'snells-law') {
        const midY = h / 2;
        const midX = w / 2;
        // Media shading
        ctx.fillStyle = `rgba(2, 132, 199, ${(n1 - 1) * 0.16})`;
        ctx.fillRect(0, 0, w, midY);
        ctx.fillStyle = `rgba(14, 165, 233, ${(n2 - 1) * 0.16})`;
        ctx.fillRect(0, midY, w, midY);

        // Boundary & normal
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(w, midY); ctx.stroke();

        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#64748b';
        ctx.beginPath(); ctx.moveTo(midX, 16); ctx.lineTo(midX, h - 16); ctx.stroke();
        ctx.setLineDash([]);

        const rad1 = (theta1 * Math.PI) / 180;
        const rayLen = Math.min(w, h) * 0.44;
        const ix = midX - Math.sin(rad1) * rayLen;
        const iy = midY - Math.cos(rad1) * rayLen;

        // Incident beam
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(midX, midY); ctx.stroke();

        // Moving photon pulse
        const p = (t * 0.8) % 1;
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(ix + (midX - ix) * p, iy + (midY - iy) * p, 4, 0, Math.PI * 2);
        ctx.fill();

        const sinT2 = (n1 / n2) * Math.sin(rad1);
        const isTIR = sinT2 > 1;

        // Reflected ray
        const rx = midX + Math.sin(rad1) * rayLen;
        const ry = midY - Math.cos(rad1) * rayLen;
        ctx.strokeStyle = isTIR ? '#f59e0b' : 'rgba(245, 158, 11, 0.35)';
        ctx.lineWidth = isTIR ? 3 : 1.5;
        ctx.beginPath(); ctx.moveTo(midX, midY); ctx.lineTo(rx, ry); ctx.stroke();

        if (!isTIR) {
          const rad2 = Math.asin(sinT2);
          const tx = midX + Math.sin(rad2) * rayLen;
          const ty = midY + Math.cos(rad2) * rayLen;
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(midX, midY); ctx.lineTo(tx, ty); ctx.stroke();

          ctx.fillStyle = '#bae6fd';
          ctx.beginPath();
          ctx.arc(midX + (tx - midX) * p, midY + (ty - midY) * p, 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#fbbf24';
          ctx.font = '600 12px "JetBrains Mono", monospace';
          ctx.fillText('TOTAL INTERNAL REFLECTION ACTIVE', midX - 135, midY + 34);
        }

        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillText(`MEDIUM 1: n₁ = ${n1.toFixed(2)}`, 16, 26);
        ctx.fillText(`MEDIUM 2: n₂ = ${n2.toFixed(2)}`, 16, h - 18);
      } else if (expId === 'thin-lenses') {
        const cx = w / 2;
        const cy = h / 2;
        const scale = 5.2; // px per cm
        const fSigned = lensType === 'convex' ? focalLen : -focalLen;

        // Optical axis
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(w - 20, cy); ctx.stroke();

        // Lens shape
        ctx.strokeStyle = '#38bdf8';
        ctx.fillStyle = 'rgba(2, 132, 199, 0.18)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (lensType === 'convex') {
          ctx.moveTo(cx, cy - 115);
          ctx.quadraticCurveTo(cx + 28, cy, cx, cy + 115);
          ctx.quadraticCurveTo(cx - 28, cy, cx, cy - 115);
        } else {
          ctx.moveTo(cx - 16, cy - 115);
          ctx.lineTo(cx + 16, cy - 115);
          ctx.quadraticCurveTo(cx + 3, cy, cx + 16, cy + 115);
          ctx.lineTo(cx - 16, cy + 115);
          ctx.quadraticCurveTo(cx - 3, cy, cx - 16, cy - 115);
        }
        ctx.fill();
        ctx.stroke();

        // Focal markers
        [focalLen, -focalLen, focalLen * 2, -focalLen * 2].forEach((fx, i) => {
          const px = cx + fx * scale;
          if (px > 16 && px < w - 16) {
            ctx.fillStyle = i < 2 ? '#93ccff' : '#64748b';
            ctx.beginPath(); ctx.arc(px, cy, 3.5, 0, Math.PI * 2); ctx.fill();
            ctx.font = '10px "JetBrains Mono", monospace';
            ctx.fillText(i < 2 ? 'F' : '2F', px - 4, cy + 16);
          }
        });

        const ox = cx - objDist * scale;
        const ohPx = objHeight * scale * 1.4;
        const oy = cy - ohPx;

        // Object arrow
        ctx.strokeStyle = '#4edea3';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(ox, cy); ctx.lineTo(ox, oy); ctx.stroke();
        ctx.fillStyle = '#4edea3';
        ctx.beginPath(); ctx.moveTo(ox, oy - 6); ctx.lineTo(ox - 5, oy + 4); ctx.lineTo(ox + 5, oy + 4); ctx.fill();

        const denom = 1 / fSigned - 1 / objDist;
        const di = Math.abs(denom) < 0.0001 ? 9999 : 1 / denom;
        const mag = -di / objDist;
        const ix = cx + di * scale;
        const iy = cy - ohPx * mag;

        // Principal Ray 1: Parallel to axis -> through F'
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(cx, oy); ctx.stroke();
        if (Math.abs(di) < 120) {
          ctx.beginPath(); ctx.moveTo(cx, oy);
          const slope1 = (cy - oy) / (fSigned * scale);
          ctx.lineTo(w - 15, oy + slope1 * (w - 15 - cx));
          ctx.stroke();
          if (di < 0) {
            ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(cx, oy); ctx.lineTo(ix, iy); ctx.stroke();
            ctx.setLineDash([]);
          }
        }

        // Principal Ray 2: Through Optical Center
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        const slope2 = (cy - oy) / (cx - ox);
        ctx.moveTo(ox, oy);
        ctx.lineTo(w - 15, oy + slope2 * (w - 15 - ox));
        ctx.stroke();
        if (di < 0) {
          ctx.setLineDash([4, 4]);
          ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ix, iy); ctx.stroke();
          ctx.setLineDash([]);
        }

        // Image arrow
        if (Math.abs(di) < 120 && ix > 10 && ix < w - 10) {
          ctx.strokeStyle = di > 0 ? '#f43f5e' : '#c084fc';
          ctx.lineWidth = 3;
          if (di < 0) ctx.setLineDash([4, 3]);
          ctx.beginPath(); ctx.moveTo(ix, cy); ctx.lineTo(ix, iy); ctx.stroke();
          ctx.setLineDash([]);
        }
      } else if (expId === 'double-slit') {
        const slitX = w * 0.25;
        const screenX = w * 0.72;
        const slitGapPx = Math.max(14, slitSep * 95);
        const s1Y = h / 2 - slitGapPx / 2;
        const s2Y = h / 2 + slitGapPx / 2;
        const color = wavelengthToRgb(wavelength);

        // Incident wave fronts
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.6;
        const waveOffset = (t * 36) % 24;
        for (let wx = 18 + waveOffset; wx < slitX - 4; wx += 24) {
          ctx.globalAlpha = 0.45;
          ctx.beginPath(); ctx.moveTo(wx, 40); ctx.lineTo(wx, h - 40); ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // Slit barrier
        ctx.fillStyle = '#475569';
        ctx.fillRect(slitX - 4, 20, 8, s1Y - 26);
        ctx.fillRect(slitX - 4, s1Y + 6, 8, s2Y - s1Y - 12);
        ctx.fillRect(slitX - 4, s2Y + 6, 8, h - 20 - (s2Y + 6));

        // Expanding ripples
        for (let r = (t * 48) % 28; r < screenX - slitX; r += 28) {
          ctx.strokeStyle = color;
          ctx.globalAlpha = Math.max(0.08, 0.45 - r / (screenX - slitX) * 0.35);
          ctx.beginPath(); ctx.arc(slitX + 4, s1Y, r, -Math.PI / 2.2, Math.PI / 2.2); ctx.stroke();
          ctx.beginPath(); ctx.arc(slitX + 4, s2Y, r, -Math.PI / 2.2, Math.PI / 2.2); ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // Screen fringe intensity band + curve
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(screenX, 20); ctx.lineTo(screenX, h - 20); ctx.stroke();

        // Intensity plot
        const dxPx = (wavelength * 1e-6 * screenDist * 1000) / slitSep * 9.5;
        ctx.beginPath();
        for (let y = 22; y < h - 22; y += 2) {
          const dy = y - h / 2;
          const phase = (Math.PI * dy) / Math.max(8, dxPx);
          const intensity = Math.pow(Math.cos(phase), 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.1 + 0.9 * intensity;
          ctx.fillRect(screenX + 4, y, 16, 2);

          const plotX = screenX + 28 + intensity * (w - screenX - 48);
          if (y === 22) ctx.moveTo(plotX, y);
          else ctx.lineTo(plotX, y);
        }
        ctx.globalAlpha = 1;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (expId === 'prism-dispersion') {
        const cx = w * 0.42;
        const cy = h * 0.56;
        const side = Math.min(w, h) * 0.48;
        const halfA = ((apexAngle / 2) * Math.PI) / 180;
        const topY = cy - (side * 0.5) / Math.tan(halfA);
        const baseY = cy + side * 0.42;
        const halfBase = (baseY - topY) * Math.tan(halfA);

        // Prism triangle
        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, topY);
        ctx.lineTo(cx - halfBase, baseY);
        ctx.lineTo(cx + halfBase, baseY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Entry point on left face
        const entryFrac = 0.55;
        const ex = cx - halfBase * entryFrac;
        const ey = topY + (baseY - topY) * entryFrac;
        const leftNormalAngle = Math.PI - halfA; // pointing out left-up? Wait: left face vector goes down-left (-sin(halfA), cos(halfA))
        const inNorm = Math.atan2(-Math.sin(halfA), -Math.cos(halfA));
        const incRad = (prismIncidence * Math.PI) / 180;
        const beamInAngle = inNorm + incRad;
        const startX = ex + Math.cos(beamInAngle) * 160;
        const startY = ey + Math.sin(beamInAngle) * 160;

        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(ex, ey); ctx.stroke();

        // Disperse 7 wavelengths via Cauchy
        const cauchyA = glassType === 'crown' ? 1.504 : 1.62;
        const cauchyB = glassType === 'crown' ? 0.0042 : 0.0135;
        const wls = [680, 620, 580, 532, 485, 445, 405];

        wls.forEach((wl) => {
          const wlUm = wl / 1000;
          const n = cauchyA + cauchyB / (wlUm * wlUm);
          // Simplified accurate angular deviation
          const r1 = Math.asin(Math.sin(incRad) / n);
          const r2 = (apexAngle * Math.PI) / 180 - r1;
          const sinOut = n * Math.sin(r2);
          const color = wavelengthToRgb(wl);

          const exitFrac = entryFrac + 0.06 + (n - 1.5) * 0.25;
          const ox = cx + halfBase * Math.min(0.92, exitFrac);
          const oy = topY + (baseY - topY) * Math.min(0.92, exitFrac);

          ctx.strokeStyle = color;
          ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ox, oy); ctx.stroke();

          if (Math.abs(sinOut) <= 1) {
            const i2 = Math.asin(sinOut);
            const dev = incRad + i2 - (apexAngle * Math.PI) / 180;
            const outAngle = Math.atan2(ey - startY, ex - startX) + dev;
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(ox, oy);
            ctx.lineTo(ox + Math.cos(outAngle) * 280, oy + Math.sin(outAngle) * 280);
            ctx.stroke();
          }
        });
      } else {
        // Diffraction Grating Spectrometry
        const src = SPECTRAL_SOURCES[sourceKey];
        const gx = w * 0.28;
        const gy = h / 2;
        const dNm = 1_000_000 / linesPerMm;

        // Lamp + beam
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.fillRect(28, gy - 16, 54, 32);
        ctx.strokeRect(28, gy - 16, 54, 32);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(sourceKey.slice(0, 2).toUpperCase(), 48, gy + 4);

        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(82, gy); ctx.lineTo(gx, gy); ctx.stroke();

        // Grating ticks
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        for (let y = 36; y < h - 36; y += 14) {
          ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, y + 7); ctx.stroke();
        }

        // Spectrometer arc
        const arcR = Math.min(w * 0.6, h * 0.45);
        ctx.strokeStyle = 'rgba(255,255,255,0.14)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(gx, gy, arcR, -Math.PI / 2.2, Math.PI / 2.2); ctx.stroke();

        // m = 0 undeviated beam
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + arcR, gy); ctx.stroke();

        // m = ±1, ±2 spectral lines
        [1, -1, 2, -2].forEach((m) => {
          src.lines.forEach((line) => {
            const s = (m * line.nm) / dNm;
            if (Math.abs(s) <= 0.96) {
              const ang = Math.asin(s);
              const ex = gx + Math.cos(ang) * arcR;
              const ey = gy - Math.sin(ang) * arcR;
              ctx.strokeStyle = wavelengthToRgb(line.nm);
              ctx.lineWidth = Math.abs(m) === 1 ? 2.2 : 1.4;
              ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(ex, ey); ctx.stroke();
              ctx.fillStyle = wavelengthToRgb(line.nm);
              ctx.beginPath(); ctx.arc(ex, ey, 4, 0, Math.PI * 2); ctx.fill();
            }
          });
        });
      }
    },
    [
      expId, n1, n2, theta1, lensType, focalLen, objDist, objHeight,
      wavelength, slitSep, screenDist, glassType, apexAngle, prismIncidence,
      sourceKey, linesPerMm,
    ],
    running
  );

  // Telemetry computation
  let telemetry: TelemetryMetric[] = [];
  let recordSnapshot: Record<string, string> = {};

  if (expId === 'snells-law') {
    const rad1 = (theta1 * Math.PI) / 180;
    const sin2 = (n1 / n2) * Math.sin(rad1);
    const isTIR = sin2 > 1;
    const theta2 = isTIR ? 'TIR' : ((Math.asin(sin2) * 180) / Math.PI).toFixed(1);
    const crit = n1 > n2 ? ((Math.asin(n2 / n1) * 180) / Math.PI).toFixed(1) : 'N/A';
    telemetry = [
      { label: 'Incident θ₁', value: `${theta1}`, unit: 'deg' },
      { label: 'Refracted θ₂', value: theta2, unit: isTIR ? '' : 'deg', tone: isTIR ? 'warning' : 'nominal' },
      { label: 'Critical θc', value: crit, unit: crit === 'N/A' ? '' : 'deg' },
      { label: 'Phase Speed v₂', value: (2.998 / n2).toFixed(2), unit: '×10⁸ m/s' },
    ];
    recordSnapshot = { 'n₁': n1.toFixed(2), 'n₂': n2.toFixed(2), 'θ₁ (°)': `${theta1}`, 'θ₂ (°)': theta2, Regime: isTIR ? 'TIR' : 'Refracted' };
  } else if (expId === 'thin-lenses') {
    const f = lensType === 'convex' ? focalLen : -focalLen;
    const di = 1 / (1 / f - 1 / objDist);
    const mag = -di / objDist;
    const nature = di > 0 ? 'Real Inv.' : 'Virtual Up.';
    telemetry = [
      { label: 'Image Dist dᵢ', value: Number.isFinite(di) ? di.toFixed(1) : '∞', unit: 'cm', tone: di > 0 ? 'nominal' : 'accent' },
      { label: 'Magnification m', value: Number.isFinite(mag) ? mag.toFixed(2) : '∞', unit: '×' },
      { label: 'Optical Power', value: (100 / f).toFixed(1), unit: 'D' },
      { label: 'Image Nature', value: nature },
    ];
    recordSnapshot = { Type: lensType, 'f (cm)': `${f}`, 'd₀ (cm)': `${objDist}`, 'dᵢ (cm)': di.toFixed(1), 'Mag (m)': mag.toFixed(2) };
  } else if (expId === 'double-slit') {
    const dxMm = (wavelength * 1e-6 * screenDist * 1000) / slitSep;
    const theta1Deg = ((Math.asin(Math.min(1, (wavelength * 1e-6) / (slitSep * 1e-3))) * 180) / Math.PI).toFixed(3);
    telemetry = [
      { label: 'Wavelength λ', value: `${wavelength}`, unit: 'nm' },
      { label: 'Fringe Spacing Δx', value: dxMm.toFixed(2), unit: 'mm', tone: 'nominal' },
      { label: '1st Order θ₁', value: theta1Deg, unit: 'deg' },
      { label: 'Photon Energy', value: (1240 / wavelength).toFixed(2), unit: 'eV' },
    ];
    recordSnapshot = { 'λ (nm)': `${wavelength}`, 'd (mm)': slitSep.toFixed(2), 'L (m)': screenDist.toFixed(1), 'Δx (mm)': dxMm.toFixed(2), '1st Max θ': `${theta1Deg}°` };
  } else if (expId === 'prism-dispersion') {
    const cA = glassType === 'crown' ? 1.504 : 1.62;
    const cB = glassType === 'crown' ? 0.0042 : 0.0135;
    const nRed = cA + cB / (0.68 * 0.68);
    const nVio = cA + cB / (0.405 * 0.405);
    const calcDev = (n: number) => {
      const i1 = (prismIncidence * Math.PI) / 180;
      const r1 = Math.asin(Math.sin(i1) / n);
      const r2 = (apexAngle * Math.PI) / 180 - r1;
      const sinOut = n * Math.sin(r2);
      if (Math.abs(sinOut) > 1) return null;
      return ((i1 + Math.asin(sinOut) - (apexAngle * Math.PI) / 180) * 180) / Math.PI;
    };
    const dRed = calcDev(nRed);
    const dVio = calcDev(nVio);
    const spread = dRed !== null && dVio !== null ? Math.abs(dVio - dRed).toFixed(2) : 'TIR';
    telemetry = [
      { label: 'n (Red 680nm)', value: nRed.toFixed(3) },
      { label: 'n (Violet 405nm)', value: nVio.toFixed(3) },
      { label: 'δ_red', value: dRed !== null ? dRed.toFixed(1) : 'TIR', unit: dRed !== null ? 'deg' : '' },
      { label: 'Dispersion Δδ', value: spread, unit: spread === 'TIR' ? '' : 'deg', tone: spread === 'TIR' ? 'warning' : 'nominal' },
    ];
    recordSnapshot = { Glass: glassType, 'Apex A (°)': `${apexAngle}`, 'Incidence i₁ (°)': `${prismIncidence}`, 'δ_red (°)': dRed !== null ? dRed.toFixed(1) : 'TIR', 'δ_violet (°)': dVio !== null ? dVio.toFixed(1) : 'TIR' };
  } else {
    const src = SPECTRAL_SOURCES[sourceKey];
    const dNm = 1_000_000 / linesPerMm;
    const firstLine = src.lines[0];
    const sinTheta = firstLine.nm / dNm;
    const deg1 = sinTheta <= 1 ? ((Math.asin(sinTheta) * 180) / Math.PI).toFixed(1) : 'N/A';
    telemetry = [
      { label: 'Grating Pitch d', value: dNm.toFixed(0), unit: 'nm' },
      { label: 'Max Order (550nm)', value: `${Math.floor(dNm / 550)}` },
      { label: 'Primary Line θ₁', value: deg1, unit: deg1 === 'N/A' ? '' : 'deg', tone: 'nominal' },
      { label: 'Resolving Power', value: `${linesPerMm * 2}`, unit: 'm=1 (2mm)' },
    ];
    recordSnapshot = { Source: src.name, 'Lines/mm': `${linesPerMm}`, 'Pitch d (nm)': dNm.toFixed(0), 'Order m': '1', 'Dominant θ (°)': deg1 };
  }

  const controls = (
    <div className="flex flex-col gap-4">
      {expId === 'snells-law' && (
        <>
          <ParamSlider label="Incident Medium (n₁)" value={n1} min={1.0} max={2.42} step={0.01} onChange={setN1} />
          <ParamSlider label="Refracting Medium (n₂)" value={n2} min={1.0} max={2.42} step={0.01} onChange={setN2} />
          <ParamSlider label="Incident Angle (θ₁)" value={theta1} min={0} max={85} step={1} unit="°" onChange={setTheta1} />
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="button" onClick={() => { setN1(1.0); setN2(1.52); setTheta1(40); }} className="px-2.5 py-1 text-xs rounded bg-white/5 border border-white/10 hover:border-white/25 cursor-pointer">Air → Glass</button>
            <button type="button" onClick={() => { setN1(1.52); setN2(1.0); setTheta1(48); }} className="px-2.5 py-1 text-xs rounded bg-white/5 border border-white/10 hover:border-white/25 cursor-pointer">Glass → Air (TIR)</button>
            <button type="button" onClick={() => { setN1(2.42); setN2(1.0); setTheta1(30); }} className="px-2.5 py-1 text-xs rounded bg-white/5 border border-white/10 hover:border-white/25 cursor-pointer">Diamond → Air</button>
          </div>
        </>
      )}
      {expId === 'thin-lenses' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {(['convex', 'concave'] as const).map((t) => (
              <button key={t} type="button" onClick={() => setLensType(t)} className={`py-1.5 text-xs font-medium rounded border cursor-pointer capitalize ${lensType === t ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>
                {t} Lens
              </button>
            ))}
          </div>
          <ParamSlider label="Focal Length |f|" value={focalLen} min={5} max={25} step={1} unit="cm" onChange={setFocalLen} />
          <ParamSlider label="Object Distance d₀" value={objDist} min={4} max={50} step={1} unit="cm" onChange={setObjDist} />
          <ParamSlider label="Object Height h₀" value={objHeight} min={2} max={10} step={0.5} unit="cm" onChange={setObjHeight} />
        </>
      )}
      {expId === 'double-slit' && (
        <>
          <ParamSlider label="Laser Wavelength (λ)" value={wavelength} min={380} max={740} step={2} unit="nm" onChange={setWavelength} />
          <ParamSlider label="Slit Separation (d)" value={slitSep} min={0.1} max={0.8} step={0.01} unit="mm" onChange={setSlitSep} />
          <ParamSlider label="Screen Distance (L)" value={screenDist} min={0.5} max={3.0} step={0.1} unit="m" onChange={setScreenDist} />
        </>
      )}
      {expId === 'prism-dispersion' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {(['crown', 'flint'] as const).map((g) => (
              <button key={g} type="button" onClick={() => setGlassType(g)} className={`py-1.5 text-xs font-medium rounded border cursor-pointer capitalize ${glassType === g ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>
                {g} Glass
              </button>
            ))}
          </div>
          <ParamSlider label="Prism Apex Angle (A)" value={apexAngle} min={30} max={75} step={1} unit="°" onChange={setApexAngle} />
          <ParamSlider label="Incidence Angle (i₁)" value={prismIncidence} min={20} max={80} step={1} unit="°" onChange={setPrismIncidence} />
        </>
      )}
      {expId === 'diffraction-grating' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(SPECTRAL_SOURCES) as Array<keyof typeof SPECTRAL_SOURCES>).map((key) => (
              <button key={key} type="button" onClick={() => setSourceKey(key as 'hydrogen' | 'helium' | 'sodium' | 'mercury')} className={`py-1.5 text-xs font-medium rounded border cursor-pointer ${sourceKey === key ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>
                {SPECTRAL_SOURCES[key].name}
              </button>
            ))}
          </div>
          <ParamSlider label="Grating Ruling Density" value={linesPerMm} min={200} max={1200} step={50} unit="lines/mm" onChange={setLinesPerMm} />
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
        setN1(1.52); setN2(1.0); setTheta1(32);
        setFocalLen(12); setObjDist(26); setWavelength(532);
        setSlitSep(0.25); setScreenDist(1.5); setApexAngle(60); setLinesPerMm(600);
      }}
      onRecordTrial={() => onRecord(recordSnapshot)}
    />
  );
};
