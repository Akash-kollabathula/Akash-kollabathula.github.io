import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { sendQuickMessage, TARGET_EMAIL } from '../utils/mailService';
import { terminalAudio } from '../utils/soundEffects';

interface QuickMessageTerminalProps {
  initialSubject?: string;
}

export const QuickMessageTerminal: React.FC<QuickMessageTerminalProps> = ({
  initialSubject = 'SDET Automation Role / Inquiry',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      setStatus('error');
      setFeedback('Please enter both your email address and message.');
      return;
    }

    setStatus('sending');
    setFeedback('Connecting to free email gateway...');
    terminalAudio.playCommandSubmit();

    try {
      const res = await sendQuickMessage({
        name,
        email,
        subject,
        message,
      });

      if (res.success) {
        setStatus('success');
        setFeedback(res.message || `Message delivered directly to ${TARGET_EMAIL}!`);
        terminalAudio.playSuccessChime();
        setMessage('');
      } else {
        setStatus('error');
        setFeedback(res.message || 'Error transmitting message.');
      }
    } catch (err: any) {
      setStatus('error');
      setFeedback(err?.message || 'Failed to dispatch email.');
    }
  };

  const handleMailto = () => {
    const mailto = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(
      subject || 'SDET Role Opportunity'
    )}&body=${encodeURIComponent(
      `Name: ${name || 'Recruiter'}\nEmail: ${email || 'N/A'}\n\n${message || 'Hi Akash, I came across your SDET portfolio...'}`
    )}`;
    window.location.href = mailto;
  };

  return (
    <div className="mt-3 p-3 bg-black/90 border border-emerald-500/40 rounded-lg font-mono text-xs space-y-3">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <Send className="w-3.5 h-3.5 text-cyan-400" />
          <span>QUICK MESSAGE DISPATCH (FREE API)</span>
        </div>
        <span className="text-[10px] text-cyan-300">
          Target: <code className="text-white">{TARGET_EMAIL}</code>
        </span>
      </div>

      {status === 'success' && (
        <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/60 rounded text-emerald-300 flex items-start gap-2 text-[11px]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Transmission Confirmed!</div>
            <p className="text-gray-300 mt-0.5">{feedback}</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="p-2.5 bg-red-950/80 border border-red-500/60 rounded text-red-300 flex items-start gap-2 text-[11px]">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Transmission Alert</div>
            <p className="text-gray-300 mt-0.5">{feedback}</p>
            <button
              type="button"
              onClick={handleMailto}
              className="mt-1 text-cyan-400 underline font-bold hover:text-white cursor-pointer"
            >
              Open in your default mail app instead →
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSend} className="space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-gray-400 mb-0.5">Your Name (optional):</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex (Engineering Manager)"
              className="w-full bg-[#0d140f] border border-[#1b3323] focus:border-[#00ff41] px-2.5 py-1.5 rounded text-white text-[11px] outline-none transition"
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 mb-0.5">
              Your Email <span className="text-cyan-400">*</span>:
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@company.com"
              className="w-full bg-[#0d140f] border border-[#1b3323] focus:border-[#00ff41] px-2.5 py-1.5 rounded text-white text-[11px] outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Role Opportunity / Collaboration"
            className="w-full bg-[#0d140f] border border-[#1b3323] focus:border-[#00ff41] px-2.5 py-1.5 rounded text-white text-[11px] outline-none transition"
          />
        </div>

        <div>
          <label className="block text-[10px] text-gray-400 mb-0.5">
            Message <span className="text-cyan-400">*</span>:
          </label>
          <textarea
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi Akash, let's connect regarding an SDET Playwright position..."
            className="w-full bg-[#0d140f] border border-[#1b3323] focus:border-[#00ff41] px-2.5 py-1.5 rounded text-white text-[11px] outline-none transition resize-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={handleMailto}
            className="px-2.5 py-1 text-[10.5px] text-gray-400 hover:text-white bg-black/60 border border-gray-800 rounded transition cursor-pointer"
          >
            ✉ Fallback: Direct Mailto
          </button>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-black font-bold text-xs rounded transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,255,65,0.3)]"
          >
            {status === 'sending' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Transmitting Payload...</span>
              </>
            ) : (
              <>
                <Send className="w-3 h-3" />
                <span>Send Quick Message (API)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
