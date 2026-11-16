import React from 'react';

export const ChemistrySchematic: React.FC<{ expId: string }> = ({ expId }) => {
  switch (expId) {
    case 'acid-base-titration':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Acid-Base Titration Burette and pH Curve Schematic">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* Burette */}
          <rect x="135" y="34" width="22" height="95" fill="rgba(56,189,248,0.12)" stroke="#7dd3fc" strokeWidth="1.5" />
          <rect x="137" y="54" width="18" height="73" fill="rgba(56,189,248,0.35)" />
          <line x1="146" y1="129" x2="146" y2="146" stroke="#7dd3fc" strokeWidth="2" />
          <circle cx="146" cy="156" r="3.5" fill="#38bdf8" />
          {/* Erlenmeyer Flask */}
          <path d="M 128 168 L 164 168 L 194 236 L 98 236 Z" fill="rgba(168,85,247,0.18)" stroke="#cbd5e1" strokeWidth="1.6" />
          <path d="M 110 208 L 182 208 L 193 235 L 99 235 Z" fill="rgba(236,72,153,0.42)" />
          <text x="64" y="92" fill="#7dd3fc" fontSize="11" fontFamily="JetBrains Mono">NaOH TITRANT</text>
          <text x="60" y="252" fill="#f9a8d4" fontSize="11" fontFamily="JetBrains Mono">ANALYTE + INDICATOR</text>
          {/* Sigmoidal pH Curve */}
          <line x1="290" y1="226" x2="590" y2="226" stroke="#64748b" strokeWidth="1.5" />
          <line x1="290" y1="45" x2="290" y2="226" stroke="#64748b" strokeWidth="1.5" />
          <path d="M 295 206 C 360 202, 410 194, 425 135 C 435 76, 465 65, 580 58" fill="none" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="430" cy="135" r="5" fill="#f59e0b" />
          <line x1="430" y1="135" x2="430" y2="226" stroke="#f59e0b" strokeDasharray="4 4" strokeWidth="1.2" />
          <text x="444" y="138" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">EQUIVALENCE (MₐVₐ = M_bV_b)</text>
          <text x="272" y="52" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">pH</text>
          <text x="530" y="245" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">V_base (mL)</text>
        </svg>
      );
    case 'gas-laws':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Ideal Gas Molecular Collision Chamber">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* Cylinder */}
          <rect x="70" y="55" width="240" height="170" fill="#0f172a" stroke="#475569" strokeWidth="2" />
          {/* Movable Piston */}
          <rect x="72" y="96" width="236" height="14" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="190" y1="36" x2="190" y2="96" stroke="#94a3b8" strokeWidth="4" />
          <text x="210" y="48" fill="#cbd5e1" fontSize="11" fontFamily="JetBrains Mono">MOVABLE PISTON (V)</text>
          {/* Gas Molecules + Velocity Vectors */}
          {[
            [115, 140, 145, 126],
            [180, 185, 205, 165],
            [250, 145, 275, 175],
            [140, 198, 120, 178],
            [230, 202, 260, 195],
          ].map(([x, y, vx, vy], idx) => (
            <g key={idx}>
              <line x1={x} y1={y} x2={vx} y2={vy} stroke="#38bdf8" strokeWidth="1.5" className="svg-flow-line" />
              <circle cx={x} cy={y} r="6" fill="#059669" stroke="#6ffbbe" strokeWidth="1.2" />
            </g>
          ))}
          {/* Formula summary */}
          <rect x="355" y="65" width="230" height="150" rx="4" fill="#161b2a" stroke="#334155" strokeWidth="1.2" />
          <text x="375" y="98" fill="#4edea3" fontSize="15" fontFamily="JetBrains Mono" fontWeight="600">PV = nRT</text>
          <text x="375" y="130" fill="#cbd5e1" fontSize="12" fontFamily="JetBrains Mono">v_rms = √(3RT / M)</text>
          <text x="375" y="160" fill="#94a3b8" fontSize="11" fontFamily="Plus Jakarta Sans">Wall impulse Δp = 2mvₓ</text>
          <text x="375" y="185" fill="#94a3b8" fontSize="11" fontFamily="Plus Jakarta Sans">Elastic kinetic collisions</text>
        </svg>
      );
    case 'reaction-kinetics':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Arrhenius Activation Energy Profile">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          <line x1="64" y1="226" x2="585" y2="226" stroke="#64748b" strokeWidth="1.5" />
          <line x1="64" y1="42" x2="64" y2="226" stroke="#64748b" strokeWidth="1.5" />
          {/* Uncatalyzed peak */}
          <path d="M 80 155 L 160 155 C 230 155, 250 56, 315 56 C 380 56, 405 198, 470 198 L 560 198" fill="none" stroke="#f59e0b" strokeWidth="2.4" />
          {/* Catalyzed lower path */}
          <path d="M 160 155 C 225 155, 255 104, 315 104 C 375 104, 405 198, 470 198" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5 4" />
          {/* Ea Arrow */}
          <line x1="315" y1="56" x2="315" y2="155" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="160" y1="155" x2="340" y2="155" stroke="#475569" strokeDasharray="3 3" />
          <text x="324" y="88" fill="#7dd3fc" fontSize="12" fontFamily="JetBrains Mono">Eₐ (Uncatalyzed)</text>
          <text x="324" y="130" fill="#4edea3" fontSize="12" fontFamily="JetBrains Mono">Eₐ,cat (Lowered)</text>
          <text x="86" y="145" fill="#cbd5e1" fontSize="11" fontFamily="JetBrains Mono">A + B</text>
          <text x="485" y="188" fill="#cbd5e1" fontSize="11" fontFamily="JetBrains Mono">PRODUCTS (C)</text>
          <text x="415" y="246" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">REACTION COORDINATE</text>
        </svg>
      );
    case 'flame-test':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Atomic Excitation and Flame Emission Spectrum">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* Energy levels */}
          <line x1="65" y1="210" x2="260" y2="210" stroke="#64748b" strokeWidth="2" />
          <line x1="65" y1="130" x2="260" y2="130" stroke="#64748b" strokeWidth="2" />
          <line x1="65" y1="70" x2="260" y2="70" stroke="#38bdf8" strokeWidth="2" />
          <text x="70" y="228" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">GROUND STATE (n=1)</text>
          <text x="70" y="60" fill="#7dd3fc" fontSize="11" fontFamily="JetBrains Mono">EXCITED ORBITAL</text>
          {/* Excitation & relaxation */}
          <line x1="120" y1="208" x2="120" y2="74" stroke="#f59e0b" strokeWidth="2" className="svg-flow-line" />
          <text x="70" y="114" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">+Heat</text>
          <line x1="200" y1="74" x2="200" y2="208" stroke="#10b981" strokeWidth="2.2" />
          <polygon points="200,210 195,198 205,198" fill="#10b981" />
          {/* Photon wave */}
          <path d="M 215 140 Q 230 126 245 140 T 275 140 T 305 140" fill="none" stroke="#4edea3" strokeWidth="2" />
          <text x="235" y="116" fill="#4edea3" fontSize="12" fontFamily="JetBrains Mono">ΔE = hc / λ</text>
          {/* Spectrum Bar */}
          <rect x="340" y="108" width="245" height="62" fill="#020617" stroke="#334155" strokeWidth="1.5" rx="3" />
          <line x1="378" y1="110" x2="378" y2="168" stroke="#8b5cf6" strokeWidth="2.5" />
          <line x1="435" y1="110" x2="435" y2="168" stroke="#10b981" strokeWidth="3" />
          <line x1="495" y1="110" x2="495" y2="168" stroke="#f59e0b" strokeWidth="4" />
          <line x1="552" y1="110" x2="552" y2="168" stroke="#ef4444" strokeWidth="2.5" />
          <text x="340" y="92" fill="#cbd5e1" fontSize="11" fontFamily="JetBrains Mono">EMISSION LINE SPECTRUM (nm)</text>
          <text x="340" y="192" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">400nm           550nm           700nm</text>
        </svg>
      );
    case 'electrochemistry':
    default:
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Daniell Galvanic Cell Schematic">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* Left Beaker (Zn) */}
          <rect x="75" y="120" width="160" height="115" fill="rgba(59,130,246,0.1)" stroke="#64748b" strokeWidth="1.8" />
          <rect x="108" y="88" width="22" height="125" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="1.2" />
          <text x="86" y="252" fill="#93ccff" fontSize="11" fontFamily="JetBrains Mono">ANODE: Zn → Zn²⁺ + 2e⁻</text>
          {/* Right Beaker (Cu) */}
          <rect x="405" y="120" width="160" height="115" fill="rgba(6,182,212,0.18)" stroke="#64748b" strokeWidth="1.8" />
          <rect x="510" y="88" width="22" height="125" fill="#d97706" stroke="#fbbf24" strokeWidth="1.2" />
          <text x="408" y="252" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">CATHODE: Cu²⁺ + 2e⁻ → Cu</text>
          {/* Salt Bridge */}
          <path d="M 195 165 L 195 108 Q 195 92 215 92 L 425 92 Q 445 92 445 108 L 445 165" fill="none" stroke="#4edea3" strokeWidth="14" strokeOpacity="0.24" />
          <path d="M 195 165 L 195 108 Q 195 92 215 92 L 425 92 Q 445 92 445 108 L 445 165" fill="none" stroke="#4edea3" strokeWidth="1.5" />
          <text x="276" y="114" fill="#6ffbbe" fontSize="11" fontFamily="JetBrains Mono">KNO₃ SALT BRIDGE</text>
          {/* External Electron Wire & Voltmeter */}
          <polyline points="119,88 119,44 521,44 521,88" fill="none" stroke="#f59e0b" strokeWidth="2" className="svg-flow-line" />
          <circle cx="320" cy="44" r="18" fill="#161b2a" stroke="#fbbf24" strokeWidth="1.8" />
          <text x="313" y="49" fill="#fbbf24" fontSize="13" fontFamily="JetBrains Mono" fontWeight="700">V</text>
          <text x="160" y="37" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">e⁻ FLOW →</text>
        </svg>
      );
  }
};
