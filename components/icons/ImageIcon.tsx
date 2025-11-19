'use client';

import { motion } from 'framer-motion';

interface ImageIconProps {
  className?: string;
  size?: number;
}

export default function ImageIcon({ className = '', size = 48 }: ImageIconProps) {
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
        <filter id="image-glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="image-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="image-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <linearGradient id="image-gradient-3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>

      {/* Background glow */}
      <motion.circle
        cx="24"
        cy="24"
        r="20"
        fill="url(#image-gradient-1)"
        opacity="0.2"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main frame - layered effect */}
      <motion.rect
        x="10"
        y="10"
        width="28"
        height="28"
        rx="4"
        stroke="url(#image-gradient-1)"
        strokeWidth="2.5"
        fill="none"
        filter="url(#image-glow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />

      {/* Second layer - offset */}
      <motion.rect
        x="12"
        y="12"
        width="28"
        height="28"
        rx="4"
        stroke="url(#image-gradient-2)"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
      />

      {/* Third layer - offset more */}
      <motion.rect
        x="14"
        y="14"
        width="28"
        height="28"
        rx="4"
        stroke="url(#image-gradient-3)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
      />

      {/* AI Neural network pattern inside */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {/* Neural nodes */}
        <motion.circle
          cx="16"
          cy="16"
          r="2"
          fill="url(#image-gradient-1)"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="32"
          cy="16"
          r="2"
          fill="url(#image-gradient-2)"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        <motion.circle
          cx="16"
          cy="32"
          r="2"
          fill="url(#image-gradient-3)"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        />
        <motion.circle
          cx="32"
          cy="32"
          r="2"
          fill="url(#image-gradient-1)"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
        />
        <motion.circle
          cx="24"
          cy="24"
          r="2.5"
          fill="url(#image-gradient-2)"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.45 }}
        />

        {/* Connecting lines */}
        <motion.line
          x1="16"
          y1="16"
          x2="24"
          y2="24"
          stroke="url(#image-gradient-1)"
          strokeWidth="1"
          opacity="0.5"
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.line
          x1="32"
          y1="16"
          x2="24"
          y2="24"
          stroke="url(#image-gradient-2)"
          strokeWidth="1"
          opacity="0.5"
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        <motion.line
          x1="16"
          y1="32"
          x2="24"
          y2="24"
          stroke="url(#image-gradient-3)"
          strokeWidth="1"
          opacity="0.5"
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.line
          x1="32"
          y1="32"
          x2="24"
          y2="24"
          stroke="url(#image-gradient-1)"
          strokeWidth="1"
          opacity="0.5"
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </motion.g>

      {/* Magic wand sparkle */}
      <motion.g
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '36px 12px' }}
      >
        <path
          d="M36 8L37 10L39 9L38 11L40 12L38 13L39 15L37 14L36 16L35 14L33 15L34 13L32 12L34 11L33 9L35 10L36 8Z"
          fill="url(#image-gradient-1)"
          filter="url(#image-glow)"
        />
      </motion.g>
    </motion.svg>
  );
}
