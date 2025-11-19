'use client';

import { useEffect, useRef } from 'react';

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.8;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 51, ${particle.opacity})`;
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
    <div className="h-[80vh] w-full relative overflow-hidden">
      {/* Particle canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* CSS 3D Red Pill */}
      <div className="absolute inset-0 flex items-center justify-center perspective-1000">
        <div className="pill-container animate-float-slow">
          <div className="pill-3d group cursor-pointer">
            {/* Pill body */}
            <div className="pill-body">
              {/* Left hemisphere */}
              <div className="pill-half pill-left"></div>
              {/* Right hemisphere */}
              <div className="pill-half pill-right"></div>
              {/* Center cylinder */}
              <div className="pill-center"></div>
              {/* Highlight */}
              <div className="pill-highlight"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        .pill-container {
          transform-style: preserve-3d;
        }

        .pill-3d {
          width: 200px;
          height: 80px;
          transform-style: preserve-3d;
          animation: rotate3d 8s linear infinite;
          transition: transform 0.3s ease;
        }

        .pill-3d:hover {
          animation-duration: 4s;
          transform: scale(1.2);
        }

        .pill-body {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .pill-half {
          position: absolute;
          width: 40px;
          height: 80px;
          background: linear-gradient(135deg, #ff0033 0%, #cc0028 50%, #990020 100%);
          border-radius: 40px;
        }

        .pill-left {
          left: 0;
          box-shadow:
            inset -10px 0 20px rgba(0, 0, 0, 0.3),
            0 0 40px rgba(255, 0, 51, 0.5);
        }

        .pill-right {
          right: 0;
          box-shadow:
            inset 10px 0 20px rgba(0, 0, 0, 0.3),
            0 0 40px rgba(255, 0, 51, 0.5);
        }

        .pill-center {
          position: absolute;
          left: 40px;
          width: 120px;
          height: 80px;
          background: linear-gradient(to bottom, #ff0033 0%, #cc0028 50%, #990020 100%);
          box-shadow:
            inset 0 10px 20px rgba(255, 100, 100, 0.3),
            inset 0 -10px 20px rgba(0, 0, 0, 0.3),
            0 0 40px rgba(255, 0, 51, 0.5);
        }

        .pill-highlight {
          position: absolute;
          top: 15px;
          left: 50px;
          width: 60px;
          height: 20px;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(4px);
        }

        @keyframes rotate3d {
          0% {
            transform: rotateY(0deg) rotateX(0deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(0deg);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
