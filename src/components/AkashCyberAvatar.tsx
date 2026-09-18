import React, { useEffect, useState, useRef } from 'react';
import { avatarStore } from '../utils/avatarStore';
import { terminalAudio } from '../utils/soundEffects';
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
  const [photoUrl, setPhotoUrl] = useState<string>(() => avatarStore.getPhotoUrl());
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with avatarStore
  useEffect(() => {
    const unsub = avatarStore.subscribe(() => {
      setPhotoUrl(avatarStore.getPhotoUrl());
    });
    return unsub;
  }, []);

  const dim = size === 'sm' ? 44 : size === 'lg' ? 160 : 124;

  // Derive theme-specific accent colors for outer border & HUD frame only
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

  const processImageFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        avatarStore.setCustomPhoto(ev.target.result as string);
        terminalAudio.playSuccessChime();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
    if (e.target) e.target.value = '';
  };

  const handleAvatarClick = () => {
    terminalAudio.playButtonClick();
    fileInputRef.current?.click();
  };

  return (
    <div
      id="akash-profile-avatar-container"
      className={`inline-flex flex-col items-center select-none font-mono ${className}`}
    >
      {/* Hidden file input for one-click selection of exact photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Profile Frame with Cyber HUD */}
      <div
        onClick={handleAvatarClick}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        style={{ width: `${dim}px`, height: `${dim}px` }}
        className={`relative rounded-md overflow-hidden border-2 bg-black transition-all shrink-0 cursor-pointer group ${
          isDragging
            ? 'border-cyan-400 ring-2 ring-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.6)]'
            : `${themeColors.border} ${themeColors.glow} hover:border-cyan-400 hover:shadow-[0_0_22px_rgba(0,217,255,0.45)]`
        }`}
        title="Akash Kollabathula • Exact Profile Picture (Click to select photo or drop image file)"
      >
        {photoUrl ? (
          /* EXACT UNMODIFIED REAL IMAGE - Pure Photographic Fidelity without any AI alterations or filters */
          <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
            <img
              src={photoUrl}
              alt="Akash Kollabathula"
              referrerPolicy="no-referrer"
              onError={() => {
                avatarStore.resetPhoto();
                setPhotoUrl('');
              }}
              className="w-full h-full object-cover object-top"
              style={{
                filter: 'none',
                transform: 'none',
              }}
            />
          </div>
        ) : (
          /* Prompt to load the exact photo */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#0a120d] via-[#050907] to-[#020503] text-center p-2 group-hover:bg-[#09150d] transition-colors">
            <span
              className={`${
                size === 'sm'
                  ? 'text-xs font-bold'
                  : size === 'lg'
                  ? 'text-3xl font-extrabold'
                  : 'text-xl font-extrabold'
              } text-[#00ff41] tracking-widest drop-shadow-[0_0_8px_rgba(0,255,65,0.6)]`}
            >
              AK
            </span>
            <span className="text-[8px] text-gray-400 tracking-tight mt-1 flex items-center gap-1 font-semibold text-cyan-400">
              [+ CHOOSE PHOTO]
            </span>
            {size === 'lg' && (
              <span className="text-[7.5px] text-gray-500 mt-0.5 max-w-[120px] leading-tight">
                Click or Drop ChatGPT Image
              </span>
            )}
          </div>
        )}

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-1 pointer-events-none z-30">
          <span className="text-[#00ff41] text-[10px] font-bold">
            {photoUrl ? 'CHANGE PHOTO' : 'SELECT PHOTO'}
          </span>
          <span className="text-[8px] text-gray-300 mt-0.5">
            Click / Drop exact image
          </span>
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
            <span className="font-semibold tracking-tighter">
              {photoUrl ? 'EXACT' : 'AK'}
            </span>
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
