import React, { useState } from 'react';
import { portfolioData } from '../data/portfolioData';
import { X, Printer, Download, Copy, ExternalLink, Mail, Phone, MapPin, Check, Briefcase, GraduationCap, Award, Cpu, Code2, Loader2 } from 'lucide-react';
import { downloadResumePDF } from '../utils/pdfGenerator';
import { terminalAudio } from '../utils/soundEffects';
import { AkashCyberAvatar } from './AkashCyberAvatar';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    terminalAudio.playButtonClick();
    window.print();
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      terminalAudio.playDownloadBurst();
      await downloadResumePDF();
      terminalAudio.playSuccessChime();
    } catch {
      terminalAudio.playErrorBeep();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyText = () => {
    terminalAudio.playButtonClick();
    const resumeText = `
${portfolioData.name.toUpperCase()}
${portfolioData.role}
Email: ${portfolioData.contacts.email} | Phone: ${portfolioData.contacts.phone} | LinkedIn: ${portfolioData.contacts.linkedin} | GitHub: ${portfolioData.contacts.github}

PROFESSIONAL SUMMARY
${portfolioData.summary}

TECHNICAL SKILLS
${portfolioData.skillsCategories.map(cat => `${cat.title}: ${cat.skills.join(', ')}`).join('\n')}

PROFESSIONAL EXPERIENCE
${portfolioData.experience.map(exp => `
${exp.role} · ${exp.company} (${exp.period})
Tech Stack: ${exp.stack.join(', ')}
${exp.responsibilities.map(r => `• ${r}`).join('\n')}
`).join('\n')}

PROJECTS
${portfolioData.projects.map(proj => `
${proj.title} (${proj.techStack.join(', ')})
${proj.description}
${proj.highlights.map(h => `• ${h}`).join('\n')}
`).join('\n')}

EDUCATION
${portfolioData.education.map(edu => `${edu.degree} – ${edu.field} | CGPA: ${edu.cgpa}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(resumeText);
    terminalAudio.playSuccessChime();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 font-mono cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c120f] border border-emerald-500/40 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] flex flex-col overflow-hidden font-mono cursor-default"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-emerald-950/40 border-b border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Akash_Kollabathula_SDET_Resume.pdf</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded text-xs transition cursor-pointer disabled:opacity-50"
              title="Download ATS PDF File"
            >
              {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>{isDownloading ? 'Saving...' : 'Download PDF'}</span>
            </button>
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1 bg-black/60 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 rounded text-xs transition cursor-pointer"
              title="Copy plain text resume"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-500/40 rounded text-xs transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={() => {
                terminalAudio.playButtonClick();
                onClose();
              }}
              className="p-1 text-gray-400 hover:text-white hover:bg-emerald-950 rounded transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Resume Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-gray-200 text-xs md:text-sm bg-[#080d0a] select-text">
          {/* Header */}
          <div className="border-b border-emerald-500/30 pb-5 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <AkashCyberAvatar size="sm" showToggle={false} className="shrink-0" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-emerald-400 tracking-tight">
                  {portfolioData.name}
                </h1>
                <p className="text-cyan-300 text-sm md:text-base font-medium mt-1">
                  {portfolioData.role}
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-300 space-y-1 sm:text-right font-mono">
              <div className="flex items-center gap-1.5 justify-center sm:justify-end text-emerald-300">
                <Mail className="w-3.5 h-3.5" />
                <a
                  href={`mailto:${portfolioData.contacts.email}?subject=Portfolio%20Inquiry%20-%20SDET%20%26%20Playwright%20Automation&body=Hi%20Akash,%0D%0A%0D%0AI%20reviewed%20your%20SDET%20portfolio%20and%20would%20like%20to%20connect%20regarding%20an%20opportunity.`}
                  className="hover:underline"
                >
                  {portfolioData.contacts.email}
                </a>
              </div>
              <div className="flex items-center gap-1.5 justify-center sm:justify-end text-cyan-300">
                <Phone className="w-3.5 h-3.5" />
                <a href={`tel:${portfolioData.contacts.phone}`} className="hover:underline">
                  {portfolioData.contacts.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 justify-center sm:justify-end pt-1">
                <a
                  href={portfolioData.contacts.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => terminalAudio.playProjectOpen()}
                  className="text-cyan-400 hover:text-cyan-200 underline flex items-center gap-1"
                >
                  LinkedIn
                </a>
                <span>•</span>
                <a
                  href={portfolioData.contacts.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => terminalAudio.playProjectOpen()}
                  className="text-emerald-400 hover:text-emerald-200 underline flex items-center gap-1"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-emerald-500/20 pb-1 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" /> Professional Summary
            </h2>
            <p className="text-gray-300 leading-relaxed text-xs md:text-[13px]">
              {portfolioData.summary}
            </p>
          </div>

          {/* Technical Skills */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-emerald-500/20 pb-1 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-yellow-400" /> Technical Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {portfolioData.skillsCategories.map((category) => (
                <div key={category.id} className="bg-black/40 p-2.5 rounded border border-emerald-500/20">
                  <div className="text-cyan-300 font-semibold text-[11px] mb-1">
                    {category.title}
                  </div>
                  <div className="text-gray-300 text-[11px] leading-relaxed">
                    {category.skills.join(' • ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Experience */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-emerald-500/20 pb-1 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-400" /> Professional Experience
            </h2>
            {portfolioData.experience.map((exp) => (
              <div key={exp.id} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm">{exp.role}</span>
                    <span className="text-gray-400"> · </span>
                    <span className="text-cyan-300 font-semibold">{exp.company}</span>
                  </div>
                  <span className="text-xs text-yellow-400 font-mono">{exp.period}</span>
                </div>
                <div className="text-[11px] text-gray-400 font-mono">
                  Stack: {exp.stack.join(' · ')}
                </div>
                <ul className="space-y-1.5 pl-4 list-disc text-gray-300 text-xs leading-relaxed">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-emerald-500/20 pb-1 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-fuchsia-400" /> Featured Automation Projects
            </h2>
            {portfolioData.projects.map((proj) => (
              <div key={proj.id} className="p-3 bg-black/40 rounded border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{proj.title}</span>
                  <span className="text-[11px] text-cyan-300 font-mono">{proj.techStack.join(' · ')}</span>
                </div>
                <p className="text-gray-300 text-xs">{proj.description}</p>
                <ul className="space-y-1 pl-4 list-disc text-gray-300 text-xs">
                  {proj.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-emerald-500/20 pb-1 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-yellow-400" /> Education
            </h2>
            {portfolioData.education.map((edu, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white">{edu.degree}</span>
                  <span className="text-gray-400"> – </span>
                  <span className="text-cyan-300">{edu.field}</span>
                </div>
                <span className="text-emerald-400 font-bold">CGPA: {edu.cgpa}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
