import React, { useState, useEffect } from 'react';
import { TerminalTheme } from '../types';
import { Terminal, Shield, CheckCircle, Cpu, Zap, FastForward } from 'lucide-react';
import { terminalAudio } from '../utils/soundEffects';

interface BootSequenceProps {
  onComplete: () => void;
  theme: TerminalTheme;
}

interface BootLog {
  text: string;
  status?: 'OK' | 'INFO' | 'WARN' | 'EXEC';
  delay: number;
}

const BOOT_LOGS: BootLog[] = [
  { text: 'Kali Linux GNU/Linux 6.8.0-kali-automation-sdet x86_64 bootloader', status: 'INFO', delay: 40 },
  { text: 'Loading initial ramdisk (initrd.img-6.8.0-kali)...', status: 'INFO', delay: 50 },
  { text: 'Probing hardware architecture & CPU microcode initialized', status: 'OK', delay: 60 },
  { text: 'Mounting /dev/nvme0n1p2 root partition with ext4 flags [rw,relatime]', status: 'OK', delay: 50 },
  { text: 'Starting systemd v255.4-1kali1 (SDET Engineer Profile Mode)', status: 'OK', delay: 60 },
  { text: 'Initializing cryptographic keys and security modules (AppArmor, SELinux)', status: 'OK', delay: 50 },
  { text: 'Starting Network Time Synchronization & DNS Resolver...', status: 'OK', delay: 50 },
  { text: 'Loading Playwright Test Framework Engine v1.45.0 (Chromium, Firefox, WebKit)', status: 'OK', delay: 70 },
  { text: 'Configuring parallel test worker pools (sharding factor: 4 workers)', status: 'OK', delay: 60 },
  { text: 'Initializing REST APIRequestContext & JSON Schema Validators', status: 'OK', delay: 60 },
  { text: 'Connecting Playwright MCP Server & Agentic Browser Exploration Subsystem', status: 'OK', delay: 70 },
  { text: 'Mounting HCL Technologies Software Engineering automation repositories', status: 'OK', delay: 60 },
  { text: 'Binding GitHub Actions PR-level CI/CD Quality Gates & Jenkins pipelines', status: 'OK', delay: 60 },
  { text: 'Loading Allure Test Artifact Archiver & Trace Viewer Diagnostic Engine', status: 'OK', delay: 60 },
  { text: 'Loading profile data for Akash Kollabathula [SDET / Automation Engineer, 3 YOE]', status: 'OK', delay: 80 },
  { text: 'Verification complete: 85%+ coverage gates active, flakiness <4% verified.', status: 'OK', delay: 60 },
  { text: 'Spawning interactive terminal shell on tty1 (zsh 5.9)...', status: 'EXEC', delay: 90 },
];

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete, theme }) => {
  const [logs, setLogs] = useState<BootLog[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSkipping, setIsSkipping] = useState(false);

  // Keyboard shortcut listener to skip boot sequence
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'Enter', 'Escape'].includes(e.code)) {
        e.preventDefault();
        skipBoot();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (currentIndex < BOOT_LOGS.length) {
      const timeout = setTimeout(() => {
        setLogs((prev) => [...prev, BOOT_LOGS[currentIndex]]);
        terminalAudio.playMechanicalClick('key', 0.04);
        setCurrentIndex((prev) => prev + 1);
      }, BOOT_LOGS[currentIndex].delay);

      return () => clearTimeout(timeout);
    } else {
      const endTimeout = setTimeout(() => {
        terminalAudio.playCommandExecuted();
        onComplete();
      }, 400);
      return () => clearTimeout(endTimeout);
    }
  }, [currentIndex, onComplete]);

  const skipBoot = () => {
    setIsSkipping(true);
    onComplete();
  };

  const progressPercent = Math.min(100, Math.round((currentIndex / BOOT_LOGS.length) * 100));

  return (
    <div
      id="boot-sequence-container"
      className="fixed inset-0 z-50 bg-[#0a0a0a] text-[#00ff41] font-mono flex flex-col justify-between p-4 md:p-8 select-none"
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#222222] pb-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-[#00ff41] animate-ping" />
          <span className="text-xs uppercase tracking-widest text-[#00ff41] font-bold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            Geometric Balance Station // Boot Sequence
          </span>
        </div>
        <button
          onClick={skipBoot}
          id="skip-boot-button"
          className="flex items-center gap-1.5 px-3 py-1 bg-[#0f0f0f] hover:bg-[#1a1a1a] text-gray-300 border border-[#333333] hover:border-cyan-400 text-xs transition-all cursor-pointer"
        >
          <span>Skip Boot [ESC / Click]</span>
          <FastForward className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>

      {/* Boot Logs Terminal Body */}
      <div className="my-auto max-w-4xl w-full mx-auto space-y-1.5 py-4 overflow-y-auto max-h-[70vh]">
        <div className="text-xs text-gray-500 mb-4 pb-2 border-b border-[#222222] font-mono">
          BIOS: GEOMETRIC_SDET_FIRMWARE v2.4 // RAM: 16384MB OK // ENGINE: 4-Worker Playwright Runner
        </div>

        {logs.map((log, index) => (
          <div
            key={index}
            className="flex items-start gap-2.5 text-xs md:text-sm font-mono leading-relaxed animate-in fade-in duration-75"
          >
            <span className="text-gray-600 select-none text-[11px]">
              [{String((index * 0.082).toFixed(4)).padStart(7, '0')}]
            </span>
            {log.status === 'OK' && (
              <span className="text-[#00ff41] font-bold flex items-center gap-1">
                [ <span className="text-[#00ff41]">OK</span> ]
              </span>
            )}
            {log.status === 'INFO' && (
              <span className="text-cyan-400 font-bold">
                [ <span className="text-cyan-300">INFO</span> ]
              </span>
            )}
            {log.status === 'WARN' && (
              <span className="text-amber-400 font-bold">
                [ <span className="text-amber-300">WARN</span> ]
              </span>
            )}
            {log.status === 'EXEC' && (
              <span className="text-fuchsia-400 font-bold">
                [ <span className="text-fuchsia-300">EXEC</span> ]
              </span>
            )}
            <span
              className={
                log.status === 'EXEC'
                  ? 'text-fuchsia-300 font-semibold'
                  : log.status === 'INFO'
                  ? 'text-gray-300'
                  : 'text-gray-200'
              }
            >
              {log.text}
            </span>
          </div>
        ))}

        <div className="flex items-center space-x-1.5 text-sm pt-2">
          <span className="text-white font-bold">akash@kali-box</span>
          <span className="text-gray-400">:</span>
          <span className="text-cyan-400">~</span>
          <span className="text-white">$</span>
          <span className="inline-block w-2 sm:w-2.5 h-4 sm:h-5 bg-[#00ff41] animate-cursor ml-1 shadow-[0_0_8px_#00ff41]" />
        </div>
      </div>

      {/* Progress and status */}
      <div className="max-w-4xl w-full mx-auto border-t border-[#222222] pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="w-full sm:w-1/2 bg-[#0f0f0f] border border-[#222222] h-2 overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-[#00ff41] to-cyan-400 h-full transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center gap-3 text-gray-400 font-mono text-[11px]">
          <span>INITIALIZING QUALITY ENVIRONMENT</span>
          <span className="text-cyan-400 font-bold">{progressPercent}%</span>
        </div>
      </div>
    </div>
  );
};
