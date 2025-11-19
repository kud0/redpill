# Code Patterns & Quick Reference

Quick reference guide for common patterns used throughout the premium Web3 UI system.

---

## Animation Patterns

### Basic Fade In
```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Fade In Up (Most Common)
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
>
  Content
</motion.div>
```

### Scroll-Triggered Animation
```typescript
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.8 }}
>
  Content
</motion.div>
```

### Staggered Children
```typescript
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.div
  variants={container}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div key={item.id} variants={item}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Hover Effects
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Click me
</motion.button>
```

### Continuous Animation (Pulse)
```typescript
<motion.div
  animate={{
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
>
  Pulsing element
</motion.div>
```

### Layout Animation
```typescript
<motion.div layout>
  Content that changes
</motion.div>
```

### Shared Layout Animation (Active Indicator)
```typescript
{isActive && (
  <motion.div
    layoutId="activeIndicator"
    className="absolute bottom-0 left-0 right-0 h-0.5 bg-redpill-500"
  />
)}
```

---

## Glass Morphism Patterns

### Basic Glass Card (Tailwind)
```tsx
<div className="
  bg-dark-400/60
  backdrop-blur-md
  border border-white/5
  rounded-lg
  p-6
">
  Content
</div>
```

### Glass Card with Glow
```tsx
<div className="
  bg-dark-400/60
  backdrop-blur-md
  border border-redpill-500/30
  rounded-lg
  p-6
  shadow-[0_0_20px_rgba(220,38,38,0.2)]
  hover:shadow-[0_0_40px_rgba(220,38,38,0.4)]
  transition-shadow
  duration-300
">
  Content
</div>
```

### Elevated Glass Card
```tsx
<div className="
  bg-dark-300/70
  backdrop-blur-lg
  border border-white/8
  rounded-lg
  p-6
  shadow-[0_8px_32px_rgba(0,0,0,0.37)]
  shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
">
  Content
</div>
```

### CSS Module Version
```css
.glass-card {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 2rem;
}

/* Fallback for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(16px)) {
  .glass-card {
    background: rgba(10, 10, 10, 0.95);
  }
}
```

---

## Gradient Patterns

### Text Gradient
```tsx
<h1 className="
  bg-gradient-to-r
  from-redpill-400
  via-redpill-600
  to-redpill-800
  bg-clip-text
  text-transparent
">
  Gradient Text
</h1>
```

### Animated Gradient Background
```tsx
<div className="
  bg-gradient-to-r
  from-redpill-600
  to-redpill-800
  bg-[length:200%_100%]
  animate-gradient
">
  Content
</div>
```

```css
/* Add to tailwind.config.ts */
{
  animation: {
    gradient: 'gradient 3s ease infinite',
  },
  keyframes: {
    gradient: {
      '0%, 100%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
    },
  },
}
```

### Radial Gradient Glow
```tsx
<div className="
  bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15)_0%,transparent_70%)]
">
  Content
</div>
```

---

## Hook Patterns

### Mouse Position Tracking
```typescript
import { useState, useEffect } from 'react';

export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
};
```

### Scroll Progress
```typescript
import { useScroll, useTransform } from 'framer-motion';

export const useScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return scrollYProgress;
};

// Usage
const scrollProgress = useScrollProgress();
const opacity = useTransform(scrollProgress, [0, 0.5], [1, 0]);
```

### Intersection Observer
```typescript
import { useEffect, useRef, useState } from 'react';

export const useInView = (threshold = 0.1) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
};
```

### Device Detection
```typescript
import { useState, useEffect } from 'react';

export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    isMobile: false,
    isLowPower: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLowPower = navigator.hardwareConcurrency < 4;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    setCapabilities({
      isMobile,
      isLowPower,
      prefersReducedMotion: mediaQuery.matches,
    });
  }, []);

  return capabilities;
};
```

### Debounced Value
```typescript
import { useState, useEffect } from 'react';

export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

---

## Performance Patterns

### Dynamic Import with Loading
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  {
    loading: () => <LoadingSkeleton />,
    ssr: false, // Client-side only
  }
);
```

