
import React, { useRef, useEffect } from 'react';
import { Particle, Firework } from '../types';

const SnowCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowParticles = useRef<(Particle & { phase: number; drift: number })[]>([]);
  const snowBursts = useRef<Firework[]>([]); // Renamed conceptually from fireworks
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initSnow();
    };

    const initSnow = () => {
      const count = Math.floor((canvas.width * canvas.height) / 8000);
      snowParticles.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: Math.random() * 0.7 + 0.3,
        size: Math.random() * 2.5 + 0.8,
        color: '#ffffff',
        opacity: Math.random() * 0.5 + 0.3,
        phase: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.5 + 0.2,
      }));
    };

    const createSnowBurst = (x: number, y: number) => {
      // Use shades of white and very light blue for a snowy feel
      const colors = ['#ffffff', '#f0f9ff', '#e0f2fe', '#f8fafc'];
      const particles: Particle[] = Array.from({ length: 40 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        return {
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: 1,
        };
      });
      snowBursts.current.push({ x, y, particles });
    };

    let animationFrameId: number;
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Background Falling Snow
      snowParticles.current.forEach((p) => {
        const swing = Math.sin(time / 1000 + p.phase) * p.drift;
        
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          p.vx += (dx / dist) * force * 0.5;
          p.vy += (dy / dist) * force * 0.3;
        }

        p.x += p.vx + swing;
        p.y += p.vy;
        p.vx *= 0.96;

        if (p.y > canvas.height) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
          p.vx = 0;
        }
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      });

      // 2. Draw Click-Triggered Snow Bursts
      for (let bIdx = snowBursts.current.length - 1; bIdx >= 0; bIdx--) {
        const burst = snowBursts.current[bIdx];
        burst.particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          
          // Apply some air resistance and gravity to make them look like drifting snow
          p.vx *= 0.95;
          p.vy += 0.05; 
          
          p.opacity -= 0.01; // Gradually fade away

          if (p.opacity > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            // Soft glow for the "magical" burst snow
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Occasionally draw a tiny "snowflake" cross shape for larger ones
            if (p.size > 4 && p.opacity > 0.5) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.5})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x - p.size, p.y);
                ctx.lineTo(p.x + p.size, p.y);
                ctx.moveTo(p.x, p.y - p.size);
                ctx.lineTo(p.x, p.y + p.size);
                ctx.stroke();
            }
          }
        });

        if (burst.particles.every(p => p.opacity <= 0)) {
          snowBursts.current.splice(bIdx, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleClick = (e: MouseEvent) => {
      createSnowBurst(e.clientX, e.clientY);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    resize();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default SnowCanvas;
