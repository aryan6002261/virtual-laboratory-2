import React, { useEffect, useState } from 'react';
import { ParamSlider, SimShell, useHiDpiCanvas } from './SimShared';
import { TelemetryMetric } from '../../types/lab';
import { labAudio } from '../../utils/audio';

interface Props {
  expId: string;
  onRecord: (values: Record<string, string>) => void;
}

interface BstNode {
  val: number;
  left: BstNode | null;
  right: BstNode | null;
}

function insertBst(root: BstNode | null, val: number): BstNode {
  if (!root) return { val, left: null, right: null };
  if (val < root.val) return { ...root, left: insertBst(root.left, val) };
  if (val > root.val) return { ...root, right: insertBst(root.right, val) };
  return root;
}

function bstHeight(node: BstNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(bstHeight(node.left), bstHeight(node.right));
}

function bstCount(node: BstNode | null): number {
  if (!node) return 0;
  return 1 + bstCount(node.left) + bstCount(node.right);
}

const GRAPH_NODES = [
  { id: 'S', x: 0.14, y: 0.5 },
  { id: 'A', x: 0.36, y: 0.22 },
  { id: 'B', x: 0.36, y: 0.78 },
  { id: 'C', x: 0.62, y: 0.22 },
  { id: 'D', x: 0.62, y: 0.78 },
  { id: 'T', x: 0.86, y: 0.5 },
];
const GRAPH_EDGES = [
  { u: 'S', v: 'A', w: 4 },
  { u: 'S', v: 'B', w: 2 },
  { u: 'A', v: 'C', w: 5 },
  { u: 'B', v: 'A', w: 1 },
  { u: 'B', v: 'D', w: 7 },
  { u: 'C', v: 'T', w: 3 },
  { u: 'D', v: 'C', w: 1 },
  { u: 'D', v: 'T', w: 4 },
];

