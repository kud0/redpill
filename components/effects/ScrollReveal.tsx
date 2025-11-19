'use client';

import { ReactNode, useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fade' | 'slide' | 'scale' | 'blur' | 'rotate' | 'flip';
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  animation = 'fade',
  direction = 'up',
  delay = 0,
  duration = 0.5,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const animations: Record<string, Variants> = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slide: {
      hidden: {
        opacity: 0,
        x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
        y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
      },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    blur: {
      hidden: { opacity: 0, filter: 'blur(10px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
    },
    rotate: {
      hidden: { opacity: 0, rotate: -10 },
      visible: { opacity: 1, rotate: 0 },
    },
    flip: {
      hidden: { opacity: 0, rotateX: -90 },
      visible: { opacity: 1, rotateX: 0 },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={animations[animation]}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger container for animating lists
interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className = '',
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger item for use inside StaggerContainer
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
