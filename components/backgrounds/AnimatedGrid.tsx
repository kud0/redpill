'use client';

import { useEffect, useRef } from 'react';

interface AnimatedGridProps {
  className?: string;
}

export default function AnimatedGrid({ className = '' }: AnimatedGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Grid configuration
    const gridSize = 40;
    let offset = 0;

    // Animation
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.1)';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = -offset; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = -offset; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update offset for animation
      offset = (offset + 0.5) % gridSize;

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ opacity: 0.3 }}
      />
    </div>
  );
}