export const ProgrammingSim: React.FC<Props> = ({ expId, onRecord }) => {
  // 1. Bubble Sort
  const [sortArr, setSortArr] = useState<number[]>([64, 34, 25, 12, 22, 11, 90, 48]);
  const [sortState, setSortState] = useState({ i: 0, j: 0, comps: 0, swaps: 0, done: false });
  const [sortAuto, setSortAuto] = useState(false);

  // 2. Searching
  const [searchMode, setSearchMode] = useState<'binary' | 'linear'>('binary');
  const [searchTarget, setSearchTarget] = useState(48);
  const searchArr = [11, 17, 23, 29, 34, 41, 48, 56, 63, 72, 85, 94];
  const [searchStep, setSearchStep] = useState({ low: 0, high: 11, mid: 5, linIdx: 0, probes: 0, found: -1, finished: false });

  // 3. Stack
  const [stackItems, setStackItems] = useState<number[]>([14, 28, 42]);
  const [stackInput, setStackInput] = useState(64);
  const [stackStatus, setStackStatus] = useState('READY');

  // 4. Circular Queue
  const Q_CAP = 8;
  const [qSlots, setQSlots] = useState<(number | null)[]>([12, 25, 38, null, null, null, null, null]);
  const [qFront, setQFront] = useState(0);
  const [qRear, setQRear] = useState(2);
  const [qCount, setQCount] = useState(3);
  const [qInput, setQInput] = useState(50);

  // 5. Recursion / Tower of Hanoi
  const [hanoiDisks, setHanoiDisks] = useState(3);
  const [hanoiMoves, setHanoiMoves] = useState<{ from: number; to: number; disk: number; depth: number }[]>([]);
  const [hanoiIdx, setHanoiIdx] = useState(0);

  // 6. BST
  const [bstRoot, setBstRoot] = useState<BstNode | null>(() => {
    let r: BstNode | null = null;
    [50, 30, 70, 20, 40, 60, 85].forEach((v) => { r = insertBst(r, v); });
    return r;
  });
  const [bstInput, setBstInput] = useState(45);
  const [bstHighlight, setBstHighlight] = useState<number | null>(null);
  const [bstOutput, setBstOutput] = useState<number[]>([]);

  // 7. Dijkstra
  const [djStep, setDjStep] = useState(0);

  // Generate Hanoi moves whenever disk count changes
  useEffect(() => {
    const moves: { from: number; to: number; disk: number; depth: number }[] = [];
    const solve = (n: number, f: number, a: number, t: number, d: number) => {
      if (n === 0) return;
      solve(n - 1, f, t, a, d + 1);
      moves.push({ from: f, to: t, disk: n, depth: d });
      solve(n - 1, a, f, t, d + 1);
    };
    solve(hanoiDisks, 0, 1, 2, 1);
    setHanoiMoves(moves);
    setHanoiIdx(0);
  }, [hanoiDisks]);

  // Bubble sort auto-stepper
  const stepBubbleSort = () => {
    if (sortState.done) return;
    const arr = [...sortArr];
    let { i, j, comps, swaps } = sortState;
    const n = arr.length;
    if (i >= n - 1) {
      setSortState({ ...sortState, done: true });
      setSortAuto(false);
      return;
    }
    comps++;
    if (arr[j] > arr[j + 1]) {
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      swaps++;
      setSortArr(arr);
      labAudio.playTelemetryTone(220 + arr[j + 1] * 5, 0.05);
    }
    j++;
    if (j >= n - 1 - i) {
      j = 0;
      i++;
    }
    const done = i >= n - 1;
    if (done) setSortAuto(false);
    setSortState({ i, j, comps, swaps, done });
  };

  useEffect(() => {
    if (!sortAuto) return;
    const id = setInterval(stepBubbleSort, 260);
    return () => clearInterval(id);
  });

  // Compute Hanoi peg states up to hanoiIdx
  const pegs: number[][] = [[], [], []];
  for (let d = hanoiDisks; d >= 1; d--) pegs[0].push(d);
  for (let k = 0; k < hanoiIdx && k < hanoiMoves.length; k++) {
    const m = hanoiMoves[k];
    const popped = pegs[m.from].pop();
    if (popped !== undefined) pegs[m.to].push(popped);
  }

  // Compute Dijkstra steps snapshot
  const djSnapshots = (() => {
    const dist: Record<string, number> = { S: 0, A: Infinity, B: Infinity, C: Infinity, D: Infinity, T: Infinity };
    const prev: Record<string, string | null> = { S: null, A: null, B: null, C: null, D: null, T: null };
    const settled = new Set<string>();
    const history: { dist: Record<string, number>; settled: string[]; current: string | null; prev: Record<string, string | null> }[] = [
      { dist: { ...dist }, settled: [], current: null, prev: { ...prev } },
    ];
    for (let iter = 0; iter < GRAPH_NODES.length; iter++) {
      let best: string | null = null;
      let bestD = Infinity;
      GRAPH_NODES.forEach((n) => {
        if (!settled.has(n.id) && dist[n.id] < bestD) {
          bestD = dist[n.id];
          best = n.id;
        }
      });
      if (!best) break;
      settled.add(best);
      GRAPH_EDGES.filter((e) => e.u === best).forEach((e) => {
        if (dist[best!] + e.w < dist[e.v]) {
          dist[e.v] = dist[best!] + e.w;
          prev[e.v] = best;
        }
      });
      history.push({ dist: { ...dist }, settled: Array.from(settled), current: best, prev: { ...prev } });
    }
    return history;
  })();
  const djSnap = djSnapshots[Math.min(djStep, djSnapshots.length - 1)];

  const canvasRef = useHiDpiCanvas(
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);

      if (expId === 'bubble-sort') {
        const barW = (w - 80) / sortArr.length;
        const maxV = Math.max(...sortArr, 100);
        sortArr.forEach((v, idx) => {
          const bh = (v / maxV) * (h - 90);
          const x = 40 + idx * barW + 4;
          const y = h - 42 - bh;
          const isSorted = sortState.done || idx >= sortArr.length - sortState.i;
          const isComp = !sortState.done && (idx === sortState.j || idx === sortState.j + 1);
          ctx.fillStyle = isSorted ? 'rgba(16,185,129,0.45)' : isComp ? 'rgba(245,158,11,0.55)' : 'rgba(139,92,246,0.4)';
          ctx.strokeStyle = isSorted ? '#10b981' : isComp ? '#fbbf24' : '#8b5cf6';
          ctx.lineWidth = 2;
          ctx.fillRect(x, y, barW - 8, bh);
          ctx.strokeRect(x, y, barW - 8, bh);
          ctx.fillStyle = '#dee2f6';
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillText(`${v}`, x + (barW - 8) / 2 - 8, y - 8);
        });
      } else if (expId === 'searching') {
        const cellW = (w - 60) / searchArr.length;
        searchArr.forEach((val, idx) => {
          const x = 30 + idx * cellW + 2;
          const y = h / 2 - 26;
          const inWindow = searchMode === 'binary' ? idx >= searchStep.low && idx <= searchStep.high : idx >= searchStep.linIdx;
          const isMid = searchMode === 'binary' ? idx === searchStep.mid : idx === searchStep.linIdx;
          const isFound = idx === searchStep.found;
          ctx.fillStyle = isFound ? 'rgba(16,185,129,0.45)' : isMid && !searchStep.finished ? 'rgba(245,158,11,0.4)' : inWindow ? 'rgba(139,92,246,0.22)' : 'rgba(51,65,85,0.2)';
          ctx.strokeStyle = isFound ? '#10b981' : isMid && !searchStep.finished ? '#fbbf24' : inWindow ? '#8b5cf6' : '#334155';
          ctx.lineWidth = 1.8;
          ctx.fillRect(x, y, cellW - 4, 52);
          ctx.strokeRect(x, y, cellW - 4, 52);
          ctx.fillStyle = inWindow || isFound ? '#dee2f6' : '#64748b';
          ctx.font = '13px "JetBrains Mono", monospace';
          ctx.fillText(`${val}`, x + (cellW - 4) / 2 - 9, y + 31);
          ctx.fillStyle = '#64748b';
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText(`${idx}`, x + (cellW - 4) / 2 - 4, y + 70);
        });
      } else if (expId === 'stack') {
        const cx = w / 2, baseY = h - 38;
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx - 85, 36); ctx.lineTo(cx - 85, baseY); ctx.lineTo(cx + 85, baseY); ctx.lineTo(cx + 85, 36);
        ctx.stroke();

        stackItems.forEach((item, i) => {
          const y = baseY - 34 - i * 36;
          const isTop = i === stackItems.length - 1;
          ctx.fillStyle = isTop ? 'rgba(139,92,246,0.42)' : 'rgba(30,41,59,0.85)';
          ctx.strokeStyle = isTop ? '#4edea3' : '#a78bfa';
          ctx.lineWidth = 1.8;
          ctx.fillRect(cx - 72, y, 144, 30);
          ctx.strokeRect(cx - 72, y, 144, 30);
          ctx.fillStyle = '#dee2f6';
          ctx.font = '600 13px "JetBrains Mono", monospace';
          ctx.fillText(`${item}`, cx - 10, y + 20);
          if (isTop) {
            ctx.fillStyle = '#6ffbbe';
            ctx.fillText('← TOP', cx + 96, y + 20);
          }
        });
      } else if (expId === 'queue') {
        const cx = w / 2, cy = h / 2, rad = Math.min(w, h) * 0.34;
        for (let i = 0; i < Q_CAP; i++) {
          const ang = (i / Q_CAP) * Math.PI * 2 - Math.PI / 2;
          const sx = cx + Math.cos(ang) * rad;
          const sy = cy + Math.sin(ang) * rad;
          const val = qSlots[i];
          const isFront = i === qFront && qCount > 0;
          const isRear = i === qRear && qCount > 0;
          ctx.fillStyle = val !== null ? 'rgba(139,92,246,0.34)' : '#161b2a';
          ctx.strokeStyle = isFront ? '#10b981' : isRear ? '#f59e0b' : '#475569';
          ctx.lineWidth = isFront || isRear ? 2.5 : 1.5;
          ctx.beginPath(); ctx.arc(sx, sy, 26, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#dee2f6';
          ctx.font = '600 12px "JetBrains Mono", monospace';
          ctx.fillText(val !== null ? `${val}` : '—', sx - 8, sy + 4);
          ctx.fillStyle = '#89929b';
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText(`[${i}]`, sx - 9, sy + 40);
        }
        ctx.fillStyle = '#6ffbbe';
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillText(`FRONT=${qFront}`, cx - 32, cy - 8);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`REAR=${qRear}`, cx - 30, cy + 12);
      } else if (expId === 'recursion') {
        const pegXs = [w * 0.22, w * 0.5, w * 0.78];
        const baseY = h - 46;
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(40, baseY); ctx.lineTo(w - 40, baseY); ctx.stroke();
        pegXs.forEach((px, i) => {
          ctx.beginPath(); ctx.moveTo(px, baseY); ctx.lineTo(px, 66); ctx.stroke();
          ctx.fillStyle = '#94a3b8';
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillText(`PEG ${['A', 'B', 'C'][i]}`, px - 18, baseY + 22);
        });
        pegs.forEach((peg, pIdx) => {
          peg.forEach((disk, level) => {
            const dw = 26 + disk * 22;
            const dx = pegXs[pIdx] - dw / 2;
            const dy = baseY - 22 - level * 24;
            ctx.fillStyle = `hsl(${245 + disk * 25}, 72%, 56%)`;
            ctx.fillRect(dx, dy, dw, 20);
            ctx.fillStyle = '#ffffff';
            ctx.font = '11px "JetBrains Mono", monospace';
            ctx.fillText(`${disk}`, pegXs[pIdx] - 4, dy + 14);
          });
        });
      } else if (expId === 'binary-search-tree') {
        const drawNode = (node: BstNode | null, x: number, y: number, spread: number) => {
          if (!node) return;
          if (node.left) {
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - spread, y + 60); ctx.stroke();
            drawNode(node.left, x - spread, y + 60, spread * 0.54);
          }
          if (node.right) {
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + spread, y + 60); ctx.stroke();
            drawNode(node.right, x + spread, y + 60, spread * 0.54);
          }
          const isHi = node.val === bstHighlight;
          ctx.fillStyle = isHi ? 'rgba(16,185,129,0.45)' : '#161b2a';
          ctx.strokeStyle = isHi ? '#4edea3' : '#8b5cf6';
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#dee2f6';
          ctx.font = '600 12px "JetBrains Mono", monospace';
          ctx.fillText(`${node.val}`, x - 8, y + 4);
        };
        drawNode(bstRoot, w / 2, 46, w * 0.22);
      } else {
        // Dijkstra Graph
        const pathEdges = new Set<string>();
        let cur: string | null = 'T';
        while (cur && djSnap.prev[cur]) {
          pathEdges.add(`${djSnap.prev[cur]}->${cur}`);
          cur = djSnap.prev[cur];
        }
        GRAPH_EDGES.forEach((e) => {
          const uNode = GRAPH_NODES.find((n) => n.id === e.u)!;
          const vNode = GRAPH_NODES.find((n) => n.id === e.v)!;
          const x1 = uNode.x * w, y1 = uNode.y * h;
          const x2 = vNode.x * w, y2 = vNode.y * h;
          const onPath = pathEdges.has(`${e.u}->${e.v}`);
          ctx.strokeStyle = onPath ? '#10b981' : '#475569';
          ctx.lineWidth = onPath ? 3.2 : 1.6;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          ctx.fillStyle = onPath ? '#6ffbbe' : '#94a3b8';
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillText(`${e.w}`, (x1 + x2) / 2 - 4, (y1 + y2) / 2 - 6);
        });
        GRAPH_NODES.forEach((n) => {
          const nx = n.x * w, ny = n.y * h;
          const settled = djSnap.settled.includes(n.id);
          const isCur = djSnap.current === n.id;
          ctx.fillStyle = isCur ? 'rgba(245,158,11,0.38)' : settled ? 'rgba(16,185,129,0.28)' : '#161b2a';
          ctx.strokeStyle = isCur ? '#fbbf24' : settled ? '#10b981' : '#8b5cf6';
          ctx.lineWidth = 2.2;
          ctx.beginPath(); ctx.arc(nx, ny, 22, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          const dVal = djSnap.dist[n.id];
          ctx.fillStyle = '#dee2f6';
          ctx.font = '600 12px "JetBrains Mono", monospace';
          ctx.fillText(`${n.id}:${dVal === Infinity ? '∞' : dVal}`, nx - 16, ny + 4);
        });
      }
    },
    [
      expId, sortArr, sortState, searchMode, searchStep, stackItems, qSlots, qFront, qRear, qCount,
      hanoiDisks, hanoiIdx, bstRoot, bstHighlight, djStep,
    ],
    false
  );

  let telemetry: TelemetryMetric[] = [];
  let recordSnapshot: Record<string, string> = {};

  if (expId === 'bubble-sort') {
    telemetry = [
      { label: 'Comparisons', value: `${sortState.comps}` },
      { label: 'Swaps', value: `${sortState.swaps}` },
      { label: 'Pass Index', value: `${sortState.i + 1}` },
      { label: 'Status', value: sortState.done ? 'SORTED' : 'ACTIVE', tone: sortState.done ? 'nominal' : 'accent' },
    ];
    recordSnapshot = { 'Size n': `${sortArr.length}`, Preset: 'Custom', Comparisons: `${sortState.comps}`, Swaps: `${sortState.swaps}`, 'Pass Result': sortState.done ? 'Sorted' : 'In Progress' };
  } else if (expId === 'searching') {
    telemetry = [
      { label: 'Algorithm', value: searchMode.toUpperCase() },
      { label: 'Probes', value: `${searchStep.probes}`, tone: 'nominal' },
      { label: 'Window [L, H]', value: searchMode === 'binary' ? `[${searchStep.low}, ${searchStep.high}]` : `[${searchStep.linIdx}, 11]` },
      { label: 'Result', value: searchStep.found >= 0 ? `IDX ${searchStep.found}` : searchStep.finished ? 'NOT FOUND' : 'PROBING' },
    ];
    recordSnapshot = { Algorithm: searchMode, 'Array n': `${searchArr.length}`, Target: `${searchTarget}`, Probes: `${searchStep.probes}`, 'Result Index': `${searchStep.found}` };
  } else if (expId === 'stack') {
    telemetry = [
      { label: 'TOP Index', value: `${stackItems.length - 1}` },
      { label: 'Count / Cap', value: `${stackItems.length} / 8` },
      { label: 'Peek Value', value: stackItems.length ? `${stackItems[stackItems.length - 1]}` : 'EMPTY' },
      { label: 'Status', value: stackStatus, tone: stackStatus.includes('FLOW') ? 'alert' : 'nominal' },
    ];
    recordSnapshot = { Operation: stackStatus, Value: stackItems.length ? `${stackItems[stackItems.length - 1]}` : '—', 'TOP Index': `${stackItems.length - 1}`, Count: `${stackItems.length}`, Status: stackStatus };
  } else if (expId === 'queue') {
    telemetry = [
      { label: 'FRONT Index', value: `${qFront}`, tone: 'nominal' },
      { label: 'REAR Index', value: `${qRear}` },
      { label: 'Occupancy', value: `${qCount} / ${Q_CAP}` },
      { label: 'Modulo Next', value: `(${qRear}+1)%8 = ${(qRear + 1) % Q_CAP}` },
    ];
    recordSnapshot = { Operation: 'Circular Ring', Value: qCount ? `${qSlots[qFront]}` : '—', FRONT: `${qFront}`, REAR: `${qRear}`, Occupancy: `${qCount}/${Q_CAP}` };
  } else if (expId === 'recursion') {
    const curMove = hanoiMoves[hanoiIdx - 1];
    telemetry = [
      { label: 'Disks n', value: `${hanoiDisks}` },
      { label: 'Move Step', value: `${hanoiIdx} / ${hanoiMoves.length}`, tone: 'nominal' },
      { label: 'Call Depth', value: curMove ? `${curMove.depth}` : '0' },
      { label: 'Formula 2ⁿ−1', value: `${(1 << hanoiDisks) - 1}` },
    ];
    recordSnapshot = { 'Disks n': `${hanoiDisks}`, 'Step #': `${hanoiIdx}`, Move: curMove ? `D${curMove.disk}:${curMove.from}→${curMove.to}` : 'Init', 'Stack Depth': curMove ? `${curMove.depth}` : '0', 'Total 2ⁿ−1': `${hanoiMoves.length}` };
  } else if (expId === 'binary-search-tree') {
    telemetry = [
      { label: 'Node Count', value: `${bstCount(bstRoot)}`, tone: 'nominal' },
      { label: 'Tree Height', value: `${bstHeight(bstRoot)}` },
      { label: 'Last Traversal', value: bstOutput.length ? `${bstOutput.length} keys` : 'READY' },
      { label: 'Highlighted', value: bstHighlight !== null ? `${bstHighlight}` : '—' },
    ];
    recordSnapshot = { Operation: 'BST Inspect', 'Key / Mode': `${bstInput}`, Nodes: `${bstCount(bstRoot)}`, Height: `${bstHeight(bstRoot)}`, Output: bstOutput.join(',') || '—' };
  } else {
    telemetry = [
      { label: 'Step', value: `${djStep} / ${djSnapshots.length - 1}` },
      { label: 'Settled Node', value: djSnap.current ?? 'INIT', tone: 'nominal' },
      { label: 'd[T] Shortest', value: djSnap.dist.T === Infinity ? '∞' : `${djSnap.dist.T}` },
      { label: 'Settled Count', value: `${djSnap.settled.length} / 6` },
    ];
    recordSnapshot = { 'Source → Target': 'S → T', Step: `${djStep}`, 'Settled u': djSnap.current ?? 'INIT', 'Min Cost': djSnap.dist.T === Infinity ? '∞' : `${djSnap.dist.T}`, 'Shortest Path': djSnap.settled.join('→') };
  }

  const controls = (
    <div className="flex flex-col gap-3">
      {expId === 'bubble-sort' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setSortAuto((a) => !a)} className="py-2 text-xs font-medium rounded bg-[var(--lab-accent)] text-white cursor-pointer">{sortAuto ? 'Pause Auto' : 'Auto Sort'}</button>
            <button type="button" onClick={stepBubbleSort} className="py-2 text-xs font-medium rounded bg-white/5 border border-white/15 cursor-pointer">Step Once</button>
          </div>
          <button type="button" onClick={() => { setSortAuto(false); setSortArr([64, 34, 25, 12, 22, 11, 90, 48].sort(() => Math.random() - 0.5)); setSortState({ i: 0, j: 0, comps: 0, swaps: 0, done: false }); }} className="py-1.5 text-xs rounded bg-white/5 border border-white/10 cursor-pointer">Shuffle Array</button>
        </>
      )}
      {expId === 'searching' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {(['binary', 'linear'] as const).map((m) => (
              <button key={m} type="button" onClick={() => { setSearchMode(m); setSearchStep({ low: 0, high: 11, mid: 5, linIdx: 0, probes: 0, found: -1, finished: false }); }} className={`py-1.5 text-xs font-medium rounded border cursor-pointer capitalize ${searchMode === m ? 'bg-[var(--lab-accent)] text-white border-transparent' : 'bg-white/5 border-white/10 text-[#bfc7d2]'}`}>{m} Search</button>
            ))}
          </div>
          <ParamSlider label="Target Value" value={searchTarget} min={10} max={96} step={1} onChange={(v) => { setSearchTarget(v); setSearchStep({ low: 0, high: 11, mid: 5, linIdx: 0, probes: 0, found: -1, finished: false }); }} />
          <button type="button" onClick={() => {
            if (searchStep.finished) return;
            const nextProbes = searchStep.probes + 1;
            if (searchMode === 'binary') {
              const { low, high } = searchStep;
              if (low > high) { setSearchStep({ ...searchStep, finished: true }); return; }
              const mid = low + Math.floor((high - low) / 2);
              if (searchArr[mid] === searchTarget) {
                labAudio.playCorrectChord();
                setSearchStep({ ...searchStep, mid, probes: nextProbes, found: mid, finished: true });
              } else if (searchArr[mid] < searchTarget) {
                setSearchStep({ ...searchStep, low: mid + 1, mid, probes: nextProbes });
              } else {
                setSearchStep({ ...searchStep, high: mid - 1, mid, probes: nextProbes });
              }
            } else {
              const idx = searchStep.linIdx;
              if (searchArr[idx] === searchTarget) {
                labAudio.playCorrectChord();
                setSearchStep({ ...searchStep, probes: nextProbes, found: idx, finished: true });
              } else if (idx + 1 >= searchArr.length) {
                setSearchStep({ ...searchStep, probes: nextProbes, finished: true });
              } else {
                setSearchStep({ ...searchStep, linIdx: idx + 1, probes: nextProbes });
              }
            }
          }} className="py-2 text-xs font-medium rounded bg-[var(--lab-accent)] text-white cursor-pointer">Step Probe</button>
        </>
      )}
      {expId === 'stack' && (
        <>
          <ParamSlider label="Push Value" value={stackInput} min={1} max={99} step={1} onChange={setStackInput} />
          <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={() => {
              if (stackItems.length >= 8) { setStackStatus('STACK OVERFLOW'); labAudio.playWrongBuzzer(); return; }
              setStackItems((s) => [...s, stackInput]);
              setStackInput((v) => ((v + 7) % 95) + 4);
              setStackStatus('PUSH OK');
              labAudio.playTelemetryTone(400 + stackItems.length * 45, 0.07);
            }} className="py-2 text-xs rounded bg-[var(--lab-accent)] text-white cursor-pointer">Push</button>
            <button type="button" onClick={() => {
              if (!stackItems.length) { setStackStatus('STACK UNDERFLOW'); labAudio.playWrongBuzzer(); return; }
              setStackItems((s) => s.slice(0, -1));
              setStackStatus('POP OK');
              labAudio.playTelemetryTone(320, 0.07);
            }} className="py-2 text-xs rounded bg-white/5 border border-white/15 cursor-pointer">Pop</button>
            <button type="button" onClick={() => { setStackItems([]); setStackStatus('CLEARED'); }} className="py-2 text-xs rounded bg-white/5 border border-white/15 cursor-pointer">Clear</button>
          </div>
        </>
      )}
      {expId === 'queue' && (
        <>
          <ParamSlider label="Enqueue Value" value={qInput} min={10} max={99} step={1} onChange={setQInput} />
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => {
              if (qCount >= Q_CAP) { labAudio.playWrongBuzzer(); return; }
              const nextRear = qCount === 0 ? qFront : (qRear + 1) % Q_CAP;
              setQSlots((prev) => prev.map((v, idx) => (idx === nextRear ? qInput : v)));
              setQRear(nextRear);
              setQCount((c) => c + 1);
              setQInput((v) => ((v + 11) % 89) + 10);
              labAudio.playTelemetryTone(500, 0.07);
            }} className="py-2 text-xs rounded bg-[var(--lab-accent)] text-white cursor-pointer">Enqueue</button>
            <button type="button" onClick={() => {
              if (qCount === 0) { labAudio.playWrongBuzzer(); return; }
              setQSlots((prev) => prev.map((v, idx) => (idx === qFront ? null : v)));
              setQFront((f) => (f + 1) % Q_CAP);
              setQCount((c) => c - 1);
              labAudio.playTelemetryTone(360, 0.07);
            }} className="py-2 text-xs rounded bg-white/5 border border-white/15 cursor-pointer">Dequeue</button>
          </div>
        </>
      )}
      {expId === 'recursion' && (
        <>
          <ParamSlider label="Disks (n)" value={hanoiDisks} min={1} max={5} step={1} onChange={setHanoiDisks} />
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { if (hanoiIdx < hanoiMoves.length) { setHanoiIdx((i) => i + 1); labAudio.playTelemetryTone(440 + (hanoiIdx % 5) * 40, 0.06); } }} className="py-2 text-xs rounded bg-[var(--lab-accent)] text-white cursor-pointer">Step Move</button>
            <button type="button" onClick={() => setHanoiIdx(0)} className="py-2 text-xs rounded bg-white/5 border border-white/15 cursor-pointer">Reset Towers</button>
          </div>
        </>
      )}
      {expId === 'binary-search-tree' && (
        <>
          <ParamSlider label="Key Value" value={bstInput} min={5} max={95} step={1} onChange={setBstInput} />
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { setBstRoot((r) => insertBst(r, bstInput)); setBstHighlight(bstInput); }} className="py-2 text-xs rounded bg-[var(--lab-accent)] text-white cursor-pointer">Insert Key</button>
            <button type="button" onClick={() => {
              const out: number[] = [];
              const inorder = (n: BstNode | null) => { if (!n) return; inorder(n.left); out.push(n.val); inorder(n.right); };
              inorder(bstRoot);
              setBstOutput(out);
            }} className="py-2 text-xs rounded bg-white/5 border border-white/15 cursor-pointer">Inorder Print</button>
          </div>
          {bstOutput.length > 0 && (
            <p className="text-xs font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 rounded p-2">
              Inorder: [{bstOutput.join(', ')}]
            </p>
          )}
        </>
      )}
      {expId === 'dijkstra-graph' && (
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => { if (djStep < djSnapshots.length - 1) { setDjStep((s) => s + 1); labAudio.playTelemetryTone(420 + djStep * 55, 0.08); } }} className="py-2 text-xs rounded bg-[var(--lab-accent)] text-white cursor-pointer">Relax Next Vertex</button>
          <button type="button" onClick={() => setDjStep(0)} className="py-2 text-xs rounded bg-white/5 border border-white/15 cursor-pointer">Reset Graph</button>
        </div>
      )}
    </div>
  );

  return (
    <SimShell
      canvasRef={canvasRef}
      telemetry={telemetry}
      controls={controls}
      onReset={() => {
        setSortAuto(false);
        setSortState({ i: 0, j: 0, comps: 0, swaps: 0, done: false });
        setSearchStep({ low: 0, high: 11, mid: 5, linIdx: 0, probes: 0, found: -1, finished: false });
        setHanoiIdx(0);
        setDjStep(0);
      }}
      onRecordTrial={() => onRecord(recordSnapshot)}
    />
  );
};
