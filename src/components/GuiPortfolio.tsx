import React, { useState } from 'react';
import {
  Terminal,
  Play,
  CheckCircle2,
  Download,
  Eye,
  ExternalLink,
  Mail,
  Phone,
  Linkedin,
  Github,
  MapPin,
  Sparkles,
  Layers,
  Cpu,
  GitBranch,
  ShieldCheck,
  Zap,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ChevronRight,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  Clock,
  ArrowUpRight,
  Monitor,
  Smartphone,
  Server,
  Filter,
  Send
} from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { TerminalTheme } from '../types';
import { terminalAudio } from '../utils/soundEffects';
import { AkashCyberAvatar } from './AkashCyberAvatar';
import { InteractiveTestRunner } from './InteractiveTestRunner';

interface GuiPortfolioProps {
  currentTheme: TerminalTheme;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSwitchToCli: () => void;
  onOpenResumeModal: () => void;
  onDownloadResume: () => void;
  onThemeChange?: (theme: TerminalTheme) => void;
}

export const GuiPortfolio: React.FC<GuiPortfolioProps> = ({
  currentTheme,
  soundEnabled,
  onToggleSound,
  onSwitchToCli,
  onOpenResumeModal,
  onDownloadResume,
}) => {
  const [activeSkillTab, setActiveSkillTab] = useState<string>('all');
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [showMobileNav, setShowMobileNav] = useState(false);

  const handleCopyEmail = () => {
    terminalAudio.playButtonClick();
    navigator.clipboard.writeText(portfolioData.contacts.email);
    terminalAudio.playSuccessChime();
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    terminalAudio.playButtonClick();
    navigator.clipboard.writeText(portfolioData.contacts.phone);
    terminalAudio.playSuccessChime();
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    terminalAudio.playSuccessChime();
    const mailto = `mailto:${portfolioData.contacts.email}?subject=${encodeURIComponent(
      contactSubject || 'SDET Role Opportunity / Inquiries'
    )}&body=${encodeURIComponent(contactMessage || 'Hi Akash, I came across your SDET portfolio...')}`;
    window.location.href = mailto;
  };

  // Filter skills based on tab
  const filteredSkillsCategories =
    activeSkillTab === 'all'
      ? portfolioData.skillsCategories
      : portfolioData.skillsCategories.filter((cat) => cat.id === activeSkillTab);

  return (
    <div className="min-h-screen bg-[#07090c] text-gray-100 font-sans selection:bg-[#00ff41] selection:text-black">
      {/* Top Cyberpunk Glassmorphism Navbar */}
      <header className="sticky top-0 z-40 bg-[#0a0d13]/90 backdrop-blur-md border-b border-[#1f2937] px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <AkashCyberAvatar size="sm" showToggle={false} theme={currentTheme} className="w-8 h-8 rounded-full border border-emerald-500/50" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-wide text-sm sm:text-base font-mono">
                  {portfolioData.name}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                  SDET / QA
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">Playwright Automation Engineer</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-mono text-gray-300">
            <a href="#overview" className="hover:text-emerald-400 transition-colors py-1">Overview</a>
            <a href="#metrics" className="hover:text-emerald-400 transition-colors py-1">Impact</a>
            <a href="#skills" className="hover:text-emerald-400 transition-colors py-1">Skills</a>
            <a href="#experience" className="hover:text-emerald-400 transition-colors py-1">Experience</a>
            <a href="#projects" className="hover:text-emerald-400 transition-colors py-1">Projects</a>
            <a href="#test-sandbox" className="hover:text-cyan-400 text-cyan-300 font-bold transition-colors py-1 flex items-center gap-1">
              <Play className="w-3 h-3 text-cyan-400" />
              Live Test Runner
            </a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors py-1">Contact</a>
          </nav>

          {/* Right Action Controls: Switch to CLI, Audio, Resume */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => {
                onToggleSound();
              }}
              className={`p-2 rounded-lg border transition cursor-pointer active:scale-95 ${
                soundEnabled
                  ? 'border-emerald-500/60 bg-emerald-950/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'border-gray-800 bg-[#12161f] text-gray-400 hover:text-gray-200'
              }`}
              title={soundEnabled ? 'Mute Sound SFX' : 'Enable Sound SFX'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* View Mode Toggle: Switch to CLI Shell (vijay-narasimha.github.io style) */}
            <button
              type="button"
              id="gui-switch-to-cli-btn"
              onClick={() => {
                terminalAudio.playThemeSwitch();
                onSwitchToCli();
              }}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg border border-emerald-500/60 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 hover:text-white text-xs font-mono font-bold shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-all cursor-pointer active:scale-95 group"
              title="Switch to Terminal CLI Shell Mode (or press Ctrl+`)"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400 group-hover:animate-bounce" />
              <span>Switch to CLI</span>
            </button>

            {/* Resume button */}
            <button
              type="button"
              onClick={() => {
                terminalAudio.playButtonClick();
                onOpenResumeModal();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/50 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 hover:text-white text-xs font-mono transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Resume</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        {/* HERO SECTION */}
        <section id="overview" className="relative pt-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Bio & Core Pitch */}
            <div className="lg:col-span-8 space-y-6">
              {/* Availability Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold">Available for SDET & Automation Opportunities</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-400">3 Years Experience</span>
              </div>

              {/* Display Headline */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-[#00ff41]">{portfolioData.name}</span>
                </h1>
                <h2 className="text-lg sm:text-xl font-mono text-cyan-300 mt-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>{portfolioData.role}</span>
                </h2>
              </div>

              {/* Bio Summary */}
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-3xl font-normal">
                {portfolioData.summary}
              </p>

              {/* Quick Action Button Group */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    terminalAudio.playThemeSwitch();
                    onSwitchToCli();
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition cursor-pointer active:scale-95"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Open Interactive Terminal</span>
                </button>

                <a
                  href="#test-sandbox"
                  onClick={() => terminalAudio.playButtonClick()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#141d26] hover:bg-[#1a2530] text-cyan-300 border border-cyan-500/40 font-mono font-medium text-xs sm:text-sm transition cursor-pointer"
                >
                  <Play className="w-4 h-4 text-cyan-400" />
                  <span>Run Playwright Suite</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    terminalAudio.playDownloadBurst();
                    onDownloadResume();
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#11161f] hover:bg-[#18202c] text-gray-200 border border-gray-700 font-mono text-xs sm:text-sm transition cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download Resume (PDF)</span>
                </button>
              </div>

              {/* Social and Contact Links */}
              <div className="flex flex-wrap items-center gap-3 pt-3 text-xs font-mono text-gray-400">
                <a
                  href={portfolioData.contacts.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0f131a] border border-gray-800 hover:border-emerald-500/60 hover:text-emerald-400 transition"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>

                <a
                  href={portfolioData.contacts.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0f131a] border border-gray-800 hover:border-cyan-500/60 hover:text-cyan-400 transition"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0f131a] border border-gray-800 hover:border-emerald-500/60 hover:text-emerald-400 transition cursor-pointer"
                  title="Copy Email"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{portfolioData.contacts.email}</span>
                  {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 opacity-60" />}
                </button>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0f131a] border border-gray-800 text-gray-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{portfolioData.contacts.location} (Remote / Relocation)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Cyber Avatar & Quick Specs Card */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="w-full max-w-sm bg-[#0c1017] border border-[#1f2937] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                {/* Cyber corner accents */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-cyan-500/20 to-transparent pointer-events-none" />

                {/* Avatar with cyber/terminal theme switch */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <AkashCyberAvatar size="lg" showToggle={true} theme={currentTheme} />

                  <div>
                    <h3 className="text-lg font-bold text-white font-mono">{portfolioData.name}</h3>
                    <p className="text-xs text-emerald-400 font-mono mt-0.5">Playwright SDET · HCL Tech</p>
                  </div>

                  <div className="w-full border-t border-gray-800 pt-3 space-y-2 text-left text-xs font-mono">
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Primary Engine:</span>
                      <span className="text-cyan-300 font-semibold">Playwright + TS</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Test Scope:</span>
                      <span className="text-emerald-400 font-semibold">E2E + REST API</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span>CI Pipeline:</span>
                      <span className="text-white font-semibold">GitHub Actions / Docker</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span>AI QA Agents:</span>
                      <span className="text-yellow-300 font-semibold">Playwright MCP / Copilot</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS & QA IMPACT SECTION */}
        <section id="metrics" className="space-y-6">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-wide">
              Engineering Impact & Key Metrics
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {portfolioData.metrics.map((metric, idx) => (
              <div
                key={idx}
                className="bg-[#0b0f17] border border-[#1e293b] hover:border-emerald-500/50 p-5 rounded-xl transition-all duration-200 shadow-md group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition" />
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tracking-tight">
                  {metric.value}
                </div>
                <div className="text-xs font-mono font-bold text-cyan-300 mt-1 uppercase tracking-wider">
                  {metric.title}
                </div>
                <div className="text-xs font-mono text-emerald-500/90 mt-0.5 font-medium">
                  {metric.change}
                </div>
                <p className="text-xs text-gray-400 mt-2.5 leading-relaxed font-sans">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS MATRIX SECTION */}
        <section id="skills" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-wide">
                Technical Skills & Architecture
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  terminalAudio.playButtonClick();
                  setActiveSkillTab('all');
                }}
                className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                  activeSkillTab === 'all'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-sm'
                    : 'bg-[#0f141d] border-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                All Skills
              </button>
              {portfolioData.skillsCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    terminalAudio.playButtonClick();
                    setActiveSkillTab(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                    activeSkillTab === cat.id
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold shadow-sm'
                      : 'bg-[#0f141d] border-gray-800 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSkillsCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-[#0b0e15] border border-[#1b2331] hover:border-cyan-500/50 rounded-xl p-5 shadow-lg transition-all space-y-4"
              >
                <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-bold text-sm font-mono text-white">{cat.title}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    {cat.skills.length} skills
                  </span>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed font-sans">{cat.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded bg-[#131923] border border-gray-800 hover:border-emerald-500/40 text-gray-200 hover:text-emerald-300 text-xs font-mono transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WORK EXPERIENCE SECTION */}
        <section id="experience" className="space-y-6">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-wide">
              Work Experience
            </h2>
          </div>

          <div className="space-y-6">
            {portfolioData.experience.map((exp) => (
              <div
                key={exp.id}
                className="bg-[#0b0f17] border border-[#1e2838] rounded-xl p-6 shadow-xl relative overflow-hidden"
              >
                {/* Header: Role, Company, Period */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white font-mono">{exp.role}</h3>
                    <div className="flex items-center gap-2 text-sm text-cyan-300 font-mono mt-0.5">
                      <span className="font-semibold">{exp.company}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-400">{exp.location || 'India'}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-emerald-400">{exp.type}</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs font-mono text-gray-300">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{exp.period}</span>
                  </div>
                </div>

                {/* Metrics Highlight Pills */}
                {exp.metrics && exp.metrics.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                    {exp.metrics.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="bg-[#101622] border border-gray-800/80 p-3 rounded-lg text-xs font-mono"
                      >
                        <div className="text-base font-bold text-emerald-400">{m.value}</div>
                        <div className="text-gray-300 font-semibold">{m.label}</div>
                        <div className="text-[11px] text-gray-400 font-sans mt-0.5">{m.description}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Responsibilities list */}
                <div className="space-y-2.5 my-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold">
                    Key Accomplishments & Architecture:
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-gray-300 font-sans">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack Pills */}
                <div className="pt-3 border-t border-gray-800/80 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-mono text-gray-400 mr-2">Tech Stack:</span>
                  {exp.stack.map((stk, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950/40 text-emerald-300 border border-emerald-500/20"
                    >
                      {stk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED PROJECTS SECTION */}
        <section id="projects" className="space-y-6">
          <div className="flex items-center gap-3">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-wide">
              Featured Test Frameworks & Projects
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolioData.projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-[#0b0f17] border border-[#1e293b] hover:border-emerald-500/50 rounded-xl p-6 shadow-xl transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                      {proj.category}
                    </span>
                    <span className="text-xs font-mono text-gray-500 group-hover:text-emerald-400 transition">
                      CMD: {proj.commandName}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white font-mono group-hover:text-emerald-400 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-cyan-300 font-mono">{proj.subtitle}</p>
                  <p className="text-xs text-gray-300 font-sans leading-relaxed">{proj.description}</p>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-2">
                    <h4 className="text-[11px] font-mono uppercase tracking-wide text-gray-400">Highlights:</h4>
                    <ul className="space-y-1 text-xs text-gray-300">
                      {proj.highlights.map((hl, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">›</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Impact metrics */}
                  {proj.impactMetrics && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {proj.impactMetrics.map((im, imIdx) => (
                        <span
                          key={imIdx}
                          className="px-2 py-1 rounded bg-[#131b26] text-[11px] font-mono text-emerald-300 border border-emerald-500/20"
                        >
                          {im}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom stack & actions */}
                <div className="pt-4 border-t border-gray-800/80 space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {proj.techStack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/50 text-gray-400 border border-gray-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href="#test-sandbox"
                      onClick={() => terminalAudio.playButtonClick()}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Run Live Test Sandbox</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE TEST RUNNER SANDBOX (EMBEDDED) */}
        <section id="test-sandbox" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-wide">
                  Interactive Playwright Test Runner Sandbox
                </h2>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Execute live simulation test suites with multi-browser workers & assertions
                </p>
              </div>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30 self-start sm:self-auto">
              ● Engine: Playwright v1.42
            </div>
          </div>

          <div className="bg-[#080b10] border border-[#1f2937] rounded-xl overflow-hidden shadow-2xl p-2 sm:p-4">
            <InteractiveTestRunner theme={currentTheme} defaultRunning={false} />
          </div>
        </section>

        {/* EDUCATION & CERTIFICATIONS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-mono font-bold text-lg">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <span>Education</span>
            </div>

            <div className="space-y-3">
              {portfolioData.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-[#0b0f17] border border-[#1e2838] p-5 rounded-xl space-y-2 font-mono text-xs"
                >
                  <div className="text-sm font-bold text-white">{edu.degree}</div>
                  <div className="text-cyan-300 font-semibold">{edu.field}</div>
                  <div className="text-emerald-400 font-bold">CGPA: {edu.cgpa}</div>
                  {edu.institution && <div className="text-gray-400">{edu.institution}</div>}
                  {edu.details && (
                    <ul className="list-disc list-inside text-gray-400 pt-2 space-y-1 font-sans">
                      {edu.details.map((d, dIdx) => (
                        <li key={dIdx}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-mono font-bold text-lg">
              <Award className="w-5 h-5 text-cyan-400" />
              <span>Certifications & Specialized QA Training</span>
            </div>

            <div className="space-y-3">
              {portfolioData.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="bg-[#0b0f17] border border-[#1e2838] p-4 rounded-xl flex items-center justify-between gap-3 font-mono text-xs"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{cert.title}</div>
                    <div className="text-gray-400 mt-0.5">{cert.issuer}</div>
                    <div className="text-cyan-300 text-[11px] mt-1">{cert.focus}</div>
                  </div>
                  {cert.year && (
                    <span className="px-2 py-1 rounded bg-gray-900 text-emerald-400 border border-gray-800 text-[11px]">
                      {cert.year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT & GET IN TOUCH SECTION */}
        <section id="contact" className="space-y-6">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-wide">
              Get in Touch & Connect
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Contact details & cards */}
            <div className="lg:col-span-5 space-y-4 font-mono text-xs">
              <div className="bg-[#0b0f17] border border-[#1e2838] p-5 rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-white">Direct Channels:</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded bg-[#101622] border border-gray-800">
                    <div className="flex items-center gap-2.5 text-gray-300">
                      <Mail className="w-4 h-4 text-emerald-400" />
                      <span className="truncate">{portfolioData.contacts.email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="p-1.5 rounded bg-black/60 hover:bg-emerald-950 text-gray-300 hover:text-emerald-300 transition cursor-pointer"
                      title="Copy Email"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded bg-[#101622] border border-gray-800">
                    <div className="flex items-center gap-2.5 text-gray-300">
                      <Phone className="w-4 h-4 text-cyan-400" />
                      <span>{portfolioData.contacts.phone}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="p-1.5 rounded bg-black/60 hover:bg-cyan-950 text-gray-300 hover:text-cyan-300 transition cursor-pointer"
                      title="Copy Phone"
                    >
                      {copiedPhone ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <a
                    href={portfolioData.contacts.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded bg-[#101622] border border-gray-800 hover:border-blue-500/50 transition group"
                  >
                    <div className="flex items-center gap-2.5 text-gray-300 group-hover:text-blue-400">
                      <Linkedin className="w-4 h-4 text-blue-400" />
                      <span>linkedin.com/in/akash-kollabathula</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400" />
                  </a>

                  <a
                    href={portfolioData.contacts.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded bg-[#101622] border border-gray-800 hover:border-emerald-500/50 transition group"
                  >
                    <div className="flex items-center gap-2.5 text-gray-300 group-hover:text-emerald-400">
                      <Github className="w-4 h-4 text-emerald-400" />
                      <span>github.com/akash-kollabathula</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-400" />
                  </a>
                </div>
              </div>

              {/* Quick Resume Card */}
              <div className="bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/40 p-5 rounded-xl space-y-3">
                <div className="font-bold text-white text-sm">Need Akash&apos;s Resume for Recruiting?</div>
                <p className="text-gray-300 text-xs font-sans">
                  Available in high-resolution ATS-optimized PDF format or printable plain text.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      terminalAudio.playDownloadBurst();
                      onDownloadResume();
                    }}
                    className="flex-1 py-2 px-3 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      terminalAudio.playButtonClick();
                      onOpenResumeModal();
                    }}
                    className="py-2 px-3 rounded bg-black/60 hover:bg-gray-800 text-gray-200 border border-gray-700 text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Email Generator Form */}
            <div className="lg:col-span-7 bg-[#0b0f17] border border-[#1e2838] p-6 rounded-xl space-y-4">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Send Quick Message to Akash:</span>
              </h3>

              <form onSubmit={handleSendContact} className="space-y-4 text-xs font-mono">
                <div>
                  <label htmlFor="contact-subject" className="block text-gray-400 mb-1">Subject / Role:</label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="e.g. SDET / Automation Engineer Opening at..."
                    className="w-full bg-[#121620] border border-gray-800 focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-600 outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-gray-400 mb-1">Message / Project Details:</label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Hi Akash, we are looking for a Playwright SDET engineer to lead our test automation initiatives..."
                    className="w-full bg-[#121620] border border-gray-800 focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-600 outline-none transition resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-gray-500">
                    Opens default mail client directly to Akash
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center gap-2 transition cursor-pointer active:scale-95 shadow-lg shadow-cyan-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-800/80 bg-[#080a0f] py-8 px-4 sm:px-6 lg:px-8 mt-16 font-mono text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold">{portfolioData.name}</span>
            <span className="text-gray-600">|</span>
            <span>SDET Automation Engineer</span>
            <span className="text-gray-600">|</span>
            <span className="text-emerald-400">3 Years Quality Engineering</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                terminalAudio.playThemeSwitch();
                onSwitchToCli();
              }}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Switch to Terminal CLI</span>
            </button>
            <span className="text-gray-600">•</span>
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
