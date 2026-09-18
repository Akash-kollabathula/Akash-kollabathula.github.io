import React, { useState } from 'react';
import { TerminalOutputItem, TerminalTheme } from '../types';
import { portfolioData, AVAILABLE_COMMANDS, TERMINAL_THEMES } from '../data/portfolioData';
import { InteractiveTestRunner } from './InteractiveTestRunner';
import { AkashCyberAvatar } from './AkashCyberAvatar';
import { avatarStore } from '../utils/avatarStore';
import {
  Terminal,
  Shield,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  ExternalLink,
  Mail,
  Phone,
  CheckCircle2,
  Cpu,
  Boxes,
  Code2,
  GitBranch,
  Network,
  PlaySquare,
  FileText,
  Copy,
  Check,
  Search,
  Download,
  Volume2,
  Upload,
} from 'lucide-react';
import { terminalAudio } from '../utils/soundEffects';

interface CommandOutputProps {
  item: TerminalOutputItem;
  theme: TerminalTheme;
  onExecuteCommand: (cmd: string) => void;
  onOpenResumeModal: () => void;
  onDownloadResume: () => void;
}

export const CommandOutput: React.FC<CommandOutputProps> = ({
  item,
  theme,
  onExecuteCommand,
  onOpenResumeModal,
  onDownloadResume,
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    terminalAudio.playSuccessChime();
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const command = item.command.trim().toLowerCase();
  const [cmdBase, ...cmdArgs] = command.split(' ');
  const firstArg = cmdArgs[0] || '';

  // Standard Mailto prefilled URL
  const mailtoUrl = `mailto:${portfolioData.contacts.email}?subject=Portfolio%20Inquiry%20-%20SDET%20%26%20Playwright%20Automation&body=Hi%20Akash,%0D%0A%0D%0AI%20reviewed%20your%20SDET%20portfolio%20and%20would%20like%20to%20connect%20regarding%20an%20opportunity.`;

  // Render Prompt Header for this output item
  const renderPromptHeader = () => (
    <div className="flex items-center space-x-1.5 text-xs font-mono mb-2 text-gray-300 select-none">
      <span className="text-white font-bold">{portfolioData.handle}@{portfolioData.hostname}</span>
      <span className="text-gray-400">:</span>
      <span className="text-cyan-400 font-bold">~</span>
      <span className="text-white font-bold">$</span>
      <span className="text-[#00ff41] font-semibold ml-1">{item.command}</span>
      <span className="text-gray-500 text-[10px] ml-auto select-none font-mono">[{item.timestamp}]</span>
    </div>
  );

  // 1. HELP COMMAND
  if (cmdBase === 'help' || cmdBase === '?') {
    const categories = ['Essential', 'Profile', 'Technical', 'Career', 'Contact', 'System', 'Effects', 'Utility'];
    
    return (
      <div className="space-y-4 mb-4 select-text">
        {renderPromptHeader()}
        <div className="p-4 bg-black/60 border border-emerald-500/30 rounded-lg space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>KALI LINUX SDET TERMINAL COMMAND MANUAL</span>
            </div>
            <span className="text-gray-400 text-[11px]">Type or click any command below to execute</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categories.map((cat) => {
              const catCommands = AVAILABLE_COMMANDS.filter((c) => c.category === cat);
              if (catCommands.length === 0) return null;

              return (
                <div key={cat} className="space-y-1.5 p-2 bg-emerald-950/20 rounded border border-emerald-500/10">
                  <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    {cat} Commands
                  </div>
                  <div className="space-y-1">
                    {catCommands.map((c) => (
                      <button
                        key={c.cmd}
                        type="button"
                        onClick={() => {
                          terminalAudio.playMechanicalClick('enter');
                          onExecuteCommand(c.cmd);
                        }}
                        className="w-full flex items-center justify-between p-1.5 rounded hover:bg-emerald-900/40 text-[11px] cursor-pointer group transition text-left"
                      >
                        <div className="flex items-center gap-1.5">
                          <code className="text-emerald-300 font-bold group-hover:text-cyan-300">
                            {c.cmd} {c.args}
                          </code>
                        </div>
                        <span className="text-gray-400 text-[10px] text-right truncate max-w-[55%]">
                          {c.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/20 rounded text-[11px] text-gray-300 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="text-yellow-400 font-semibold">Pro Tips:</span> Use{' '}
              <kbd className="px-1.5 py-0.5 bg-black border border-gray-600 rounded text-cyan-300">Tab</kbd> for autocomplete,{' '}
              <kbd className="px-1.5 py-0.5 bg-black border border-gray-600 rounded text-cyan-300">↑ / ↓</kbd> for history, and{' '}
              <code className="text-emerald-400 font-bold">clear</code> or <kbd className="px-1.5 py-0.5 bg-black border border-gray-600 rounded text-cyan-300">Ctrl+L</kbd> to reset screen.
            </div>
            <button
              onClick={() => {
                terminalAudio.playButtonClick();
                onExecuteCommand('test');
              }}
              className="px-3 py-1 bg-lime-900/60 hover:bg-lime-800 text-lime-200 border border-lime-500/40 rounded text-xs font-bold transition cursor-pointer"
            >
              ▶ Run Playwright Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ABOUT & WHOAMI COMMAND
  if (cmdBase === 'about' || cmdBase === 'whoami' || cmdBase === 'bio' || cmdBase === 'summary') {
    return (
      <div className="space-y-4 mb-4 select-text">
        {renderPromptHeader()}
        <div className="p-4 bg-black/60 border border-emerald-500/30 rounded-lg space-y-4 text-xs font-mono">
          {/* Identity Header with Avatar */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border-b border-emerald-500/20 pb-3">
            <AkashCyberAvatar size="sm" showToggle={false} theme={theme} className="shrink-0" />
            <div className="flex-1 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {portfolioData.name}
                  </h3>
                </div>
                <p className="text-cyan-300 text-xs font-semibold mt-0.5">
                  {portfolioData.role} • 3 Years Production Experience
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2 py-0.5 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 rounded">
                  Current: HCL Technologies
                </span>
                <span className="px-2 py-0.5 bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 rounded">
                  Specialty: Playwright + TS + AI
                </span>
              </div>
            </div>
          </div>

          {/* Professional Narrative */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-yellow-300 uppercase tracking-wider">
              // Professional Summary & Engineering Philosophy
            </div>
            <p className="text-gray-300 leading-relaxed text-xs md:text-[13px]">
              {portfolioData.summary}
            </p>
          </div>

          {/* Key Competency Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded space-y-1">
              <div className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                <PlaySquare className="w-3.5 h-3.5" /> Playwright Mastery
              </div>
              <p className="text-gray-400 text-[10px]">
                POM architecture, custom fixtures, auto-waiting, trace viewer, and parallel execution.
              </p>
            </div>
            <div className="p-2.5 bg-cyan-950/20 border border-cyan-500/20 rounded space-y-1">
              <div className="text-cyan-300 font-bold text-[11px] flex items-center gap-1">
                <Network className="w-3.5 h-3.5" /> REST API Validation
              </div>
              <p className="text-gray-400 text-[10px]">
                APIRequestContext, contract tests, JSON schema assertions, and payload verification.
              </p>
            </div>
            <div className="p-2.5 bg-fuchsia-950/20 border border-fuchsia-500/20 rounded space-y-1">
              <div className="text-fuchsia-300 font-bold text-[11px] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Agentic AI QA
              </div>
              <p className="text-gray-400 text-[10px]">
                Playwright MCP Server, AI agents, Copilot & GitLab Duo for smart test maintenance.
              </p>
            </div>
            <div className="p-2.5 bg-yellow-950/20 border border-yellow-500/20 rounded space-y-1">
              <div className="text-yellow-300 font-bold text-[11px] flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5" /> CI/CD Quality Gates
              </div>
              <p className="text-gray-400 text-[10px]">
                GitHub Actions PR gates, Jenkins scheduled regressions, and Allure report archival.
              </p>
            </div>
          </div>

          {/* Quick navigation actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-500/10">
            <span className="text-gray-400 text-[11px]">Explore deeper:</span>
            <button
              onClick={() => {
                terminalAudio.playMechanicalClick('enter');
                onExecuteCommand('skills');
              }}
              className="px-2 py-0.5 bg-black/60 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 rounded text-[11px] cursor-pointer"
            >
              $ skills
            </button>
            <button
              onClick={() => {
                terminalAudio.playMechanicalClick('enter');
                onExecuteCommand('experience');
              }}
              className="px-2 py-0.5 bg-black/60 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 rounded text-[11px] cursor-pointer"
            >
              $ experience
            </button>
            <button
              onClick={() => {
                terminalAudio.playMechanicalClick('enter');
                onExecuteCommand('projects');
              }}
              className="px-2 py-0.5 bg-black/60 hover:bg-fuchsia-900/50 text-fuchsia-300 border border-fuchsia-500/30 rounded text-[11px] cursor-pointer"
            >
              $ projects
            </button>
            <button
              onClick={() => {
                terminalAudio.playButtonClick();
                onDownloadResume();
              }}
              className="px-2.5 py-0.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/40 rounded text-[11px] font-bold cursor-pointer ml-auto flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>Download Resume PDF</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. SKILLS COMMAND
  if (cmdBase === 'skills' || cmdBase === 'tech' || cmdBase === 'stack') {
    const categories = portfolioData.skillsCategories;

    return (
      <div className="space-y-4 mb-4 select-text">
        {renderPromptHeader()}
        <div className="p-4 bg-black/60 border border-emerald-500/30 rounded-lg space-y-4 text-xs font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>TECHNICAL SKILLS & AUTOMATION CAPABILITIES</span>
              </div>
              <p className="text-gray-400 text-[11px]">
                Organized by domain • All items verified from professional production experience
              </p>
            </div>
            <div className="text-[11px] text-cyan-300 font-semibold">
              Total Categories: {categories.length}
            </div>
          </div>

          {/* Skill Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg space-y-2 hover:border-emerald-500/40 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300 font-bold text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {category.title}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {category.skills.length} skills
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">{category.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {category.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-black/70 border border-emerald-500/30 text-emerald-300 text-[11px] rounded hover:border-cyan-400 hover:text-white transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/20 rounded text-[11px] text-gray-300 flex items-center justify-between">
            <span>Want to see these skills in action?</span>
            <button
              onClick={() => {
                terminalAudio.playButtonClick();
                onExecuteCommand('test');
              }}
              className="px-2.5 py-1 bg-lime-900/60 hover:bg-lime-800 text-lime-200 border border-lime-500/40 rounded text-xs font-bold transition cursor-pointer"
            >
              ▶ Run Live Playwright Suite
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. EXPERIENCE COMMAND
  if (cmdBase === 'experience' || cmdBase === 'exp' || cmdBase === 'career' || cmdBase === 'work') {
    return (
      <div className="space-y-4 mb-4 select-text">
        {renderPromptHeader()}
        <div className="p-4 bg-black/60 border border-emerald-500/30 rounded-lg space-y-5 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>PROFESSIONAL WORK EXPERIENCE & IMPACT</span>
            </div>
            <span className="text-yellow-400 text-xs font-bold font-mono">Dec 2023 – Present</span>
          </div>

          {portfolioData.experience.map((exp) => (
            <div key={exp.id} className="space-y-4">
              {/* Role Title & Organization */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm sm:text-base">{exp.role}</span>
                    <span className="text-gray-400">@</span>
                    <span className="text-cyan-300 font-bold text-sm sm:text-base">{exp.company}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {exp.period} • {exp.type} • Quality Engineering & Test Automation
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {exp.stack.slice(0, 6).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-black/80 border border-cyan-500/30 text-cyan-300 text-[10px] rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantified Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {exp.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-black/50 border border-emerald-500/20 rounded text-center space-y-0.5"
                  >
                    <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
                      {m.value}
                    </div>
                    <div className="text-[10px] text-cyan-300 font-semibold">{m.label}</div>
                    <div className="text-[9px] text-gray-400 leading-tight">{m.description}</div>
                  </div>
                ))}
              </div>

              {/* Responsibilities & Achievements */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-yellow-300 uppercase tracking-wider">
                  // Key Responsibilities & Engineering Deliverables
                </div>
                <div className="space-y-2 pl-1">
                  {exp.responsibilities.map((resp, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-gray-200">
                      <span className="text-emerald-400 font-bold select-none mt-0.5">❯</span>
                      <span className="leading-relaxed">{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2 border-t border-emerald-500/10">
            <span className="text-gray-400 text-[11px]">View project automation framework:</span>
            <button
              onClick={() => {
                terminalAudio.playMechanicalClick('enter');
                onExecuteCommand('projects');
              }}
              className="px-3 py-1 bg-fuchsia-950/60 hover:bg-fuchsia-900 text-fuchsia-200 border border-fuchsia-500/40 rounded text-xs font-bold transition cursor-pointer"
            >
              $ projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. PROJECTS COMMAND
  if (cmdBase === 'projects' || cmdBase === 'project' || cmdBase === 'proj') {
    return (
      <div className="space-y-4 mb-4 select-text">
        {renderPromptHeader()}
        <div className="p-4 bg-black/60 border border-emerald-500/30 rounded-lg space-y-4 text-xs font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Boxes className="w-4 h-4 text-cyan-400" />
                <span>FEATURED AUTOMATION PROJECTS & FRAMEWORKS</span>
              </div>
              <p className="text-gray-400 text-[11px]">
                Production-grade automation architectures and test coverage suites
              </p>
            </div>
            <button
              onClick={() => {
                terminalAudio.playButtonClick();
                onExecuteCommand('test');
              }}
              className="px-2.5 py-1 bg-lime-900/60 hover:bg-lime-800 text-lime-200 border border-lime-500/40 rounded text-xs font-bold cursor-pointer"
            >
              ▶ Run Project Tests
            </button>
          </div>

          {portfolioData.projects.map((proj) => (
            <div
              key={proj.id}
              className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-lg space-y-3.5 hover:border-emerald-500/50 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">{proj.title}</span>
                    <span className="px-2 py-0.5 bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-700/50 text-[10px] rounded font-semibold">
                      {proj.category}
                    </span>
                  </div>
                  <p className="text-cyan-300 text-[11px] mt-0.5">{proj.subtitle}</p>
                </div>

                {/* Only display action button if a valid repository link exists */}
                {portfolioData.contacts.github && (
                  <div className="flex items-center gap-2">
                    <a
                      href={portfolioData.contacts.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => terminalAudio.playProjectOpen()}
                      className="flex items-center gap-1 px-2.5 py-1 bg-black/60 hover:bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded text-[11px] transition cursor-pointer"
                      title="Open GitHub Profile & Repositories"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>GitHub Repository</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Project Description */}
              <p className="text-gray-300 text-xs leading-relaxed">{proj.description}</p>

              {/* Tech Stack Pills */}
              <div className="space-y-1">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Technologies & Framework Design:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-black/80 border border-emerald-500/30 text-emerald-300 text-[11px] rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Highlights */}
              <div className="space-y-1.5">
                <div className="text-[10px] text-yellow-300 uppercase tracking-wider font-bold">
                  // Automation Engineering Highlights & Workflows:
                </div>
                <div className="space-y-1.5">
                  {proj.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-gray-300 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-emerald-500/10">
                {proj.impactMetrics.map((metric, i) => (
                  <div
                    key={i}
                    className="p-2 bg-black/50 border border-emerald-500/20 rounded text-[11px] text-emerald-300 text-center font-medium"
                  >
                    {metric}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. NEOFETCH COMMAND
  if (cmdBase === 'neofetch' || cmdBase === 'screenfetch' || cmdBase === 'sysinfo') {
    return (
      <div className="space-y-4 mb-4 select-text">
        {renderPromptHeader()}
        <div className="p-4 bg-black/70 border border-emerald-500/30 rounded-lg font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Akash Photo / Cyber Avatar */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-2">
              <AkashCyberAvatar size="md" showToggle={true} theme={theme} />
            </div>

            {/* Profile & System Specs */}
            <div className="md:col-span-7 space-y-1.5 text-xs">
              <div className="border-b border-emerald-500/30 pb-1">
                <span className="text-cyan-400 font-bold">{portfolioData.handle}</span>
                <span className="text-white">@</span>
                <span className="text-emerald-400 font-bold">{portfolioData.hostname}</span>
              </div>

              <div className="space-y-1 text-gray-300 text-[11px]">
                <div>
                  <strong className="text-cyan-400">OS:</strong> Kali Linux x86_64 / SDET Edition
                </div>
                <div>
                  <strong className="text-cyan-400">Host:</strong> {portfolioData.name} Station
                </div>
                <div>
                  <strong className="text-cyan-400">Role:</strong> {portfolioData.role}
                </div>
                <div>
                  <strong className="text-cyan-400">Experience:</strong> {portfolioData.yearsOfExperience} (Dec 2023 – Present)
                </div>
                <div>
                  <strong className="text-cyan-400">Company:</strong> HCL Technologies
                </div>
                <div>
                  <strong className="text-cyan-400">Framework:</strong> Playwright Test + TypeScript
                </div>
                <div>
                  <strong className="text-cyan-400">AI Stack:</strong> Copilot, GitLab Duo, Playwright MCP Server
                </div>
                <div>
                  <strong className="text-cyan-400">CI/CD:</strong> GitHub Actions & Jenkins Quality Gates
                </div>
                <div>
                  <strong className="text-cyan-400">Coverage:</strong> 85%+ Automated Workflows
                </div>
                <div>
                  <strong className="text-cyan-400">Regression:</strong> 75% Faster (60m → &lt;15m)
                </div>
                <div>
                  <strong className="text-cyan-400">Flakiness:</strong> &lt; 4% (Reduced from 20%)
                </div>
                <div>
                  <strong className="text-cyan-400">Terminal:</strong> xterm-256color (zsh 5.9)
                </div>
              </div>

              {/* Color swatch blocks */}
              <div className="flex gap-1.5 pt-2 border-t border-emerald-500/20">
                <span className="w-4 h-4 bg-black border border-gray-700" />
                <span className="w-4 h-4 bg-red-600" />
                <span className="w-4 h-4 bg-emerald-500" />
                <span className="w-4 h-4 bg-yellow-400" />
                <span className="w-4 h-4 bg-blue-500" />
                <span className="w-4 h-4 bg-fuchsia-500" />
                <span className="w-4 h-4 bg-cyan-400" />
                <span className="w-4 h-4 bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6b. PHOTO / AVATAR COMMAND: Real profile image upload & display
  if (cmdBase === 'photo' || cmdBase === 'avatar') {
    return (
      <div className="space-y-4 mb-4 select-text font-mono">
        {renderPromptHeader()}
        <div className="p-4 bg-black/80 border border-[#00ff41]/40 rounded-lg text-xs space-y-4 shadow-[0_0_20px_rgba(0,255,65,0.15)]">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <AkashCyberAvatar size="lg" theme={theme} />
            <div className="space-y-3 flex-1 w-full">
              <div className="border-b border-[#00ff41]/30 pb-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
                  Akash's Exact Real Profile Picture
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  100% photographic fidelity of your actual face — zero AI alterations or facial modifications.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <label className="px-4 py-2 bg-emerald-950/80 border border-[#00ff41] text-[#00ff41] hover:bg-emerald-900/90 rounded text-xs font-bold cursor-pointer transition shadow-[0_0_12px_rgba(0,255,65,0.25)] flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Choose Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            avatarStore.setCustomPhoto(ev.target.result as string);
                            terminalAudio.playSuccessChime();
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                      if (e.target) e.target.value = '';
                    }}
                  />
                </label>

                {avatarStore.hasCustomPhoto() && (
                  <button
                    type="button"
                    onClick={() => {
                      avatarStore.resetPhoto();
                      terminalAudio.playThemeSwitch();
                    }}
                    className="px-3 py-2 bg-red-950/60 border border-red-500/60 text-red-300 hover:bg-red-900/60 rounded text-xs font-mono transition cursor-pointer"
                  >
                    Reset Photo
                  </button>
                )}
              </div>

              <div className="text-[11px] text-gray-300 bg-[#07110a] border border-[#00ff41]/20 p-2.5 rounded space-y-1">
                <div className="flex items-center gap-1.5 text-[#00ff41] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>How to load your photo:</span>
                </div>
                <div className="text-gray-400 pl-3 space-y-0.5 text-[10.5px]">
                  <div>• Click the <strong>Choose Image File</strong> button above or click the avatar itself.</div>
                  <div>• Or drag and drop <code className="text-cyan-300">ChatGPT Image Sep 18, 2026, 10_04_10 PM.png</code> anywhere onto the browser window.</div>
                  <div>• Or copy the image and press <kbd className="px-1 py-0.5 bg-black rounded border border-gray-700 text-white">Ctrl+V</kbd> anywhere.</div>
                </div>
              </div>

              <div className="text-[10px] text-gray-400 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-800">
                <span>Current Status: <span className="text-[#00ff41] font-bold">{avatarStore.hasCustomPhoto() ? 'Custom Exact Image Loaded' : 'Awaiting Image File'}</span></span>
                <span className="text-gray-500 font-mono">Format: JPG / PNG (Unedited)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 7. TEST COMMAND (Interactive Live Playwright Runner)
  if (cmdBase === 'test' || cmdBase === 'playwright' || cmdBase === 'run') {
    return (
      <div className="space-y-4 mb-4 select-text">
        {renderPromptHeader()}
        <InteractiveTestRunner />
      </div>
    );
  }

  // 8. EDUCATION COMMAND
  if (cmdBase === 'education' || cmdBase === 'edu' || cmdBase === 'degree') {
    return (
      <div className="space-y-4 mb-4 select-text">
        {renderPromptHeader()}
        <div className="p-4 bg-black/60 border border-emerald-500/30 rounded-lg space-y-3 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <GraduationCap className="w-4 h-4 text-yellow-400" />
              <span>ACADEMIC BACKGROUND & EDUCATION</span>
            </div>
          </div>

          {portfolioData.education.map((edu, idx) => (
            <div key={idx} className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <span className="text-white font-bold text-sm">{edu.degree}</span>
                  <div className="text-cyan-300 font-medium text-xs">{edu.field}</div>
                </div>
                <div className="px-2.5 py-1 bg-black/80 border border-emerald-500/40 text-emerald-300 rounded font-bold text-xs">
                  CGPA: {edu.cgpa}
                </div>
              </div>

              {edu.details && (
                <div className="space-y-1 pt-1 border-t border-emerald-500/10">
                  {edu.details.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 text-gray-300 text-xs">
                      <span className="text-emerald-400">❯</span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 9. CERTIFICATIONS COMMAND
  if (cmdBase === 'certifications' || cmdBase === 'certs' || cmdBase === 'certificates') {
    return (
      <div className="space-y-4 mb-4 select-text">
        {renderPromptHeader()}
        <div className="p-4 bg-black/60 border border-emerald-500/30 rounded-lg space-y-3 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Award className="w-4 h-4 text-fuchsia-400" />
              <span>PROFESSIONAL CERTIFICATIONS & ACCREDITATIONS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {portfolioData.certifications.map((cert, idx) => (
              <div key={idx} className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg space-y-1.5">
                <div className="text-white font-bold text-xs">{cert.title}</div>
                <div className="text-cyan-300 text-[11px]">{cert.issuer}</div>
                <p className="text-gray-400 text-[10px] leading-relaxed">{cert.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 10. METRICS / STATS COMMAND
  if (cmdBase === 'metrics' || cmdBase === 'stats' || cmdBase === 'impact') {
    return (
      <div className="space-y-4 mb-4 select-text">
        {renderPromptHeader()}
        <div className="p-4 bg-black/60 border border-emerald-500/30 rounded-lg space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>QUANTIFIED TEST AUTOMATION METRICS & IMPACT</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {portfolioData.metrics.map((m, idx) => (
              <div key={idx} className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg space-y-1">
                <div className="text-2xl font-bold text-emerald-400 font-mono">{m.value}</div>
                <div className="text-cyan-300 font-bold text-xs">{m.title}</div>
                {m.change && (
                  <div className="text-[10px] text-yellow-300 font-mono">{m.change}</div>
                )}
                <p className="text-gray-400 text-[10px] leading-relaxed pt-1">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 11. RESUME COMMAND
  if (cmdBase === 'resume' || cmdBase === 'cv') {
    return (
      <div className="space-y-4 mb-4 select-text font-mono">
        {renderPromptHeader()}
        <div className="p-4 bg-[#0a0a0a] border border-emerald-500/30 rounded-lg space-y-4 text-xs font-mono">
          {/* Resume Terminal Header */}
          <div className="border-b border-[#222222] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-lg font-bold text-white tracking-wider">
                AKASH <span className="text-[#ef4444]">KOLLABATHULA</span>
              </div>
              <div className="text-emerald-400 font-bold text-xs mt-0.5">
                Software Development Engineer in Test (SDET) • 3 Years of Experience
              </div>
              <div className="text-gray-400 text-[11px] mt-1 flex flex-wrap gap-x-3 gap-y-1">
                <span>📍 {portfolioData.contacts.location}</span>
                <span>✉ {portfolioData.contacts.email}</span>
                <span>📞 {portfolioData.contacts.phone}</span>
              </div>
            </div>
            <div className="text-right text-[11px] text-gray-400">
              <span className="text-cyan-300">Format:</span> Terminal Standard Document
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-1.5">
            <div className="text-cyan-300 font-bold uppercase tracking-wider text-[11px] border-b border-[#222222] pb-1">
              [1] PROFESSIONAL SUMMARY
            </div>
            <p className="text-gray-300 leading-relaxed text-[11px]">
              {portfolioData.summary}
            </p>
          </div>

          {/* Core Technical Stack */}
          <div className="space-y-1.5">
            <div className="text-cyan-300 font-bold uppercase tracking-wider text-[11px] border-b border-[#222222] pb-1">
              [2] CORE TECHNICAL COMPETENCIES
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-[#121212] border border-[#222222] rounded">
                <span className="text-[#00ff41] font-bold">Automation Tools:</span> Playwright, Selenium WebDriver, TestNG, Cypress
              </div>
              <div className="p-2 bg-[#121212] border border-[#222222] rounded">
                <span className="text-[#00ff41] font-bold">Languages:</span> TypeScript, JavaScript, Java, Bash/Shell, SQL
              </div>
              <div className="p-2 bg-[#121212] border border-[#222222] rounded">
                <span className="text-[#00ff41] font-bold">API & Backend:</span> REST Assured, Postman, Contract Testing, JSON Schema
              </div>
              <div className="p-2 bg-[#121212] border border-[#222222] rounded">
                <span className="text-[#00ff41] font-bold">CI/CD & DevOps:</span> GitHub Actions, Jenkins, Docker, Linux/Kali, Git
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="space-y-2">
            <div className="text-cyan-300 font-bold uppercase tracking-wider text-[11px] border-b border-[#222222] pb-1">
              [3] PROFESSIONAL EXPERIENCE
            </div>
            {portfolioData.experience.map((exp) => (
              <div key={exp.id} className="space-y-1.5 p-2.5 bg-[#121212] border border-[#222222] rounded">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <span className="text-white font-bold">{exp.role}</span>
                    <span className="text-gray-400"> — {exp.company}</span>
                  </div>
                  <span className="text-[#00ff41] text-[11px] font-bold">{exp.period}</span>
                </div>
                <ul className="space-y-1 text-gray-300 text-[11px] pl-4 list-disc marker:text-emerald-400">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i} className="leading-relaxed">{resp}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {exp.stack.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 bg-black/60 border border-[#333333] text-[10px] text-cyan-300 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Automation Projects */}
          <div className="space-y-2">
            <div className="text-cyan-300 font-bold uppercase tracking-wider text-[11px] border-b border-[#222222] pb-1">
              [4] KEY AUTOMATION PROJECTS
            </div>
            <div className="grid grid-cols-1 gap-2">
              {portfolioData.projects.slice(0, 2).map((proj) => (
                <div key={proj.id} className="p-2 bg-[#121212] border border-[#222222] rounded space-y-1 text-[11px]">
                  <div className="text-white font-bold">{proj.title}</div>
                  <p className="text-gray-300">{proj.description}</p>
                  <div className="text-emerald-400 text-[10px]">
                    Impact: {proj.impactMetrics.join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certs */}
          <div className="space-y-1.5">
            <div className="text-cyan-300 font-bold uppercase tracking-wider text-[11px] border-b border-[#222222] pb-1">
              [5] EDUCATION
            </div>
            <div className="text-gray-300 text-[11px]">
              <strong className="text-white">B.Tech in Computer Science & Engineering</strong> — CGPA: 7.8/10
            </div>
          </div>

          {/* Command execution options */}
          <div className="pt-2 border-t border-[#222222] text-[10px] text-gray-400 flex flex-wrap items-center justify-between gap-2">
            <span>To download PDF copy, type: <code className="text-[#00ff41] font-bold">resume download</code></span>
            <span>To contact Akash, type: <code className="text-cyan-300 font-bold">contact</code></span>
          </div>
        </div>
      </div>
    );
  }

  // 12. CONTACT, GITHUB, LINKEDIN COMMANDS
  if (cmdBase === 'contact' || cmdBase === 'email' || cmdBase === 'social' || cmdBase === 'github' || cmdBase === 'linkedin') {
    return (
      <div className="space-y-4 mb-4 select-text">
        {renderPromptHeader()}
        <div className="p-4 bg-black/60 border border-emerald-500/30 rounded-lg space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>DIRECT CONTACT CHANNELS & PROFILES</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              AVAILABLE FOR HIRE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Email card */}
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-lg space-y-1">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Email Address:</div>
              <div className="text-white font-mono text-xs">{portfolioData.contacts.email}</div>
              <div className="flex gap-2 pt-1">
                <a
                  href={mailtoUrl}
                  onClick={() => terminalAudio.playButtonClick()}
                  className="px-2.5 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/40 rounded text-[11px] transition cursor-pointer"
                  title="Open Default Email App With Pre-filled Subject"
                >
                  ✉ Send Email
                </a>
                <button
                  onClick={() => copyToClipboard(portfolioData.contacts.email, 'email')}
                  className="px-2 py-1 bg-black/60 hover:bg-emerald-950 text-gray-300 border border-gray-700 rounded text-[11px] cursor-pointer"
                >
                  {copiedText === 'email' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Phone card */}
            <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-lg space-y-1">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Direct Phone:</div>
              <div className="text-white font-mono text-xs">{portfolioData.contacts.phone}</div>
              <div className="flex gap-2 pt-1">
                <a
                  href={`tel:${portfolioData.contacts.phone}`}
                  onClick={() => terminalAudio.playButtonClick()}
                  className="px-2.5 py-1 bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-500/40 rounded text-[11px] transition cursor-pointer"
                >
                  📞 Call Now
                </a>
                <button
                  onClick={() => copyToClipboard(portfolioData.contacts.phone, 'phone')}
                  className="px-2 py-1 bg-black/60 hover:bg-cyan-950 text-gray-300 border border-gray-700 rounded text-[11px] cursor-pointer"
                >
                  {copiedText === 'phone' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* LinkedIn card */}
            <div className="p-3 bg-blue-950/20 border border-blue-500/20 rounded-lg space-y-1">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">LinkedIn Profile:</div>
              <div className="text-cyan-300 font-mono text-xs">akash-kollabathula</div>
              <div className="pt-1">
                <a
                  href={portfolioData.contacts.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => terminalAudio.playProjectOpen()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-500/40 rounded text-[11px] transition cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open LinkedIn</span>
                </a>
              </div>
            </div>

            {/* GitHub card */}
            <div className="p-3 bg-fuchsia-950/20 border border-fuchsia-500/20 rounded-lg space-y-1">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">GitHub Profile:</div>
              <div className="text-fuchsia-300 font-mono text-xs">akash-kollabathula</div>
              <div className="pt-1">
                <a
                  href={portfolioData.contacts.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => terminalAudio.playProjectOpen()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-fuchsia-900/60 hover:bg-fuchsia-800 text-fuchsia-200 border border-fuchsia-500/40 rounded text-[11px] transition cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 13. THEME COMMAND
  if (cmdBase === 'theme') {
    return (
      <div className="space-y-4 mb-4 select-text">
        {renderPromptHeader()}
        <div className="p-3 bg-black/60 border border-emerald-500/30 rounded-lg space-y-2 text-xs font-mono">
          <div className="text-emerald-400 font-bold">Theme updated. Available themes:</div>
          <div className="flex flex-wrap gap-2 pt-1">
            {(Object.keys(TERMINAL_THEMES) as TerminalTheme[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  terminalAudio.playButtonClick();
                  onExecuteCommand(`theme ${t}`);
                }}
                className="px-2 py-0.5 bg-black border border-emerald-500/30 text-emerald-300 rounded text-xs hover:border-cyan-400 cursor-pointer"
              >
                ${t}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 14. MATRIX & SCANLINES COMMANDS
  if (cmdBase === 'matrix') {
    return (
      <div className="space-y-4 mb-4 select-text">
        {renderPromptHeader()}
        <div className="p-3 bg-black/60 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-300">
          Matrix digital rain visual background toggled.
        </div>
      </div>
    );
  }

  if (cmdBase === 'gemini' || cmdBase === 'chat' || cmdBase === 'ask' || cmdBase === 'ai') {
    const userQuery = cmdArgs.join(' ') || (item.data?.query || 'Information about Akash Kollabathula');
    const aiResponse = item.rawText || item.data?.reply || (
      "Akash Kollabathula is an SDET with 3 years of experience at HCL Technologies specializing in Playwright, TypeScript, REST API testing, and CI/CD quality gates. He achieved 85%+ critical flow automation coverage and cut regression execution time by 75%."
    );

    return (
      <div className="space-y-3 mb-4 select-text font-mono">
        {renderPromptHeader()}
        <div className="p-4 bg-[#0a0f0d] border border-emerald-500/40 rounded-lg space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-[#1e2d24] pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-[#00ff41] font-bold">GEMINI 3.5 FLASH SDET ASSISTANT</span>
            </div>
            <span className="text-[10px] text-gray-400 bg-black/60 px-2 py-0.5 rounded border border-[#222]">
              MULTI-TURN AI
            </span>
          </div>

          <div className="text-gray-300 text-[11px] bg-black/50 p-2.5 rounded border border-[#1e2d24] space-y-1">
            <div className="text-cyan-400 font-bold text-[10px]">QUERY:</div>
            <div>{userQuery}</div>
          </div>

          <div className="text-gray-200 text-xs leading-relaxed space-y-2 whitespace-pre-line">
            <div className="text-emerald-400 font-bold text-[10px]">RESPONSE:</div>
            <div className="p-2.5 bg-[#050907] border border-[#1e2d24] rounded text-emerald-300">
              {aiResponse}
            </div>
          </div>

          <div className="pt-2 border-t border-[#1e2d24] text-[10px] text-gray-400 flex items-center justify-between">
            <span>Powered by Google GenAI SDK</span>
            <span>Ask anything: <code className="text-cyan-300 font-bold">gemini &lt;question&gt;</code></span>
          </div>
        </div>
      </div>
    );
  }

  if (cmdBase === 'sound' || cmdBase === 'audio' || cmdBase === 'volume' || cmdBase === 'sfx') {
    const isMute = firstArg === 'off' || firstArg === '0' || firstArg === 'mute';
    return (
      <div className="space-y-4 mb-4 select-text">
        {renderPromptHeader()}
        <div className="p-3 bg-[#0f0f0f] border border-[#222222] rounded-lg text-xs font-mono space-y-1">
          <div className="text-[#00ff41] font-bold flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>
              Terminal Sound Effects {isMute ? 'DISABLED (MUTED)' : 'ENABLED'} — Volume: {Math.round(terminalAudio.getVolume() * 100)}%
            </span>
          </div>
          <div className="text-gray-400 text-[11px]">
            Realistic tactile typewriter, mechanical switch acoustics, command blips, scroll ticks, and download sounds synthesized via Web Audio API.
          </div>
        </div>
      </div>
    );
  }

  // 15. DATE, UNAME, PWD, LS, CAT, ECHO, HISTORY, SUDO
  if (cmdBase === 'date') {
    return (
      <div className="space-y-2 mb-4 select-text font-mono text-xs">
        {renderPromptHeader()}
        <div className="text-gray-300 pl-2">{new Date().toUTCString()} (UTC)</div>
      </div>
    );
  }

  if (cmdBase === 'uname') {
    return (
      <div className="space-y-2 mb-4 select-text font-mono text-xs">
        {renderPromptHeader()}
        <div className="text-gray-300 pl-2">
          Linux kali-sdet-box 6.8.0-kali-automation #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux
        </div>
      </div>
    );
  }

  if (cmdBase === 'pwd') {
    return (
      <div className="space-y-2 mb-4 select-text font-mono text-xs">
        {renderPromptHeader()}
        <div className="text-gray-300 pl-2">/home/akash/portfolio</div>
      </div>
    );
  }

  if (cmdBase === 'ls') {
    return (
      <div className="space-y-2 mb-4 select-text font-mono text-xs">
        {renderPromptHeader()}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-2 bg-black/40 rounded border border-emerald-500/20">
          <button
            type="button"
            className="text-cyan-300 font-bold flex items-center gap-1 cursor-pointer hover:underline text-left"
            onClick={() => {
              terminalAudio.playButtonClick();
              onExecuteCommand('about');
            }}
          >
            📁 about/
          </button>
          <button
            type="button"
            className="text-cyan-300 font-bold flex items-center gap-1 cursor-pointer hover:underline text-left"
            onClick={() => {
              terminalAudio.playButtonClick();
              onExecuteCommand('skills');
            }}
          >
            📁 skills/
          </button>
          <button
            type="button"
            className="text-cyan-300 font-bold flex items-center gap-1 cursor-pointer hover:underline text-left"
            onClick={() => {
              terminalAudio.playButtonClick();
              onExecuteCommand('experience');
            }}
          >
            📁 experience/
          </button>
          <button
            type="button"
            className="text-cyan-300 font-bold flex items-center gap-1 cursor-pointer hover:underline text-left"
            onClick={() => {
              terminalAudio.playButtonClick();
              onExecuteCommand('projects');
            }}
          >
            📁 projects/
          </button>
          <button
            type="button"
            className="text-emerald-300 cursor-pointer hover:underline text-left font-bold"
            onClick={() => {
              terminalAudio.playButtonClick();
              onDownloadResume();
            }}
          >
            📄 resume.pdf
          </button>
          <button
            type="button"
            className="text-yellow-300 cursor-pointer hover:underline text-left font-bold"
            onClick={() => {
              terminalAudio.playButtonClick();
              onExecuteCommand('test');
            }}
          >
            ⚙ playwright.config.ts
          </button>
          <button
            type="button"
            className="text-fuchsia-300 cursor-pointer hover:underline text-left font-bold"
            onClick={() => {
              terminalAudio.playButtonClick();
              onExecuteCommand('neofetch');
            }}
          >
            📊 neofetch.sh
          </button>
          <button
            type="button"
            className="text-gray-400 cursor-pointer hover:underline text-left font-bold"
            onClick={() => {
              terminalAudio.playButtonClick();
              onExecuteCommand('contact');
            }}
          >
            ✉ contact.vcf
          </button>
        </div>
      </div>
    );
  }

  if (cmdBase === 'sudo') {
    return (
      <div className="space-y-2 mb-4 select-text font-mono text-xs">
        {renderPromptHeader()}
        <div className="text-yellow-400 pl-2 font-bold">
          [sudo] password for akash: Permission granted! You already have root access to explore this portfolio.
        </div>
      </div>
    );
  }

  if (cmdBase === 'cowsay') {
    const cowMsg = cmdArgs.join(' ') || 'Playwright + TypeScript = Zero Flaky Tests!';
    return (
      <div className="space-y-2 mb-4 select-text font-mono text-xs">
        {renderPromptHeader()}
        <pre className="text-emerald-400 text-[11px] p-2 bg-black/60 rounded border border-emerald-500/20">
{`  ________________________________________
< ${cowMsg} >
  ----------------------------------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`}
        </pre>
      </div>
    );
  }

  // DEFAULT / UNRECOGNIZED COMMAND (With fuzzy suggestion and error sound triggered)
  const allCmdNames = AVAILABLE_COMMANDS.map((c) => c.cmd);
  const closestMatch = allCmdNames.find(
    (c) => c.startsWith(cmdBase) || cmdBase.startsWith(c.slice(0, 2))
  );

  return (
    <div className="space-y-2 mb-4 select-text font-mono text-xs">
      {renderPromptHeader()}
      <div className="p-3.5 bg-red-950/40 border-2 border-red-500/60 rounded-lg text-red-200 space-y-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
        <div className="flex items-center justify-between border-b border-red-800/40 pb-2">
          <div className="flex items-center gap-2 text-red-400 font-bold">
            <span className="animate-pulse text-base">⚠️</span>
            <span>ALERT: WRONG COMMAND ENTERED</span>
          </div>
          <span className="text-[10px] bg-red-900/60 text-red-200 px-2 py-0.5 rounded font-mono border border-red-500/40">
            SOUND ALERT FIRED
          </span>
        </div>

        <div className="font-mono text-sm text-red-300">
          zsh: command not found: <strong className="text-white bg-black/60 px-1.5 py-0.5 rounded border border-red-500/40">{cmdBase}</strong>
        </div>

        <div className="text-xs text-gray-300 space-y-1 pt-1">
          {closestMatch ? (
            <div>
              Suggestion: Did you mean <button onClick={() => { terminalAudio.playButtonClick(); onExecuteCommand(closestMatch); }} className="text-cyan-300 font-bold underline hover:text-white cursor-pointer">{closestMatch}</button>?
            </div>
          ) : null}
          <div>
            Type <button onClick={() => { terminalAudio.playButtonClick(); onExecuteCommand('help'); }} className="text-emerald-400 font-bold underline hover:text-white cursor-pointer">help</button> to view all supported SDET terminal commands.
          </div>
        </div>
      </div>
    </div>
  );
};
