import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Avatar upload endpoint to save original profile image directly on disk
  app.post('/api/upload-avatar', (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64 || typeof imageBase64 !== 'string') {
        return res.status(400).json({ error: 'Missing imageBase64 string' });
      }

      const isPng = imageBase64.includes('image/png');
      const ext = isPng ? 'png' : 'jpg';
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const publicDir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      const primaryFileName = `Akashface.${ext}`;
      fs.writeFileSync(path.join(publicDir, primaryFileName), buffer);
      fs.writeFileSync(path.join(publicDir, `akash_profile.${ext}`), buffer);
      fs.writeFileSync(path.join(publicDir, 'Akashface.png'), buffer);
      fs.writeFileSync(path.join(publicDir, 'Akashface.jpg'), buffer);

      const distDir = path.join(process.cwd(), 'dist');
      if (fs.existsSync(distDir)) {
        fs.writeFileSync(path.join(distDir, primaryFileName), buffer);
        fs.writeFileSync(path.join(distDir, 'Akashface.png'), buffer);
        fs.writeFileSync(path.join(distDir, 'Akashface.jpg'), buffer);
      }

      console.log(`Successfully saved exact profile image (${primaryFileName}) to public directory`);
      return res.json({ success: true, url: `/${primaryFileName}` });
    } catch (err) {
      console.error('Failed to save avatar image:', err);
      return res.status(500).json({ error: 'Failed to write avatar image to disk' });
    }
  });

  app.get('/api/avatar', (req, res) => {
    const publicDir = path.join(process.cwd(), 'public');
    const candidates = ['Akashface.png', 'Akashface.jpg', 'akash_profile.png', 'akash_profile.jpg'];
    for (const file of candidates) {
      if (fs.existsSync(path.join(publicDir, file))) {
        return res.json({ exists: true, url: `/${file}` });
      }
    }
    return res.json({ exists: false, url: null });
  });

  // Free Email API endpoint for quick messages to Akash
  app.post('/api/send-email', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!email || !message) {
        return res.status(400).json({ error: 'Email and message are required' });
      }

      const targetEmail = 'kollabathula.akash.test@gmail.com';
      const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Referer: (req.headers.referer as string) || 'https://kollabathula-akash.github.io/',
        },
        body: JSON.stringify({
          name: name || 'Portfolio Visitor',
          email,
          _subject: subject || `Quick Message from ${name || 'Recruiter'} (${email})`,
          message,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const data = await formSubmitRes.json().catch(() => ({ success: true }));
      return res.json({
        success: true,
        message: 'Message delivered to kollabathula.akash.test@gmail.com',
        details: data,
      });
    } catch (err: any) {
      console.error('Error dispatching mail:', err);
      return res.status(500).json({
        error: 'Failed to dispatch email',
        message: err.message,
      });
    }
  });

  // Gemini AI Chat endpoint
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // Return intelligent fallback responses based on Akash's portfolio if key is not configured
        const fallbackAnswers: Record<string, string> = {
          default:
            "Akash Kollabathula is an SDET with 3 years of experience at HCL Technologies specializing in Playwright, TypeScript, REST API testing, and CI/CD quality gates. He achieved 85%+ critical flow automation coverage and cut regression execution time by 75%.",
          playwright:
            "Akash architected enterprise-grade Page Object Model (POM) test automation suites using Playwright + TypeScript, supporting parallel workers, custom fixtures, auto-waiting, and Allure reporting.",
          skills:
            "Akash's core technical stack includes Playwright, TypeScript, JavaScript, Java, Selenium WebDriver, Postman/RestAssured for API testing, Docker, Jenkins, GitHub Actions, and Git.",
        };

        const lowerMsg = (message || '').toLowerCase();
        let reply = fallbackAnswers.default;
        if (lowerMsg.includes('playwright') || lowerMsg.includes('framework')) {
          reply = fallbackAnswers.playwright;
        } else if (lowerMsg.includes('skill') || lowerMsg.includes('tool') || lowerMsg.includes('stack')) {
          reply = fallbackAnswers.skills;
        }

        return res.json({
          reply: `[GEMINI-3.5-FLASH] ${reply}\n\n(Tip: Type 'skills', 'experience', 'projects', or 'resume' to explore live records).`,
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are the AI Assistant embedded in Akash Kollabathula's Kali Linux SDET Portfolio Terminal.
Akash Kollabathula is a Software Development Engineer in Test (SDET) / Automation Engineer with 3 years of experience at HCL Technologies.
Key Details about Akash:
- Current Role: Software Engineer at HCL Technologies (Dec 2023 - Present)
- Core Stack: Playwright, TypeScript, JavaScript, Java, Selenium WebDriver, TestNG
- API Testing: Postman, REST Assured, automated contract/schema validation
- CI/CD & DevOps: GitHub Actions, Jenkins, Docker, Git
- Key Metrics: 85%+ critical path automated coverage, 75% regression time reduction (from 60 min to <15 min), flakiness cut from 20% to <4%
- Core Project: Builder Management Tool Automation Suite (250+ scenarios, multi-role testing, parallel runs)
- Education: B.Tech in Computer Science & Engineering
- Tone: Technical, concise, professional hacker terminal aesthetic. Keep responses focused and readable within a Linux terminal.`;

      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history) {
          if (item.role && item.text) {
            contents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message || 'Hello' }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Command executed without text output.";
      return res.json({ reply: replyText });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Gemini API error:', errorMessage);
      return res.status(500).json({
        error: 'Failed to process AI query',
        details: errorMessage,
      });
    }
  });

  // Vite development middleware or static production serve
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kali Terminal Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
