
import React, { useEffect, useRef } from 'react';

interface Props {
  theme: 'neon' | 'golden' | 'cosmic' | 'forest' | 'indigo' | 'yellow' | 'white' | 'grey' | 'cherry' | 'red';
  speed: number;
  density: number;
  style: 'constellation' | 'stars_only' | 'static';
}

export const GalaxyBackground: React.FC<Props> = ({ theme, speed, density, style }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    const connectionDistance = 150;
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;

    const colors: Record<string, string> = {
      neon: '6, 182, 212',
      golden: '255, 215, 0',
      cosmic: '168, 85, 247',
      forest: '16, 185, 129',
      indigo: '79, 70, 229',
      yellow: '250, 204, 21',
      white: '255, 255, 255',
      grey: '148, 163, 184',
      cherry: '244, 63, 94',
      red: '239, 68, 68'
    };

    class Particle {
      angle: number;
      radius: number;
      orbitalSpeed: number;
      size: number;
      x: number;
      y: number;
      opacity: number;

      constructor() {
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.pow(Math.random(), 0.5) * (Math.max(canvas!.width, canvas!.height) * 0.8);
        this.orbitalSpeed = (0.002 + Math.random() * 0.002) * (1 + 100 / (this.radius + 50)) * speed;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.x = centerX + Math.cos(this.angle) * this.radius;
        this.y = centerY + Math.sin(this.angle) * this.radius;
      }

      update() {
        if (style === 'static') return;
        this.angle += this.orbitalSpeed;
        this.x = centerX + Math.cos(this.angle) * this.radius;
        this.y = centerY + Math.sin(this.angle) * this.radius;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${colors[theme] || colors.golden}, ${this.opacity})`;
        ctx!.fill();
        
        if (this.size > 1.8) {
          ctx!.shadowBlur = 10;
          ctx!.shadowColor = `rgba(${colors[theme] || colors.golden}, 0.5)`;
        } else {
          ctx!.shadowBlur = 0;
        }
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      centerX = canvas.width / 2;
      centerY = canvas.height / 2;
      particles = Array.from({ length: density }, () => new Particle());
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      if (style === 'constellation') {
        ctx.shadowBlur = 0;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < connectionDistance) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              const alpha = (1 - dist / connectionDistance) * 0.2;
              ctx.strokeStyle = `rgba(${colors[theme] || colors.golden}, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }
      requestAnimationFrame(animate);
    };

    init();
    animate();
    
    const handleResize = () => init();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme, speed, density, style]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000" 
      style={{ opacity: 0.6 }}
    />
  );
};