### Lazy Load on Scroll
```typescript
import { useInView } from '@/hooks/useInView';
import dynamic from 'next/dynamic';

const LazyComponent = dynamic(() => import('@/components/Heavy'));

const LazyWrapper = () => {
  const { ref, inView } = useInView();

  return (
    <div ref={ref}>
      {inView ? <LazyComponent /> : <div style={{ height: 400 }} />}
    </div>
  );
};
```

### RequestAnimationFrame Debounce
```typescript
export const debounceFrame = (callback: Function) => {
  let rafId: number | null = null;

  return (...args: any[]) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => callback(...args));
  };
};

// Usage
const handleScroll = debounceFrame(() => {
  // Expensive operation
});

window.addEventListener('scroll', handleScroll, { passive: true });
```

### Memoized Components
```typescript
import { memo } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  // Expensive rendering
  return <div>{data}</div>;
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.data === nextProps.data;
});
```

---

## Canvas Patterns

### Basic Canvas Setup
```typescript
import { useRef, useEffect } from 'react';

const CanvasComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Animation loop
    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw here

      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
};
```

### Particle System
```typescript
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

const createParticle = (canvas: HTMLCanvasElement): Particle => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 2,
  vy: (Math.random() - 0.5) * 2,
  size: Math.random() * 3 + 1,
});

const updateParticle = (particle: Particle, canvas: HTMLCanvasElement) => {
  particle.x += particle.vx;
  particle.y += particle.vy;

  // Wrap around edges
  if (particle.x < 0) particle.x = canvas.width;
  if (particle.x > canvas.width) particle.x = 0;
  if (particle.y < 0) particle.y = canvas.height;
  if (particle.y > canvas.height) particle.y = 0;
};

const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(220, 38, 38, 0.8)';
  ctx.fill();
};
```

---

## Accessibility Patterns

### Focus Visible
```tsx
<button className="
  outline-none
  focus:ring-2
  focus:ring-redpill-500
  focus:ring-offset-2
  focus:ring-offset-dark-500
">
  Accessible Button
</button>
```

### Screen Reader Only
```tsx
<span className="sr-only">
  Text only for screen readers
</span>
```

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Skip Link
```tsx
<a
  href="#main-content"
  className="
    sr-only
    focus:not-sr-only
    focus:absolute
    focus:top-4
    focus:left-4
    focus:z-50
    focus:px-4
    focus:py-2
    focus:bg-redpill-600
    focus:text-white
  "
>
  Skip to main content
</a>
```

### ARIA Patterns
```tsx
// Button with loading state
<button
  aria-busy={loading}
  aria-label={loading ? 'Loading...' : 'Submit'}
>
  {loading ? 'Loading...' : 'Submit'}
</button>

// Toggle button
<button
  aria-pressed={isActive}
  onClick={() => setIsActive(!isActive)}
>
  Toggle
</button>

// Expandable section
<div>
  <button
    aria-expanded={isOpen}
    aria-controls="content-id"
    onClick={() => setIsOpen(!isOpen)}
  >
    Toggle Section
  </button>
  <div id="content-id" hidden={!isOpen}>
    Content
  </div>
</div>
```

---

## TypeScript Patterns

### Component Props
```typescript
interface ComponentProps {
  // Required
  title: string;

  // Optional with default
  variant?: 'primary' | 'secondary';

  // Optional
  description?: string;

  // Children
  children: React.ReactNode;

  // Function
  onClick?: () => void;

  // Event handler
  onChange?: (value: string) => void;

  // Style
  className?: string;
  style?: React.CSSProperties;

  // Ref forwarding
  ref?: React.Ref<HTMLDivElement>;
}
```

### Generic Component
```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <div>
      {items.map(item => (
        <div key={keyExtractor(item)}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
```

### Framer Motion Variants Type
```typescript
import { Variants } from 'framer-motion';

const variants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
```

### Custom Hook Type
```typescript
interface UseToggleReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useToggle = (initial = false): UseToggleReturn => {
  const [isOpen, setIsOpen] = useState(initial);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
  };
};
```

---

## Tailwind Utility Patterns

### Responsive Design
```tsx
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-4
  sm:gap-6
  lg:gap-8
">
  Cards
</div>
```

