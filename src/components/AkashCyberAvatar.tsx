import React from 'react';
import { AKASH_PROFILE_IMAGE } from '../assets/avatar';
import { TerminalTheme } from '../types';

interface AkashCyberAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showStatus?: boolean;
  showToggle?: boolean;
  defaultMode?: string;
  theme?: TerminalTheme;
}

export const AkashCyberAvatar: React.FC<AkashCyberAvatarProps> = ({
  size = 'md',
  className = '',
  showStatus = true,
  theme = 'kali-green',
}) => {
  const dim = size === 'sm' ? 44 : size === 'lg' ? 160 : 124;

  // Derive theme-specific accent colors for outer border & HUD frame
  const themeColors = {
    'kali-green': {
      border: 'border-[#00ff41]/80',
      glow: 'shadow-[0_0_16px_rgba(0,255,65,0.35)]',
      hud: '#00ff41',
      badgeText: 'text-[#00ff41]',
      badgeBorder: 'border-[#00ff41]/50',
    },
    'cyber-cyan': {
      border: 'border-[#00e5ff]/80',
      glow: 'shadow-[0_0_16px_rgba(0,229,255,0.35)]',
      hud: '#00e5ff',
      badgeText: 'text-[#00e5ff]',
      badgeBorder: 'border-[#00e5ff]/50',
    },
    'amber-phosphor': {
      border: 'border-[#ffb000]/80',
      glow: 'shadow-[0_0_16px_rgba(255,176,0,0.35)]',
      hud: '#ffb000',
      badgeText: 'text-[#ffb000]',
      badgeBorder: 'border-[#ffb000]/50',
    },
    'hacker-purple': {
      border: 'border-[#c084fc]/80',
      glow: 'shadow-[0_0_16px_rgba(192,132,252,0.35)]',
      hud: '#c084fc',
      badgeText: 'text-[#c084fc]',
      badgeBorder: 'border-[#c084fc]/50',
    },
    'matrix-dark': {
      border: 'border-[#00ff41]/90',
      glow: 'shadow-[0_0_18px_rgba(0,255,65,0.45)]',
      hud: '#00ff41',
      badgeText: 'text-[#00ff41]',
      badgeBorder: 'border-[#00ff41]/60',
    },
  }[theme] || {
    border: 'border-[#00ff41]/80',
    glow: 'shadow-[0_0_16px_rgba(0,255,65,0.35)]',
    hud: '#00ff41',
    badgeText: 'text-[#00ff41]',
    badgeBorder: 'border-[#00ff41]/50',
  };

  return (
    <div
      id="akash-profile-avatar-container"
      className={`inline-flex flex-col items-center select-none font-mono ${className}`}
    >
      {/* Profile Frame with Cyber HUD */}
      <div
        style={{ width: `${dim}px`, height: `${dim}px` }}
        className={`relative rounded-md overflow-hidden border-2 bg-black transition-all shrink-0 ${themeColors.border} ${themeColors.glow}`}
        title="Akash Kollabathula • SDET & Automation Engineer"
      >
        {/* EXACT REAL PROFILE IMAGE */}
        <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
          <img
            src={AKASH_PROFILE_IMAGE}
            alt="Akash Kollabathula"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top"
            style={{
              filter: 'none',
              transform: 'none',
            }}
          />
        </div>

        {/* Cyber HUD Corner Brackets */}
        <div
          className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 z-10 pointer-events-none transition-colors"
          style={{ borderColor: themeColors.hud }}
        />
        <div
          className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 z-10 pointer-events-none transition-colors"
          style={{ borderColor: themeColors.hud }}
        />
        <div
          className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 z-10 pointer-events-none transition-colors"
          style={{ borderColor: '#00e5ff' }}
        />
        <div
          className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 z-10 pointer-events-none transition-colors"
          style={{ borderColor: '#00e5ff' }}
        />

        {/* Status indicator badge */}
        {showStatus && (
          <div
            className={`absolute bottom-1 right-1 z-20 flex items-center gap-1 px-1.5 py-0.5 bg-black/90 rounded border ${themeColors.badgeBorder} ${themeColors.badgeText} text-[8px] font-mono shadow-sm pointer-events-none`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: themeColors.hud }}
            />
            <span className="font-semibold tracking-tighter">ONLINE</span>
          </div>
        )}
      </div>

      <div className="text-[10px] text-gray-400 mt-1 font-mono tracking-tight text-center flex items-center gap-1">
        <span>Akash</span>
        <span className="text-red-400 font-bold">Kollabathula</span>
      </div>
    </div>
  );
};

