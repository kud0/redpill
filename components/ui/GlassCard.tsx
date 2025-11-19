'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import styles from './GlassCard.module.css';

interface GlassCardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'glow' | 'bordered';
  blur?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  glow?: boolean;
  glowColor?: string;
  className?: string;
  onClick?: () => void;
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
  },
  tap: {
    scale: 0.98,
  },
};

export default function GlassCard({
  children,
  variant = 'default',
  blur = 'md',
  animated = true,
  glow = false,
  glowColor = '#dc2626',
  className = '',
  onClick,
}: GlassCardProps) {
  const Component = animated ? motion.div : 'div';

  const animationProps = animated ? {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-50px" },
    whileHover: "hover",
    whileTap: onClick ? "tap" : undefined,
    variants: cardVariants,
    transition: {
      duration: 0.6,
      ease: "easeOut" as any,
    },
  } : {};

  return (
    <Component
      className={`${styles.card} ${styles[variant]} ${styles[blur]} ${className}`}
      style={glow ? { '--glow-color': glowColor } as any : undefined}
      onClick={onClick}
      {...animationProps}
    >
      {children}
    </Component>
  );
}
