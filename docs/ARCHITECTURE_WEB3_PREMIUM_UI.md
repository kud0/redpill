# RedPill AI - Premium Web3 UI Architecture

## Executive Summary

This document outlines the technical architecture for transforming RedPill AI from a basic dark-themed site into an award-winning Web3 application with premium aesthetics comparable to DeLorean marketplace level of polish.

### Current State Analysis
- **Framework**: Next.js 15.0.0 with React 18.3.0
- **Styling**: Tailwind CSS 3.4.0 with custom utilities
- **Current Theme**: Basic dark theme with red accent (redpill-500: #ef4444)
- **Components**: 5 basic components (navigation, wallet-connect, balance-checker, tier-badge, providers)
- **Design**: Simple cards with basic glow effects and borders
- **Animations**: Minimal (pulse-slow, basic glow)

### Target State
- **Visual Goal**: Premium Web3 aesthetics with high-end polish
- **Performance**: 60 FPS animations, <2s initial load
- **Interactivity**: Smooth micro-interactions, 3D elements, particle effects
- **Responsiveness**: Flawless mobile/tablet/desktop experience
- **Accessibility**: WCAG 2.1 AA compliant

---

## 1. Technology Stack Decisions

### 1.1 Animation Libraries

#### Primary: Framer Motion (v11.0+)
**Rationale:**
- Best-in-class declarative animations for React
- Built-in layout animations and gestures
- Excellent TypeScript support
- Great performance with automatic optimization
- Page transitions and scroll animations
- Size: ~40KB gzipped (acceptable for premium UX)

**Use Cases:**
- Page transitions
- Component entrance/exit animations
- Hover effects and micro-interactions
- Scroll-triggered animations
- Layout shifts and morphing
- Gesture-based interactions

#### Secondary: Three.js + React Three Fiber (v8.15+)
**Rationale:**
- Industry standard for WebGL/3D
- React integration via R3F
- Mature ecosystem with tons of examples
- Drei (helper library) for common patterns
- Size: ~150KB gzipped (loaded on-demand)

**Use Cases:**
- 3D hero elements
- Floating particle fields
- Interactive background mesh
- Premium loading states
- Token visualization

#### Tertiary: GSAP (v3.12+) - Optional Enhancement
**Rationale:**
- Best performance for complex timeline animations
- Superior control for scroll-based animations
- Size: ~50KB gzipped
- Only if Framer Motion proves insufficient

**Use Cases:**
- Complex scroll animations (if needed)
- SVG path animations
- Timeline-based sequences

### 1.2 CSS Strategy

#### Tailwind CSS + CSS Modules Hybrid
**Rationale:**
- Keep Tailwind for utility classes and rapid development
- Use CSS Modules for complex animations and effects
- Leverage CSS custom properties for dynamic theming
- PostCSS for advanced features (container queries, nesting)

**File Structure:**
```
styles/
├── globals.css              # Tailwind base + global styles
├── animations.css           # Keyframe animations
├── effects.css              # Glassmorphism, glows, gradients
└── components/
    ├── glass-card.module.css
    ├── animated-grid.module.css
    └── particle-field.module.css
```

### 1.3 Performance Strategy

#### Code Splitting & Lazy Loading
```typescript
// Heavy animations loaded on-demand
const ParticleField = dynamic(() => import('@/components/backgrounds/ParticleField'), {
  ssr: false,
  loading: () => <div className="bg-dark-500" />
});

const Scene3D = dynamic(() => import('@/components/3d/HeroScene'), {
  ssr: false,
});
```

#### Animation Budget
- **Critical animations**: <100ms interaction response
- **Hero animations**: 60 FPS minimum
- **Background effects**: 30 FPS acceptable
- **Total JavaScript**: <300KB initial bundle
- **Async chunks**: <150KB per chunk

#### Optimization Techniques
1. **requestAnimationFrame** for custom animations
2. **will-change** CSS property for GPU acceleration
3. **IntersectionObserver** for scroll-based triggers
4. **CSS containment** for isolated animation layers
5. **Web Workers** for particle calculations

---

## 2. Component Architecture

### 2.1 Atomic Design Structure

```
components/
├── atoms/                   # Basic building blocks
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   └── Button.stories.tsx
│   ├── Badge/
│   ├── Icon/
│   └── Text/
├── molecules/               # Simple component combinations
│   ├── Card/
│   │   ├── GlassCard.tsx
│   │   ├── FeatureCard.tsx
│   │   └── PricingCard.tsx
│   ├── Input/
│   └── Navigation/
├── organisms/               # Complex sections
│   ├── Hero/
│   │   ├── HeroSection.tsx
│   │   ├── Hero3D.tsx
│   │   └── HeroContent.tsx
│   ├── Features/
│   ├── Pricing/
│   └── Footer/
├── templates/               # Page layouts
│   ├── MainLayout.tsx
│   ├── FeatureLayout.tsx
│   └── AuthLayout.tsx
├── backgrounds/             # Visual effects
│   ├── AnimatedGrid.tsx
│   ├── ParticleField.tsx
│   ├── GradientMesh.tsx
│   └── MatrixRain.tsx
├── effects/                 # Interaction effects
│   ├── ScrollReveal.tsx
│   ├── HoverGlow.tsx
│   ├── CursorFollow.tsx
│   └── PageTransition.tsx
└── 3d/                     # Three.js components
    ├── HeroScene.tsx
    ├── TokenModel.tsx
    └── FloatingObjects.tsx
```

### 2.2 Core Components Specification

#### 2.2.1 Background Components

##### AnimatedGrid
```typescript
// components/backgrounds/AnimatedGrid.tsx
interface AnimatedGridProps {
  color?: string;
  opacity?: number;
  lineWidth?: number;
  spacing?: number;
  animated?: boolean;
  speed?: number;
}

// Features:
// - Perspective grid with depth
// - Pulsing lines that sync with user interactions
// - Responsive to mouse movement
// - Optimized with CSS transforms
// - Optional glow effect on intersections
```

##### ParticleField
```typescript
// components/backgrounds/ParticleField.tsx
interface ParticleFieldProps {
  count?: number;
  color?: string;
  speed?: number;
  connections?: boolean;
  interactive?: boolean;
}

// Implementation Strategy:
// - Canvas-based for performance
// - Web Worker for particle calculations
// - Mouse interaction with physics
// - Lazy load on viewport entry
// - Mobile: reduced particle count
```

##### GradientMesh
```typescript
// components/backgrounds/GradientMesh.tsx
interface GradientMeshProps {
  colors?: string[];
  animated?: boolean;
  intensity?: number;
  blur?: number;
}

// Features:
// - Animated blob gradients
// - CSS filter effects
// - GPU-accelerated transforms
// - Responds to scroll position
// - Blends with content
```

#### 2.2.2 Glass Morphism Components

##### GlassCard
```typescript
// components/molecules/Card/GlassCard.tsx
interface GlassCardProps {
  variant?: 'default' | 'elevated' | 'bordered' | 'glow';
  blur?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  animated?: boolean;
  children: React.ReactNode;
}

// CSS Properties:
// - backdrop-filter: blur(16px)
// - background: rgba(10, 10, 10, 0.6)
// - border: 1px solid rgba(220, 38, 38, 0.2)
// - box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4)
// - Animated glow on hover
// - Transform effects
```

#### 2.2.3 Hero Section

##### Hero3D
```typescript
// components/organisms/Hero/Hero3D.tsx
interface Hero3DProps {
  model?: 'token' | 'pill' | 'abstract';
  interactive?: boolean;
  autoRotate?: boolean;
}

// Implementation:
// - React Three Fiber scene
// - GLTF model loading
// - Bloom post-processing
// - Mouse parallax effect
// - Mobile: simplified version or static image
```

##### HeroSection
```typescript
// components/organisms/Hero/HeroSection.tsx
interface HeroSectionProps {
  title: string;
  subtitle: string;
  cta?: React.ReactNode;
  background?: 'particles' | 'grid' | 'mesh' | '3d';
}

// Features:
// - Staggered text animations
// - Floating CTA buttons with glow
// - Scroll indicator
// - Responsive typography
// - Multiple background options
```

#### 2.2.4 Interactive Effects

##### ScrollReveal
```typescript
// components/effects/ScrollReveal.tsx
interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scale' | 'blur';
  delay?: number;
  threshold?: number;
  once?: boolean;
}

// Implementation:
// - Framer Motion + IntersectionObserver
// - Configurable animations
// - Stagger support for lists
// - Mobile-optimized triggers
```

##### HoverGlow
```typescript
// components/effects/HoverGlow.tsx
interface HoverGlowProps {
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  size?: number;
  followCursor?: boolean;
}

// Features:
// - Radial gradient that follows cursor
// - Smooth transitions
// - Contained within component bounds
// - GPU-accelerated
```

#### 2.2.5 Navigation

##### PremiumNavigation
```typescript
// components/molecules/Navigation/PremiumNavigation.tsx
interface PremiumNavigationProps {
  sticky?: boolean;
  transparent?: boolean;
  blur?: boolean;
}

// Features:
// - Glassmorphism effect
// - Smooth scroll transitions
// - Active link indicators with glow
// - Wallet integration
// - Mobile drawer with animations
// - Logo with subtle animation
```

---

## 3. Design System

### 3.1 Color Palette Enhancement

```typescript
// Extended color system
const colors = {
  redpill: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Primary red
    600: '#dc2626',  // Main brand color
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  dark: {
    50: '#3a3a3a',
    100: '#2a2a2a',
    200: '#1a1a1a',
    300: '#141414',
    400: '#0f0f0f',
    500: '#0a0a0a',  // Main background
    600: '#050505',
    700: '#030303',
    800: '#020202',
    900: '#010101',
  },
  accent: {
    cyan: '#06b6d4',    // For highlights
    purple: '#a855f7',  // For premium features
    gold: '#fbbf24',    // For god tier
  },
  glow: {
    red: 'rgba(220, 38, 38, 0.4)',
    blue: 'rgba(6, 182, 212, 0.4)',
    purple: 'rgba(168, 85, 247, 0.4)',
  }
};
```

### 3.2 Animation Variants

```typescript
// Framer Motion variants library
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const glowPulse = {
  initial: { boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)' },
  animate: {
    boxShadow: [
      '0 0 20px rgba(220, 38, 38, 0.3)',
      '0 0 40px rgba(220, 38, 38, 0.6)',
      '0 0 20px rgba(220, 38, 38, 0.3)',
    ],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  }
};
```

### 3.3 Typography Scale

```typescript
// Enhanced typography with animations
const typography = {
  h1: 'text-6xl md:text-8xl font-bold tracking-tight',
  h2: 'text-4xl md:text-6xl font-bold tracking-tight',
  h3: 'text-3xl md:text-4xl font-bold',
  h4: 'text-2xl md:text-3xl font-semibold',
  body: 'text-base md:text-lg',
  small: 'text-sm md:text-base',

  // Animated text effects
  gradient: 'bg-gradient-to-r from-redpill-400 via-redpill-600 to-redpill-400 bg-clip-text text-transparent animate-gradient',
  glow: 'text-redpill-500 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]',
};
```

### 3.4 Glass Morphism System

```css
/* styles/effects.css */
.glass-base {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.glass-elevated {
  background: rgba(15, 15, 15, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 32px 0 rgba(0, 0, 0, 0.37),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
}

.glass-glow {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(220, 38, 38, 0.3);
  box-shadow:
    0 0 20px rgba(220, 38, 38, 0.2),
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.glass-glow:hover {
  border-color: rgba(220, 38, 38, 0.5);
  box-shadow:
    0 0 30px rgba(220, 38, 38, 0.4),
    0 0 60px rgba(220, 38, 38, 0.2),
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
```

---

## 4. Implementation Phases

### Phase 1: Foundation (Week 1)
**Priority: Critical**

#### Dependencies
```bash
npm install framer-motion @react-three/fiber @react-three/drei three
npm install --save-dev @types/three
```

#### Components to Build
1. **AnimatedGrid** - Background grid effect
2. **GlassCard** - Base card component
3. **ScrollReveal** - Scroll animation wrapper
4. **PremiumNavigation** - Enhanced navigation

#### Deliverables
- Basic glass morphism system
- Animated grid background
- Scroll reveal animations
- Updated navigation with blur

### Phase 2: Hero & Backgrounds (Week 1-2)
**Priority: High**

#### Components to Build
1. **ParticleField** - Canvas-based particles
2. **GradientMesh** - Animated gradients
3. **HeroSection** - Complete hero redesign
4. **Hero3D** - Optional 3D element

#### Deliverables
- Multiple background options
- Premium hero section
- Page transition system
- Loading states

### Phase 3: Interactive Effects (Week 2)
**Priority: High**

#### Components to Build
1. **HoverGlow** - Cursor-following glow
2. **FeatureCard** - Enhanced feature cards
3. **PricingCard** - Animated pricing cards
4. **CursorFollow** - Custom cursor effects

#### Deliverables
- Interactive hover effects
- Micro-interactions
- Enhanced card designs
- Cursor effects (optional)

### Phase 4: Advanced Features (Week 3)
**Priority: Medium**

#### Components to Build
1. **MatrixRain** - Optional background effect
2. **TokenModel** - 3D token visualization
3. **AnimatedStats** - Number animations
4. **ParallaxSection** - Parallax scrolling

#### Deliverables
- Advanced 3D features
- Complex animations
- Parallax effects
- Performance optimizations

### Phase 5: Polish & Optimization (Week 3-4)
**Priority: Critical**

#### Tasks
1. Performance audit
2. Mobile optimization
3. Accessibility improvements
4. Loading optimizations
5. SEO enhancements

#### Deliverables
- 90+ Lighthouse scores
- Smooth 60 FPS animations
- Perfect mobile experience
- A11y compliant

---

## 5. Performance Optimization Strategy

### 5.1 Loading Strategy

#### Progressive Enhancement
```typescript
// Load heavy features progressively
const loadingPriority = {
  critical: [
    'navigation',
    'hero-content',
    'basic-styles',
  ],
  high: [
    'animated-grid',
    'glass-cards',
    'scroll-animations',
  ],
  low: [
    'particle-field',
    '3d-elements',
    'advanced-effects',
  ],
};

// Implementation
const ParticleField = dynamic(() =>
  import('@/components/backgrounds/ParticleField'),
  {
    ssr: false,
    loading: () => null, // No loading indicator
  }
);
```

### 5.2 Animation Performance

#### GPU Acceleration
```css
/* Force GPU acceleration for animated elements */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform, opacity;
  backface-visibility: hidden;
}

/* Use transform instead of position changes */
.animate-position {
  transform: translate3d(0, 0, 0);
}
```

#### Frame Budget
```typescript
// Monitor frame rate and reduce effects if needed
const usePerformanceMonitor = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const checkFPS = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime >= lastTime + 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;

        // Reduce effects if FPS drops below 30
        if (fps < 30) {
          setReducedMotion(true);
        }
      }

      requestAnimationFrame(checkFPS);
    };

    checkFPS();
  }, []);

  return reducedMotion;
};
```

### 5.3 Mobile Optimization

#### Responsive Effects
```typescript
// Detect device and adjust effects
const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    hasGPU: true,
    isMobile: false,
    isLowPower: false,
  });

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLowPower = navigator.hardwareConcurrency < 4;

    setCapabilities({
      hasGPU: !isMobile || !isLowPower,
      isMobile,
      isLowPower,
    });
  }, []);

  return capabilities;
};

// Usage
const ParticleFieldWrapper = () => {
  const { isMobile, isLowPower } = useDeviceCapabilities();

  if (isMobile || isLowPower) {
    return <StaticGradient />;
  }

  return <ParticleField count={1000} />;
};
```

### 5.4 Bundle Size Management

#### Code Splitting Strategy
```typescript
// Route-based splitting (automatic with Next.js)
// Component-based splitting for heavy features
const Heavy3DScene = dynamic(() => import('@/components/3d/Scene'));
const ParticleSystem = dynamic(() => import('@/components/backgrounds/Particles'));
const AdvancedAnimations = dynamic(() => import('@/components/effects/Advanced'));

// Conditional loading
const OptionalFeature = dynamic(
  () => import('@/components/OptionalFeature'),
  {
    loading: () => <Skeleton />,
    ssr: false,
  }
);
```

#### Target Bundle Sizes
- **Initial bundle**: <150KB (HTML + CSS + critical JS)
- **Main chunk**: <200KB (React + Next.js + core app)
- **Animation chunk**: <100KB (Framer Motion)
- **3D chunk**: <150KB (Three.js + R3F, lazy loaded)
- **Total FCP**: <2s on 3G

---

## 6. Technical Patterns

### 6.1 Animation Hooks

```typescript
// hooks/useScrollAnimation.ts
export const useScrollAnimation = (threshold = 0.1) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start('visible');
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [controls, threshold]);

  return { ref, controls };
};

// hooks/useParallax.ts
export const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offset;
};

// hooks/useMousePosition.ts
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

### 6.2 Performance Utilities

```typescript
// utils/performance.ts
export const debounceFrame = (callback: Function) => {
  let rafId: number | null = null;

  return (...args: any[]) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => callback(...args));
  };
};

