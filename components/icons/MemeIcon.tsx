'use client';

import { motion } from 'framer-motion';

interface MemeIconProps {
  className?: string;
  size?: number;
}

export default function MemeIcon({ className = '', size = 48 }: MemeIconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      {/* Glow effect */}
      <defs>
        <filter id="meme-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="meme-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <radialGradient id="meme-spark" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background circle with pulse animation */}
      <motion.circle
        cx="24"
        cy="24"
        r="22"
        fill="url(#meme-spark)"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main speech bubble (viral spread) */}
      <motion.path
        d="M32 12H16C13.79 12 12 13.79 12 16V26C12 28.21 13.79 30 16 30H18L22 34L26 30H32C34.21 30 36 28.21 36 26V16C36 13.79 34.21 12 32 12Z"
        stroke="url(#meme-gradient)"
        strokeWidth="2.5"
        fill="none"
        filter="url(#meme-glow)"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />

      {/* Sparkle 1 - top right */}
      <motion.g
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path
          d="M36 10L37 12L39 11L38 13L40 14L38 15L39 17L37 16L36 18L35 16L33 17L34 15L32 14L34 13L33 11L35 12L36 10Z"
          fill="url(#meme-gradient)"
          filter="url(#meme-glow)"
        />
      </motion.g>

      {/* Sparkle 2 - bottom left */}
      <motion.g
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -180, -360],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <path
          d="M12 32L13 34L15 33L14 35L16 36L14 37L15 39L13 38L12 40L11 38L9 39L10 37L8 36L10 35L9 33L11 34L12 32Z"
          fill="url(#meme-gradient)"
          filter="url(#meme-glow)"
        />
      </motion.g>

      {/* Viral spread effect - connecting nodes */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {/* Small bubble 1 */}
        <motion.circle
          cx="38"
          cy="20"
          r="3"
          fill="url(#meme-gradient)"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.line
          x1="32"
          y1="18"
          x2="35"
          y2="20"
          stroke="url(#meme-gradient)"
          strokeWidth="1.5"
          strokeDasharray="2,2"
          animate={{ pathLength: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Small bubble 2 */}
        <motion.circle
          cx="10"
          cy="22"
          r="2.5"
          fill="url(#meme-gradient)"
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        <motion.line
          x1="12"
          y1="20"
          x2="10.5"
          y2="22"
          stroke="url(#meme-gradient)"
          strokeWidth="1.5"
          strokeDasharray="2,2"
          animate={{ pathLength: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
        />
      </motion.g>

      {/* "Fire" emoji style elements inside bubble */}
      <motion.g
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '24px 22px' }}
      >
        <circle cx="20" cy="20" r="1.5" fill="#dc2626" />
        <circle cx="28" cy="20" r="1.5" fill="#dc2626" />
        <path
          d="M20 24C20 24 22 26 24 26C26 26 28 24 28 24"
          stroke="#dc2626"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </motion.g>
    </motion.svg>
  );
}
