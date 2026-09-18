import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { portfolioData, AVAILABLE_COMMANDS } from '../data/portfolioData';
import { TerminalTheme } from '../types';
import { CornerDownLeft, Play, ArrowUp, ArrowDown, Keyboard } from 'lucide-react';
import { terminalAudio } from '../utils/soundEffects';
import { avatarStore } from '../utils/avatarStore';

interface TerminalPromptProps {
  theme: TerminalTheme;
  onExecute: (command: string) => void;
  commandHistory: string[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  onScrollUp?: () => void;
  onScrollDown?: () => void;
}

export const TerminalPrompt: React.FC<TerminalPromptProps> = ({
  theme,
  onExecute,
  commandHistory,
  inputRef,
  onScrollUp,
  onScrollDown,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [ghostSuggestion, setGhostSuggestion] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>(() => avatarStore.getPhotoUrl());
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerTypingPulse = () => {
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 850);
  };

  const stopTypingPulse = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const getThemePulseClass = () => {
    switch (theme) {
      case 'cyber-cyan':
        return 'retro-typing-pulse-cyan';
      case 'amber-phosphor':
        return 'retro-typing-pulse-amber';
      case 'hacker-purple':
        return 'retro-typing-pulse-purple';
      case 'matrix-dark':
        return 'retro-typing-pulse-matrix';
      case 'kali-green':
      default:
        return 'retro-typing-pulse-green';
    }
  };

  const getThemePrimaryColor = () => {
    switch (theme) {
      case 'cyber-cyan':
        return 'text-cyan-400';
      case 'amber-phosphor':
        return 'text-amber-400';
      case 'hacker-purple':
        return 'text-fuchsia-400';
      case 'matrix-dark':
      case 'kali-green':
      default:
        return 'text-[#00ff41]';
    }
  };

  const getThemeInputColor = () => {
    switch (theme) {
      case 'cyber-cyan':
        return 'text-cyan-400 caret-cyan-400';
      case 'amber-phosphor':
        return 'text-amber-400 caret-amber-400';
      case 'hacker-purple':
        return 'text-fuchsia-400 caret-fuchsia-400';
      case 'matrix-dark':
      case 'kali-green':
      default:
        return 'text-[#00ff41] caret-[#00ff41]';
    }
  };

  const getThemeAccentColor = () => {
    switch (theme) {
      case 'cyber-cyan':
        return 'text-cyan-300';
      case 'amber-phosphor':
        return 'text-yellow-300';
      case 'hacker-purple':
        return 'text-fuchsia-300';
      case 'matrix-dark':
      case 'kali-green':
      default:
        return 'text-cyan-400';
    }
  };

  useEffect(() => {
    return avatarStore.subscribe(() => {
      setPhotoUrl(avatarStore.getPhotoUrl());
    });
  }, []);

  // Update ghost suggestion when typing
  useEffect(() => {
    const trimmed = inputVal.trim().toLowerCase();
    if (!trimmed) {
      setGhostSuggestion('');
      return;
    }

    const match = AVAILABLE_COMMANDS.find((c) => c.cmd.startsWith(trimmed));
    if (match && match.cmd !== trimmed) {
      setGhostSuggestion(match.cmd);
    } else {
      setGhostSuggestion('');
    }
  }, [inputVal]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Trigger retro typing animation on keystroke
    if (!e.ctrlKey && !e.metaKey && !e.altKey && (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete')) {
      triggerTypingPulse();
    }

    // Play acoustic mechanical key click
    if (e.key === 'Enter') {
      terminalAudio.playMechanicalClick('enter');
    } else if (e.key === ' ' || e.code === 'Space') {
      terminalAudio.playMechanicalClick('space');
    } else if (e.key === 'Backspace') {
      terminalAudio.playMechanicalClick('backspace');
    } else if (e.key === 'Delete') {
      terminalAudio.playMechanicalClick('delete');
    } else if (e.key === 'Tab') {
      terminalAudio.playMechanicalClick('tab');
    } else if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
      terminalAudio.playMechanicalClick('key');
    }

    // TAB: Autocomplete command
    if (e.key === 'Tab') {
      e.preventDefault();
      triggerTypingPulse();
      if (ghostSuggestion) {
        setInputVal(ghostSuggestion);
        setGhostSuggestion('');
      } else {
        const trimmed = inputVal.trim().toLowerCase();
        const matches = AVAILABLE_COMMANDS.filter((c) => c.cmd.startsWith(trimmed));
        if (matches.length === 1) {
          setInputVal(matches[0].cmd);
        }
      }
      return;
    }

    // ENTER: Execute command
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFormSubmit();
      return;
    }

    // ARROW UP: If Shift/Ctrl is held, or if input is empty, scroll page UP! Otherwise history
    if (e.key === 'ArrowUp') {
      if (e.shiftKey || e.ctrlKey || (inputVal === '' && commandHistory.length === 0)) {
        e.preventDefault();
        onScrollUp?.();
        terminalAudio.playScrollTick();
        return;
      }

      e.preventDefault();
      terminalAudio.playMechanicalClick('key', 0.1);
      if (commandHistory.length === 0) {
        onScrollUp?.();
        return;
      }

      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex]);
      triggerTypingPulse();
      return;
    }

    // ARROW DOWN: If Shift/Ctrl is held, or if input is empty and no active history, scroll page DOWN!
    if (e.key === 'ArrowDown') {
      if (e.shiftKey || e.ctrlKey || (inputVal === '' && historyIndex === -1)) {
        e.preventDefault();
        onScrollDown?.();
        terminalAudio.playScrollTick();
        return;
      }

      e.preventDefault();
      terminalAudio.playMechanicalClick('key', 0.1);
      if (historyIndex === -1) {
        onScrollDown?.();
        return;
      }

      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
      triggerTypingPulse();
      return;
    }

    // PageUp / PageDown inside input -> scroll page
    if (e.key === 'PageUp') {
      e.preventDefault();
      onScrollUp?.();
      terminalAudio.playScrollTick();
      return;
    }
    if (e.key === 'PageDown') {
      e.preventDefault();
      onScrollDown?.();
      terminalAudio.playScrollTick();
      return;
    }

    // CTRL+L: Clear screen
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      stopTypingPulse();
      onExecute('clear');
      return;
    }

    // CTRL+C: Cancel current line
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      stopTypingPulse();
      setInputVal('');
      setGhostSuggestion('');
      return;
    }
  };

  const handleFormSubmit = () => {
    stopTypingPulse();
    const cmd = inputVal.trim();
    if (cmd) {
      terminalAudio.playMechanicalClick('enter');
      onExecute(cmd);
      setInputVal('');
      setHistoryIndex(-1);
      setGhostSuggestion('');
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  const handleQuickSubmit = (cmdToRun: string) => {
    stopTypingPulse();
    terminalAudio.playButtonClick();
    onExecute(cmdToRun);
    setInputVal('');
    setHistoryIndex(-1);
  };

  // Scroll into view on focus so virtual keyboard doesn't hide input on Android
  const handleFocus = () => {
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
  };

  const interactiveQuickChips = [
    'help',
    'skills',
    'experience',
    'projects',
    'resume',
    'contact',
    'test',
    'clear',
  ];

  return (
    <div id="terminal-prompt-bar" className="mt-4 pt-3 border-t border-[#222222] font-mono">
      {/* Interactive Mobile & Tablet Command Quick-Bar */}
      <div className="mb-2 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none select-none">
        <span className="text-[10px] text-gray-500 font-bold uppercase shrink-0 mr-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
          CMD:
        </span>
        {interactiveQuickChips.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => handleQuickSubmit(cmd)}
            className="px-2.5 py-1 bg-[#121212] hover:bg-[#1a1a1a] active:bg-[#00ff41]/20 border border-[#2a2a2a] hover:border-[#00ff41]/60 text-cyan-300 hover:text-[#00ff41] rounded text-[11px] font-mono font-semibold transition shrink-0 cursor-pointer shadow-sm active:scale-95"
            title={`Run ${cmd}`}
          >
            {cmd}
          </button>
        ))}

        {/* Tactile scroll controls for mobile/tablet */}
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => {
              onScrollUp?.();
              terminalAudio.playScrollTick();
            }}
            className="p-1 bg-[#141414] hover:bg-[#202020] border border-[#333] text-gray-400 hover:text-white rounded text-[10px] flex items-center gap-0.5 cursor-pointer"
            title="Scroll Terminal Page Up"
          >
            <ArrowUp className="w-3 h-3 text-[#00ff41]" />
            <span className="hidden sm:inline">UP</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onScrollDown?.();
              terminalAudio.playScrollTick();
            }}
            className="p-1 bg-[#141414] hover:bg-[#202020] border border-[#333] text-gray-400 hover:text-white rounded text-[10px] flex items-center gap-0.5 cursor-pointer"
            title="Scroll Terminal Page Down"
          >
            <ArrowDown className="w-3 h-3 text-[#00ff41]" />
            <span className="hidden sm:inline">DN</span>
          </button>
        </div>
      </div>

      {/* Active command prompt line with retro typing pulse & native Android form submission */}
      <form 
        id="terminal-command-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit();
        }}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('button')) return;
          inputRef.current?.focus();
        }}
        onTouchEnd={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('button')) return;
          inputRef.current?.focus();
          setTimeout(() => {
            inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 150);
        }}
        className={`relative flex items-center space-x-2 p-2.5 sm:p-3 rounded transition-all duration-300 cursor-text shadow-inner overflow-hidden select-text ${
          isTyping
            ? `${getThemePulseClass()} border`
            : 'bg-[#0c0c0c] border border-[#282828] focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/40'
        }`}
      >
        {/* Retro CRT cathode electron sweep beam along top border when actively typing */}
        {isTyping && (
          <div
            className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent pointer-events-none opacity-80 retro-typing-beam z-20 ${getThemeAccentColor()}`}
          />
        )}

        {/* Linux Prompt prefix with micro avatar */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 select-none shrink-0 text-xs sm:text-sm">
          <div
            onClick={(e) => {
              e.stopPropagation();
              terminalAudio.playButtonClick();
              onExecute('about');
            }}
            className={`w-5 h-5 rounded overflow-hidden border transition cursor-pointer relative shrink-0 flex items-center justify-center bg-[#050907] ${
              isTyping
                ? 'border-cyan-400 shadow-[0_0_8px_rgba(0,255,65,0.5)] scale-105'
                : 'border-emerald-500/50 hover:border-cyan-400 shadow-[0_0_6px_rgba(0,255,65,0.3)]'
            }`}
            title="Akash Kollabathula"
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Akash avatar"
                referrerPolicy="no-referrer"
                onError={() => setPhotoUrl('')}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-150"
              />
            ) : (
              <span className={`text-[9px] font-bold leading-none ${getThemePrimaryColor()}`}>
                AK
              </span>
            )}
          </div>
          <span className={`font-bold hidden xs:inline transition-colors duration-200 ${isTyping ? 'text-white' : 'text-gray-200'}`}>
            {portfolioData.handle}@{portfolioData.hostname}
          </span>
          <span className="text-gray-400 hidden xs:inline">:</span>
          <span className={`${getThemeAccentColor()} transition-colors duration-200 font-semibold`}>~</span>
          <span
            className={`font-bold transition-all duration-200 ${
              isTyping
                ? `${getThemePrimaryColor()} scale-110 drop-shadow-[0_0_8px_currentColor]`
                : 'text-white'
            }`}
          >
            $
          </span>
        </div>

        {/* Input container with ghost text overlay */}
        <div className="relative flex-1 flex items-center min-w-0 font-mono text-[15px] sm:text-sm">
          <input
            ref={inputRef}
            type="text"
            id="terminal-cli-input"
            name="terminal-command"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setHistoryIndex(-1);
              triggerTypingPulse();
            }}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onTouchStart={() => {
              inputRef.current?.focus();
            }}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            enterKeyHint="go"
            inputMode="text"
            className={`w-full min-h-[42px] py-1 bg-transparent font-mono text-[15px] sm:text-sm outline-none border-none p-0 z-10 font-bold select-text ${getThemeInputColor()} ${
              isTyping ? 'retro-typing-text-glow' : ''
            }`}
            placeholder={inputVal ? '' : 'Type command (e.g. help, skills, test)...'}
          />

          {/* Ghost text for autocomplete preview */}
          {ghostSuggestion && (
            <div className="absolute left-0 top-0 text-gray-600 pointer-events-none select-none font-mono text-[15px] sm:text-sm font-bold z-0 flex items-center h-full">
              <span className="opacity-0">{inputVal}</span>
              <span>{ghostSuggestion.slice(inputVal.length)}</span>
            </div>
          )}
        </div>

        {/* Subtle retro transmission activity status badge */}
        {isTyping && (
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/70 border border-current/30 text-[9px] font-mono font-bold pointer-events-none shrink-0 ${getThemePrimaryColor()} shadow-sm`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_6px_currentColor] animate-ping" />
            <span className="tracking-widest">TYPING</span>
          </div>
        )}

        {/* Android Keyboard Toggle Helper Button for Touch Screens */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            terminalAudio.playButtonClick();
            inputRef.current?.focus();
            setTimeout(() => {
              inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
          }}
          className="xs:hidden px-2 py-2 rounded text-xs font-mono font-bold flex items-center justify-center bg-[#181818] hover:bg-[#252525] text-cyan-400 border border-[#333] transition cursor-pointer shrink-0 active:scale-95"
          title="Open Android Keyboard"
          aria-label="Open Keyboard"
        >
          <Keyboard className="w-3.5 h-3.5" />
        </button>

        {/* Interactive Execute Button for Mobile & Touch Android */}
        <button
          type="submit"
          className={`px-3 py-2 rounded text-xs font-mono font-bold flex items-center gap-1 transition cursor-pointer shrink-0 ${
            inputVal.trim()
              ? 'bg-[#00ff41] hover:bg-[#27c93f] text-black shadow-[0_0_10px_rgba(0,255,65,0.4)]'
              : 'bg-[#181818] text-gray-500 hover:text-gray-300'
          }`}
          title="Execute Command (Enter)"
        >
          <Play className="w-3 h-3 fill-current" />
          <span className="text-[10px]">ENTER</span>
        </button>
      </form>
    </div>
  );
};