export const throttleFrame = (callback: Function) => {
  let rafId: number | null = null;
  let lastArgs: any[] | null = null;

  const throttled = () => {
    if (lastArgs) {
      callback(...lastArgs);
      lastArgs = null;
      rafId = requestAnimationFrame(throttled);
    } else {
      rafId = null;
    }
  };

  return (...args: any[]) => {
    lastArgs = args;
    if (!rafId) {
      rafId = requestAnimationFrame(throttled);
    }
  };
};
```

### 6.3 Glass Morphism Components

```typescript
// components/molecules/Card/GlassCard.tsx
import { motion } from 'framer-motion';
import styles from './GlassCard.module.css';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glow';
  animated?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  animated = true,
  className = '',
}) => {
  const baseClass = styles.glassCard;
  const variantClass = styles[variant];

  const Component = animated ? motion.div : 'div';

  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] },
    whileHover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
  } : {};

  return (
    <Component
      className={`${baseClass} ${variantClass} ${className}`}
      {...animationProps}
    >
      {children}
    </Component>
  );
};
```

---

## 7. Implementation Examples

### 7.1 Enhanced Hero Section

```typescript
// components/organisms/Hero/HeroSection.tsx
import { motion } from 'framer-motion';
import AnimatedGrid from '@/components/backgrounds/AnimatedGrid';
import ParticleField from '@/components/backgrounds/ParticleField';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <AnimatedGrid />
        <ParticleField count={500} interactive />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Logo with glow effect */}
          <motion.div
            className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-redpill-500 to-redpill-700 rounded-full flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 30px rgba(220, 38, 38, 0.4)',
                '0 0 60px rgba(220, 38, 38, 0.6)',
                '0 0 30px rgba(220, 38, 38, 0.4)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-white font-bold text-6xl">R</span>
          </motion.div>

          {/* Title with gradient */}
          <h1 className="text-7xl md:text-9xl font-bold mb-6">
            <span className="text-white">Take the </span>
            <span className="bg-gradient-to-r from-redpill-400 via-redpill-600 to-redpill-800 bg-clip-text text-transparent">
              Red Pill
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Hold $REDPILL tokens to unlock unlimited access to premium AI tools.
            <br />
            <span className="text-redpill-400">No subscriptions. No limits. Just pure utility.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.button
              className="px-8 py-4 bg-redpill-600 rounded-lg text-white font-bold text-lg relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Get Started</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-redpill-500 to-redpill-700"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              className="px-8 py-4 bg-transparent border-2 border-redpill-600 rounded-lg text-white font-bold text-lg backdrop-blur-sm"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 30px rgba(220, 38, 38, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-redpill-500 rounded-full flex justify-center">
          <motion.div
            className="w-1.5 h-1.5 bg-redpill-500 rounded-full mt-2"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
```

### 7.2 Animated Grid Background

```typescript
// components/backgrounds/AnimatedGrid.tsx
import { useEffect, useRef } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';
import styles from './AnimatedGrid.module.css';

interface AnimatedGridProps {
  color?: string;
  opacity?: number;
  spacing?: number;
}

const AnimatedGrid: React.FC<AnimatedGridProps> = ({
  color = '#dc2626',
  opacity = 0.15,
  spacing = 50,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useMousePosition();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    let animationFrame: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set perspective
      const perspective = 600;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Mouse influence
      const mouseInfluence = 50;
      const mouseOffsetX = (mousePosition.x - centerX) / canvas.width * mouseInfluence;
      const mouseOffsetY = (mousePosition.y - centerY) / canvas.height * mouseInfluence;

      // Draw grid
      ctx.strokeStyle = color;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = 1;

      // Horizontal lines
      for (let i = -10; i <= 10; i++) {
        const y = centerY + i * spacing + mouseOffsetY;
        const z = 500 - Math.abs(i) * 30;
        const scale = perspective / (perspective + z);

        ctx.beginPath();
        ctx.moveTo(centerX - 500 * scale + mouseOffsetX, y);
        ctx.lineTo(centerX + 500 * scale + mouseOffsetX, y);
        ctx.stroke();
      }

      // Vertical lines
      for (let i = -10; i <= 10; i++) {
        const x = centerX + i * spacing + mouseOffsetX;

        ctx.beginPath();
        ctx.moveTo(x, centerY - 300);
        ctx.lineTo(x + mouseOffsetX * 0.5, centerY + 300);
        ctx.stroke();
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, [mousePosition, color, opacity, spacing]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.grid}
    />
  );
};

export default AnimatedGrid;
```

```css
/* components/backgrounds/AnimatedGrid.module.css */
.grid {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
```

### 7.3 Feature Card with Hover Effects

```typescript
// components/molecules/Card/FeatureCard.tsx
import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useState, useRef } from 'react';
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  tier: string;
  href: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  tier,
  href,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();

  const getMousePositionRelativeToCard = () => {
    if (!cardRef.current) return { x: 0, y: 0 };

    const rect = cardRef.current.getBoundingClientRect();
    return {
      x: mousePosition.x - rect.left,
      y: mousePosition.y - rect.top,
    };
  };

  const relativeMousePosition = getMousePositionRelativeToCard();

  return (
    <motion.a
      ref={cardRef}
      href={href}
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect that follows cursor */}
      {isHovered && (
        <motion.div
          className={styles.glow}
          style={{
            left: relativeMousePosition.x,
            top: relativeMousePosition.y,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Content */}
      <div className={styles.content}>
        <motion.div
          className={styles.icon}
          animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
        >
          {icon}
        </motion.div>

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        <div className={styles.badge}>
          <span>{tier} Tier</span>
        </div>
      </div>

      {/* Animated border */}
      <svg className={styles.border} width="100%" height="100%">
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          strokeDasharray="400"
          strokeDashoffset={isHovered ? 0 : 400}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
      </svg>
    </motion.a>
  );
};
```

```css
/* components/molecules/Card/FeatureCard.module.css */
.card {
  position: relative;
  padding: 2rem;
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(16px);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.glow {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.3) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.card:hover .title {
  color: #f87171;
}

.description {
  color: #9ca3af;
  margin-bottom: 1rem;
}

.badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 9999px;
  color: #f87171;
  font-size: 0.875rem;
  font-weight: 600;
}

.border {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}
```

---

## 8. Responsive Design Strategy

### 8.1 Breakpoints

```typescript
// tailwind.config.ts - Extended breakpoints
export default {
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
  },
};
```

### 8.2 Mobile-First Approach

```typescript
// Responsive component example
const ResponsiveHero = () => {
  const { isMobile } = useDeviceCapabilities();

  return (
    <section>
      {/* Mobile: Static gradient, no particles */}
      {isMobile ? (
        <div className="bg-gradient-to-br from-dark-500 via-dark-400 to-dark-500" />
      ) : (
        <>
          <AnimatedGrid />
          <ParticleField />
        </>
      )}

      {/* Content scales appropriately */}
      <div className="p-4 md:p-8 lg:p-12">
        <h1 className="text-4xl md:text-6xl lg:text-8xl">
          Take the Red Pill
        </h1>
      </div>
    </section>
  );
};
```

### 8.3 Touch-Friendly Interactions

```typescript
// Mobile gesture support
import { motion, PanInfo } from 'framer-motion';

const SwipeableCard = () => {
  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      // Swipe right
    } else if (info.offset.x < -100) {
      // Swipe left
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.95 }}
    >
      {/* Card content */}
    </motion.div>
  );
};
```

---

## 9. Accessibility Considerations

### 9.1 Reduced Motion

```typescript
// Respect user preferences
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
};

