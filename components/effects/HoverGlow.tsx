'use client';

import { useEffect, useRef, useState } from 'react';

interface HoverGlowProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: number;
  intensity?: number;
}

export default function HoverGlow({
  children,
  className = '',
  glowColor = '220, 38, 38',
  glowSize = 300,
  intensity = 0.4,
}: HoverGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        isolation: 'isolate',
      }}
    >
      {isHovering && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovering ? 1 : 0,
            background: `radial-gradient(${glowSize}px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(${glowColor}, ${intensity}), transparent 80%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}
