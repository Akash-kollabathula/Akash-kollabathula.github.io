import React, { useEffect, useRef } from 'react';
import { TerminalTheme } from '../types';

interface MatrixBackgroundProps {
  enabled: boolean;
  theme: TerminalTheme;
  opacity?: number;
}

export const MatrixBackground: React.FC<MatrixBackgroundProps> = ({
  enabled,
  theme,
  opacity = 0.08,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Characters for matrix rain (Katakana + Latin + Hex + Code symbols)
    const characters =
      '0123456789ABCDEF01010101PLAYWRIGHTTESTSDETAUTOMATIONCI/CDGITHUBTypeScriptAPI<>{}[]=/*~';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    // Theme color mapping for matrix rain
    const getThemeColor = () => {
      switch (theme) {
        case 'cyber-cyan':
          return { head: '#a5f3fc', body: '#06b6d4' };
        case 'amber-phosphor':
          return { head: '#fef08a', body: '#d97706' };
        case 'hacker-purple':
          return { head: '#f5d0fe', body: '#c026d3' };
        case 'matrix-dark':
          return { head: '#bbf7d0', body: '#16a34a' };
        case 'kali-green':
        default:
          return { head: '#6ee7b7', body: '#10b981' };
      }
    };

    let frameCount = 0;

    const render = () => {
      frameCount++;
      // Throttle to save CPU (render every 2nd frame)
      if (frameCount % 2 === 0) {
        ctx.fillStyle = 'rgba(5, 8, 7, 0.07)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const colors = getThemeColor();
        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = characters.charAt(Math.floor(Math.random() * characters.length));
          
          // Draw character
          const isLead = Math.random() > 0.85;
          ctx.fillStyle = isLead ? colors.head : colors.body;
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, theme]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      id="matrix-rain-canvas"
      aria-hidden="true"
      style={{ opacity }}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
    />
  );
};
