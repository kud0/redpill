'use client';

import { useEffect, useRef } from 'react';

export default function RedPillExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 600;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Sparkles particle system
    const sparkles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      life: number;
    }> = [];

    // Create sparkles
    for (let i = 0; i < 50; i++) {
      sparkles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.3,
        life: Math.random(),
      });
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw sparkles
      sparkles.forEach((sparkle) => {
        sparkle.x += sparkle.speedX;
        sparkle.y += sparkle.speedY;
        sparkle.life += 0.01;

        // Wrap around screen
        if (sparkle.x < 0) sparkle.x = canvas.width;
        if (sparkle.x > canvas.width) sparkle.x = 0;
        if (sparkle.y < 0) sparkle.y = canvas.height;
        if (sparkle.y > canvas.height) sparkle.y = 0;

        // Pulsing effect
        const pulse = Math.sin(sparkle.life * 2) * 0.5 + 0.5;

        // Draw sparkle
        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size * pulse, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          sparkle.x,
          sparkle.y,
          0,
          sparkle.x,
          sparkle.y,
          sparkle.size * pulse
        );
        gradient.addColorStop(0, `rgba(255, 0, 51, ${sparkle.opacity * pulse})`);
        gradient.addColorStop(1, 'rgba(255, 0, 51, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="w-full h-[600px] relative bg-black overflow-hidden">
      {/* Sparkles canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* 3D CSS Red Pill */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1200px' }}>
        <div className="pill-scene">
          {/* Main Pill */}
          <div className="pill-wrapper">
            <div className="pill-3d">
              {/* Pill body */}
              <div className="pill-body">
                {/* Left hemisphere */}
                <div className="pill-hemisphere pill-left"></div>
                {/* Right hemisphere */}
                <div className="pill-hemisphere pill-right"></div>
                {/* Center cylinder */}
                <div className="pill-cylinder"></div>
                {/* Glossy highlight */}
                <div className="pill-gloss"></div>
                {/* Wireframe overlay */}
                <div className="pill-wireframe"></div>
              </div>
            </div>
          </div>

          {/* 3D Text below pill */}
          <div className="matrix-text">THE MATRIX IS REAL</div>
        </div>
      </div>

      <style jsx>{`
        .pill-scene {
          transform-style: preserve-3d;
          animation: scene-float 6s ease-in-out infinite;
        }

        .pill-wrapper {
          position: relative;
          width: 280px;
          height: 120px;
          transform-style: preserve-3d;
          margin-bottom: 80px;
        }

        .pill-3d {
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: pill-rotate 12s linear infinite;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .pill-3d:hover {
          animation-duration: 6s;
          transform: scale(1.1);
        }

        .pill-body {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .pill-hemisphere {
          position: absolute;
          width: 60px;
          height: 120px;
          border-radius: 60px;
          background: linear-gradient(135deg, #ff0033 0%, #cc0028 50%, #990020 100%);
        }

        .pill-left {
          left: 0;
          box-shadow:
            inset -15px 0 30px rgba(0, 0, 0, 0.4),
            inset 5px 0 20px rgba(255, 100, 100, 0.3),
            0 0 60px rgba(255, 0, 51, 0.6),
            0 0 100px rgba(255, 0, 51, 0.3);
        }

        .pill-right {
          right: 0;
          box-shadow:
            inset 15px 0 30px rgba(0, 0, 0, 0.4),
            inset -5px 0 20px rgba(255, 100, 100, 0.3),
            0 0 60px rgba(255, 0, 51, 0.6),
            0 0 100px rgba(255, 0, 51, 0.3);
        }

        .pill-cylinder {
          position: absolute;
          left: 60px;
          width: 160px;
          height: 120px;
          background: linear-gradient(
            to bottom,
            #ff0033 0%,
            #ff1a47 20%,
            #cc0028 50%,
            #990020 80%,
            #800018 100%
          );
          box-shadow:
            inset 0 15px 30px rgba(255, 100, 100, 0.4),
            inset 0 -15px 30px rgba(0, 0, 0, 0.5),
            0 0 60px rgba(255, 0, 51, 0.6),
            0 0 100px rgba(255, 0, 51, 0.3);
        }

        .pill-gloss {
          position: absolute;
          top: 20px;
          left: 70px;
          width: 100px;
          height: 30px;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.5) 0%,
            rgba(255, 255, 255, 0.2) 50%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(6px);
          pointer-events: none;
        }

        .pill-wireframe {
          position: absolute;
          inset: -3px;
          border: 2px solid rgba(255, 51, 51, 0.15);
          border-radius: 60px;
          pointer-events: none;
          box-shadow: 0 0 20px rgba(255, 51, 51, 0.2);
        }

        .matrix-text {
          position: absolute;
          bottom: -60px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Share Tech Mono', monospace;
          font-size: 1.2rem;
          font-weight: bold;
          color: white;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.5);
          letter-spacing: 0.15em;
          animation: text-float 4s ease-in-out infinite;
          white-space: nowrap;
        }

        @keyframes pill-rotate {
          0% {
            transform: rotateX(5deg) rotateY(0deg);
          }
          100% {
            transform: rotateX(5deg) rotateY(360deg);
          }
        }

        @keyframes scene-float {
          0%,
          100% {
            transform: translateY(0px) rotateX(2deg);
          }
          50% {
            transform: translateY(-20px) rotateX(-2deg);
          }
        }

        @keyframes text-float {
          0%,
          100% {
            transform: translateX(-50%) translateY(0px);
            opacity: 0.8;
          }
          50% {
            transform: translateX(-50%) translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
