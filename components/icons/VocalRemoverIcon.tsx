'use client';

import { motion } from 'framer-motion';

interface VocalRemoverIconProps {
  className?: string;
  size?: number;
}

export default function VocalRemoverIcon({ className = '', size = 48 }: VocalRemoverIconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.1, rotate: 2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      {/* Glow and gradient definitions */}
      <defs>
        <filter id="vocal-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="vocal-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <linearGradient id="vocal-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <radialGradient id="vocal-radial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background glow */}
      <motion.circle
        cx="24"
        cy="24"
        r="20"
        fill="url(#vocal-radial)"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Center dividing line */}
      <motion.line
        x1="24"
        y1="8"
        x2="24"
        y2="40"
        stroke="url(#vocal-gradient-1)"
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.5"
        animate={{
          strokeDashoffset: [0, 8]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />

      {/* Left side - EQ bars (vocals) */}
      <motion.g
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Bar 1 - tallest */}
        <motion.rect
          x="6"
          y="18"
          width="3"
          height="12"
          rx="1.5"
          fill="url(#vocal-gradient-1)"
          filter="url(#vocal-glow)"
          animate={{
            height: [12, 16, 12],
            y: [18, 16, 18]
          }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Bar 2 */}
        <motion.rect
          x="11"
          y="20"
          width="3"
          height="8"
          rx="1.5"
          fill="url(#vocal-gradient-1)"
          filter="url(#vocal-glow)"
          animate={{
            height: [8, 12, 8],
            y: [20, 18, 20]
          }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        />

        {/* Bar 3 */}
        <motion.rect
          x="16"
          y="16"
          width="3"
          height="16"
          rx="1.5"
          fill="url(#vocal-gradient-1)"
          filter="url(#vocal-glow)"
          animate={{
            height: [16, 20, 16],
            y: [16, 14, 16]
          }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
      </motion.g>

      {/* Right side - EQ bars (instrumental) */}
      <motion.g
        initial={{ opacity: 0, x: 5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Bar 1 */}
        <motion.rect
          x="27"
          y="22"
          width="3"
          height="4"
          rx="1.5"
          fill="url(#vocal-gradient-2)"
          filter="url(#vocal-glow)"
          animate={{
            height: [4, 6, 4],
            y: [22, 21, 22]
          }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Bar 2 */}
        <motion.rect
          x="32"
          y="19"
          width="3"
          height="10"
          rx="1.5"
          fill="url(#vocal-gradient-2)"
          filter="url(#vocal-glow)"
          animate={{
            height: [10, 14, 10],
            y: [19, 17, 19]
          }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* Bar 3 */}
        <motion.rect
          x="37"
          y="21"
          width="3"
          height="6"
          rx="1.5"
          fill="url(#vocal-gradient-2)"
          filter="url(#vocal-glow)"
          animate={{
            height: [6, 10, 6],
            y: [21, 19, 21]
          }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        />
      </motion.g>

      {/* Separation arrows */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {/* Left arrow */}
        <motion.path
          d="M20 14L16 12L20 10"
          stroke="url(#vocal-gradient-1)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#vocal-glow)"
          animate={{
            x: [0, -2, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Right arrow */}
        <motion.path
          d="M28 14L32 12L28 10"
          stroke="url(#vocal-gradient-2)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#vocal-glow)"
          animate={{
            x: [0, 2, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>

      {/* Frequency spectrum visualization at bottom */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        {/* Left spectrum */}
        {[...Array(6)].map((_, i) => (
          <motion.line
            key={`left-${i}`}
            x1={8 + i * 2.5}
            y1={36}
            x2={8 + i * 2.5}
            y2={36 - (Math.sin(i) * 3 + 2)}
            stroke="url(#vocal-gradient-1)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
            animate={{
              y2: [36 - (Math.sin(i) * 3 + 2), 36 - (Math.sin(i) * 3 + 4), 36 - (Math.sin(i) * 3 + 2)]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.1
            }}
          />
        ))}

        {/* Right spectrum */}
        {[...Array(6)].map((_, i) => (
          <motion.line
            key={`right-${i}`}
            x1={28 + i * 2.5}
            y1={36}
            x2={28 + i * 2.5}
            y2={36 - (Math.cos(i) * 2 + 2)}
            stroke="url(#vocal-gradient-2)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
            animate={{
              y2: [36 - (Math.cos(i) * 2 + 2), 36 - (Math.cos(i) * 2 + 3.5), 36 - (Math.cos(i) * 2 + 2)]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.1
            }}
          />
        ))}
      </motion.g>

      {/* Particles showing separation */}
      <motion.g>
        <motion.circle
          cx="24"
          cy="12"
          r="1"
          fill="#fca5a5"
          animate={{
            cx: [24, 18, 24],
            opacity: [1, 0, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="24"
          cy="12"
          r="1"
          fill="#fca5a5"
          animate={{
            cx: [24, 30, 24],
            opacity: [1, 0, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>

      {/* Circular rotation effect */}
      <motion.circle
        cx="24"
        cy="24"
        r="18"
        stroke="url(#vocal-gradient-1)"
        strokeWidth="1"
        fill="none"
        opacity="0.2"
        strokeDasharray="3 5"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '24px 24px' }}
      />
    </motion.svg>
  );
}
