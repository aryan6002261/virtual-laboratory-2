import React from 'react';

export const ProgrammingSchematic: React.FC<{ expId: string }> = ({ expId }) => {
  switch (expId) {
    case 'bubble-sort':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Bubble Sort Adjacent Inversion Comparison">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {[42, 78, 35, 92, 60, 108].map((h, i) => {
            const x = 110 + i * 74;
            const highlight = i === 1 || i === 2;
            const sorted = i === 5;
            return (
              <g key={i}>
                <rect x={x} y={205 - h * 1.2} width="52" height={h * 1.2} rx="3" fill={sorted ? 'rgba(16,185,129,0.28)' : highlight ? 'rgba(245,158,11,0.3)' : 'rgba(139,92,246,0.25)'} stroke={sorted ? '#10b981' : highlight ? '#f59e0b' : '#8b5cf6'} strokeWidth="1.6" />
                <text x={x + 17} y={196 - h * 1.2} fill="#dee2f6" fontSize="12" fontFamily="JetBrains Mono">{h}</text>
              </g>
            );
          })}
          <path d="M 210 222 Q 247 248 284 222" fill="none" stroke="#f59e0b" strokeWidth="2" className="svg-flow-line" />
          <text x="180" y="254" fill="#fbbf24" fontSize="11" fontFamily="JetBrains Mono">SWAP INVERTED PAIR (78 &gt; 35)</text>
          <text x="462" y="48" fill="#6ffbbe" fontSize="11" fontFamily="JetBrains Mono">SORTED TAIL</text>
        </svg>
      );
    case 'searching':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Binary Search Interval Halving">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {[12, 19, 27, 34, 48, 56, 71, 88].map((val, i) => {
            const x = 68 + i * 64;
            const isMid = i === 3;
            const discarded = i < 3;
            return (
              <g key={val}>
                <rect x={x} y="105" width="56" height="52" rx="3" fill={isMid ? 'rgba(139,92,246,0.35)' : discarded ? 'rgba(100,116,139,0.12)' : 'rgba(56,189,248,0.18)'} stroke={isMid ? '#c084fc' : discarded ? '#475569' : '#38bdf8'} strokeWidth="1.6" />
                <text x={x + 18} y="137" fill={discarded ? '#64748b' : '#dee2f6'} fontSize="14" fontFamily="JetBrains Mono">{val}</text>
                <text x={x + 24} y="176" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">{i}</text>
              </g>
            );
          })}
          <text x="276" y="88" fill="#d8b4fe" fontSize="11" fontFamily="JetBrains Mono">MID = 3</text>
          <text x="336" y="88" fill="#7dd3fc" fontSize="11" fontFamily="JetBrains Mono">LOW</text>
          <text x="526" y="88" fill="#7dd3fc" fontSize="11" fontFamily="JetBrains Mono">HIGH</text>
          <text x="150" y="226" fill="#94a3b8" fontSize="12" fontFamily="JetBrains Mono">TARGET &gt; arr[mid]  ⟹  DISCARD LEFT HALF IN O(1)  ·  TOTAL O(log₂ n)</text>
        </svg>
      );
    case 'stack':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="LIFO Stack Frame Cylinder">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          <polyline points="220,58 220,235 370,235 370,58" fill="none" stroke="#8b5cf6" strokeWidth="2.4" />
          {[
            { val: 'FRAME 1: main()', y: 192 },
            { val: 'FRAME 2: parse()', y: 148 },
            { val: 'FRAME 3: eval()', y: 104 },
          ].map((f, idx) => (
            <g key={f.val}>
              <rect x="232" y={f.y} width="126" height="36" rx="3" fill={idx === 2 ? 'rgba(139,92,246,0.34)' : '#161b2a'} stroke="#a78bfa" strokeWidth="1.5" />
              <text x="242" y={f.y + 22} fill="#dee2f6" fontSize="11" fontFamily="JetBrains Mono">{f.val}</text>
            </g>
          ))}
          <line x1="125" y1="122" x2="225" y2="122" stroke="#4edea3" strokeWidth="2" />
          <text x="72" y="126" fill="#6ffbbe" fontSize="12" fontFamily="JetBrains Mono">TOP →</text>
          <text x="405" y="110" fill="#fbbf24" fontSize="12" fontFamily="JetBrains Mono">PUSH / POP @ TOP</text>
          <text x="405" y="136" fill="#94a3b8" fontSize="11" fontFamily="Plus Jakarta Sans">Last-In, First-Out (O(1))</text>
        </svg>
      );
    case 'queue':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Circular Modulo Ring Queue">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          <circle cx="240" cy="140" r="82" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((slot) => {
            const ang = (slot / 8) * Math.PI * 2 - Math.PI / 2;
            const x = 240 + Math.cos(ang) * 82;
            const y = 140 + Math.sin(ang) * 82;
            const filled = slot >= 2 && slot <= 5;
            return (
              <g key={slot}>
                <circle cx={x} cy={y} r="20" fill={filled ? 'rgba(139,92,246,0.32)' : '#161b2a'} stroke={slot === 2 ? '#4edea3' : slot === 5 ? '#f59e0b' : '#8b5cf6'} strokeWidth="1.8" />
                <text x={x - 4} y={y + 4} fill="#dee2f6" fontSize="11" fontFamily="JetBrains Mono">{slot}</text>
              </g>
            );
          })}
          <text x="382" y="102" fill="#6ffbbe" fontSize="12" fontFamily="JetBrains Mono">FRONT = 2 (Dequeue)</text>
          <text x="382" y="134" fill="#fbbf24" fontSize="12" fontFamily="JetBrains Mono">REAR = 5 (Enqueue)</text>
          <text x="382" y="172" fill="#d8b4fe" fontSize="12" fontFamily="JetBrains Mono">next = (idx + 1) mod 8</text>
        </svg>
      );
    case 'recursion':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Recursion Call Tree and Tower of Hanoi">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          {/* Tree */}
          <line x1="220" y1="68" x2="135" y2="138" stroke="#8b5cf6" strokeWidth="1.8" />
          <line x1="220" y1="68" x2="305" y2="138" stroke="#8b5cf6" strokeWidth="1.8" />
          <line x1="135" y1="158" x2="90" y2="215" stroke="#4edea3" strokeWidth="1.6" />
          <line x1="135" y1="158" x2="180" y2="215" stroke="#4edea3" strokeWidth="1.6" />
          <rect x="165" y="42" width="110" height="32" rx="4" fill="#161b2a" stroke="#a78bfa" strokeWidth="1.6" />
          <text x="178" y="62" fill="#dee2f6" fontSize="11" fontFamily="JetBrains Mono">hanoi(3,A,B,C)</text>
          <rect x="80" y="132" width="110" height="30" rx="4" fill="#161b2a" stroke="#8b5cf6" strokeWidth="1.5" />
          <text x="92" y="151" fill="#cbd5e1" fontSize="11" fontFamily="JetBrains Mono">hanoi(2,A,C,B)</text>
          <rect x="250" y="132" width="110" height="30" rx="4" fill="#161b2a" stroke="#8b5cf6" strokeWidth="1.5" />
          <text x="262" y="151" fill="#cbd5e1" fontSize="11" fontFamily="JetBrains Mono">hanoi(2,B,A,C)</text>
          <rect x="52" y="210" width="76" height="26" rx="4" fill="rgba(16,185,129,0.22)" stroke="#10b981" strokeWidth="1.4" />
          <text x="64" y="227" fill="#6ffbbe" fontSize="10" fontFamily="JetBrains Mono">BASE n=1</text>
          <text x="410" y="116" fill="#d8b4fe" fontSize="13" fontFamily="JetBrains Mono">T(n) = 2T(n−1) + 1</text>
          <text x="410" y="146" fill="#6ffbbe" fontSize="13" fontFamily="JetBrains Mono">Moves = 2ⁿ − 1</text>
        </svg>
      );
    case 'binary-search-tree':
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Binary Search Tree Invariant L < P < R">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          <line x1="250" y1="68" x2="155" y2="132" stroke="#8b5cf6" strokeWidth="1.8" />
          <line x1="250" y1="68" x2="345" y2="132" stroke="#8b5cf6" strokeWidth="1.8" />
          <line x1="155" y1="132" x2="105" y2="200" stroke="#38bdf8" strokeWidth="1.6" />
          <line x1="155" y1="132" x2="205" y2="200" stroke="#38bdf8" strokeWidth="1.6" />
          <line x1="345" y1="132" x2="395" y2="200" stroke="#38bdf8" strokeWidth="1.6" />
          {[
            [250, 68, 50],
            [155, 132, 30],
            [345, 132, 70],
            [105, 200, 20],
            [205, 200, 40],
            [395, 200, 85],
          ].map(([cx, cy, val]) => (
            <g key={val}>
              <circle cx={cx} cy={cy} r="20" fill="#161b2a" stroke="#a78bfa" strokeWidth="2" />
              <text x={cx - 9} y={cy + 5} fill="#dee2f6" fontSize="13" fontFamily="JetBrains Mono">{val}</text>
            </g>
          ))}
          <text x="445" y="106" fill="#d8b4fe" fontSize="12" fontFamily="JetBrains Mono">INVARIANT: L &lt; P &lt; R</text>
          <text x="445" y="138" fill="#6ffbbe" fontSize="11" fontFamily="JetBrains Mono">Inorder: 20,30,40,50,70,85</text>
          <text x="445" y="168" fill="#94a3b8" fontSize="11" fontFamily="Plus Jakarta Sans">Avg Search Depth: O(log₂ n)</text>
        </svg>
      );
    case 'dijkstra-graph':
    default:
      return (
        <svg viewBox="0 0 640 280" className="w-full h-auto" role="img" aria-label="Dijkstra Shortest Path Edge Relaxation">
          <rect x="20" y="20" width="600" height="240" fill="#090e1c" rx="4" />
          <line x1="115" y1="140" x2="255" y2="75" stroke="#10b981" strokeWidth="2.6" className="svg-flow-line" />
          <line x1="115" y1="140" x2="255" y2="205" stroke="#475569" strokeWidth="1.8" />
          <line x1="255" y1="75" x2="415" y2="140" stroke="#10b981" strokeWidth="2.6" className="svg-flow-line" />
          <line x1="255" y1="205" x2="415" y2="140" stroke="#475569" strokeWidth="1.8" />
          <line x1="255" y1="75" x2="255" y2="205" stroke="#475569" strokeWidth="1.6" />
          {[
            [115, 140, 'S (0)'],
            [255, 75, 'B (4)'],
            [255, 205, 'C (7)'],
            [415, 140, 'T (9)'],
          ].map(([cx, cy, label]) => (
            <g key={String(label)}>
              <circle cx={Number(cx)} cy={Number(cy)} r="24" fill="#161b2a" stroke="#a78bfa" strokeWidth="2" />
              <text x={Number(cx) - 18} y={Number(cy) + 4} fill="#dee2f6" fontSize="11" fontFamily="JetBrains Mono">{label}</text>
            </g>
          ))}
          <text x="172" y="96" fill="#6ffbbe" fontSize="11" fontFamily="JetBrains Mono">w=4</text>
          <text x="335" y="96" fill="#6ffbbe" fontSize="11" fontFamily="JetBrains Mono">w=5</text>
          <text x="172" y="192" fill="#94a3b8" fontSize="11" fontFamily="JetBrains Mono">w=7</text>
          <text x="462" y="128" fill="#d8b4fe" fontSize="11" fontFamily="JetBrains Mono">RELAXATION:</text>
          <text x="462" y="150" fill="#6ffbbe" fontSize="11" fontFamily="JetBrains Mono">d[v] = min(d[v], d[u]+w)</text>
        </svg>
      );
  }
};
