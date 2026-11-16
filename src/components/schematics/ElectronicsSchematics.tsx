import React from 'react';

export const ElectronicsSchematic: React.FC<{ expId: string }> = ({ expId }) => {
  switch (expId) {
    case 'logic-gates':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Boolean Logic Gate Primitives">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* AND */}
          <path d="M 70 60 L 110 60 A 25 25 0 0 1 110 110 L 70 110 Z" fill="#161b2a" stroke="#10b981" strokeWidth="1.8" />
          <line x1="44" y1="72" x2="70" y2="72" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="44" y1="98" x2="70" y2="98" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="135" y1="85" x2="165" y2="85" stroke="#10b981" strokeWidth="1.8" className="svg-flow-line" />
          <text x="76" y="132" fill="#4edea3" fontSize="11" fontFamily="JetBrains Mono">AND (A·B)</text>
          {/* OR */}
          <path d="M 245 60 Q 265 85 245 110 Q 290 110 315 85 Q 290 60 245 60 Z" fill="#161b2a" stroke="#38bdf8" strokeWidth="1.8" />
          <line x1="215" y1="72" x2="253" y2="72" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="215" y1="98" x2="253" y2="98" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="315" y1="85" x2="345" y2="85" stroke="#38bdf8" strokeWidth="1.8" className="svg-flow-line" />
          <text x="248" y="132" fill="#7dd3fc" fontSize="11" fontFamily="JetBrains Mono">OR (A+B)</text>
          {/* XOR */}
          <path d="M 412 60 Q 432 85 412 110" fill="none" stroke="#a855f7" strokeWidth="1.8" />
          <path d="M 422 60 Q 442 85 422 110 Q 467 110 492 85 Q 467 60 422 60 Z" fill="#161b2a" stroke="#a855f7" strokeWidth="1.8" />
          <line x1="492" y1="85" x2="522" y2="85" stroke="#a855f7" strokeWidth="1.8" className="svg-flow-line" />
          <text x="422" y="132" fill="#d8b4fe" fontSize="11" fontFamily="JetBrains Mono">XOR (A⊕B)</text>
          {/* Universal NAND note */}
          <rect x="70" y="164" width="500" height="66" rx="4" fill="#161b2a" stroke="#334155" strokeWidth="1.2" />
          <text x="90" y="192" fill="#6ffbbe" fontSize="12" fontFamily="JetBrains Mono">DE MORGAN UNIVERSAL SYNTHESIS: ¬(A·B) = ¬A + ¬B</text>
          <text x="90" y="214" fill="#94a3b8" fontSize="11" fontFamily="Plus Jakarta Sans">Every Boolean truth table can be synthesized purely from NAND or NOR gates.</text>
        </svg>
      );
    case 'half-adder':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Half Adder XOR and AND Gate Schematic">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          <text x="64" y="88" fill="#cbd5e1" fontSize="12" fontFamily="JetBrains Mono">A</text>
          <text x="64" y="182" fill="#cbd5e1" fontSize="12" fontFamily="JetBrains Mono">B</text>
          {/* Signal wires */}
          <line x1="88" y1="84" x2="265" y2="84" stroke="#10b981" strokeWidth="2" className="svg-flow-line" />
          <line x1="88" y1="178" x2="265" y2="178" stroke="#38bdf8" strokeWidth="2" className="svg-flow-line" />
          <polyline points="150,84 150,158 265,158" fill="none" stroke="#10b981" strokeWidth="1.8" />
          <polyline points="185,178 185,104 265,104" fill="none" stroke="#38bdf8" strokeWidth="1.8" />
          {/* XOR Box */}
          <rect x="265" y="64" width="120" height="58" rx="4" fill="#161b2a" stroke="#10b981" strokeWidth="1.8" />
          <text x="288" y="98" fill="#6ffbbe" fontSize="13" fontFamily="JetBrains Mono">XOR (⊕)</text>
          <line x1="385" y1="93" x2="480" y2="93" stroke="#10b981" strokeWidth="2.2" />
          <text x="492" y="98" fill="#4edea3" fontSize="12" fontFamily="JetBrains Mono">SUM = A ⊕ B</text>
          {/* AND Box */}
          <rect x="265" y="146" width="120" height="58" rx="4" fill="#161b2a" stroke="#f59e0b" strokeWidth="1.8" />
          <text x="292" y="180" fill="#fbbf24" fontSize="13" fontFamily="JetBrains Mono">AND (·)</text>
          <line x1="385" y1="175" x2="480" y2="175" stroke="#f59e0b" strokeWidth="2.2" />
          <text x="492" y="180" fill="#fbbf24" fontSize="12" fontFamily="JetBrains Mono">CARRY = A · B</text>
        </svg>
      );
    case 'digital-circuits':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="4:1 Multiplexer Data Selector Block">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* MUX trapezoid */}
          <polygon points="240,46 390,82 390,198 240,234" fill="#161b2a" stroke="#10b981" strokeWidth="2" />
          <text x="275" y="145" fill="#6ffbbe" fontSize="14" fontFamily="JetBrains Mono" fontWeight="600">4:1 MUX</text>
          {/* 4 Data inputs */}
          {[76, 118, 160, 202].map((y, idx) => (
            <g key={y}>
              <line x1="120" y1={y} x2="240" y2={y} stroke={idx === 2 ? '#10b981' : '#475569'} strokeWidth={idx === 2 ? '2.4' : '1.5'} className={idx === 2 ? 'svg-flow-line' : ''} />
              <text x="86" y={y + 4} fill={idx === 2 ? '#6ffbbe' : '#94a3b8'} fontSize="12" fontFamily="JetBrains Mono">D{idx}</text>
            </g>
          ))}
          {/* Output */}
          <line x1="390" y1="140" x2="520" y2="140" stroke="#10b981" strokeWidth="2.5" className="svg-flow-line" />
          <text x="530" y="145" fill="#6ffbbe" fontSize="12" fontFamily="JetBrains Mono">Y = D_sel</text>
          {/* Select lines */}
          <line x1="295" y1="221" x2="295" y2="255" stroke="#fbbf24" strokeWidth="1.8" />
          <line x1="335" y1="211" x2="335" y2="255" stroke="#fbbf24" strokeWidth="1.8" />
          <text x="260" y="268" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">SELECT S₁, S₀</text>
        </svg>
      );
    case 'flip-flops':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Edge-Triggered JK Flip-Flop and Clock Timing">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* IC Block */}
          <rect x="95" y="64" width="160" height="150" rx="4" fill="#161b2a" stroke="#10b981" strokeWidth="2" />
          <line x1="45" y1="95" x2="95" y2="95" stroke="#4edea3" strokeWidth="2" />
          <text x="108" y="100" fill="#6ffbbe" fontSize="12" fontFamily="JetBrains Mono">J / D</text>
          <line x1="45" y1="140" x2="95" y2="140" stroke="#f59e0b" strokeWidth="2" />
          <polygon points="95,132 108,140 95,148" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="114" y="144" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">↑ CLK</text>
          <line x1="45" y1="185" x2="95" y2="185" stroke="#38bdf8" strokeWidth="2" />
          <text x="108" y="190" fill="#7dd3fc" fontSize="12" fontFamily="JetBrains Mono">K</text>
          <line x1="255" y1="95" x2="305" y2="95" stroke="#10b981" strokeWidth="2" />
          <text x="228" y="100" fill="#6ffbbe" fontSize="12" fontFamily="JetBrains Mono">Q</text>
          <line x1="255" y1="185" x2="305" y2="185" stroke="#94a3b8" strokeWidth="2" />
          <text x="226" y="190" fill="#94a3b8" fontSize="12" fontFamily="JetBrains Mono">Q̄</text>
          {/* Timing waveform */}
          <text x="340" y="70" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">CLK</text>
          <polyline points="380,92 415,92 415,62 455,62 455,92 495,92 495,62 535,62 535,92 585,92" fill="none" stroke="#f59e0b" strokeWidth="2" />
          <text x="340" y="165" fill="#4edea3" fontSize="11" fontFamily="JetBrains Mono">Q</text>
          <polyline points="380,180 415,180 415,146 495,146 495,180 585,180" fill="none" stroke="#10b981" strokeWidth="2.2" />
          <line x1="415" y1="60" x2="415" y2="195" stroke="#475569" strokeDasharray="3 3" />
          <line x1="495" y1="60" x2="495" y2="195" stroke="#475569" strokeDasharray="3 3" />
          <text x="380" y="218" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">LATCHES ON RISING ↑ CLOCK EDGE</text>
        </svg>
      );
    case 'binary-logic':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="8-Bit Positional Weighting and Two's Complement">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {[128, 64, 32, 16, 8, 4, 2, 1].map((w, i) => {
            const x = 52 + i * 68;
            const isMsb = i === 0;
            const active = [1, 0, 1, 1, 0, 1, 0, 1][i];
            return (
              <g key={w}>
                <rect x={x} y="75" width="56" height="64" rx="4" fill={active ? 'rgba(16,185,129,0.2)' : '#161b2a'} stroke={isMsb ? '#f59e0b' : '#10b981'} strokeWidth="1.6" />
                <text x={x + 22} y="116" fill="#dee2f6" fontSize="20" fontFamily="JetBrains Mono" fontWeight="700">{active}</text>
                <text x={x + 14} y="62" fill={isMsb ? '#fbbf24' : '#94a3b8'} fontSize="11" fontFamily="JetBrains Mono">{isMsb ? '±128' : `2^${7 - i}`}</text>
                <text x={x + 18} y="160" fill="#64748b" fontSize="11" fontFamily="JetBrains Mono">{w}</text>
              </g>
            );
          })}
          <text x="54" y="202" fill="#6ffbbe" fontSize="13" fontFamily="JetBrains Mono">HEX: 0xB5  ·  OCT: 265₈  ·  UNSIGNED: 181  ·  TWO'S COMP: −75</text>
          <text x="54" y="228" fill="#94a3b8" fontSize="11" fontFamily="Plus Jakarta Sans">Two's Complement negation flips all bits (~X) and adds 1, eliminating duplicate zero.</text>
        </svg>
      );
    case 'diode-characteristics':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="PN Junction Depletion Layer and Shockley Curve">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* Semiconductor cross section */}
          <rect x="55" y="75" width="105" height="90" fill="rgba(239,68,68,0.16)" stroke="#f87171" strokeWidth="1.5" />
          <rect x="160" y="75" width="38" height="90" fill="rgba(148,163,184,0.16)" stroke="#64748b" strokeDasharray="3 3" />
          <rect x="198" y="75" width="105" height="90" fill="rgba(56,189,248,0.16)" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="95" y="124" fill="#fca5a5" fontSize="13" fontFamily="JetBrains Mono">P (+)</text>
          <text x="235" y="124" fill="#7dd3fc" fontSize="13" fontFamily="JetBrains Mono">N (−)</text>
          <text x="122" y="190" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">DEPLETION BARRIER (~0.7 V)</text>
          {/* I-V Curve */}
          <line x1="350" y1="175" x2="590" y2="175" stroke="#64748b" strokeWidth="1.5" />
          <line x1="470" y1="45" x2="470" y2="235" stroke="#64748b" strokeWidth="1.5" />
          <path d="M 365 225 L 385 177 L 505 174 Q 528 172 542 56" fill="none" stroke="#10b981" strokeWidth="2.5" />
          <text x="515" y="192" fill="#4edea3" fontSize="11" fontFamily="JetBrains Mono">V_k ≈ 0.7V</text>
          <text x="355" y="164" fill="#fca5a5" fontSize="11" fontFamily="JetBrains Mono">Breakdown</text>
        </svg>
      );
    case 'operational-amplifier':
    default:
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Inverting Operational Amplifier with Negative Feedback">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* Feedback loop */}
          <polyline points="205,120 205,56 445,56 445,140" fill="none" stroke="#10b981" strokeWidth="1.8" className="svg-flow-line" />
          <rect x="295" y="44" width="60" height="24" fill="#161b2a" stroke="#10b981" strokeWidth="1.5" />
          <text x="315" y="61" fill="#6ffbbe" fontSize="11" fontFamily="JetBrains Mono">R_f</text>
          {/* Op-Amp Triangle */}
          <polygon points="275,92 275,188 405,140" fill="#161b2a" stroke="#38bdf8" strokeWidth="2" />
          <text x="288" y="126" fill="#f87171" fontSize="14" fontFamily="JetBrains Mono">−</text>
          <text x="288" y="166" fill="#4edea3" fontSize="14" fontFamily="JetBrains Mono">+</text>
          {/* Inputs & Output */}
          <line x1="70" y1="120" x2="275" y2="120" stroke="#f59e0b" strokeWidth="2" />
          <rect x="115" y="108" width="56" height="24" fill="#161b2a" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="130" y="125" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">R_in</text>
          <text x="42" y="125" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">V_in</text>
          {/* Ground on + */}
          <polyline points="275,160 225,160 225,195" fill="none" stroke="#64748b" strokeWidth="1.8" />
          <line x1="210" y1="195" x2="240" y2="195" stroke="#64748b" strokeWidth="2" />
          <line x1="216" y1="202" x2="234" y2="202" stroke="#64748b" strokeWidth="2" />
          {/* Output */}
          <line x1="405" y1="140" x2="545" y2="140" stroke="#38bdf8" strokeWidth="2.2" />
          <text x="470" y="130" fill="#7dd3fc" fontSize="12" fontFamily="JetBrains Mono">V_out = −(R_f/R_in)V_in</text>
          <text x="200" y="236" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">VIRTUAL GROUND V₋ ≈ V₊ = 0 V</text>
        </svg>
      );
  }
};
