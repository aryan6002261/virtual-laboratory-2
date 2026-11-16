import React, { useState, useMemo } from 'react';
import { SCIENTIFIC_GLOSSARY } from '../data/glossary';
import { LabId } from '../types/lab';
import { BookMarked, Search, X, Sparkles } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSelectTerm?: (term: string) => void;
}

export const GlossaryModal: React.FC<Props> = ({ onClose, onSelectTerm }) => {
  const [search, setSearch] = useState('');
  const [filterDisc, setFilterDisc] = useState<LabId | 'all'>('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SCIENTIFIC_GLOSSARY.filter((item) => {
      if (filterDisc !== 'all' && item.discipline !== filterDisc) return false;
      if (!q) return true;
      return (
        item.term.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q) ||
        (item.formula && item.formula.toLowerCase().includes(q))
      );
    });
  }, [search, filterDisc]);

  const disciplines: Array<{ id: LabId | 'all'; label: string }> = [
    { id: 'all', label: 'All Fields' },
    { id: 'optics', label: 'Optics' },
    { id: 'chemistry', label: 'Chemistry' },
    { id: 'electrical', label: 'Electrical' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'mechanical', label: 'Mechanics' },
    { id: 'programming', label: 'Programming' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-panel-elevated rounded-lg max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-white/15 bg-[#0e1321]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090e1c]">
          <div className="flex items-center gap-2.5">
            <BookMarked className="w-5 h-5 text-[var(--lab-accent)]" />
            <div>
              <h2 className="font-display text-lg font-bold text-[#dee2f6]">
                Scientific Glossary & Concept Dictionary
              </h2>
              <p className="text-xs text-[#89929b]">
                {SCIENTIFIC_GLOSSARY.length} curated laws, principles, formulas, and SI definitions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#89929b] hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-white/10 bg-white/[0.02] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#89929b] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search concepts, equations, terms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#090e1c] border border-white/15 rounded-md pl-9 pr-3 py-2 text-xs text-[#dee2f6] outline-none placeholder:text-[#89929b]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {disciplines.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setFilterDisc(d.id)}
                className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition cursor-pointer ${
                  filterDisc === d.id
                    ? 'bg-[var(--lab-accent)] text-white font-semibold'
                    : 'bg-white/5 border border-white/10 text-[#bfc7d2] hover:border-white/25'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-[#89929b] font-mono text-sm">
              No matching scientific terms found for &quot;{search}&quot;.
            </div>
          ) : (
            filtered.map((term) => (
              <div
                key={term.id}
                className="rounded-md bg-[#090e1c] border border-white/10 p-4 flex flex-col gap-2 hover:border-white/20 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-sm font-bold text-[#dee2f6]">
                    {term.term}
                  </h3>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#93ccff] shrink-0">
                    {term.discipline}
                  </span>
                </div>

                <p className="text-xs text-[#bfc7d2] leading-relaxed">
                  {term.definition}
                </p>

                {term.formula && (
                  <div className="mt-1 bg-white/[0.03] p-2 rounded border border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#89929b]">Formula:</span>
                    <span className="text-sky-300 font-semibold">{term.formula}</span>
                  </div>
                )}

                {term.unit && (
                  <div className="text-[11px] font-mono text-[#89929b]">
                    <span>Units / Constants: </span>
                    <span className="text-[#dee2f6]">{term.unit}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#090e1c] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

