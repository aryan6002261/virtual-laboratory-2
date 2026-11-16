import React from 'react';

export const MechanicalSchematic: React.FC<{ expId: string }> = ({ expId }) => {
  switch (expId) {
    case 'projectile-motion':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Parabolic Projectile Trajectory Schematic">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          <line x1="55" y1="224" x2="585" y2="224" stroke="#475569" strokeWidth="2" />
          <path d="M 75 224 Q 315 24 555 224" fill="none" stroke="#3b82f6" strokeWidth="2.5" className="svg-flow-line" />
          {/* Apex marker */}
          <line x1="315" y1="124" x2="315" y2="224" stroke="#4edea3" strokeDasharray="4 4" strokeWidth="1.4" />
          <circle cx="315" cy="124" r="5" fill="#4edea3" />
          <line x1="315" y1="124" x2="380" y2="124" stroke="#4edea3" strokeWidth="2" />
          <text x="325" y="112" fill="#6ffbbe" fontSize="11" fontFamily="JetBrains Mono">APEX: v_y = 0, H = v₀²sin²θ/2g</text>
          {/* Launch vector */}
          <line x1="75" y1="224" x2="145" y2="152" stroke="#f59e0b" strokeWidth="2.4" />
          <text x="115" y="168" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">v₀, θ</text>
          <text x="278" y="246" fill="#93ccff" fontSize="11" fontFamily="JetBrains Mono">RANGE R = v₀² sin(2θ) / g</text>
        </svg>
      );
    case 'newtons-laws':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Free Body Force Diagram">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          <line x1="65" y1="190" x2="575" y2="190" stroke="#475569" strokeWidth="2" />
          <rect x="255" y="122" width="110" height="68" rx="4" fill="#161b2a" stroke="#3b82f6" strokeWidth="2" />
          <text x="296" y="160" fill="#dee2f6" fontSize="14" fontFamily="JetBrains Mono">m</text>
          {/* Normal Up */}
          <line x1="310" y1="122" x2="310" y2="54" stroke="#4edea3" strokeWidth="2.2" />
          <text x="320" y="72" fill="#6ffbbe" fontSize="12" fontFamily="JetBrains Mono">N = mg</text>
          {/* Weight Down */}
          <line x1="310" y1="190" x2="310" y2="246" stroke="#f59e0b" strokeWidth="2.2" />
          <text x="320" y="236" fill="#fbbf24" fontSize="12" fontFamily="JetBrains Mono">W = mg</text>
          {/* Applied Force Right */}
          <line x1="365" y1="156" x2="510" y2="156" stroke="#38bdf8" strokeWidth="2.6" className="svg-flow-line" />
          <text x="415" y="144" fill="#7dd3fc" fontSize="12" fontFamily="JetBrains Mono">F_app</text>
          {/* Friction Left */}
          <line x1="255" y1="172" x2="155" y2="172" stroke="#ef4444" strokeWidth="2.2" />
          <text x="165" y="160" fill="#fca5a5" fontSize="12" fontFamily="JetBrains Mono">f_k = μ_k N</text>
          <text x="425" y="226" fill="#93ccff" fontSize="12" fontFamily="JetBrains Mono">F_net = m a</text>
        </svg>
      );
    case 'friction':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Inclined Plane Force Decomposition">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          <polygon points="110,226 530,226 530,66" fill="rgba(59,130,246,0.1)" stroke="#64748b" strokeWidth="2" />
          <text x="175" y="216" fill="#93ccff" fontSize="12" fontFamily="JetBrains Mono">θ</text>
          {/* Tilted Block */}
          <g transform="translate(340, 138) rotate(-20.8)">
            <rect x="-32" y="-44" width="64" height="44" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
            <line x1="0" y1="-44" x2="0" y2="-104" stroke="#4edea3" strokeWidth="2" />
            <text x="8" y="-88" fill="#6ffbbe" fontSize="11" fontFamily="JetBrains Mono">N = mg cos θ</text>
            <line x1="32" y1="-22" x2="96" y2="-22" stroke="#f59e0b" strokeWidth="2" />
            <text x="58" y="-32" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">f_s ≤ μ_s N</text>
            <line x1="-32" y1="-22" x2="-102" y2="-22" stroke="#38bdf8" strokeWidth="2" />
            <text x="-135" y="-32" fill="#7dd3fc" fontSize="11" fontFamily="JetBrains Mono">mg sin θ</text>
          </g>
          <text x="45" y="64" fill="#cbd5e1" fontSize="12" fontFamily="JetBrains Mono">ANGLE OF REPOSE: tan θ_c = μ_s</text>
        </svg>
      );
    case 'simple-pendulum':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Simple Pendulum Harmonic Oscillator">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          <line x1="120" y1="36" x2="360" y2="36" stroke="#64748b" strokeWidth="3" />
          <line x1="240" y1="36" x2="240" y2="225" stroke="#475569" strokeDasharray="4 4" />
          <path d="M 155 198 Q 240 232 325 198" fill="none" stroke="#38bdf8" strokeDasharray="3 3" strokeWidth="1.5" />
          <line x1="240" y1="36" x2="320" y2="198" stroke="#93ccff" strokeWidth="2" />
          <circle cx="320" cy="198" r="14" fill="#2563eb" stroke="#93ccff" strokeWidth="2" />
          <text x="255" y="114" fill="#fbbf24" fontSize="12" fontFamily="JetBrains Mono">θ</text>
          <text x="292" y="114" fill="#93ccff" fontSize="12" fontFamily="JetBrains Mono">L</text>
          <line x1="320" y1="198" x2="320" y2="252" stroke="#f59e0b" strokeWidth="2" />
          <text x="330" y="244" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">mg</text>
          <rect x="395" y="75" width="195" height="125" rx="4" fill="#161b2a" stroke="#334155" strokeWidth="1.2" />
          <text x="415" y="112" fill="#7dd3fc" fontSize="14" fontFamily="JetBrains Mono">T = 2π √(L / g)</text>
          <text x="415" y="144" fill="#94a3b8" fontSize="11" fontFamily="Plus Jakarta Sans">Independent of bob mass</text>
          <text x="415" y="168" fill="#94a3b8" fontSize="11" fontFamily="Plus Jakarta Sans">Elliptical (θ, ω) phase orbit</text>
        </svg>
      );
    case 'work-energy':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Roller Coaster Energy Conservation Track">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          <path d="M 65 76 C 145 76, 175 214, 275 214 C 360 214, 385 112, 460 112 C 520 112, 545 190, 580 190" fill="none" stroke="#3b82f6" strokeWidth="3" />
          <circle cx="80" cy="68" r="10" fill="#f59e0b" />
          <text x="58" y="50" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">MAX U = mgh</text>
          <circle cx="275" cy="206" r="10" fill="#4edea3" />
          <text x="235" y="242" fill="#6ffbbe" fontSize="11" fontFamily="JetBrains Mono">MAX K = ½mv²</text>
          <text x="380" y="70" fill="#93ccff" fontSize="12" fontFamily="JetBrains Mono">E_mech = mgh + ½mv² = CONST</text>
        </svg>
      );
    case 'hookes-law':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Hooke's Law Spring Mass System">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          <line x1="65" y1="65" x2="65" y2="205" stroke="#64748b" strokeWidth="4" />
          <polyline points="65,135 95,135 110,108 130,162 150,108 170,162 190,108 210,162 225,135 260,135" fill="none" stroke="#38bdf8" strokeWidth="2.4" />
          <rect x="260" y="102" width="76" height="66" rx="4" fill="#161b2a" stroke="#3b82f6" strokeWidth="2" />
          <text x="290" y="140" fill="#dee2f6" fontSize="14" fontFamily="JetBrains Mono">m</text>
          <line x1="298" y1="135" x2="215" y2="135" stroke="#f59e0b" strokeWidth="2" />
          <text x="195" y="92" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">F = −kx</text>
          {/* Parabola U = 1/2 kx^2 */}
          <line x1="400" y1="205" x2="585" y2="205" stroke="#64748b" strokeWidth="1.5" />
          <line x1="492" y1="65" x2="492" y2="205" stroke="#64748b" strokeWidth="1.5" />
          <path d="M 415 80 Q 492 315 570 80" fill="none" stroke="#4edea3" strokeWidth="2.4" />
          <text x="428" y="64" fill="#6ffbbe" fontSize="11" fontFamily="JetBrains Mono">U_s = ½ k x²</text>
        </svg>
      );
    case 'collisions':
    default:
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="1D Momentum Conservation Collision">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          <line x1="55" y1="175" x2="585" y2="175" stroke="#475569" strokeWidth="2" />
          <rect x="120" y="115" width="90" height="54" rx="4" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
          <text x="155" y="146" fill="#dee2f6" fontSize="13" fontFamily="JetBrains Mono">m₁</text>
          <line x1="215" y1="142" x2="290" y2="142" stroke="#38bdf8" strokeWidth="2.5" className="svg-flow-line" />
          <text x="235" y="130" fill="#7dd3fc" fontSize="12" fontFamily="JetBrains Mono">v₁ →</text>
          <rect x="410" y="115" width="110" height="54" rx="4" fill="#065f46" stroke="#10b981" strokeWidth="2" />
          <text x="455" y="146" fill="#dee2f6" fontSize="13" fontFamily="JetBrains Mono">m₂</text>
          <line x1="405" y1="142" x2="345" y2="142" stroke="#f59e0b" strokeWidth="2.5" className="svg-flow-line" />
          <text x="355" y="130" fill="#fbbf24" fontSize="12" fontFamily="JetBrains Mono">← v₂</text>
          <text x="145" y="224" fill="#93ccff" fontSize="12" fontFamily="JetBrains Mono">m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'  ·  e = (v₂' − v₁')/(v₁ − v₂)</text>
        </svg>
      );
  }
};
