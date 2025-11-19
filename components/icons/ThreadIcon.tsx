'use client';

import { motion } from 'framer-motion';

interface ThreadIconProps {
  className?: string;
  size?: number;
}

export default function ThreadIcon({ className = '', size = 48 }: ThreadIconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.1, rotate: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      {/* Glow and gradient definitions */}
      <defs>
        <filter id="thread-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="thread-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="thread-flow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#ef4444" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Background flow effect */}
      <motion.rect
        x="8"
        y="8"
        width="32"
        height="32"
        rx="16"
        fill="url(#thread-flow)"
        opacity="0.3"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Network nodes */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Top node */}
        <motion.circle
          cx="24"
          cy="12"
          r="3.5"
          fill="url(#thread-gradient)"
          filter="url(#thread-glow)"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Middle-left node */}
        <motion.circle
          cx="14"
          cy="24"
          r="3.5"
          fill="url(#thread-gradient)"
          filter="url(#thread-glow)"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* Middle-right node */}
        <motion.circle
          cx="34"
          cy="24"
          r="3.5"
          fill="url(#thread-gradient)"
          filter="url(#thread-glow)"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        />

        {/* Bottom node */}
        <motion.circle
          cx="24"
          cy="36"
          r="3.5"
          fill="url(#thread-gradient)"
          filter="url(#thread-glow)"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
        />

        {/* Center hub node - larger */}
        <motion.circle
          cx="24"
          cy="24"
          r="4"
          fill="url(#thread-gradient)"
          filter="url(#thread-glow)"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.45 }}
        />
      </motion.g>

      {/* Connecting lines with flow animation */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Top to center */}
        <motion.line
          x1="24"
          y1="15.5"
          x2="24"
          y2="20"
          stroke="url(#thread-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#thread-glow)"
          animate={{ pathLength: [0, 1], opacity: [0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Center to left */}
        <motion.line
          x1="20"
          y1="24"
          x2="17.5"
          y2="24"
          stroke="url(#thread-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#thread-glow)"
          animate={{ pathLength: [0, 1], opacity: [0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* Center to right */}
        <motion.line
          x1="28"
          y1="24"
          x2="30.5"
          y2="24"
          stroke="url(#thread-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#thread-glow)"
          animate={{ pathLength: [0, 1], opacity: [0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        />

        {/* Center to bottom */}
        <motion.line
          x1="24"
          y1="28"
          x2="24"
          y2="32.5"
          stroke="url(#thread-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#thread-glow)"
          animate={{ pathLength: [0, 1], opacity: [0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
        />
      </motion.g>

      {/* Data flow particles */}
      <motion.g>
        {/* Particle 1 - flowing down */}
        <motion.circle
          cx="24"
          cy="12"
          r="1.5"
          fill="#fca5a5"
          animate={{
            cy: [12, 24],
            opacity: [1, 0]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeIn' }}
        />

        {/* Particle 2 - flowing right */}
        <motion.circle
          cx="24"
          cy="24"
          r="1.5"
          fill="#fca5a5"
          animate={{
            cx: [24, 34],
            opacity: [1, 0]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeIn', delay: 0.3 }}
        />

        {/* Particle 3 - flowing left */}
        <motion.circle
          cx="24"
          cy="24"
          r="1.5"
          fill="#fca5a5"
          animate={{
            cx: [24, 14],
            opacity: [1, 0]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeIn', delay: 0.6 }}
        />

        {/* Particle 4 - flowing down */}
        <motion.circle
          cx="24"
          cy="24"
          r="1.5"
          fill="#fca5a5"
          animate={{
            cy: [24, 36],
            opacity: [1, 0]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeIn', delay: 0.9 }}
        />
      </motion.g>

      {/* Outer ring pulse */}
      <motion.circle
        cx="24"
        cy="24"
        r="18"
        stroke="url(#thread-gradient)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
        strokeDasharray="4 4"
        animate={{
          rotate: 360,
          scale: [1, 1.05, 1]
        }}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
          scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }}
        style={{ transformOrigin: '24px 24px' }}
      />
    </motion.svg>
  );
}
