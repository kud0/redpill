'use client';

import { motion } from 'framer-motion';

interface VoiceIconProps {
  className?: string;
  size?: number;
}

export default function VoiceIcon({ className = '', size = 48 }: VoiceIconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      {/* Glow and gradient definitions */}
      <defs>
        <filter id="voice-glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="voice-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <radialGradient id="voice-radial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background glow pulse */}
      <motion.circle
        cx="24"
        cy="24"
        r="22"
        fill="url(#voice-radial)"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Microphone body */}
      <motion.g
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Mic capsule */}
        <motion.rect
          x="20"
          y="10"
          width="8"
          height="14"
          rx="4"
          stroke="url(#voice-gradient)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#voice-glow)"
          animate={{ y: [0, -1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Mic stand arc */}
        <motion.path
          d="M16 20C16 24.418 19.582 28 24 28C28.418 28 32 24.418 32 20"
          stroke="url(#voice-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#voice-glow)"
        />

        {/* Mic stand vertical */}
        <motion.line
          x1="24"
          y1="28"
          x2="24"
          y2="34"
          stroke="url(#voice-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#voice-glow)"
        />

        {/* Mic base */}
        <motion.line
          x1="20"
          y1="34"
          x2="28"
          y2="34"
          stroke="url(#voice-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#voice-glow)"
        />
      </motion.g>

      {/* Sound waves - left side */}
      <motion.g>
        <motion.path
          d="M14 16C14 16 12 18 12 20C12 22 14 24 14 24"
          stroke="url(#voice-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M10 14C10 14 7 17 7 20C7 23 10 26 10 26"
          stroke="url(#voice-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        />
        <motion.path
          d="M6 12C6 12 3 16 3 20C3 24 6 28 6 28"
          stroke="url(#voice-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
      </motion.g>

      {/* Sound waves - right side */}
      <motion.g>
        <motion.path
          d="M34 16C34 16 36 18 36 20C36 22 34 24 34 24"
          stroke="url(#voice-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M38 14C38 14 41 17 41 20C41 23 38 26 38 26"
          stroke="url(#voice-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0.2, 0.6, 0.2]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        />
        <motion.path
          d="M42 12C42 12 45 16 45 20C45 24 42 28 42 28"
          stroke="url(#voice-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
      </motion.g>

      {/* AI particles floating around mic */}
      <motion.g>
        <motion.circle
          cx="18"
          cy="12"
          r="1.5"
          fill="#fca5a5"
          animate={{
            y: [0, -3, 0],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="30"
          cy="14"
          r="1.5"
          fill="#fca5a5"
          animate={{
            y: [0, -4, 0],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        <motion.circle
          cx="26"
          cy="11"
          r="1.5"
          fill="#fca5a5"
          animate={{
            y: [0, -2, 0],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        />
      </motion.g>

      {/* Waveform visualization inside mic */}
      <motion.g>
        <motion.line
          x1="22"
          y1="17"
          x2="22"
          y2="20"
          stroke="#dc2626"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ y1: [17, 16, 17], y2: [20, 21, 20] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.line
          x1="24"
          y1="15"
          x2="24"
          y2="22"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ y1: [15, 14, 15], y2: [22, 23, 22] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        />
        <motion.line
          x1="26"
          y1="16"
          x2="26"
          y2="21"
          stroke="#dc2626"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ y1: [16, 15, 16], y2: [21, 22, 21] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
      </motion.g>
    </motion.svg>
  );
}