### Container Pattern
```tsx
<div className="
  max-w-7xl
  mx-auto
  px-4
  sm:px-6
  lg:px-8
">
  Content
</div>
```

### Aspect Ratio
```tsx
<div className="aspect-w-16 aspect-h-9">
  <img src="..." className="object-cover" />
</div>
```

### Truncate Text
```tsx
<p className="
  truncate
  max-w-xs
">
  Long text that will be cut off...
</p>

<p className="
  line-clamp-3
">
  Long text that will be limited to 3 lines...
</p>
```

### Center Content
```tsx
// Horizontal & Vertical
<div className="flex items-center justify-center min-h-screen">
  Centered
</div>

// Absolute centering
<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
  Centered
</div>
```

---

## Animation Variants Library

### Fade Variants
```typescript
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};
```

### Scale Variants
```typescript
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export const scaleUp: Variants = {
  hidden: { scale: 0 },
  visible: { scale: 1 },
};
```

### Blur Variants
```typescript
export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(10px)' },
  visible: { opacity: 1, filter: 'blur(0px)' },
};
```

### Stagger Container
```typescript
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
```

### Slide Variants
```typescript
export const slideInLeft: Variants = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
  exit: { x: '-100%' },
};

export const slideInRight: Variants = {
  hidden: { x: '100%' },
  visible: { x: 0 },
  exit: { x: '100%' },
};
```

---

## Common Easing Functions

```typescript
// Custom easing curves
export const easeOutExpo = [0.19, 1, 0.22, 1];
export const easeOutCubic = [0.33, 1, 0.68, 1];
export const easeInOutCubic = [0.65, 0, 0.35, 1];
export const easeOutQuart = [0.25, 1, 0.5, 1];

// Default (recommended)
export const defaultEase = [0.6, -0.05, 0.01, 0.99];

// Usage
<motion.div
  animate={{ x: 100 }}
  transition={{ duration: 0.6, ease: defaultEase }}
/>
```

---

## CSS Custom Properties Pattern

```css
/* Define in globals.css or component */
:root {
  --color-redpill: #dc2626;
  --color-dark: #0a0a0a;
  --glow-intensity: 0.4;
  --blur-amount: 16px;
  --animation-speed: 1s;
}

/* Use in components */
.component {
  color: var(--color-redpill);
  box-shadow: 0 0 20px rgba(220, 38, 38, var(--glow-intensity));
  backdrop-filter: blur(var(--blur-amount));
  animation-duration: var(--animation-speed);
}
```

---

## File Naming Conventions

```
components/
  atoms/
    Button/
      Button.tsx              # Main component
      Button.module.css       # CSS module
      Button.stories.tsx      # Storybook (optional)
      Button.test.tsx         # Tests (optional)
      index.ts                # Export

hooks/
  useMousePosition.ts
  useScrollAnimation.ts

utils/
  performance.ts
  animations.ts

types/
  components.ts
  animations.ts
```

---

## Import Pattern

```typescript
// React
import { useState, useEffect, useRef } from 'react';

// Next.js
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Third-party
import { motion, AnimatePresence } from 'framer-motion';

// Components
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';

// Hooks
import { useMousePosition } from '@/hooks/useMousePosition';

// Utils
import { cn } from '@/utils/classnames';

// Types
import type { ComponentProps } from '@/types/components';

// Styles
import styles from './Component.module.css';
```

---

## Error Boundary Pattern

```typescript
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-redpill-500 mb-4">
            Something went wrong
          </h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-redpill-600 rounded-lg"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Loading Skeleton Pattern

```tsx
export const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-dark-400 rounded w-3/4" />
    <div className="h-4 bg-dark-400 rounded w-full" />
    <div className="h-4 bg-dark-400 rounded w-5/6" />
    <div className="grid grid-cols-3 gap-4">
      <div className="h-32 bg-dark-400 rounded" />
      <div className="h-32 bg-dark-400 rounded" />
      <div className="h-32 bg-dark-400 rounded" />
    </div>
  </div>
);
```

---

This quick reference should help implementation agents write consistent, high-quality code throughout the project.
