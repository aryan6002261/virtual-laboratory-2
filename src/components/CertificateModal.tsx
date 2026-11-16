import React, { useRef, useEffect, useState } from 'react';
import { Award, Download, Printer, X } from 'lucide-react';
import { labAudio } from '../utils/audio';

interface Props {
  studentName: string;
  disciplineTitle?: string;
  scorePct?: number;
  onClose: () => void;
}

export const CertificateModal: React.FC<Props> = ({
  studentName,
  disciplineTitle = 'Comprehensive STEM Experimental Sciences',
  scorePct = 94,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [name, setName] = useState(studentName || 'STEM Scholar');
  const [discipline, setDiscipline] = useState(disciplineTitle);

  const verificationCode = `VSL-CERT-${Math.abs(name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 73 + 1042)}`;
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const drawCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 1200;
    const h = 840;
    canvas.width = w;
    canvas.height = h;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#0c1222');
    bgGrad.addColorStop(0.5, '#090e1c');
    bgGrad.addColorStop(1, '#060a14');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Decorative outer border
    ctx.strokeStyle = '#d97706'; // Gold
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    // Inner thin border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(44, 44, w - 88, h - 88);

    // Corner decorative accents
    const corners = [
      [44, 44],
      [w - 44, 44],
      [44, h - 44],
      [w - 44, h - 44],
    ];
    for (const [cx, cy] of corners) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Header wordmark
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('VIRTUAL SCIENCE LABORATORY · STEM RESEARCH INSTITUTE', w / 2, 120);

    // Certificate Title
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 44px Georgia, serif';
    ctx.fillText('Certificate of Mastery', w / 2, 190);

    ctx.fillStyle = '#89929b';
    ctx.font = '16px system-ui';
    ctx.fillText('THIS RECOGNIZES THAT', w / 2, 240);

    // Recipient Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold italic 52px Georgia, serif';
    ctx.fillText(name, w / 2, 320);

    // Underline
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 240, 345);
    ctx.lineTo(w / 2 + 240, 345);
    ctx.stroke();

    // Body Text
    ctx.fillStyle = '#dee2f6';
    ctx.font = '19px system-ui';
    ctx.fillText(
      'has successfully conducted physical, chemical, and computational simulations,',
      w / 2,
      400
    );
    ctx.fillText(
      'verifying analytical derivations and mastering experimental methodologies in',
      w / 2,
      435
    );

    // Discipline Field
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillText(discipline, w / 2, 490);

    // Score & Verification
    ctx.fillStyle = '#89929b';
    ctx.font = '15px monospace';
    ctx.fillText(
      `Evaluation Rating: ${scorePct}% Mastery · Issued on ${issueDate}`,
      w / 2,
      545
    );

    // Official Seal (Bottom Left)
    ctx.save();
    ctx.translate(220, 680);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 55, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('VERIFIED STEM LAB', 0, -6);
    ctx.fillText('SEAL OF MASTERY', 0, 10);
    ctx.restore();

    // Signatures
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;

    // Director signature line
    ctx.beginPath();
    ctx.moveTo(w - 360, 680);
    ctx.lineTo(w - 140, 680);
    ctx.stroke();

    ctx.fillStyle = '#dee2f6';
    ctx.font = 'italic 20px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Dr. Julian Sterling', w - 250, 665);

    ctx.fillStyle = '#89929b';
    ctx.font = '12px system-ui';
    ctx.fillText('Laboratory Director & Dean of Science', w - 250, 705);

    // Verification ID bottom center
    ctx.fillStyle = '#89929b';
    ctx.font = '11px monospace';
    ctx.fillText(`Verification Key: ${verificationCode}`, w / 2, 770);
  };

  useEffect(() => {
    drawCertificate();
  }, [name, discipline, scorePct]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate-${name.replace(/\s+/g, '_')}.png`;
    a.click();
    labAudio.playClick();
  };

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html>
          <head><title>Print Certificate</title></head>
          <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#000;">
            <img src="${dataUrl}" style="max-width:100%;height:auto;" onload="window.print();window.close();" />
          </body>
        </html>
      `);
      win.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel-elevated rounded-lg max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-white/20 bg-[#0e1321]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090e1c]">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="font-display text-lg font-bold text-[#dee2f6]">
              Official Laboratory Mastery Certificate
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

        {/* Customization Row */}
        <div className="px-6 py-3 border-b border-white/10 bg-white/[0.02] flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#89929b]">Recipient:</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#090e1c] border border-white/15 rounded px-2.5 py-1 text-[#dee2f6] outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#89929b]">Discipline:</span>
            <input
              type="text"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className="bg-[#090e1c] border border-white/15 rounded px-2.5 py-1 text-[#dee2f6] outline-none min-w-[260px]"
            />
          </div>
        </div>

        {/* Canvas Display */}
        <div className="flex-1 overflow-auto p-6 flex justify-center bg-black/40">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto rounded shadow-2xl border border-amber-500/30 block"
            style={{ maxHeight: '56vh' }}
          />
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#090e1c] flex items-center justify-between">
          <span className="font-mono text-xs text-[#89929b]">
            High-Resolution 1200×840px Canvas Render
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/15 text-[#dee2f6] transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-semibold bg-[var(--lab-accent)] text-white hover:brightness-110 transition cursor-pointer shadow"
            >
              <Download className="w-3.5 h-3.5" /> Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

