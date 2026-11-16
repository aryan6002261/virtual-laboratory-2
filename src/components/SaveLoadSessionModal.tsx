import React, { useState } from 'react';
import { ObservationEntry, SavedExperimentSession, LabId } from '../types/lab';
import { Save, FolderOpen, Download, Upload, Trash2, X } from 'lucide-react';
import { labAudio } from '../utils/audio';

interface Props {
  expId: string;
  labId: LabId;
  logs: ObservationEntry[];
  onLoadLogs: (loadedLogs: ObservationEntry[]) => void;
  onClose: () => void;
}

const STORAGE_KEY = 'vsl_saved_sessions_v1';

export const SaveLoadSessionModal: React.FC<Props> = ({
  expId,
  labId,
  logs,
  onLoadLogs,
  onClose,
}) => {
  const [sessionName, setSessionName] = useState(`Session ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  const [sessionNotes, setSessionNotes] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const getSavedSessions = (): SavedExperimentSession[] => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as SavedExperimentSession[];
    } catch {
      return [];
    }
  };

  const [savedList, setSavedList] = useState<SavedExperimentSession[]>(() => {
    return getSavedSessions().filter((s) => s.expId === expId);
  });

  const handleSaveToBrowser = () => {
    const current = getSavedSessions();
    const newSession: SavedExperimentSession = {
      id: `session_${Date.now()}`,
      name: sessionName.trim() || 'Untitled Session',
      expId,
      labId,
      timestamp: new Date().toLocaleString(),
      notes: sessionNotes,
      logs,
    };

    const next = [newSession, ...current];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSavedList(next.filter((s) => s.expId === expId));
    setMessage('Session saved to browser storage successfully!');
    labAudio.playClick();
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLoad = (session: SavedExperimentSession) => {
    onLoadLogs(session.logs);
    labAudio.playClick();
    setMessage(`Loaded "${session.name}" (${session.logs.length} trials)!`);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = (id: string) => {
    const current = getSavedSessions();
    const next = current.filter((s) => s.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSavedList(next.filter((s) => s.expId === expId));
    labAudio.playClick();
  };

  const handleExportJson = () => {
    const sessionData = {
      version: '1.0',
      expId,
      labId,
      exportedAt: new Date().toISOString(),
      name: sessionName,
      notes: sessionNotes,
      logs,
    };

    const blob = new Blob([JSON.stringify(sessionData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vsl-session-${expId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    labAudio.playClick();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.logs)) {
          onLoadLogs(parsed.logs);
          setMessage(`Imported ${parsed.logs.length} trials from JSON!`);
          labAudio.playClick();
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage('Error: Invalid session file structure.');
        }
      } catch {
        setMessage('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="glass-panel-elevated rounded-lg max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-white/15 bg-[#0e1321]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090e1c]">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[var(--lab-accent)]" />
            <h2 className="font-display text-lg font-bold text-[#dee2f6]">
              Save & Load Experiment Results
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#89929b] hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 flex flex-col gap-6 text-xs font-mono">
          {message && (
            <div className="p-3 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold text-center">
              {message}
            </div>
          )}

          {/* Section 1: Save Current Trials */}
          <div className="bg-[#090e1c] p-4 rounded border border-white/10 flex flex-col gap-3">
            <h3 className="font-display text-sm font-semibold text-[#dee2f6]">
              Save Active Trials ({logs.length} Logged)
            </h3>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Session Name"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="flex-1 bg-white/5 border border-white/15 rounded px-3 py-2 text-[#dee2f6] outline-none"
              />
              <button
                type="button"
                onClick={handleSaveToBrowser}
                disabled={logs.length === 0}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded bg-[var(--lab-accent)] text-white font-semibold hover:brightness-110 disabled:opacity-40 transition cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Save Session
              </button>
              <button
                type="button"
                onClick={handleExportJson}
                disabled={logs.length === 0}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-white/5 border border-white/15 text-[#dee2f6] hover:bg-white/15 disabled:opacity-40 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export JSON
              </button>
            </div>
          </div>

          {/* Section 2: Import from Disk */}
          <div className="bg-[#090e1c] p-4 rounded border border-white/10 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-sm font-semibold text-[#dee2f6]">
                Import Session from Disk (.json)
              </h3>
              <p className="text-[11px] text-[#89929b] mt-0.5">
                Load a portable experiment backup file
              </p>
            </div>

            <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-white/5 border border-white/15 hover:bg-white/15 text-[#dee2f6] transition cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Choose File
              <input
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>
          </div>

          {/* Section 3: Browser Saved Sessions List */}
          <div className="flex flex-col gap-2">
            <h3 className="font-display text-sm font-semibold text-[#dee2f6]">
              Saved Sessions for this Experiment ({savedList.length})
            </h3>

            {savedList.length === 0 ? (
              <p className="text-[#89929b] italic py-4 text-center">
                No saved sessions found in browser storage for this practical.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {savedList.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded bg-[#090e1c] border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition"
                  >
                    <div>
                      <span className="font-semibold text-white block text-sm font-display">
                        {s.name}
                      </span>
                      <span className="text-[11px] text-[#89929b]">
                        {s.timestamp} · {s.logs.length} trials
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLoad(s)}
                        className="px-3 py-1 rounded bg-[var(--lab-accent)] text-white text-xs font-semibold hover:brightness-110 cursor-pointer"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        className="p-1 rounded text-[#89929b] hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#090e1c] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