// Usage
const AnimatedComponent = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={prefersReducedMotion ? {} : { opacity: 1 }}
    >
      Content
    </motion.div>
  );
};
```

### 9.2 Keyboard Navigation

```typescript
// Ensure all interactive elements are keyboard accessible
const AccessibleButton = () => {
  return (
    <motion.button
      className="focus:outline-none focus:ring-2 focus:ring-redpill-500 focus:ring-offset-2 focus:ring-offset-dark-500"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      whileFocus={{ scale: 1.05 }}
    >
      Click me
    </motion.button>
  );
};
```

### 9.3 Screen Reader Support

```typescript
// Proper semantic HTML and ARIA labels
const Hero = () => {
  return (
    <section aria-label="Hero section">
      <h1 className="sr-only">RedPill AI - Premium AI Tools</h1>
      <div aria-hidden="true">
        {/* Decorative animations */}
      </div>
      <div role="main">
        {/* Main content */}
      </div>
    </section>
  );
};
```

---

## 10. Testing Strategy

### 10.1 Performance Testing

```typescript
// Performance monitoring
const usePerformanceMetrics = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Log Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }, []);
};
```

### 10.2 Visual Testing

```typescript
// Storybook setup for visual regression
// .storybook/main.ts
export default {
  stories: ['../components/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
};
```

### 10.3 Animation Testing

```typescript
// Test animation completion
import { render, waitFor } from '@testing-library/react';

test('animation completes', async () => {
  const { getByTestId } = render(<AnimatedComponent />);
  const element = getByTestId('animated-element');

  await waitFor(() => {
    expect(element).toHaveStyle('opacity: 1');
  }, { timeout: 1000 });
});
```

---

## 11. Deployment Considerations

### 11.1 Build Optimization

```javascript
// next.config.js
module.exports = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizeCss: true,
  },
};
```

### 11.2 CDN Strategy

```typescript
// Serve heavy assets from CDN
const ASSET_PREFIX = process.env.NODE_ENV === 'production'
  ? 'https://cdn.redpill.ai'
  : '';

