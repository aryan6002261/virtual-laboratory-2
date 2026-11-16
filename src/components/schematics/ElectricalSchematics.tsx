import React from 'react';

export const ElectricalSchematic: React.FC<{ expId: string }> = ({ expId }) => {
  switch (expId) {
    case 'ohms-law':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Ohm's Law Test Circuit and I-V Slope">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          <polyline points="85,180 85,70 300,70 300,200 85,200 85,180" fill="none" stroke="#f59e0b" strokeWidth="1.8" className="svg-flow-line" />
          {/* Battery */}
          <rect x="70" y="122" width="30" height="26" fill="#090e1c" />
          <line x1="72" y1="128" x2="98" y2="128" stroke="#f59e0b" strokeWidth="3" />
          <line x1="78" y1="140" x2="92" y2="140" stroke="#f59e0b" strokeWidth="2" />
          <text x="42" y="140" fill="#fbbf24" fontSize="12" fontFamily="JetBrains Mono">V</text>
          {/* Ammeter */}
          <circle cx="192" cy="70" r="16" fill="#161b2a" stroke="#38bdf8" strokeWidth="1.6" />
          <text x="187" y="75" fill="#7dd3fc" fontSize="12" fontFamily="JetBrains Mono">A</text>
          {/* Resistor */}
          <rect x="288" y="108" width="24" height="58" fill="#161b2a" stroke="#f59e0b" strokeWidth="1.8" />
          <text x="320" y="142" fill="#fbbf24" fontSize="12" fontFamily="JetBrains Mono">R</text>
          {/* I-V Plot */}
          <line x1="390" y1="215" x2="585" y2="215" stroke="#64748b" strokeWidth="1.5" />
          <line x1="390" y1="60" x2="390" y2="215" stroke="#64748b" strokeWidth="1.5" />
          <line x1="390" y1="215" x2="565" y2="75" stroke="#4edea3" strokeWidth="2.4" />
          <text x="470" y="124" fill="#4edea3" fontSize="12" fontFamily="JetBrains Mono">SLOPE = 1 / R</text>
          <text x="372" y="70" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">I</text>
          <text x="572" y="232" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">V</text>
        </svg>
      );
    case 'kirchhoffs-laws':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Kirchhoff Dual-Loop Network">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          <rect x="115" y="65" width="410" height="150" fill="none" stroke="#f59e0b" strokeWidth="1.8" />
          <line x1="320" y1="65" x2="320" y2="215" stroke="#38bdf8" strokeWidth="1.8" />
          {/* Nodes */}
          <circle cx="320" cy="65" r="5" fill="#4edea3" />
          <text x="305" y="50" fill="#4edea3" fontSize="11" fontFamily="JetBrains Mono">NODE A (I₁+I₃=I₂)</text>
          <circle cx="320" cy="215" r="5" fill="#64748b" />
          {/* Sources & Resistors */}
          <rect x="98" y="122" width="34" height="32" fill="#161b2a" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="106" y="143" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">V₁</text>
          <rect x="508" y="122" width="34" height="32" fill="#161b2a" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="516" y="143" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">V₂</text>
          <rect x="188" y="54" width="60" height="22" fill="#161b2a" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="208" y="69" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">R₁</text>
          <rect x="306" y="114" width="28" height="52" fill="#161b2a" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="342" y="145" fill="#7dd3fc" fontSize="11" fontFamily="JetBrains Mono">R₂</text>
          <rect x="392" y="54" width="60" height="22" fill="#161b2a" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="412" y="69" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">R₃</text>
          <text x="170" y="152" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">LOOP 1: ∑ΔV = 0</text>
          <text x="380" y="152" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">LOOP 2: ∑ΔV = 0</text>
        </svg>
      );
    case 'series-parallel':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Series vs Parallel Resistor Networks">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* Series side */}
          <text x="55" y="52" fill="#fbbf24" fontSize="12" fontFamily="JetBrains Mono">SERIES: R_eq = R₁+R₂+R₃</text>
          <line x1="55" y1="120" x2="285" y2="120" stroke="#f59e0b" strokeWidth="2" className="svg-flow-line" />
          {[80, 145, 210].map((x, i) => (
            <g key={x}>
              <rect x={x} y="106" width="46" height="28" fill="#161b2a" stroke="#f59e0b" strokeWidth="1.5" />
              <text x={x + 14} y="125" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">R{i + 1}</text>
            </g>
          ))}
          <text x="72" y="176" fill="#94a3b8" fontSize="11" fontFamily="Plus Jakarta Sans">Uniform current I; voltage divides</text>
          {/* Parallel side */}
          <line x1="320" y1="40" x2="320" y2="238" stroke="#334155" strokeWidth="1" />
          <text x="355" y="52" fill="#4edea3" fontSize="12" fontFamily="JetBrains Mono">PARALLEL: 1/R_eq = ∑(1/Rᵢ)</text>
          <line x1="360" y1="145" x2="405" y2="145" stroke="#10b981" strokeWidth="2" />
          <line x1="535" y1="145" x2="580" y2="145" stroke="#10b981" strokeWidth="2" />
          <line x1="405" y1="88" x2="405" y2="202" stroke="#10b981" strokeWidth="2" />
          <line x1="535" y1="88" x2="535" y2="202" stroke="#10b981" strokeWidth="2" />
          {[88, 145, 202].map((y, i) => (
            <g key={y}>
              <line x1="405" y1={y} x2="535" y2={y} stroke="#10b981" strokeWidth="1.8" className="svg-flow-line" />
              <rect x="444" y={y - 12} width="52" height="24" fill="#161b2a" stroke="#4edea3" strokeWidth="1.5" />
              <text x="462" y={y + 4} fill="#6ffbbe" fontSize="11" fontFamily="JetBrains Mono">R{i + 1}</text>
            </g>
          ))}
        </svg>
      );
    case 'rc-circuits':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="RC Transient Charging Curve">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* Circuit */}
          <polyline points="75,180 75,70 250,70 250,200 75,200 75,180" fill="none" stroke="#f59e0b" strokeWidth="1.8" />
          <rect x="132" y="58" width="54" height="24" fill="#161b2a" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="152" y="75" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">R</text>
          <line x1="234" y1="128" x2="266" y2="128" stroke="#38bdf8" strokeWidth="3" />
          <line x1="234" y1="142" x2="266" y2="142" stroke="#38bdf8" strokeWidth="3" />
          <text x="274" y="140" fill="#7dd3fc" fontSize="11" fontFamily="JetBrains Mono">C</text>
          {/* Exponential curve */}
          <line x1="340" y1="215" x2="585" y2="215" stroke="#64748b" strokeWidth="1.5" />
          <line x1="340" y1="55" x2="340" y2="215" stroke="#64748b" strokeWidth="1.5" />
          <line x1="340" y1="75" x2="585" y2="75" stroke="#475569" strokeDasharray="4 4" />
          <path d="M 340 215 Q 375 100 575 77" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
          <circle cx="388" cy="127" r="4.5" fill="#4edea3" />
          <line x1="388" y1="127" x2="388" y2="215" stroke="#4edea3" strokeDasharray="3 3" />
          <text x="396" y="132" fill="#4edea3" fontSize="11" fontFamily="JetBrains Mono">t = τ (63.2% V₀)</text>
          <text x="348" y="68" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">V_C(t) = V₀(1 − e^(−t/τ))</text>
        </svg>
      );
    case 'electrical-measurements':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Ammeter Shunt and Voltmeter Multiplier Schematics">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* Ammeter */}
          <text x="55" y="54" fill="#fbbf24" fontSize="12" fontFamily="JetBrains Mono">AMMETER (PARALLEL SHUNT R_sh)</text>
          <line x1="55" y1="120" x2="290" y2="120" stroke="#f59e0b" strokeWidth="2" />
          <line x1="110" y1="120" x2="110" y2="190" stroke="#f59e0b" strokeWidth="1.8" />
          <line x1="235" y1="120" x2="235" y2="190" stroke="#f59e0b" strokeWidth="1.8" />
          <line x1="110" y1="190" x2="235" y2="190" stroke="#4edea3" strokeWidth="2" />
          <circle cx="172" cy="120" r="18" fill="#161b2a" stroke="#fbbf24" strokeWidth="1.6" />
          <text x="166" y="125" fill="#fbbf24" fontSize="12" fontFamily="JetBrains Mono">G</text>
          <rect x="145" y="178" width="54" height="22" fill="#161b2a" stroke="#4edea3" strokeWidth="1.5" />
          <text x="157" y="193" fill="#6ffbbe" fontSize="11" fontFamily="JetBrains Mono">R_sh</text>
          {/* Voltmeter */}
          <line x1="320" y1="40" x2="320" y2="238" stroke="#334155" strokeWidth="1" />
          <text x="348" y="54" fill="#7dd3fc" fontSize="12" fontFamily="JetBrains Mono">VOLTMETER (SERIES R_m)</text>
          <line x1="355" y1="138" x2="585" y2="138" stroke="#38bdf8" strokeWidth="2" />
          <rect x="392" y="126" width="58" height="24" fill="#161b2a" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="410" y="142" fill="#7dd3fc" fontSize="11" fontFamily="JetBrains Mono">R_m</text>
          <circle cx="515" cy="138" r="18" fill="#161b2a" stroke="#38bdf8" strokeWidth="1.6" />
          <text x="509" y="143" fill="#7dd3fc" fontSize="12" fontFamily="JetBrains Mono">G</text>
        </svg>
      );
    case 'rlc-circuits':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Series RLC Impedance and Resonance Curve">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* AC Series Loop */}
          <polyline points="60,180 60,72 290,72 290,200 60,200 60,180" fill="none" stroke="#f59e0b" strokeWidth="1.8" className="svg-flow-line" />
          <circle cx="60" cy="136" r="16" fill="#161b2a" stroke="#fbbf24" strokeWidth="1.6" />
          <text x="53" y="141" fill="#fbbf24" fontSize="13" fontFamily="JetBrains Mono">~</text>
          <rect x="108" y="60" width="44" height="24" fill="#161b2a" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="125" y="77" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">R</text>
          <path d="M 180 72 Q 190 52 200 72 Q 210 52 220 72 Q 230 52 240 72" fill="none" stroke="#38bdf8" strokeWidth="2.2" />
          <text x="205" y="50" fill="#7dd3fc" fontSize="11" fontFamily="JetBrains Mono">L</text>
          <line x1="274" y1="128" x2="306" y2="128" stroke="#4edea3" strokeWidth="3" />
          <line x1="274" y1="142" x2="306" y2="142" stroke="#4edea3" strokeWidth="3" />
          <text x="314" y="140" fill="#4edea3" fontSize="11" fontFamily="JetBrains Mono">C</text>
          {/* Resonance peak */}
          <line x1="365" y1="215" x2="590" y2="215" stroke="#64748b" strokeWidth="1.5" />
          <line x1="365" y1="55" x2="365" y2="215" stroke="#64748b" strokeWidth="1.5" />
          <path d="M 372 206 C 430 204, 455 64, 478 64 C 501 64, 526 204, 582 206" fill="rgba(245,158,11,0.16)" stroke="#f59e0b" strokeWidth="2.4" />
          <line x1="478" y1="64" x2="478" y2="215" stroke="#4edea3" strokeDasharray="4 4" />
          <text x="488" y="88" fill="#4edea3" fontSize="11" fontFamily="JetBrains Mono">f₀ = 1/(2π√LC)</text>
        </svg>
      );
    case 'wheatstone-bridge':
    default:
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Wheatstone Bridge Diamond Schematic">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* Diamond */}
          <polygon points="320,44 170,140 320,236 470,140" fill="none" stroke="#f59e0b" strokeWidth="2" />
          <line x1="170" y1="140" x2="470" y2="140" stroke="#38bdf8" strokeWidth="1.8" />
          <circle cx="320" cy="140" r="18" fill="#161b2a" stroke="#38bdf8" strokeWidth="1.8" />
          <text x="314" y="145" fill="#7dd3fc" fontSize="12" fontFamily="JetBrains Mono">G</text>
          <text x="215" y="88" fill="#fbbf24" fontSize="12" fontFamily="JetBrains Mono">R₁</text>
          <text x="415" y="88" fill="#fbbf24" fontSize="12" fontFamily="JetBrains Mono">R₂</text>
          <text x="215" y="202" fill="#4edea3" fontSize="12" fontFamily="JetBrains Mono">R₃ (Var)</text>
          <text x="412" y="202" fill="#c084fc" fontSize="12" fontFamily="JetBrains Mono">R_x (?)</text>
          <text x="494" y="144" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">NULL: I_g = 0</text>
          <text x="494" y="164" fill="#cbd5e1" fontSize="11" fontFamily="JetBrains Mono">R_x = R₃(R₂/R₁)</text>
        </svg>
      );
  }
};
