import React, { useState, useRef, useEffect } from 'react';
import { ExperimentMeta, ExperimentPedagogy, QuizQuestion } from '../types/lab';
import { Bot, Send, X, Sparkles, HelpCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { labAudio } from '../utils/audio';

interface Props {
  exp?: ExperimentMeta;
  pedagogy?: ExperimentPedagogy;
  questions?: QuizQuestion[];
  onClose: () => void;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIAssistantDrawer: React.FC<Props> = ({
  exp,
  pedagogy,
  questions,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const intro = exp
      ? `Hello! I am your AI Lab Assistant for **${exp.title}** (${exp.formula}). How can I help you today? You can ask me about physical principles, error analysis, equations, or hints for the quiz questions.`
      : 'Hello! I am your AI Lab Assistant across all STEM disciplines. Select an experiment or ask me any question about physics, chemistry, circuits, optics, or programming!';

    return [
      {
        sender: 'ai',
        text: intro,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateAnswer = (userQuery: string): string => {
    const q = userQuery.toLowerCase();

    if (q.includes('precaution') || q.includes('safety') || q.includes('error')) {
      if (exp && exp.precautions && exp.precautions.length > 0) {
        return `**Essential Precautions & Error Sources for ${exp.title}:**\n\n` +
          exp.precautions.map((p, i) => `• **Precaution ${i + 1}:** ${p}`).join('\n') +
          `\n\n**Common Sources of Error:**\n` +
          exp.commonErrors.map((e, i) => `• ${e}`).join('\n');
      }
      return 'Key precautions include eliminating parallax during scale readings, ensuring rigid optical and mechanical alignments, and accounting for instrumental zero errors before taking dynamic trials.';
    }

    if (q.includes('hint') || q.includes('quiz')) {
      if (exp && exp.hints && exp.hints.length > 0) {
        return `**Lab Quiz Hints:**\n\n` +
          exp.hints.map((h, i) => `💡 **Hint ${i + 1}:** ${h}`).join('\n\n') +
          `\n\nRemember to check standard units (convert mm to m, cm to m, or kHz to Hz) before evaluating expressions!`;
      }
      return 'Always begin by writing down given values and converting them to consistent SI units. Identify which variable remains invariant during the transformation!';
    }

    if (q.includes('formula') || q.includes('equation') || q.includes('derivation')) {
      if (exp && pedagogy) {
        return `**Mathematical Formulation for ${exp.title}:**\n\n` +
          `• **Primary Law:** \`${exp.formula}\`\n\n` +
          (exp.derivationOverview ? `• **Derivation:** ${exp.derivationOverview}\n\n` : '') +
          `• **Constitutive Relations:**\n` +
          pedagogy.equations.map((e) => `  - **${e.name}:** \`${e.expression}\` (${e.notes})`).join('\n');
      }
      return 'The governing laws depend on conservation of energy, momentum, or charge balance across the nodes and wavefronts.';
    }

    if (q.includes('real world') || q.includes('application') || q.includes('industry')) {
      if (pedagogy && pedagogy.realWorldApplications) {
        return `**Engineering & Industrial Applications of ${exp?.title || 'this lab'}:**\n\n` +
          pedagogy.realWorldApplications.map((app, i) => `0${i + 1}. ${app}`).join('\n\n');
      }
      return 'These principles form the foundation of fiber optic telecommunications, semiconductor fabrication, aerospace avionics, and modern algorithmic optimization.';
    }

    if (q.includes('explain') || q.includes('how does it work') || q.includes('summary')) {
      if (exp) {
        return `**Conceptual Summary of ${exp.title}:**\n\n` +
          `${exp.summary}\n\n` +
          `**Core Pedagogical Flow:**\n` +
          (pedagogy?.flowchart ? pedagogy.flowchart.map((s) => `• Step ${s.step}: **${s.title}** — ${s.detail}`).join('\n') : '');
      }
      return 'In this simulation, adjusting physical parameters updates telemetry in real-time at 60 FPS, demonstrating how mathematical constants shape empirical behavior.';
    }

    return `For **${exp?.title || 'this laboratory'}**, the behavior is governed by \`${exp?.formula || 'the physical laws'}\`. When you manipulate input parameters on the workbench, watch how the live telemetry indicators respond. Try logging multiple trials to plot a linear regression fit or examine the percentage error against standard accepted values!`;
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    labAudio.playClick();
    const userMsg: ChatMessage = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateAnswer(text);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 450);
  };

  const quickPrompts = [
    '💡 Explain the core formula',
    '⚠️ What precautions & errors to watch?',
    '🎯 Give me a hint for the quiz',
    '🌍 Real-world engineering applications',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-[#0e1321] border-l border-white/15 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 bg-[#090e1c] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--lab-accent)]/20 border border-[var(--lab-accent)]/40 flex items-center justify-center text-[var(--lab-accent)]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold text-[#dee2f6]">
              AI Lab Assistant & Science Tutor
            </h2>
            <p className="text-[11px] text-[#89929b] font-mono">
              {exp ? exp.shortTitle : 'General Laboratory Tutor'} · Offline Ready
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

      {/* Quick Prompts */}
      <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/5 flex gap-2 overflow-x-auto text-[11px] font-mono shrink-0">
        {quickPrompts.map((qp) => (
          <button
            key={qp}
            type="button"
            onClick={() => handleSend(qp)}
            className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#bfc7d2] hover:text-white hover:border-white/25 whitespace-nowrap cursor-pointer transition"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-[88%] ${
              m.sender === 'user'
                ? 'self-end items-end'
                : 'self-start items-start'
            }`}
          >
            <div
              className={`p-3.5 rounded-lg leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-[var(--lab-accent)] text-white'
                  : 'bg-[#090e1c] text-[#dee2f6] border border-white/10'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-[#89929b] font-mono mt-1 px-1">
              {m.timestamp}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="self-start bg-[#090e1c] border border-white/10 p-3 rounded-lg text-xs text-[#89929b] flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-[var(--lab-accent)]" />
            AI Assistant is formulating explanation...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-[#090e1c]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${exp?.shortTitle || 'science experiments'}...`}
            className="flex-1 bg-white/5 border border-white/15 rounded-md px-3.5 py-2.5 text-xs text-[#dee2f6] outline-none placeholder:text-[#89929b]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-3.5 py-2.5 rounded-md bg-[var(--lab-accent)] text-white hover:brightness-110 disabled:opacity-40 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

