'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

interface RedPillLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'simple' | 'static' | 'icon' | 'wordmark';
  animated?: boolean;
  glow?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizeMap = {
  sm: { width: 32, height: 32, fontSize: '0.875rem' },
  md: { width: 64, height: 64, fontSize: '1.5rem' },
  lg: { width: 128, height: 128, fontSize: '3rem' },
  xl: { width: 160, height: 160, fontSize: '3.5rem' },
};

/**
 * RedPill Logo Component
 *
 * An epic animated pill capsule logo combining:
 * - 3D depth with gradients and shadows
 * - Matrix-style binary rain animation
 * - Glowing particle effects
 * - Liquid/fluid animation inside the pill
 * - Interactive hover and click states
 * - Multiple variants for different use cases
 */
export default function RedPillLogo({
  size = 'md',
  variant = 'default',
  animated = true,
  glow = true,
  onClick,
  className = '',
}: RedPillLogoProps) {
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [bubbleRadii, setBubbleRadii] = useState<number[]>([]);
  const [binaryCode, setBinaryCode] = useState<string[]>([]);
  const [particleOffsets, setParticleOffsets] = useState<number[]>([]);

  // Calculate dimensions based on screen size after mount
  const [dimensions, setDimensions] = useState(sizeMap[size]);

  useEffect(() => {
    if (size === 'xl' && typeof window !== 'undefined') {
      const isDesktop = window.innerWidth >= 768;
      setDimensions(isDesktop
        ? { width: 200, height: 200, fontSize: '4.5rem' }
        : { width: 160, height: 160, fontSize: '3.5rem' }
      );
    }
  }, [size]);

  // Initialize random values after client hydration
  useEffect(() => {
    setMounted(true);
    // Generate bubble radii (5 bubbles)
    setBubbleRadii([...Array(5)].map(() => 3 + Math.random() * 2));
    // Generate binary code (8 characters)
    setBinaryCode([...Array(8)].map(() => Math.random() > 0.5 ? '1' : '0'));
    // Generate particle offsets (6 particles)
    setParticleOffsets([...Array(6)].map(() => Math.random() * 40 - 20));
  }, []);

  // Continuous rotation animation
  useEffect(() => {
    if (animated && variant === 'default') {
      controls.start({
        rotateY: [0, 360],
        transition: {
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        },
      });
    }
  }, [animated, variant, controls]);

  // Handle click explosion effect
  const handleClick = () => {
    if (onClick) {
      setIsExploding(true);
      onClick();
      setTimeout(() => setIsExploding(false), 1000);
    }
  };

  // Static variant - simple pill shape
  if (variant === 'static') {
    return (
      <div
        className={className}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width={dimensions.width} height={dimensions.height} viewBox="0 0 100 100">
          <defs>
            <linearGradient id="pill-gradient-static" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
          </defs>
          <rect x="15" y="30" width="70" height="40" rx="20" fill="url(#pill-gradient-static)" />
        </svg>
      </div>
    );
  }

  // Icon variant - simplified for small sizes
  if (variant === 'icon' || variant === 'simple') {
    return (
      <motion.div
        className={className}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          perspective: '1000px',
        }}
        whileHover={animated ? { scale: 1.1 } : undefined}
        onClick={handleClick}
      >
        <motion.div
          animate={animated ? {
            rotateY: [0, 360],
          } : undefined}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
          }}
        >
          <svg width={dimensions.width} height={dimensions.height} viewBox="0 0 100 100">
            <defs>
              <linearGradient id="pill-gradient-simple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
              {glow && (
                <filter id="glow-filter-simple">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              )}
            </defs>
            <rect
              x="15"
              y="30"
              width="70"
              height="40"
              rx="20"
              fill="url(#pill-gradient-simple)"
              filter={glow ? 'url(#glow-filter-simple)' : undefined}
            />
          </svg>
        </motion.div>
      </motion.div>
    );
  }

  // Default variant - full featured logo
  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        perspective: '1000px',
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={animated ? { scale: 1.1 } : undefined}
    >
      {/* Glow effect background */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
          animate={animated ? {
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          } : undefined}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Main pill container */}
      <motion.div
        animate={controls}
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
        }}
      >
        <svg width={dimensions.width} height={dimensions.height} viewBox="0 0 200 200">
          <defs>
            {/* Main pill gradient */}
            <linearGradient id="pill-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#991b1b" stopOpacity="1" />
            </linearGradient>

            {/* Glass shine effect */}
            <linearGradient id="shine-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.1)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </linearGradient>

            {/* Liquid gradient */}
            <linearGradient id="liquid-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444">
                <animate
                  attributeName="stop-color"
                  values="#ef4444; #dc2626; #ef4444"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#991b1b">
                <animate
                  attributeName="stop-color"
                  values="#991b1b; #7f1d1d; #991b1b"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Shadow filter */}
            <filter id="shadow-filter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="2" dy="4" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Clip path for pill shape */}
            <clipPath id="pill-clip">
              <rect x="30" y="60" width="140" height="80" rx="40" />
            </clipPath>
          </defs>

          {/* Shadow layer */}
          <rect
            x="30"
            y="60"
            width="140"
            height="80"
            rx="40"
            fill="rgba(0, 0, 0, 0.3)"
            transform="translate(3, 6)"
            filter="blur(4px)"
          />

          {/* Main pill body */}
          <rect
            x="30"
            y="60"
            width="140"
            height="80"
            rx="40"
            fill="url(#pill-gradient)"
            filter="url(#shadow-filter)"
          />

          {/* Liquid animation inside pill */}
          {animated && mounted && (
            <g clipPath="url(#pill-clip)">
              {/* Bubbles */}
              {[...Array(5)].map((_, i) => (
                <circle
                  key={i}
                  cx={50 + i * 25}
                  cy={120}
                  r={bubbleRadii[i] || 3}
                  fill="rgba(255, 255, 255, 0.3)"
                >
                  <animate
                    attributeName="cy"
                    values="140; 60; 140"
                    dur={`${2 + i * 0.5}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0; 1; 0"
                    dur={`${2 + i * 0.5}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}

              {/* Liquid wave effect */}
              <path
                d="M 30 100 Q 70 95, 100 100 T 170 100 L 170 140 L 30 140 Z"
                fill="url(#liquid-gradient)"
                opacity="0.3"
              >
                <animate
                  attributeName="d"
                  values="M 30 100 Q 70 95, 100 100 T 170 100 L 170 140 L 30 140 Z;
                          M 30 100 Q 70 105, 100 100 T 170 100 L 170 140 L 30 140 Z;
                          M 30 100 Q 70 95, 100 100 T 170 100 L 170 140 L 30 140 Z"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          )}

          {/* Binary code particles (Matrix effect) */}
          {animated && mounted && (
            <g clipPath="url(#pill-clip)" opacity="0.4">
              {[...Array(8)].map((_, i) => (
                <text
                  key={i}
                  x={40 + i * 18}
                  y={70}
                  fill="#00ff41"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {binaryCode[i] || '0'}
                  <animate
                    attributeName="y"
                    values="60; 140; 60"
                    dur={`${1.5 + i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0; 1; 0.5; 0"
                    dur={`${1.5 + i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </text>
              ))}
            </g>
          )}

          {/* Center divider line */}
          <line
            x1="100"
            y1="60"
            x2="100"
            y2="140"
            stroke="rgba(0, 0, 0, 0.3)"
            strokeWidth="2"
          />

          {/* Glass shine overlay */}
          <rect
            x="30"
            y="60"
            width="70"
            height="80"
            rx="40"
            fill="url(#shine-gradient)"
            opacity="0.6"
          />

          {/* Top highlight */}
          <ellipse
            cx="80"
            cy="75"
            rx="30"
            ry="8"
            fill="rgba(255, 255, 255, 0.3)"
          />

          {/* Particle effects escaping from pill */}
          {animated && isHovered && mounted && (
            <g>
              {[...Array(6)].map((_, i) => (
                <circle
                  key={i}
                  cx={100 + (particleOffsets[i] || 0)}
                  cy={100}
                  r="2"
                  fill="#ef4444"
                  opacity="0.8"
                >
                  <animate
                    attributeName="cy"
                    values="100; 40; 40"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.8; 0.4; 0"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="r"
                    values="2; 1; 0"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </g>
          )}

          {/* Explosion effect on click */}
          {isExploding && (
            <g>
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const distance = 60;
                const endX = 100 + Math.cos(angle) * distance;
                const endY = 100 + Math.sin(angle) * distance;

                return (
                  <circle
                    key={i}
                    cx="100"
                    cy="100"
                    r="3"
                    fill="#ef4444"
                  >
                    <animate
                      attributeName="cx"
                      values={`100; ${endX}`}
                      dur="0.6s"
                      fill="freeze"
                    />
                    <animate
                      attributeName="cy"
                      values={`100; ${endY}`}
                      dur="0.6s"
                      fill="freeze"
                    />
                    <animate
                      attributeName="opacity"
                      values="1; 0"
                      dur="0.6s"
                      fill="freeze"
                    />
                  </circle>
                );
              })}
            </g>
          )}
        </svg>
      </motion.div>

      {/* Wordmark variant addition */}
      {variant === 'wordmark' && (
        <motion.div
          className="absolute left-full ml-4 top-1/2"
          style={{
            transform: 'translateY(-50%)',
            fontSize: dimensions.fontSize,
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #991b1b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            whiteSpace: 'nowrap',
          }}
          animate={animated ? {
            opacity: [1, 0.8, 1],
          } : undefined}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          REDPILL
        </motion.div>
      )}
    </motion.div>
  );
}
