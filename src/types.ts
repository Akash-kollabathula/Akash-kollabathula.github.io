export interface SocialLinks {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location?: string;
}

export interface SkillItem {
  name: string;
  level?: 'Expert' | 'Advanced' | 'Proficient';
  featured?: boolean;
}

export interface SkillCategory {
  id: string;
  title: string;
  iconName: string;
  description: string;
  skills: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  type: string;
  stack: string[];
  responsibilities: string[];
  metrics: {
    label: string;
    value: string;
    description: string;
  }[];
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Automation' | 'API Testing' | 'CI/CD' | 'Full E2E';
  description: string;
  techStack: string[];
  highlights: string[];
  impactMetrics: string[];
  githubUrl?: string;
  demoUrl?: string;
  commandName: string;
}

export interface EducationItem {
  degree: string;
  field: string;
  cgpa: string;
  institution?: string;
  details?: string[];
}

export interface CertificationItem {
  title: string;
  issuer: string;
  year?: string;
  focus: string;
}

export interface ProfileData {
  name: string;
  handle: string;
  hostname: string;
  role: string;
  yearsOfExperience: string;
  summary: string;
  contacts: SocialLinks;
  skillsCategories: SkillCategory[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  metrics: {
    title: string;
    value: string;
    change?: string;
    description: string;
  }[];
}

export interface TerminalOutputItem {
  id: string;
  timestamp: string;
  command: string;
  component?: string; // identifier for custom UI component or rendered block
  data?: any;
  rawText?: string;
  isError?: boolean;
  type?: 'command' | 'system' | 'boot' | 'info' | 'help' | 'banner';
}

export type TerminalTheme = 'kali-green' | 'cyber-cyan' | 'amber-phosphor' | 'hacker-purple' | 'matrix-dark';

export interface ThemeConfig {
  id: TerminalTheme;
  name: string;
  primaryColor: string; // e.g. text-emerald-400
  accentColor: string; // e.g. text-cyan-400
  bgColor: string; // e.g. bg-black or bg-slate-950
  borderColor: string;
  glowColor: string;
  promptUserColor: string;
  promptHostColor: string;
  bannerColor: string;
}
