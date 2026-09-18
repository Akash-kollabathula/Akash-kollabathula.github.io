import React from 'react';
import { TerminalTheme } from '../types';
import { portfolioData } from '../data/portfolioData';
import { AkashCyberAvatar } from './AkashCyberAvatar';
import { terminalAudio } from '../utils/soundEffects';

interface AsciiBannerProps {
  theme: TerminalTheme;
  onExecuteCommand: (cmd: string) => void;
}

export const AsciiBanner: React.FC<AsciiBannerProps> = ({ theme, onExecuteCommand }) => {
  return (
    <div id="terminal-welcome-banner" className="space-y-4 mb-4 select-text font-mono">
      {/* 1. System Boot Messages */}
      <div className="text-[10px] sm:text-[11px] leading-relaxed text-cyan-400 font-mono">
        <div>[  <span className="text-[#00ff41] font-bold">OK</span>  ] Mounted /dev/playwright-engine (v1.45.0)</div>
        <div>[  <span className="text-[#00ff41] font-bold">OK</span>  ] Started SDET Portfolio Interface Service</div>
        <div>[  <span className="text-[#00ff41] font-bold">OK</span>  ] Initialized Automated Quality Engineering Subsystem</div>
        <div>[  <span className="text-[#00ff41] font-bold">OK</span>  ] Loaded Akash Kollabathula (3 YOE SDET) Production Profile</div>
      </div>

      {/* 2. ASCII Title Banner - AKASH in Green, KOLLABATHULA in RED */}
      <div className="overflow-x-auto py-1 select-none">
        <div className="hidden sm:block">
          <div className="flex flex-col lg:flex-row gap-2 items-start font-mono text-[9px] md:text-[10px] leading-[1.05] font-bold">
            {/* AKASH in Hacker Green */}
            <pre className="text-[#00ff41] drop-shadow-[0_0_8px_rgba(0,255,65,0.4)]">
{`█████╗ ██╗  ██╗ █████╗ ███████╗██╗  ██╗
██╔══██╗██║ ██╔╝██╔══██╗██╔════╝██║  ██║
███████║█████╔╝ ███████║███████╗███████║
██╔══██║██╔═██╗ ██╔══██║╚════██║██╔══██║
██║  ██║██║  ██╗██║  ██║███████║██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝`}
            </pre>

            {/* KOLLABATHULA in Vibrant Red */}
            <pre className="text-[#ef4444] drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">
{`██╗  ██╗ ██████╗ ██╗     ██╗      █████╗ ██████╗  █████╗ ████████╗██╗  ██╗██╗   ██╗██╗      █████╗ 
██║ ██╔╝██╔═══██╗██║     ██║     ██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██║  ██║██║   ██║██║     ██╔══██╗
█████╔╝ ██║   ██║██║     ██║     ███████║██████╔╝███████║   ██║   ███████║██║   ██║██║     ███████║
██╔═██╗ ██║   ██║██║     ██║     ██╔══██║██╔══██╗██╔══██║   ██║   ██╔══██║██║   ██║██║     ██╔══██║
██║  ██╗╚██████╔╝███████╗███████╗██║  ██║██████╔╝██║  ██║   ██║   ██║  ██║╚██████╔╝███████╗██║  ██║
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝`}
            </pre>
          </div>
        </div>

        {/* Mobile-optimized high-impact stylized header */}
        <div className="sm:hidden flex items-center gap-2 py-1">
          <span className="text-[#00ff41] font-black text-xl tracking-widest drop-shadow-[0_0_8px_rgba(0,255,65,0.5)]">
            AKASH
          </span>
          <span className="text-[#ef4444] font-black text-xl tracking-widest drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]">
            KOLLABATHULA
          </span>
        </div>
      </div>

      {/* 3. Terminal Profile Specs Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-stretch">
        {/* Left Box: Specs with Akash's Exact Profile Avatar */}
        <div className="border border-[#222222] bg-[#0c0c0c] p-3 sm:p-4 flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <div className="shrink-0 flex flex-col items-center">
            <AkashCyberAvatar size="md" theme={theme} />
          </div>

          <div className="space-y-1 text-xs sm:text-[13px] flex-1 w-full">
            <div className="text-cyan-400 font-bold border-b border-[#222222] pb-1 mb-2 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
                <span className="text-white">{portfolioData.handle}</span>@<span className="text-[#ef4444] font-bold">kollabathula-kali</span>
              </span>
              <span className="text-[10px] text-gray-500 font-normal">v3.0-sdet</span>
            </div>
            <div className="flex"><span className="text-gray-400 w-24 text-xs">Name:</span><span className="text-white font-bold">Akash <span className="text-[#ef4444]">Kollabathula</span></span></div>
            <div className="flex"><span className="text-gray-400 w-24 text-xs">Role:</span><span className="text-white font-medium">{portfolioData.role}</span></div>
            <div className="flex"><span className="text-gray-400 w-24 text-xs">Experience:</span><span className="text-[#00ff41] font-bold">{portfolioData.yearsOfExperience} Production QA</span></div>
            <div className="flex"><span className="text-gray-400 w-24 text-xs">Company:</span><span className="text-white">HCL Technologies</span></div>
            <div className="flex"><span className="text-gray-400 w-24 text-xs">Core Stack:</span><span className="text-white">Playwright + TypeScript + CI/CD</span></div>
            <div className="flex"><span className="text-gray-400 w-24 text-xs">Coverage:</span><span className="text-cyan-400 font-bold">85%+ Critical End-to-End</span></div>
            <div className="flex"><span className="text-gray-400 w-24 text-xs">Regression:</span><span className="text-yellow-400 font-bold">75% Faster (60m → &lt;15m)</span></div>

            {/* Linux Color Palette indicators */}
            <div className="mt-2.5 pt-2 border-t border-[#222222] flex items-center space-x-2">
              <div className="w-3 h-3 bg-black border border-[#333333]" title="Black" />
              <div className="w-3 h-3 bg-[#ef4444]" title="Kollabathula Red" />
              <div className="w-3 h-3 bg-[#00ff41]" title="Hacker Green" />
              <div className="w-3 h-3 bg-[#ffbd2e]" title="Amber Phosphor" />
              <div className="w-3 h-3 bg-cyan-400" title="Neon Cyan" />
              <div className="w-3 h-3 bg-white" title="White" />
            </div>
          </div>
        </div>

        {/* Right Box: Live Shell Guide & Process Status */}
        <div className="border border-[#222222] bg-[#0c0c0c] p-3 sm:p-4 space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="text-xs text-cyan-400 font-bold border-b border-[#222222] pb-1.5 flex items-center justify-between">
              <span>ACTIVE_SHELL: KALI_LINUX_SDET</span>
              <span className="text-[10px] text-[#00ff41] font-normal flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-ping" />
                PID: 1337 [ACTIVE]
              </span>
            </div>

            <div className="mt-2 space-y-1.5 text-[11px] text-gray-300">
              <p className="leading-relaxed">
                Welcome to <strong className="text-white">Akash <span className="text-[#ef4444]">Kollabathula</span></strong>&apos;s Linux terminal portfolio.
                This environment operates via <strong className="text-[#00ff41]">command-line execution only</strong>.
              </p>
              <div className="p-2 bg-[#141414] border border-[#222222] text-[11px] space-y-1.5 rounded">
                <div className="text-emerald-400 font-bold flex items-center justify-between">
                  <span>Interactive Quick Commands:</span>
                  <span className="text-[10px] text-gray-500 font-normal">Click or Type</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-gray-300">
                  {[
                    { cmd: 'help', desc: 'Manual & all cmds' },
                    { cmd: 'gui', desc: 'Switch to GUI mode' },
                    { cmd: 'skills', desc: 'Automation stack' },
                    { cmd: 'experience', desc: 'HCL Tech history' },
                    { cmd: 'projects', desc: 'Test frameworks' },
                    { cmd: 'resume', desc: 'Full SDET resume' },
                    { cmd: 'contact', desc: 'Email & phone' },
                    { cmd: 'test', desc: 'Run Playwright' },
                  ].map((item) => (
                    <button
                      key={item.cmd}
                      type="button"
                      onClick={() => {
                        terminalAudio.playMechanicalClick('enter');
                        onExecuteCommand(item.cmd);
                      }}
                      className="flex items-center justify-between px-2 py-1 bg-[#181818] hover:bg-emerald-950/40 border border-[#2a2a2a] hover:border-[#00ff41]/50 rounded text-left transition cursor-pointer group active:scale-95"
                      title={`Execute '${item.cmd}'`}
                    >
                      <span className="text-cyan-300 font-bold group-hover:text-[#00ff41]">{item.cmd}</span>
                      <span className="text-gray-400 text-[10px] truncate max-w-[55%]">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#222222] text-[10px] text-gray-400 flex items-center justify-between">
            <span>Navigation: <span className="text-[#00ff41] font-semibold">Mouse, Touch & Keyboard</span></span>
            <span>Click any command or type <code className="text-cyan-300 font-bold">help</code></span>
          </div>
        </div>
      </div>
    </div>
  );
};
