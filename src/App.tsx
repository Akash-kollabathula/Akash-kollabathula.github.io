import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TerminalTheme, TerminalOutputItem } from './types';
import { TERMINAL_THEMES, portfolioData, AVAILABLE_COMMANDS } from './data/portfolioData';
import { MatrixBackground } from './components/MatrixBackground';
import { BootSequence } from './components/BootSequence';
import { AsciiBanner } from './components/AsciiBanner';
import { TerminalHeader } from './components/TerminalHeader';
import { TerminalPrompt } from './components/TerminalPrompt';
import { CommandOutput } from './components/CommandOutput';
import { ResumeModal } from './components/ResumeModal';
import { MobileQuickBar } from './components/MobileQuickBar';
import { GuiPortfolio } from './components/GuiPortfolio';
import { terminalAudio } from './utils/soundEffects';
import { speechVoice } from './utils/speechVoice';
import { avatarStore } from './utils/avatarStore';
import { downloadResumePDF } from './utils/pdfGenerator';
import { CheckCircle2, Loader2, Keyboard, Terminal as TerminalIcon, ChevronUp, ChevronDown } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'cli' | 'gui'>('cli');
  const [bootCompleted, setBootCompleted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<TerminalTheme>('kali-green');
  const [matrixEnabled, setMatrixEnabled] = useState(true);
  const [scanlinesEnabled, setScanlinesEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => terminalAudio.isEnabled());
  const [soundVolume, setSoundVolume] = useState<number>(() => terminalAudio.getVolume());
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Chat / Gemini history state for multi-turn conversations
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ role: 'user' | 'model'; text: string }>>([]);
  
  // Download progress state
  const [downloadingFile, setDownloadingFile] = useState<{
    active: boolean;
    name: string;
    progress: number;
    completed: boolean;
  } | null>(null);

  const [outputHistory, setOutputHistory] = useState<TerminalOutputItem[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Smooth scroll helper for keyboard shortcuts & mobile controls
  const scrollViewport = useCallback((deltaY: number) => {
    if (viewportRef.current) {
      viewportRef.current.scrollBy({ top: deltaY, behavior: 'smooth' });
      terminalAudio.playScrollTick();
    }
    // Also smoothly scroll window if on small mobile screen
    if (window.innerHeight < 700) {
      window.scrollBy({ top: deltaY, behavior: 'smooth' });
    }
  }, []);

  // Auto-scroll to bottom of terminal when new output is added
  useEffect(() => {
    if (bootCompleted) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [outputHistory, bootCompleted]);

  // Voice announcement on initial boot completion: "Opening Akash portfolio"
  useEffect(() => {
    if (bootCompleted) {
      speechVoice.announcePortfolioOpen();
    }
  }, [bootCompleted]);

  // Global Keyboard Navigation & Accessibility (No mouse usage required)
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (isResumeModalOpen || !bootCompleted) return;

      // 1. ArrowUp: if target is NOT the CLI input, or with Shift/Ctrl, or PageUp -> Scroll UP
      if (
        (e.key === 'ArrowUp' && e.target !== inputRef.current) ||
        (e.shiftKey && e.key === 'ArrowUp') ||
        (e.ctrlKey && e.key === 'ArrowUp') ||
        e.key === 'PageUp'
      ) {
        e.preventDefault();
        scrollViewport(-280);
        return;
      }

      // 2. ArrowDown: if target is NOT the CLI input, or with Shift/Ctrl, or PageDown -> Scroll DOWN
      if (
        (e.key === 'ArrowDown' && e.target !== inputRef.current) ||
        (e.shiftKey && e.key === 'ArrowDown') ||
        (e.ctrlKey && e.key === 'ArrowDown') ||
        e.key === 'PageDown'
      ) {
        e.preventDefault();
        scrollViewport(280);
        return;
      }

      // 3. Home: Scroll to top
      if (e.key === 'Home') {
        e.preventDefault();
        viewportRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        terminalAudio.playScrollTick();
        return;
      }

      // 4. End: Scroll to bottom
      if (e.key === 'End') {
        e.preventDefault();
        if (viewportRef.current) {
          viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
        }
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        terminalAudio.playScrollTick();
        return;
      }

      // 5. Ctrl + L: Clear terminal screen
      if ((e.ctrlKey || e.metaKey) && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        setOutputHistory([]);
        terminalAudio.playMechanicalClick('enter');
        return;
      }

      // 6. Ctrl + G or Alt + G: Toggle between CLI and GUI mode
      if ((e.ctrlKey || e.metaKey || e.altKey) && (e.key === 'g' || e.key === 'G')) {
        e.preventDefault();
        terminalAudio.playThemeSwitch();
        setViewMode((prev) => (prev === 'cli' ? 'gui' : 'cli'));
        return;
      }

      // If already focused on input, let input handle its own keys
      if (e.target === inputRef.current) return;

      // 6. Direct any alphanumeric / symbol keypress directly to CLI input
      if (
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        e.key.length === 1 &&
        inputRef.current
      ) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isResumeModalOpen, bootCompleted, scrollViewport]);

  // Audio unlock listener for mobile & modern browsers (browser requires user gesture)
  useEffect(() => {
    const handleFirstGesture = () => {
      terminalAudio.unlockAudio();
    };
    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  // Global drag-and-drop listener to set profile picture if Akashface.jpg is dropped
  useEffect(() => {
    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            if (ev.target?.result) {
              avatarStore.setCustomPhoto(ev.target.result as string);
              terminalAudio.playSuccessChime();
            }
          };
          reader.readAsDataURL(file);
        }
      }
    };

    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);
    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, []);

  // Sound toggling
  const handleToggleSound = (forceState?: boolean) => {
    const newState = terminalAudio.toggleSound(forceState);
    speechVoice.toggleVoice(newState);
    setSoundEnabled(newState);
  };

  // Sound volume adjustment
  const handleChangeVolume = (volume: number) => {
    const newVol = terminalAudio.setVolume(volume);
    setSoundVolume(newVol);
    if (!soundEnabled && newVol > 0) {
      setSoundEnabled(true);
      speechVoice.toggleVoice(true);
    }
  };

  // Direct Resume PDF Download
  const handleDownloadResume = async () => {
    const fileName = 'Akash_Kollabathula_SDET_Resume.pdf';
    setDownloadingFile({
      active: true,
      name: fileName,
      progress: 15,
      completed: false,
    });

    terminalAudio.playDownloadBurst();

    try {
      await downloadResumePDF((progress) => {
        setDownloadingFile((prev) => (prev ? { ...prev, progress } : null));
      });

      setDownloadingFile({
        active: true,
        name: fileName,
        progress: 100,
        completed: true,
      });

      terminalAudio.playSuccessChime();

      setTimeout(() => {
        setDownloadingFile(null);
      }, 3500);
    } catch {
      terminalAudio.playWrongCommandAlert();
      setDownloadingFile(null);
    }
  };

  const handleViewportScroll = () => {
    terminalAudio.playScrollTick();
  };

  const handleTerminalBodyClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.closest(
      'button, a, input, select, textarea, [role="button"], [data-clickable], .cursor-pointer'
    );
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;
    if (!isInteractive) {
      inputRef.current?.focus();
    }
  };

  const handleTerminalBodyTouch = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.closest(
      'button, a, input, select, textarea, [role="button"], [data-clickable], .cursor-pointer'
    );
    if (isInteractive) return;
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return;
    if (inputRef.current) {
      inputRef.current.focus();
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }
  };

  // Enable mouse wheel scrolling everywhere across the terminal window
  const handleTerminalWheel = (e: React.WheelEvent) => {
    if (viewportRef.current) {
      if (e.target !== viewportRef.current && !viewportRef.current.contains(e.target as Node)) {
        viewportRef.current.scrollTop += e.deltaY;
      }
    }
  };

  const handleExecuteCommand = async (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    if (!trimmed) return;

    // Update command history for Up/Down arrows
    setCommandHistory((prev) => [...prev, trimmed]);

    const lower = trimmed.toLowerCase();
    const [cmd, ...args] = lower.split(' ');
    const firstArg = args[0] || '';

    // Validate command against all known commands & aliases
    const knownCmds = AVAILABLE_COMMANDS.map((c) => c.cmd);
    const isKnown =
      knownCmds.includes(cmd) ||
      [
        'gui', 'desktop', 'ui', 'cli', 'terminal', 'shell',
        'photo', 'avatar',
        'clear', 'cls', 'reboot', 'restart', 'theme', 'matrix', 'scanlines',
        'sound', 'audio', 'volume', 'sfx', 'resume', 'cv', 'email', 'contact',
        'contacts', 'github', 'linkedin', 'sudo', 'cowsay', 'whoami', 'bio',
        'summary', 'stack', 'tech', 'career', 'work', 'exp', 'proj', 'project',
        'stats', 'metrics', 'impact', 'edu', 'degree', 'certs', 'certificates',
        'playwright', 'run', 'gemini', 'chat', 'ask', 'ai', 'scroll'
      ].includes(cmd);

    // If wrong / unrecognized command: play dual alert sound & announce warning!
    if (!isKnown) {
      terminalAudio.playWrongCommandAlert();
      speechVoice.announceWrongCommand(cmd);
    } else {
      terminalAudio.playCommandExecuted();
      speechVoice.announceCommand(cmd);
    }

    // GUI / DESKTOP command: switch to modern GUI layout
    if (cmd === 'gui' || cmd === 'desktop' || cmd === 'ui') {
      terminalAudio.playThemeSwitch();
      setViewMode('gui');
      return;
    }

    // CLI / TERMINAL command: ensure CLI view is active
    if (cmd === 'cli' || cmd === 'terminal' || cmd === 'shell') {
      terminalAudio.playCommandExecuted();
      setViewMode('cli');
      return;
    }

    // SCROLL command
    if (cmd === 'scroll') {
      if (firstArg === 'up') {
        scrollViewport(-350);
        return;
      } else if (firstArg === 'down') {
        scrollViewport(350);
        return;
      } else if (firstArg === 'top') {
        viewportRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      } else if (firstArg === 'bottom') {
        viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
        return;
      }
    }

    // CLEAR command
    if (cmd === 'clear' || cmd === 'cls') {
      setOutputHistory([]);
      return;
    }

    // REBOOT / RESTART command
    if (cmd === 'reboot' || cmd === 'restart') {
      setBootCompleted(false);
      setOutputHistory([]);
      return;
    }

    // THEME switcher command
    if (cmd === 'theme') {
      if (firstArg && Object.keys(TERMINAL_THEMES).includes(firstArg)) {
        setCurrentTheme(firstArg as TerminalTheme);
      }
    }

    // PHOTO / AVATAR styling command
    if (cmd === 'photo' || cmd === 'avatar') {
      if (firstArg === 'terminal' || firstArg === 'term' || firstArg === 'matrix') {
        avatarStore.setFilterStyle('terminal');
      } else if (firstArg === 'cyber' || firstArg === 'glow') {
        avatarStore.setFilterStyle('cyber');
      } else if (firstArg === 'natural' || firstArg === 'clean' || firstArg === 'normal' || firstArg === 'off') {
        avatarStore.setFilterStyle('natural');
      } else {
        avatarStore.cycleFilterStyle();
      }
      terminalAudio.playThemeSwitch();
    }

    // MATRIX toggle command
    if (cmd === 'matrix') {
      if (firstArg === 'off' || firstArg === '0') {
        setMatrixEnabled(false);
      } else if (firstArg === 'on' || firstArg === '1') {
        setMatrixEnabled(true);
      } else {
        setMatrixEnabled((prev) => !prev);
      }
    }

    // SCANLINES toggle command
    if (cmd === 'scanlines') {
      if (firstArg === 'off' || firstArg === '0') {
        setScanlinesEnabled(false);
      } else if (firstArg === 'on' || firstArg === '1') {
        setScanlinesEnabled(true);
      } else {
        setScanlinesEnabled((prev) => !prev);
      }
    }

    // SOUND / AUDIO / VOLUME commands
    if (cmd === 'sound' || cmd === 'audio' || cmd === 'sfx') {
      if (firstArg === 'off' || firstArg === '0' || firstArg === 'mute') {
        handleToggleSound(false);
      } else if (firstArg === 'on' || firstArg === '1') {
        handleToggleSound(true);
      } else {
        const num = parseFloat(firstArg);
        if (!isNaN(num)) {
          const normalized = num > 1 ? num / 100 : num;
          handleChangeVolume(normalized);
        } else {
          handleToggleSound();
        }
      }
    }

    if (cmd === 'volume') {
      const num = parseFloat(firstArg);
      if (!isNaN(num)) {
        const normalized = num > 1 ? num / 100 : num;
        handleChangeVolume(normalized);
      } else if (firstArg === 'mute' || firstArg === 'off') {
        handleToggleSound(false);
      } else if (firstArg === 'on') {
        handleToggleSound(true);
      }
    }

    // RESUME command
    if (cmd === 'resume' || cmd === 'cv') {
      if (firstArg === 'download' || firstArg === 'pdf') {
        handleDownloadResume();
      } else if (firstArg === 'modal' || firstArg === 'viewer') {
        setIsResumeModalOpen(true);
      }
    }

    // EMAIL command
    if (cmd === 'email') {
      const mailto = `mailto:${portfolioData.contacts.email}?subject=Portfolio%20Inquiry%20-%20Akash%20Kollabathula%20SDET&body=Hi%20Akash,%0D%0A%0D%0AI%20reviewed%20your%20SDET%20portfolio%20and%20would%20like%20to%20connect%20regarding%20an%20opportunity.`;
      window.location.href = mailto;
    }

    // GITHUB link open
    if (cmd === 'github' && (firstArg === 'open' || firstArg === 'go')) {
      terminalAudio.playProjectOpen();
      window.open(portfolioData.contacts.github, '_blank', 'noopener,noreferrer');
    }

    // LINKEDIN link open
    if (cmd === 'linkedin' && (firstArg === 'open' || firstArg === 'go')) {
      terminalAudio.playProjectOpen();
      window.open(portfolioData.contacts.linkedin, '_blank', 'noopener,noreferrer');
    }

    // Append to output history
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const newEntry: TerminalOutputItem = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: timeStr,
      command: trimmed,
    };

    setOutputHistory((prev) => [...prev, newEntry]);

    // Handle Gemini AI multi-turn interaction
    if (cmd === 'gemini' || cmd === 'chat' || cmd === 'ask' || cmd === 'ai') {
      const userPrompt = args.join(' ') || 'Summarize Akash Kollabathula\'s SDET experience and technical skills';
      try {
        const res = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userPrompt,
            history: aiChatHistory,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.reply || 'AI response processed.';
          
          setAiChatHistory((prev) => [
            ...prev,
            { role: 'user', text: userPrompt },
            { role: 'model', text: reply },
          ]);

          setOutputHistory((prev) =>
            prev.map((item) =>
              item.id === newEntry.id
                ? { ...item, rawText: reply, data: { query: userPrompt, reply } }
                : item
            )
          );
        }
      } catch {
        // Fallback already pre-rendered in CommandOutput
      }
    }
  };

  if (viewMode === 'gui') {
    return (
      <div id="portfolio-gui-root" className="min-h-screen bg-[#07090c] text-white">
        <GuiPortfolio
          currentTheme={currentTheme}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onSwitchToCli={() => {
            terminalAudio.playThemeSwitch();
            setViewMode('cli');
          }}
          onOpenResumeModal={() => setIsResumeModalOpen(true)}
          onDownloadResume={handleDownloadResume}
          onThemeChange={(theme) => setCurrentTheme(theme)}
        />

        {/* Recruiter-friendly printable Resume Modal */}
        <ResumeModal
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div
      id="portfolio-root"
      className="min-h-screen bg-[#0a0a0a] text-[#00ff41] font-mono relative overflow-x-hidden pointer-events-auto select-auto"
      style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
    >
      {/* Optional CRT Scanline Shader Overlay - strictly non-blocking */}
      {scanlinesEnabled && (
        <div
          className="fixed inset-0 pointer-events-none z-20 crt-scanlines"
          aria-hidden="true"
        />
      )}

      {/* Matrix digital rain background */}
      <MatrixBackground enabled={matrixEnabled} theme={currentTheme} opacity={0.06} />

      {/* Boot Animation Sequence */}
      {!bootCompleted && (
        <BootSequence
          theme={currentTheme}
          onComplete={() => setBootCompleted(true)}
        />
      )}

      {/* Main Terminal UI Container */}
      <div
        className={`relative z-10 flex flex-col transition-all duration-200 ${
          isFullscreen
            ? 'w-full min-h-screen p-0'
            : 'max-w-6xl mx-auto min-h-screen p-1 sm:p-4 md:p-6'
        }`}
      >
        {/* Terminal Window Wrapper with Global Wheel Scroll Listener */}
        <div
          id="kali-terminal-window"
          onWheel={handleTerminalWheel}
          className="flex-1 flex flex-col bg-[#0a0a0a] border border-[#222222] shadow-2xl transition-all rounded-none sm:rounded-lg overflow-hidden"
        >
          {/* Top Window Header (Linux Chrome) */}
          <TerminalHeader
            currentTheme={currentTheme}
            soundEnabled={soundEnabled}
            soundVolume={soundVolume}
            onToggleSound={handleToggleSound}
            onExecuteCommand={handleExecuteCommand}
            onReboot={() => {
              setBootCompleted(false);
              setOutputHistory([]);
            }}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
            onSwitchToGui={() => {
              terminalAudio.playThemeSwitch();
              setViewMode('gui');
            }}
          />

          {/* Download Progress Toast */}
          {downloadingFile && (
            <div
              id="terminal-download-toast"
              className="bg-[#111827] border-b border-emerald-500/50 px-4 py-2 flex items-center justify-between gap-3 text-xs font-mono select-none animate-in slide-in-from-top-2 duration-150"
            >
              <div className="flex items-center gap-2 text-white">
                {downloadingFile.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#00ff41]" />
                ) : (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                )}
                <span>
                  <strong className="text-cyan-300">curl -O</strong> {downloadingFile.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-32 sm:w-48 h-2 bg-black/80 rounded-full overflow-hidden border border-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-[#00ff41] transition-all duration-150"
                    style={{ width: `${downloadingFile.progress}%` }}
                  />
                </div>
                <span className="text-[#00ff41] font-bold text-[11px]">
                  {downloadingFile.progress}%
                </span>
                {downloadingFile.completed && (
                  <span className="text-emerald-400 font-bold hidden sm:inline">[DOWNLOAD COMPLETE]</span>
                )}
              </div>
            </div>
          )}

          {/* Terminal Main Body / Output Log Area with high-performance touch scrolling */}
          <div
            id="terminal-viewport"
            ref={viewportRef}
            onClick={handleTerminalBodyClick}
            onTouchEnd={handleTerminalBodyTouch}
            onScroll={handleViewportScroll}
            className="flex-1 p-2.5 sm:p-5 md:p-6 pb-28 md:pb-8 overflow-y-auto min-h-[50vh] max-h-[calc(100dvh-130px)] md:max-h-[calc(100vh-120px)] space-y-5 cursor-text select-text bg-[#0a0a0a] touch-pan-y"
            style={{
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
            }}
          >
            {/* Welcome banner & profile specs */}
            <AsciiBanner
              theme={currentTheme}
              onExecuteCommand={handleExecuteCommand}
            />

            {/* Rendered History Items */}
            {outputHistory.map((item) => (
              <CommandOutput
                key={item.id}
                item={item}
                theme={currentTheme}
                onExecuteCommand={handleExecuteCommand}
                onOpenResumeModal={() => setIsResumeModalOpen(true)}
                onDownloadResume={handleDownloadResume}
              />
            ))}

            {/* Active Command Input Prompt with mobile quick-action chips */}
            <TerminalPrompt
              theme={currentTheme}
              onExecute={handleExecuteCommand}
              commandHistory={commandHistory}
              inputRef={inputRef}
              onScrollUp={() => scrollViewport(-280)}
              onScrollDown={() => scrollViewport(280)}
            />

            <div ref={terminalEndRef} />
          </div>

          {/* Keyboard Navigation Helper Status Bar */}
          <div
            id="terminal-status-bar"
            className="border-t border-[#1a1a1a] bg-[#080808] px-3 py-1.5 flex flex-wrap items-center justify-between text-[10px] text-gray-400 font-mono select-none gap-1"
          >
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <Keyboard className="w-3 h-3 text-[#00ff41]" />
              <span>
                <kbd className="text-[#00ff41] font-bold">↑/↓</kbd> Scroll & History
              </span>
              <span className="text-gray-600">|</span>
              <span>
                <kbd className="text-cyan-400 font-bold">PgUp/PgDn</kbd> Page Scroll
              </span>
              <span className="text-gray-600">|</span>
              <span>
                <kbd className="text-yellow-400 font-bold">Tab</kbd> Complete
              </span>
              <span className="text-gray-600">|</span>
              <span>
                <kbd className="text-[#ef4444] font-bold">Ctrl+L</kbd> Clear
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-500 hidden sm:flex">
              <TerminalIcon className="w-3 h-3 text-cyan-400" />
              <span>Interactive Shell • Mouse, Touch & Keyboard Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Quick-Scroll Controls for Mouse, Touchpad & Mobile */}
      <div className="fixed bottom-20 sm:bottom-12 right-3 z-30 flex flex-col gap-1.5 select-none opacity-85 hover:opacity-100 transition">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            scrollViewport(-320);
          }}
          className="w-9 h-9 rounded bg-[#121212]/95 border border-[#333] hover:border-[#00ff41] text-[#00ff41] flex items-center justify-center shadow-xl active:scale-90 cursor-pointer backdrop-blur-sm"
          title="Scroll Page Up"
          aria-label="Scroll Page Up"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            scrollViewport(320);
          }}
          className="w-9 h-9 rounded bg-[#121212]/95 border border-[#333] hover:border-[#00ff41] text-[#00ff41] flex items-center justify-center shadow-xl active:scale-90 cursor-pointer backdrop-blur-sm"
          title="Scroll Page Down"
          aria-label="Scroll Page Down"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Sticky Mobile Quick Navigation & Keyboard Bar for Android & Mobile phones */}
      <MobileQuickBar
        onExecute={handleExecuteCommand}
        onDownloadResume={handleDownloadResume}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onSwitchToGui={() => {
          terminalAudio.playThemeSwitch();
          setViewMode('gui');
        }}
        onFocusInput={() => {
          inputRef.current?.focus();
          setTimeout(() => {
            inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 150);
        }}
      />

      {/* Recruiter-friendly printable Resume Modal */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </div>
  );
}
