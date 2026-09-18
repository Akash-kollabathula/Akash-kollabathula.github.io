/**
 * Voice Speech Announcement System for Akash Kollabathula's Hacker Terminal
 * Utilizes Web Speech API SpeechSynthesis for robotic/tech voice feedback.
 */

class SpeechVoiceEngine {
  private enabled: boolean = true;

  constructor() {
    try {
      const stored = localStorage.getItem('kali_voice_enabled');
      if (stored !== null) {
        this.enabled = stored === 'true';
      }
    } catch {
      this.enabled = true;
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggleVoice(force?: boolean): boolean {
    this.enabled = force !== undefined ? force : !this.enabled;
    try {
      localStorage.setItem('kali_voice_enabled', String(this.enabled));
    } catch {}
    return this.enabled;
  }

  public speak(phrase: string) {
    if (!this.enabled) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      // Cancel previous speech to eliminate latency/queuing
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.rate = 1.05; // Slightly brisk, tech pace
      utterance.pitch = 0.95; // Confident, deep tech tone
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      // Look for clean English voices
      const selectedVoice =
        voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Alex') || v.name.includes('Daniel'))) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0];

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis playback error:', e);
    }
  }

  public announceCommand(rawCmd: string) {
    const cmd = rawCmd.trim().toLowerCase().split(' ')[0];
    switch (cmd) {
      case 'skills':
      case 'skill':
        this.speak('Akash skills');
        break;
      case 'experience':
      case 'exp':
      case 'career':
      case 'work':
        this.speak('Akash experience');
        break;
      case 'projects':
      case 'proj':
      case 'project':
        this.speak('Akash projects');
        break;
      case 'resume':
      case 'cv':
        this.speak('Opening Akash portfolio');
        break;
      case 'contact':
      case 'contacts':
      case 'email':
        this.speak('Akash contact');
        break;
      case 'about':
      case 'whoami':
        this.speak('Akash Kollabathula');
        break;
      case 'help':
        this.speak('Akash portfolio help');
        break;
      case 'test':
      case 'tests':
        this.speak('Running Akash test suite');
        break;
      case 'gemini':
      case 'chat':
      case 'ai':
        this.speak('Gemini AI Assistant initialized');
        break;
      default:
        // For general commands, speak brief cue
        break;
    }
  }

  public announcePortfolioOpen() {
    this.speak('Opening Akash portfolio');
  }

  public announceWrongCommand(rawCmd: string) {
    this.speak('Command not recognized. Type help for command list.');
  }
}

export const speechVoice = new SpeechVoiceEngine();
