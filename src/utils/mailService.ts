export interface SendMailPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface SendMailResult {
  success: boolean;
  message: string;
  needsActivation?: boolean;
}

export const TARGET_EMAIL = 'kollabathula.akash.test@gmail.com';

/**
 * Dispatches a quick email to Akash using a 100% free form API (FormSubmit)
 * Supports both fullstack server relay and client-side static hosting (GitHub Pages).
 */
export async function sendQuickMessage(payload: SendMailPayload): Promise<SendMailResult> {
  const { name, email, subject, message } = payload;
  
  if (!email || !email.trim()) {
    return { success: false, message: 'Please enter your email address.' };
  }
  if (!message || !message.trim()) {
    return { success: false, message: 'Please enter a message.' };
  }

  // 1. Try server relay endpoint first if running fullstack
  try {
    const serverRes = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    });

    if (serverRes.ok) {
      const data = await serverRes.json();
      return {
        success: true,
        message: data.message || 'Message sent directly to Akash!',
      };
    }
  } catch {
    // If running statically on GitHub Pages, fallback to direct free API
  }

  // 2. Direct free API call via FormSubmit (CORS-enabled, free forever, no signup key required)
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: name || 'Portfolio Visitor',
        email: email.trim(),
        _subject: subject?.trim() || `Portfolio Quick Message from ${name || 'Recruiter'} (${email})`,
        message: message.trim(),
        _template: 'table',
        _captcha: 'false',
      }),
    });

    const data = await response.json();
    
    if (data.success === 'true' || data.success === true) {
      return {
        success: true,
        message: 'Message delivered to kollabathula.akash.test@gmail.com!',
      };
    } else if (data.message && data.message.toLowerCase().includes('activation')) {
      return {
        success: true,
        needsActivation: true,
        message: 'Form initialized! A confirmation email has been dispatched to kollabathula.akash.test@gmail.com.',
      };
    } else {
      return {
        success: false,
        message: data.message || 'Could not send message. Please use direct email.',
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Network error. Please try direct email.',
    };
  }
}
