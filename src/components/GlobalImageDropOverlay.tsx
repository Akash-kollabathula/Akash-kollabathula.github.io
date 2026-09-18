import React, { useState, useEffect, useRef } from 'react';
import { avatarStore } from '../utils/avatarStore';
import { terminalAudio } from '../utils/soundEffects';
import { Upload, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export const GlobalImageDropOverlay: React.FC = () => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setToastMessage('Error: Selected file is not an image.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        avatarStore.setCustomPhoto(dataUrl);
        terminalAudio.playSuccessChime();
        setToastMessage(`[OK] Exact profile picture updated: ${file.name}`);
        setTimeout(() => setToastMessage(null), 4500);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current += 1;
      if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
        setIsDraggingOver(true);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setIsDraggingOver(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDraggingOver(false);

      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            handleFile(blob);
            break;
          }
        }
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);
    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <>
      {/* Hidden file input for global picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
          }
          if (e.target) e.target.value = '';
        }}
      />

      {/* Global Drag Overlay */}
      {isDraggingOver && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 border-4 border-dashed border-[#00ff41] animate-pulse">
          <div className="max-w-md w-full bg-[#050907] border border-[#00ff41] p-6 rounded-lg text-center shadow-[0_0_50px_rgba(0,255,65,0.4)] space-y-4 font-mono">
            <Upload className="w-16 h-16 text-[#00ff41] mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white tracking-wide">
              DROP EXACT PROFILE IMAGE HERE
            </h3>
            <p className="text-xs text-gray-300">
              Release to apply <span className="text-[#00ff41] font-semibold">ChatGPT Image Sep 18, 2026, 10_04_10 PM.png</span> directly as your real profile picture.
            </p>
            <p className="text-[11px] text-cyan-400">
              [ 100% Photographic Fidelity • Zero AI Face Modifications ]
            </p>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-black/95 border border-[#00ff41] text-[#00ff41] text-xs font-mono rounded shadow-[0_0_20px_rgba(0,255,65,0.3)] animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#00ff41] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};
