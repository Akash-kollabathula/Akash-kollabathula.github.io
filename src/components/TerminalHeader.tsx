import React from 'react';
import { TerminalTheme } from '../types';
import { Activity, Volume2, VolumeX, Maximize2, Minimize2, Layout } from 'lucide-react';
import { terminalAudio } from '../utils/soundEffects';

interface TerminalHeaderProps {
  currentTheme: TerminalTheme;
  soundEnabled: boolean;
  soundVolume: number;
  onToggleSound: () => void;
  onExecuteCommand: (cmd: string) => void;
  onReboot: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onSwitchToGui: () => void;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  currentTheme,
  soundEnabled,
  soundVolume,
  onToggleSound,
  onExecuteCommand,
  onReboot,
  isFullscreen,
  onToggleFullscreen,
  onSwitchToGui,
}) => {
  return (
    <header
      id="kali-terminal-header"
      className="sticky top-0 z-40 bg-[#0d0d0d] border-b border-[#222222] px-3 sm:px-4 py-2 flex items-center justify-between gap-2 select-none font-mono"
    >
      {/* Left: Window Controls & Active Shell Tab */}
      <div className="flex items-center gap-3">
        {/* Linux window dots */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              terminalAudio.playButtonClick();
              onExecuteCommand('clear');
            }}
            title="Clear terminal screen (Ctrl+L)"
            className="w-3 h-3 rounded-full bg-[#ff5f56] hover:opacity-80 transition cursor-pointer flex items-center justify-center group"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black font-bold leading-none">×</span>
          </button>
          <button
            onClick={() => {
              terminalAudio.playButtonClick();
              onReboot();
            }}
            title="Reboot Kali session (reboot)"
            className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:opacity-80 transition cursor-pointer flex items-center justify-center group"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[7px] text-black font-bold leading-none">-</span>
          </button>
          <button
            onClick={() => {
              terminalAudio.playButtonClick();
              onToggleFullscreen();
            }}
            title="Toggle fullscreen view"
            className="w-3 h-3 rounded-full bg-[#27c93f] hover:opacity-80 transition cursor-pointer flex items-center justify-center group"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[6px] text-black font-bold leading-none">+</span>
          </button>
        </div>

        {/* Path / Host Label */}
        <div className="text-xs text-gray-300 font-bold tracking-wider font-mono">
          <span className="text-[#00ff41]">root</span>@<span className="text-cyan-400">kali</span>
          <span className="hidden sm:inline">
            -box:<span className="text-gray-400">~</span>/<span className="text-white">portfolio</span>
          </span>
        </div>
      </div>

      {/* Center: Live Diagnostic Hardware Monitor */}
      <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-gray-400 bg-[#050505] px-3 py-1 border border-[#222222] rounded">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#00ff41] animate-pulse" />
          <span>SDET WORKERS: <strong className="text-[#00ff41]">4 PARALLEL</strong></span>
        </div>
        <span className="text-[#333333]">|</span>
        <div>
          <span>COVERAGE: <strong className="text-cyan-400">85%+</strong></span>
        </div>
        <span className="text-[#333333]">|</span>
        <div>
          <span>ENGINE: <strong className="text-white">Playwright</strong></span>
        </div>
      </div>

      {/* Right: Sound, Mode & Screen Status */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono">
        {/* Switch to GUI Mode Button (vijay-narasimha reference style) */}
        <button
          type="button"
          id="cli-quick-gui-btn"
          onClick={(e) => {
            e.stopPropagation();
            terminalAudio.playThemeSwitch();
            onSwitchToGui();
          }}
          className="min-h-[34px] px-2.5 sm:px-3 py-1 rounded border border-cyan-500/50 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 hover:text-white font-bold transition cursor-pointer flex items-center gap-1.5 text-[11px] select-none active:scale-95 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
          title="Switch to Desktop GUI Mode (or type 'gui')"
        >
          <Layout className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="tracking-wide">Switch to GUI</span>
        </button>

        {/* Audio Toggle Indicator */}
        <button
          type="button"
          id="terminal-audio-toggle-button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSound();
          }}
          className={`min-h-[34px] px-2 sm:px-2.5 py-1 rounded border transition cursor-pointer flex items-center gap-1.5 text-[11px] select-none active:scale-95 ${
            soundEnabled
              ? 'border-emerald-500/70 bg-emerald-950/40 text-[#00ff41] shadow-[0_0_8px_rgba(0,255,65,0.25)]'
              : 'border-[#333333] bg-[#141414] text-gray-400 hover:text-gray-200'
          }`}
          title={soundEnabled ? 'Audio SFX Active - Click to Mute' : 'Audio Muted - Click to Enable Sound'}
          aria-label={soundEnabled ? 'Mute audio' : 'Unmute audio'}
        >
          {soundEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-[#00ff41] animate-pulse shrink-0" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          )}
          <span className="font-bold text-[10px] tracking-wide hidden sm:inline">
            {soundEnabled ? 'AUDIO ON' : 'MUTED'}
          </span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            terminalAudio.playButtonClick();
            onToggleFullscreen();
          }}
          className="min-h-[34px] px-2 py-1 rounded border border-[#2a2a2a] bg-[#141414] hover:border-cyan-400/60 text-gray-400 hover:text-cyan-300 transition cursor-pointer flex items-center justify-center active:scale-95"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
