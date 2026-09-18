import React, { useState, useRef } from 'react';
import {
  HelpCircle,
  User,
  Code2,
  Briefcase,
  Boxes,
  FileText,
  Mail,
  Play,
  Trash2,
  Keyboard,
  Send,
  X,
  Volume2,
  VolumeX,
  Layout,
} from 'lucide-react';
import { terminalAudio } from '../utils/soundEffects';

interface MobileQuickBarProps {
  onExecute: (cmd: string) => void;
  onDownloadResume: () => void;
  onFocusInput?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onSwitchToGui?: () => void;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  onExecute,
  onDownloadResume,
  onFocusInput,
  soundEnabled = true,
  onToggleSound,
  onSwitchToGui,
}) => {
  const [showInputMode, setShowInputMode] = useState(false);
  const [mobileInput, setMobileInput] = useState('');
  const mobileBarInputRef = useRef<HTMLInputElement>(null);

  const quickActions = [
    { label: 'Help', cmd: 'help', icon: HelpCircle, color: 'text-cyan-400' },
    { label: 'About', cmd: 'about', icon: User, color: 'text-[#00ff41]' },
    { label: 'Skills', cmd: 'skills', icon: Code2, color: 'text-yellow-400' },
    { label: 'Exp', cmd: 'experience', icon: Briefcase, color: 'text-white' },
    { label: 'Projects', cmd: 'projects', icon: Boxes, color: 'text-cyan-300' },
    { label: 'Test', cmd: 'test', icon: Play, color: 'text-[#00ff41]' },
    { label: 'Contact', cmd: 'contact', icon: Mail, color: 'text-cyan-300' },
  ];

  const handleOpenKeyboard = () => {
    terminalAudio.playButtonClick();
    setShowInputMode(true);
    onFocusInput?.();
    setTimeout(() => {
      mobileBarInputRef.current?.focus();
    }, 100);
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = mobileInput.trim();
    if (trimmed) {
      terminalAudio.playMechanicalClick('enter');
      onExecute(trimmed);
      setMobileInput('');
      setShowInputMode(false);
    }
  };

  return (
    <div
      id="mobile-quick-nav-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0c0c] border-t border-[#262626] p-2 select-none shadow-[0_-4px_16px_rgba(0,0,0,0.8)]"
    >
      {showInputMode ? (
        <form
          onSubmit={handleMobileSubmit}
          className="flex items-center gap-1.5 w-full bg-[#141414] border border-cyan-400/60 rounded px-2 py-1.5 shadow-inner"
        >
          <span className="text-[#00ff41] font-mono text-xs font-bold shrink-0">akash@kali:~$</span>
          <input
            ref={mobileBarInputRef}
            type="text"
            value={mobileInput}
            onChange={(e) => setMobileInput(e.target.value)}
            placeholder="Type command (e.g. help, skills)..."
            autoFocus
            autoCapitalize="none"
            autoCorrect="off"
            enterKeyHint="go"
            className="flex-1 bg-transparent text-white font-mono text-[15px] outline-none min-h-[36px] py-1 select-text"
          />
          <button
            type="submit"
            className="px-2.5 py-1.5 bg-[#00ff41] hover:bg-[#27c93f] active:scale-95 text-black font-mono font-bold text-xs rounded flex items-center gap-1 cursor-pointer shrink-0 shadow-[0_0_8px_rgba(0,255,65,0.4)]"
            title="Execute"
          >
            <Send className="w-3 h-3" />
            <span>Run</span>
          </button>
          <button
            type="button"
            onClick={() => setShowInputMode(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#222] cursor-pointer shrink-0"
            title="Close Keyboard Input"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          {/* Dedicated Android Keyboard Activator */}
          <button
            type="button"
            onClick={handleOpenKeyboard}
            className="flex flex-col items-center justify-center min-w-[50px] min-h-[44px] px-2 py-1 bg-[#161b22] active:bg-[#1f2937] border border-cyan-400/50 text-[10px] font-mono text-cyan-300 rounded transition cursor-pointer shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.3)] active:scale-95"
            title="Open Android Keyboard to Type Command"
          >
            <Keyboard className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="mt-0.5 font-bold">Type</span>
          </button>

          {/* Switch to Desktop GUI Mode Button for Mobile */}
          {onSwitchToGui && (
            <button
              type="button"
              onClick={() => {
                terminalAudio.playThemeSwitch();
                onSwitchToGui();
              }}
              className="flex flex-col items-center justify-center min-w-[52px] min-h-[44px] px-2 py-1 bg-cyan-950/60 active:bg-cyan-900 border border-cyan-500/60 text-[10px] font-mono text-cyan-300 rounded transition cursor-pointer shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.25)] active:scale-95"
              title="Switch to Desktop GUI Mode"
            >
              <Layout className="w-4 h-4 text-cyan-400" />
              <span className="mt-0.5 font-bold">GUI</span>
            </button>
          )}

          {/* Mobile Sound / Audio Toggle Button */}
          {onToggleSound && (
            <button
              type="button"
              onClick={onToggleSound}
              className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-2 py-1 border text-[10px] font-mono rounded transition cursor-pointer shrink-0 active:scale-95 ${
                soundEnabled
                  ? 'bg-emerald-950/50 border-emerald-500/60 text-[#00ff41] shadow-[0_0_8px_rgba(0,255,65,0.2)]'
                  : 'bg-[#101010] border-[#333333] text-gray-400'
              }`}
              title={soundEnabled ? 'Audio SFX ON - Tap to Mute' : 'Audio Muted - Tap to Enable'}
              aria-label={soundEnabled ? 'Mute audio' : 'Unmute audio'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#00ff41] shrink-0" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-400 shrink-0" />
              )}
              <span className="mt-0.5 font-bold">{soundEnabled ? 'Audio' : 'Mute'}</span>
            </button>
          )}

          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.cmd}
                type="button"
                onClick={() => {
                  terminalAudio.playMechanicalClick('enter');
                  onExecute(item.cmd);
                }}
                className="flex flex-col items-center justify-center min-w-[46px] min-h-[44px] px-2 py-1 bg-[#101010] active:bg-[#1a1a1a] border border-[#222222] text-[10px] font-mono text-gray-300 rounded transition cursor-pointer shrink-0 active:scale-95"
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span className="mt-0.5 font-medium">{item.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              terminalAudio.playButtonClick();
              onDownloadResume();
            }}
            className="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] px-2.5 py-1 bg-[#101010] active:bg-[#1a1a1a] border border-[#00ff41]/50 text-[10px] font-mono text-[#00ff41] rounded transition cursor-pointer font-bold shrink-0 active:scale-95"
            title="Download ATS Resume PDF"
          >
            <FileText className="w-4 h-4 text-[#00ff41]" />
            <span className="mt-0.5">Resume</span>
          </button>

          <button
            type="button"
            onClick={() => {
              terminalAudio.playMechanicalClick('backspace');
              onExecute('clear');
            }}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 bg-[#101010] active:bg-[#1a1a1a] border border-[#ff5f56]/40 text-[10px] font-mono text-[#ff5f56] rounded transition cursor-pointer shrink-0 active:scale-95"
            title="Clear screen"
          >
            <Trash2 className="w-4 h-4" />
            <span className="mt-0.5">Clear</span>
          </button>
        </div>
      )}
    </div>
  );
};