export const getAssetUrl = (path: string) => `${ASSET_PREFIX}${path}`;
```

### 11.3 Monitoring

```typescript
// Error tracking and performance monitoring
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out non-critical errors
    return event;
  },
});
```

---

## 12. Migration Plan

### 12.1 Component Migration Order

1. **Week 1: Foundation**
   - Install dependencies
   - Create base glass components
   - Implement animated grid
   - Update navigation

2. **Week 2: Hero & Effects**
   - Build new hero section
   - Add particle system
   - Implement scroll animations
   - Create feature cards

3. **Week 3: Polish**
   - Add 3D elements (optional)
   - Optimize performance
   - Mobile testing
   - Accessibility audit

4. **Week 4: Launch**
   - Final QA
   - Performance testing
   - SEO optimization
   - Deploy to production

### 12.2 Risk Mitigation

**Risks:**
1. Performance degradation on low-end devices
2. Browser compatibility issues
3. Animation jank
4. Bundle size bloat

**Mitigation:**
1. Progressive enhancement with fallbacks
2. Extensive cross-browser testing
3. Performance monitoring from day 1
4. Aggressive code splitting

---

## 13. Success Metrics

### 13.1 Performance Targets

- **Lighthouse Score**: 90+ (all categories)
- **FCP**: <1.5s
- **LCP**: <2.5s
- **CLS**: <0.1
- **FPS**: 60 (animations)
- **Bundle Size**: <300KB initial

### 13.2 User Experience Metrics

- **Bounce Rate**: <40%
- **Time on Site**: >2 minutes
- **Engagement**: 50%+ scroll depth
- **Mobile Usage**: Smooth on iOS/Android

### 13.3 Business Metrics

- **Conversion Rate**: 15%+ improvement
- **Wallet Connections**: 25%+ increase
- **Feature Usage**: 30%+ increase
- **User Satisfaction**: >4.5/5 rating

---

## 14. Next Steps

### Immediate Actions

1. **Review & Approve Architecture**
   - Stakeholder review
   - Technical team alignment
   - Budget approval

2. **Setup Development Environment**
   - Install dependencies
   - Configure tools
   - Setup Storybook

3. **Create Design System**
   - Build base components
   - Create animation library
   - Document patterns

4. **Begin Phase 1 Implementation**
   - Animated grid
   - Glass cards
   - Navigation update

### Long-term Roadmap

**Q1 2025:**
- Complete UI transformation
- Launch premium features
- User testing & iteration

**Q2 2025:**
- Advanced 3D features
- Mobile app (PWA)
- Performance optimization

**Q3 2025:**
- AR/VR experiments
- Web3 integrations
- Community features

---

## 15. Conclusion

This architecture provides a comprehensive roadmap for transforming RedPill AI into a premium Web3 application with award-winning aesthetics. The phased approach ensures manageable implementation while maintaining high quality standards.

Key success factors:
1. **Performance-first approach** with aggressive optimization
2. **Progressive enhancement** for broad device support
3. **Modular architecture** for maintainability
4. **Extensive testing** for reliability
5. **Clear metrics** for measuring success

The combination of Framer Motion for React animations, Three.js for 3D elements, and a refined glass morphism design system will create a visually stunning experience that matches or exceeds DeLorean marketplace quality while maintaining excellent performance.

---

**Document Version**: 1.0
**Last Updated**: 2025-11-19
**Authors**: Architecture Team
**Status**: Ready for Implementation
