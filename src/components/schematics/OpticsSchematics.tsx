import React from 'react';

export const OpticsSchematic: React.FC<{ expId: string }> = ({ expId }) => {
  switch (expId) {
    case 'snells-law':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Snell's Law and Total Internal Reflection Diagram">
          <defs>
            <linearGradient id="glassMed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <rect x="20" y="20" width="600" height="120" fill="#090e1c" rx="4" />
          <rect x="20" y="140" width="600" height="120" fill="url(#glassMed)" rx="4" />
          <line x1="20" y1="140" x2="620" y2="140" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="320" y1="26" x2="320" y2="254" stroke="#64748b" strokeWidth="1.2" strokeDasharray="5 5" />
          <text x="330" y="42" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">NORMAL LINE</text>
          <text x="36" y="44" fill="#bae6fd" fontSize="12" fontFamily="JetBrains Mono">MEDIUM 1 (n₁)</text>
          <text x="36" y="244" fill="#7dd3fc" fontSize="12" fontFamily="JetBrains Mono">MEDIUM 2 (n₂)</text>
          {/* Incident ray */}
          <line x1="160" y1="36" x2="320" y2="140" stroke="#f59e0b" strokeWidth="2.2" className="svg-flow-line" />
          <circle cx="320" cy="140" r="4" fill="#38bdf8" />
          {/* Reflected ray */}
          <line x1="320" y1="140" x2="480" y2="36" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.55" />
          {/* Refracted ray */}
          <line x1="320" y1="140" x2="412" y2="250" stroke="#38bdf8" strokeWidth="2.2" className="svg-flow-line" />
          {/* Critical grazing ray */}
          <line x1="320" y1="140" x2="585" y2="140" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 4" />
          {/* Arcs & labels */}
          <path d="M 320 98 A 42 42 0 0 0 285 117" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="276" y="94" fill="#fbbf24" fontSize="12" fontFamily="JetBrains Mono">θ₁</text>
          <path d="M 320 184 A 44 44 0 0 0 348 174" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="336" y="198" fill="#7dd3fc" fontSize="12" fontFamily="JetBrains Mono">θ₂</text>
          <text x="118" y="68" fill="#fbbf24" fontSize="11" fontFamily="Plus Jakarta Sans">Incident Beam</text>
          <text x="424" y="226" fill="#7dd3fc" fontSize="11" fontFamily="Plus Jakarta Sans">Refracted Beam (n₁ sin θ₁ = n₂ sin θ₂)</text>
          <text x="466" y="132" fill="#c084fc" fontSize="11" fontFamily="JetBrains Mono">θ₂ = 90° @ θc</text>
        </svg>
      );
    case 'thin-lenses':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Thin Convex Lens Principal Ray Tracing">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          <line x1="36" y1="145" x2="604" y2="145" stroke="#475569" strokeWidth="1.5" />
          {/* Convex Lens */}
          <path d="M 320 45 Q 350 145 320 245 Q 290 145 320 45 Z" fill="#0284c7" fillOpacity="0.22" stroke="#38bdf8" strokeWidth="1.8" />
          {/* Focal points */}
          <circle cx="220" cy="145" r="3.5" fill="#93ccff" />
          <circle cx="420" cy="145" r="3.5" fill="#93ccff" />
          <circle cx="120" cy="145" r="3" fill="#64748b" />
          <circle cx="520" cy="145" r="3" fill="#64748b" />
          <text x="214" y="164" fill="#93ccff" fontSize="11" fontFamily="JetBrains Mono">F</text>
          <text x="415" y="164" fill="#93ccff" fontSize="11" fontFamily="JetBrains Mono">F'</text>
          <text x="110" y="164" fill="#64748b" fontSize="11" fontFamily="JetBrains Mono">2F</text>
          <text x="510" y="164" fill="#64748b" fontSize="11" fontFamily="JetBrains Mono">2F'</text>
          {/* Object arrow */}
          <line x1="150" y1="145" x2="150" y2="80" stroke="#4edea3" strokeWidth="3" />
          <polygon points="150,74 145,86 155,86" fill="#4edea3" />
          <text x="122" y="66" fill="#4edea3" fontSize="11" fontFamily="JetBrains Mono">OBJECT (d₀)</text>
          {/* Ray 1: Parallel then focal */}
          <line x1="150" y1="80" x2="320" y2="80" stroke="#f59e0b" strokeWidth="1.6" className="svg-flow-line" />
          <line x1="320" y1="80" x2="545" y2="225" stroke="#f59e0b" strokeWidth="1.6" className="svg-flow-line" />
          {/* Ray 2: Center */}
          <line x1="150" y1="80" x2="545" y2="232" stroke="#38bdf8" strokeWidth="1.6" className="svg-flow-line" />
          {/* Ray 3: Front Focal then parallel */}
          <line x1="150" y1="80" x2="320" y2="238" stroke="#c084fc" strokeWidth="1.6" strokeDasharray="4 4" />
          <line x1="320" y1="238" x2="545" y2="238" stroke="#c084fc" strokeWidth="1.6" strokeDasharray="4 4" />
          {/* Image arrow at convergence (x=472, y=214) */}
          <line x1="472" y1="145" x2="472" y2="195" stroke="#f43f5e" strokeWidth="3" />
          <polygon points="472,202 467,190 477,190" fill="#f43f5e" />
          <text x="444" y="220" fill="#fda4af" fontSize="11" fontFamily="JetBrains Mono">REAL IMAGE (dᵢ)</text>
        </svg>
      );
    case 'double-slit':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Young's Double-Slit Interference Schematic">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* Incident plane waves */}
          {[55, 78, 101, 124].map((x) => (
            <line key={x} x1={x} y1="60" x2={x} y2="220" stroke="#0284c7" strokeWidth="1.5" strokeOpacity="0.6" />
          ))}
          <text x="44" y="46" fill="#7dd3fc" fontSize="11" fontFamily="JetBrains Mono">COHERENT λ</text>
          {/* Slit Barrier */}
          <rect x="160" y="40" width="8" height="65" fill="#475569" />
          <rect x="160" y="121" width="8" height="38" fill="#475569" />
          <rect x="160" y="175" width="8" height="65" fill="#475569" />
          <text x="148" y="144" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">d</text>
          {/* Circular wavefronts from S1 & S2 */}
          {[45, 85, 125, 165, 205].map((r) => (
            <g key={r}>
              <circle cx="168" cy="113" r={r} fill="none" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.32" />
              <circle cx="168" cy="167" r={r} fill="none" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.32" />
            </g>
          ))}
          {/* Interference rays to m=1 */}
          <line x1="168" y1="113" x2="490" y2="85" stroke="#4edea3" strokeWidth="1.6" className="svg-flow-line" />
          <line x1="168" y1="167" x2="490" y2="85" stroke="#f59e0b" strokeWidth="1.6" className="svg-flow-line" />
          {/* Screen & intensity profile */}
          <line x1="490" y1="36" x2="490" y2="244" stroke="#64748b" strokeWidth="2" />
          <path d="M 490 45 C 510 55, 510 65, 490 75 C 550 82, 550 94, 490 105 C 575 128, 575 152, 490 175 C 550 186, 550 198, 490 205 C 510 215, 510 225, 490 235" fill="rgba(56,189,248,0.22)" stroke="#38bdf8" strokeWidth="1.8" />
          <text x="530" y="144" fill="#93ccff" fontSize="11" fontFamily="JetBrains Mono">m = 0</text>
          <text x="528" y="92" fill="#4edea3" fontSize="11" fontFamily="JetBrains Mono">m = +1</text>
          <text x="315" y="244" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">SCREEN DISTANCE L  ·  Δx = λL/d</text>
        </svg>
      );
    case 'prism-dispersion':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Chromatic Dispersion Through Glass Prism">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* Prism */}
          <polygon points="300,52 200,224 400,224" fill="rgba(56, 189, 248, 0.14)" stroke="#7dd3fc" strokeWidth="1.8" />
          <text x="294" y="84" fill="#93ccff" fontSize="12" fontFamily="JetBrains Mono">A</text>
          {/* White incident ray */}
          <line x1="65" y1="158" x2="246" y2="145" stroke="#f8fafc" strokeWidth="3" className="svg-flow-line" />
          <text x="68" y="142" fill="#e2e8f0" fontSize="11" fontFamily="JetBrains Mono">WHITE LIGHT</text>
          {/* Dispersed spectral fan inside & out */}
          <line x1="246" y1="145" x2="349" y2="136" stroke="#ef4444" strokeWidth="1.6" />
          <line x1="349" y1="136" x2="575" y2="156" stroke="#ef4444" strokeWidth="2.2" />
          <text x="515" y="148" fill="#fca5a5" fontSize="11" fontFamily="JetBrains Mono">RED (700nm)</text>

          <line x1="246" y1="145" x2="354" y2="145" stroke="#22c55e" strokeWidth="1.6" />
          <line x1="354" y1="145" x2="575" y2="188" stroke="#22c55e" strokeWidth="2.2" />
          <text x="515" y="182" fill="#86efac" fontSize="11" fontFamily="JetBrains Mono">GREEN (532nm)</text>

          <line x1="246" y1="145" x2="360" y2="156" stroke="#a855f7" strokeWidth="1.6" />
          <line x1="360" y1="156" x2="575" y2="224" stroke="#a855f7" strokeWidth="2.2" />
          <text x="505" y="218" fill="#d8b4fe" fontSize="11" fontFamily="JetBrains Mono">VIOLET (405nm)</text>

          <text x="218" y="246" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">n(λ) = A + B / λ²  ·  n_violet &gt; n_red</text>
        </svg>
      );
    case 'diffraction-grating':
    default:
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Diffraction Grating Spectrometer Schematic">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* Source & Collimator */}
          <rect x="44" y="122" width="64" height="36" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="53" y="144" fill="#bae6fd" fontSize="11" fontFamily="JetBrains Mono">LAMP</text>
          <line x1="108" y1="140" x2="210" y2="140" stroke="#f8fafc" strokeWidth="2.4" className="svg-flow-line" />
          {/* Periodic Grating */}
          {[70, 90, 110, 130, 150, 170, 190, 210].map((y) => (
            <line key={y} x1="215" y1={y} x2="215" y2={y + 10} stroke="#38bdf8" strokeWidth="3" />
          ))}
          <text x="174" y="54" fill="#7dd3fc" fontSize="11" fontFamily="JetBrains Mono">GRATING (d)</text>
          {/* 0th order */}
          <line x1="215" y1="140" x2="560" y2="140" stroke="#f8fafc" strokeWidth="2" />
          <text x="505" y="132" fill="#e2e8f0" fontSize="11" fontFamily="JetBrains Mono">m = 0</text>
          {/* 1st order dispersed */}
          <line x1="215" y1="140" x2="545" y2="85" stroke="#3b82f6" strokeWidth="2" />
          <line x1="215" y1="140" x2="545" y2="56" stroke="#ef4444" strokeWidth="2" />
          <text x="480" y="50" fill="#fca5a5" fontSize="11" fontFamily="JetBrains Mono">m = +1 (Red θ &gt; Blue θ)</text>
          <line x1="215" y1="140" x2="545" y2="195" stroke="#3b82f6" strokeWidth="2" />
          <line x1="215" y1="140" x2="545" y2="224" stroke="#ef4444" strokeWidth="2" />
          <text x="490" y="242" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">d sin θ = mλ</text>
        </svg>
      );
  }
};
