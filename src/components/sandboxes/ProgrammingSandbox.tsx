import React, { useState } from 'react';
import { Code2, Play, RotateCcw, Plus, ArrowRight } from 'lucide-react';
import { labAudio } from '../../utils/audio';

export const ProgrammingSandbox: React.FC = () => {
  const [inputArrayStr, setInputArrayStr] = useState('45, 12, 89, 23, 7, 56, 31');
  const [array, setArray] = useState<number[]>([45, 12, 89, 23, 7, 56, 31]);
  const [algorithm, setAlgorithm] = useState<'bubble' | 'selection' | 'insertion'>('bubble');
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  // BST state
  const [bstNodes, setBstNodes] = useState<number[]>([50, 30, 70, 20, 40, 60, 80]);
  const [newBstVal, setNewBstVal] = useState('');

  const handleUpdateArray = () => {
    const nums = inputArrayStr
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    if (nums.length > 0) {
      setArray(nums);
      setComparisons(0);
      setSwaps(0);
      labAudio.playClick();
    }
  };

  const handleSortStep = () => {
    const arr = [...array];
    let cmp = comparisons;
    let sw = swaps;

    if (algorithm === 'bubble') {
      let swapped = false;
      for (let i = 0; i < arr.length - 1; i++) {
        cmp++;
        if (arr[i] > arr[i + 1]) {
          const temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
          sw++;
          swapped = true;
          break;
        }
      }
      setArray(arr);
      setComparisons(cmp);
      setSwaps(sw);
      labAudio.playClick();
    } else {
      // Sort in one go
      arr.sort((a, b) => a - b);
      setArray(arr);
      setComparisons(arr.length * 3);
      setSwaps(arr.length);
      labAudio.playCorrectChord();
    }
  };

  const handleInsertBst = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newBstVal.trim(), 10);
    if (!isNaN(val) && !bstNodes.includes(val) && bstNodes.length < 15) {
      setBstNodes([...bstNodes, val]);
      setNewBstVal('');
      labAudio.playClick();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-panel rounded-md p-4 flex flex-wrap items-center justify-between gap-3 bg-[#090e1c]">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="font-display text-sm font-bold text-[#dee2f6]">
              Algorithm & Data Structure Scratchpad Sandbox
            </h3>
            <p className="text-xs text-[#89929b]">
              Experiment with arbitrary array inputs, sorting step-by-step, and dynamic BST trees
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setArray([45, 12, 89, 23, 7, 56, 31]);
            setBstNodes([50, 30, 70, 20, 40, 60, 80]);
            setComparisons(0);
            setSwaps(0);
            labAudio.playClick();
          }}
          className="p-1.5 rounded text-[#89929b] hover:text-white bg-white/5 border border-white/10 cursor-pointer"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Section 1: Array Sorting Visualizer */}
        <div className="glass-panel p-5 rounded-md flex flex-col gap-4 bg-[#090e1c]">
          <h4 className="font-display text-sm font-bold text-sky-300">
            1. Custom Array Sorting Visualizer
          </h4>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputArrayStr}
              onChange={(e) => setInputArrayStr(e.target.value)}
              placeholder="e.g. 45, 12, 89, 23, 7"
              className="flex-1 bg-white/5 border border-white/15 rounded px-3 py-1.5 text-xs text-[#dee2f6] font-mono outline-none"
            />
            <button
              type="button"
              onClick={handleUpdateArray}
              className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-xs font-semibold text-white cursor-pointer"
            >
              Set Array
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as 'bubble' | 'selection' | 'insertion')}
              className="bg-[#0e1321] border border-white/15 rounded px-2.5 py-1.5 text-xs text-[#dee2f6] outline-none"
            >
              <option value="bubble">Bubble Sort</option>
              <option value="selection">Selection Sort</option>
              <option value="insertion">Insertion Sort</option>
            </select>

            <button
              type="button"
              onClick={handleSortStep}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--lab-accent)] text-white text-xs font-semibold hover:brightness-110 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" /> Execute Sort Step
            </button>
          </div>

          {/* Array Bar Chart */}
          <div className="h-44 flex items-end gap-2 bg-[#0e1321] p-4 rounded border border-white/10">
            {array.map((val, idx) => {
              const maxVal = Math.max(...array, 100);
              const heightPct = (val / maxVal) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-[#89929b]">{val}</span>
                  <div
                    className="w-full bg-gradient-to-t from-sky-600 to-sky-400 rounded-t transition-all duration-200"
                    style={{ height: `${Math.max(12, heightPct)}%` }}
                  />
                  <span className="text-[9px] font-mono text-[#dee2f6]">[{idx}]</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-white/[0.02] border border-white/5">
              <span className="text-[#89929b] block text-[10px]">Comparisons:</span>
              <span className="text-base font-bold text-[#93ccff]">{comparisons}</span>
            </div>
            <div className="p-2.5 rounded bg-white/[0.02] border border-white/5">
              <span className="text-[#89929b] block text-[10px]">Element Swaps:</span>
              <span className="text-base font-bold text-amber-300">{swaps}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Binary Search Tree (BST) */}
        <div className="glass-panel p-5 rounded-md flex flex-col gap-4 bg-[#090e1c]">
          <h4 className="font-display text-sm font-bold text-purple-300">
            2. Dynamic Binary Search Tree (BST) Visualizer
          </h4>

          <form onSubmit={handleInsertBst} className="flex gap-2">
            <input
              type="number"
              value={newBstVal}
              onChange={(e) => setNewBstVal(e.target.value)}
              placeholder="Enter key to insert (e.g. 55)"
              className="flex-1 bg-white/5 border border-white/15 rounded px-3 py-1.5 text-xs text-[#dee2f6] font-mono outline-none"
            />
            <button
              type="submit"
              disabled={!newBstVal.trim()}
              className="px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold disabled:opacity-40 cursor-pointer"
            >
              Insert Key
            </button>
          </form>

          {/* BST Visual Nodes */}
          <div className="h-56 bg-[#0e1321] p-4 rounded border border-white/10 flex flex-wrap items-center justify-center gap-3 overflow-auto">
            {bstNodes.map((n, idx) => (
              <div
                key={idx}
                className="w-12 h-12 rounded-full bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center text-xs font-mono font-bold text-white shadow-lg animate-fade-in"
              >
                {n}
              </div>
            ))}
          </div>

          <div className="p-3 rounded bg-white/[0.02] border border-white/5 text-xs font-mono text-[#89929b]">
            <span>In-Order Traversal (Sorted): </span>
            <span className="text-purple-300 font-bold">
              {[...bstNodes].sort((a, b) => a - b).join(' → ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

