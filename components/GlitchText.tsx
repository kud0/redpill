'use client';

import { useEffect, useRef } from 'react';

interface GlitchTextProps {
  text: string;
}

const GlitchText = ({ text }: GlitchTextProps) => {
  const elementRef = useRef<HTMLHeadingElement>(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&";

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const originalText = text.split('');
    let iteration = 0;

    const interval = setInterval(() => {
      element.innerText = originalText
        .map((letter, index) => {
          if (index < iteration) {
            return text[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3; // Controls speed
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <h1
      ref={elementRef}
      className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white font-mono tracking-tighter"
    >
      {text}
    </h1>
  );
};

export default GlitchText;
