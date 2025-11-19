# Component Specifications - Premium Web3 UI

## Overview

Detailed specifications for each component in the premium Web3 UI system. These specs guide implementation agents and ensure consistency across the application.

---

## 1. Background Components

### 1.1 AnimatedGrid

**File**: `components/backgrounds/AnimatedGrid.tsx`

**Purpose**: Create a dynamic 3D perspective grid that responds to mouse movement and provides depth to the interface.

**Visual Reference**: Similar to Stripe's grid effect with Web3 aesthetic.

**Technical Specs**:
```typescript
interface AnimatedGridProps {
  color?: string;           // Default: '#dc2626'
  opacity?: number;         // Default: 0.15
  lineWidth?: number;       // Default: 1
  spacing?: number;         // Default: 50
  animated?: boolean;       // Default: true
  speed?: number;          // Default: 0.5
  perspective?: number;    // Default: 600
  interactive?: boolean;   // Default: true
}
```

**Behavior**:
- Grid lines converge to vanishing point in perspective
- Mouse movement creates parallax effect (max 50px offset)
- Lines pulse gently (opacity variation: ±10%)
- Smooth interpolation between states
- Responsive: simplify on mobile (no mouse tracking)

**Performance**:
- Render: Canvas 2D (not WebGL for simplicity)
- Frame rate: 60 FPS
- Debounce mouse events: 16ms (1 frame)
- Lazy load: Only render when in viewport

**Implementation Notes**:
```typescript
// Pseudo-code structure
const AnimatedGrid = ({ color, opacity, spacing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useMousePosition();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      // 1. Clear canvas
      // 2. Apply perspective transform
      // 3. Draw horizontal lines with depth scaling
      // 4. Draw vertical lines
      // 5. Apply mouse offset
      // 6. Add subtle animation (time-based)
    };

    const animate = () => {
      draw();
      requestAnimationFrame(animate);
    };

    animate();
  }, [mousePosition]);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
};
```

**CSS**:
```css
.animated-grid {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
```

---

### 1.2 ParticleField

**File**: `components/backgrounds/ParticleField.tsx`

**Purpose**: Create an interactive particle system that connects nearby particles and responds to mouse interaction.

**Visual Reference**: Constellation-style connected particles, similar to Polygon's website.

**Technical Specs**:
```typescript
interface ParticleFieldProps {
  count?: number;              // Default: 100 (mobile), 500 (desktop)
  color?: string;              // Default: '#dc2626'
  particleSize?: number;       // Default: 2
  connectionDistance?: number; // Default: 150
  speed?: number;             // Default: 0.5
  interactive?: boolean;      // Default: true
  mouseRadius?: number;       // Default: 200
  mouseForce?: number;        // Default: 0.5
}
```

**Behavior**:
- Particles float randomly with physics
- Lines connect particles within connectionDistance
- Mouse interaction: particles attracted/repelled
- Fade in on load (300ms)
- Smooth 60 FPS animation
- Responsive: reduce particle count on mobile

**Performance**:
- Render: Canvas 2D
- Calculations: Web Worker for physics
- Frame budget: 16ms per frame
- Cull offscreen particles
- Distance checks: spatial hashing for O(n) instead of O(n²)

**Implementation Notes**:
```typescript
// Web Worker for particle calculations
// worker.ts
self.onmessage = (e) => {
  const { particles, mousePos, deltaTime } = e.data;

  // Update particle positions
  particles.forEach(particle => {
    // Apply velocity
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;

    // Boundary checks
    // Mouse interaction force
    // Calculate connections
  });

  self.postMessage({ particles, connections });
};

// Main component
const ParticleField = ({ count, interactive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize worker
    workerRef.current = new Worker('/workers/particles.js');

    // Setup canvas
    // Start animation loop
    // Send updates to worker
    // Receive and render from worker
  }, []);

  return <canvas ref={canvasRef} className="particle-field" />;
};
```

**Mobile Optimization**:
```typescript
const useParticleCount = () => {
  const [count, setCount] = useState(100);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const isLowPower = navigator.hardwareConcurrency < 4;

    if (isMobile || isLowPower) {
      setCount(50);
    } else {
      setCount(500);
    }
  }, []);

  return count;
};
```

---

### 1.3 GradientMesh

**File**: `components/backgrounds/GradientMesh.tsx`

**Purpose**: Animated blob gradients that create an organic, flowing background.

**Visual Reference**: Stripe's animated gradient mesh effect.

**Technical Specs**:
```typescript
interface GradientMeshProps {
  colors?: string[];        // Default: ['#dc2626', '#7f1d1d', '#450a0a']
  blobCount?: number;       // Default: 3
  blur?: number;           // Default: 100
  animated?: boolean;      // Default: true
  speed?: number;         // Default: 0.3
  scale?: number;         // Default: 1.5
}
```

**Behavior**:
- Multiple gradient blobs move slowly
- Blobs scale and rotate over time
- Smooth CSS filter blur
- Blends with backdrop
- No mouse interaction (performance)

**Performance**:
- Render: CSS with transforms
- No JavaScript animation (use CSS @keyframes)
- GPU-accelerated (will-change: transform)
- Lazy load: Display after page paint

**Implementation Notes**:
```typescript
const GradientMesh = ({ colors, blobCount, blur }) => {
  const blobs = useMemo(() => {
    return Array.from({ length: blobCount }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 1 + Math.random() * 0.5,
      duration: 20 + Math.random() * 10,
    }));
  }, [blobCount, colors]);

  return (
    <div className="gradient-mesh">
      {blobs.map(blob => (
        <div
          key={blob.id}
          className="gradient-blob"
          style={{
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            transform: `scale(${blob.scale})`,
            filter: `blur(${blur}px)`,
            animation: `float ${blob.duration}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
};
```

**CSS**:
```css
.gradient-mesh {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.gradient-blob {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  opacity: 0.3;
  will-change: transform;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  25% {
    transform: translate(50px, -30px) scale(1.1) rotate(90deg);
  }
  50% {
    transform: translate(-30px, 50px) scale(0.9) rotate(180deg);
  }
  75% {
    transform: translate(30px, 30px) scale(1.05) rotate(270deg);
  }
}
```

---

## 2. Glass Morphism Components

### 2.1 GlassCard

**File**: `components/molecules/Card/GlassCard.tsx`

**Purpose**: Reusable card component with glass morphism effect and optional glow.

**Visual Reference**: iOS 15 glass cards with Web3 glow aesthetic.

**Technical Specs**:
```typescript
interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glow' | 'bordered';
  blur?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  glow?: boolean;
  glowColor?: string;
  className?: string;
  onClick?: () => void;
}
```

**Variants**:

1. **Default**:
   - Background: rgba(10, 10, 10, 0.6)
   - Backdrop filter: blur(16px)
   - Border: 1px solid rgba(255, 255, 255, 0.05)
   - No shadow

2. **Elevated**:
   - Background: rgba(15, 15, 15, 0.7)
   - Backdrop filter: blur(20px)
   - Border: 1px solid rgba(255, 255, 255, 0.08)
   - Shadow: 0 8px 32px rgba(0, 0, 0, 0.37)

3. **Glow**:
   - Background: rgba(10, 10, 10, 0.6)
   - Backdrop filter: blur(16px)
   - Border: 1px solid rgba(220, 38, 38, 0.3)
   - Shadow: 0 0 20px rgba(220, 38, 38, 0.2)
   - Hover: Intensify glow

4. **Bordered**:
   - Background: rgba(10, 10, 10, 0.4)
   - Backdrop filter: blur(12px)
   - Border: 2px solid rgba(220, 38, 38, 0.5)
   - No shadow

**Animations**:
```typescript
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99], // Custom easing
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
  },
};
```

**Implementation**:
```typescript
import { motion } from 'framer-motion';
import styles from './GlassCard.module.css';

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  blur = 'md',
  animated = true,
  glow = false,
  glowColor = '#dc2626',
  className = '',
  onClick,
}) => {
  const Component = animated ? motion.div : 'div';

  const animationProps = animated ? {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-50px" },
    whileHover: "hover",
    whileTap: onClick ? "tap" : undefined,
    variants: cardVariants,
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
};
```

**CSS Module**:
```css
/* GlassCard.module.css */
.card {
  position: relative;
  padding: 2rem;
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.default {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.elevated {
  background: rgba(15, 15, 15, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 32px 0 rgba(0, 0, 0, 0.37),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
}

.glow {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--glow-color, rgba(220, 38, 38, 0.3));
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.2);
}

.glow:hover {
  border-color: var(--glow-color, rgba(220, 38, 38, 0.5));
  box-shadow:
    0 0 30px rgba(220, 38, 38, 0.4),
    0 0 60px rgba(220, 38, 38, 0.2);
}

.bordered {
  background: rgba(10, 10, 10, 0.4);
  backdrop-filter: blur(12px) saturate(180%);
  border: 2px solid rgba(220, 38, 38, 0.5);
}

.sm {
  backdrop-filter: blur(12px) saturate(180%);
}

.md {
  backdrop-filter: blur(16px) saturate(180%);
}

.lg {
  backdrop-filter: blur(24px) saturate(180%);
}
```

---

### 2.2 FeatureCard

**File**: `components/molecules/Card/FeatureCard.tsx`

**Purpose**: Feature showcase card with advanced hover effects and cursor-following glow.

**Technical Specs**:
```typescript
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  tier: string;
  href: string;
  locked?: boolean;
}
```

**Behavior**:
- Hover: Card lifts (-5px translateY)
- Cursor-following glow effect
- Icon rotates slightly on hover
- Animated border draws on hover
- Disabled state for locked features

**Implementation**:
```typescript
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';
import styles from './FeatureCard.module.css';

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  tier,
  href,
  locked = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();

  const getRelativePosition = () => {
    if (!cardRef.current) return { x: 0, y: 0 };
    const rect = cardRef.current.getBoundingClientRect();
    return {
      x: mousePosition.x - rect.left,
      y: mousePosition.y - rect.top,
    };
  };

  const relativePos = isHovered ? getRelativePosition() : { x: 0, y: 0 };

  return (
    <motion.a
      ref={cardRef}
      href={locked ? undefined : href}
      className={`${styles.card} ${locked ? styles.locked : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={locked ? {} : { y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Cursor-following glow */}
      {isHovered && !locked && (
        <motion.div
          className={styles.cursorGlow}
          style={{
            left: relativePos.x,
            top: relativePos.y,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        />
      )}

      {/* Content */}
      <div className={styles.content}>
        <motion.div
          className={styles.iconWrapper}
          animate={isHovered && !locked ? { scale: 1.1, rotate: 5 } : {}}
        >
          {icon}
        </motion.div>

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        <div className={styles.footer}>
          <span className={styles.tier}>{tier} Tier</span>
          {locked && <span className={styles.lockIcon}>🔒</span>}
        </div>
      </div>

      {/* Animated border SVG */}
      {!locked && (
        <svg className={styles.borderSvg} width="100%" height="100%">
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeDasharray="800"
            strokeDashoffset={isHovered ? 0 : 800}
            rx="16"
            style={{
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="1" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </motion.a>
  );
};
```

---

## 3. Hero Components

### 3.1 HeroSection

**File**: `components/organisms/Hero/HeroSection.tsx`

**Purpose**: Main landing page hero with dynamic background and animated content.

**Technical Specs**:
```typescript
interface HeroSectionProps {
  title: string | React.ReactNode;
  subtitle: string | React.ReactNode;
  cta?: {
    primary?: { text: string; href: string; onClick?: () => void };
    secondary?: { text: string; href: string };
  };
  background?: 'particles' | 'grid' | 'mesh' | '3d' | 'gradient';
  showScrollIndicator?: boolean;
}
```

**Layout Structure**:
```
<section> (min-h-screen, flex, items-center)
  <Background> (absolute, inset-0, z-0)
  <Container> (relative, z-10, max-w-7xl, mx-auto)
    <Logo> (animated, glow effect)
    <Title> (staggered animation)
    <Subtitle> (fade in with delay)
    <CTA Buttons> (hover effects)
  <ScrollIndicator> (absolute, bottom-8, animated)
</section>
```

**Animations**:
```typescript
const heroAnimations = {
  logo: {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
    },
  },
  title: {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
        staggerChildren: 0.1,
      }
    },
  },
  subtitle: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.8, delay: 0.5 }
    },
  },
  cta: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.7 }
    },
  },
};
```

**Implementation**:
```typescript
import { motion } from 'framer-motion';
import AnimatedGrid from '@/components/backgrounds/AnimatedGrid';
import ParticleField from '@/components/backgrounds/ParticleField';
import GradientMesh from '@/components/backgrounds/GradientMesh';

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  cta,
  background = 'particles',
  showScrollIndicator = true,
}) => {
  const BackgroundComponent = {
    particles: ParticleField,
    grid: AnimatedGrid,
    mesh: GradientMesh,
    gradient: () => <div className="bg-gradient-to-br from-dark-500 via-dark-400 to-dark-500" />,
  }[background];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <BackgroundComponent />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <motion.div
          className="inline-block mb-8"
          variants={heroAnimations.logo}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="w-32 h-32 bg-gradient-to-br from-redpill-500 to-redpill-700 rounded-full flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 30px rgba(220, 38, 38, 0.4)',
                '0 0 60px rgba(220, 38, 38, 0.6)',
                '0 0 30px rgba(220, 38, 38, 0.4)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-white font-bold text-6xl">R</span>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div
          variants={heroAnimations.title}
          initial="initial"
          animate="animate"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6">
            {title}
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          variants={heroAnimations.subtitle}
          initial="initial"
          animate="animate"
        >
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* CTA Buttons */}
        {cta && (
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={heroAnimations.cta}
            initial="initial"
            animate="animate"
          >
            {cta.primary && (
              <PremiumButton
                variant="primary"
                size="lg"
                href={cta.primary.href}
                onClick={cta.primary.onClick}
              >
                {cta.primary.text}
              </PremiumButton>
            )}
            {cta.secondary && (
              <PremiumButton
                variant="secondary"
                size="lg"
                href={cta.secondary.href}
              >
                {cta.secondary.text}
              </PremiumButton>
            )}
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && <ScrollIndicator />}
    </section>
  );
};
```

---

## 4. Interactive Components

### 4.1 ScrollReveal

**File**: `components/effects/ScrollReveal.tsx`

**Purpose**: Wrapper component that reveals children with animations when they scroll into view.

**Technical Specs**:
```typescript
interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scale' | 'blur';
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  stagger?: boolean;
  className?: string;
}
```

**Animations Library**:
```typescript
const scrollAnimations = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
};
```

**Implementation**:
```typescript
import { motion } from 'framer-motion';

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  once = true,
  stagger = false,
  className = '',
}) => {
  const variants = scrollAnimations[animation];

  const containerVariants = stagger ? {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  } : variants;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={containerVariants}
      transition={{ duration, ease: [0.6, -0.05, 0.01, 0.99] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
```

**Usage Examples**:
```typescript
// Single element
<ScrollReveal animation="fadeUp" delay={0.2}>
  <h2>Appears from bottom</h2>
</ScrollReveal>

// Staggered children
<ScrollReveal animation="fadeUp" stagger>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</ScrollReveal>

// Custom timing
<ScrollReveal
  animation="scale"
  duration={1.2}
  delay={0.5}
  threshold={0.5}
  once={false}
>
  <Card />
</ScrollReveal>
```

---

### 4.2 HoverGlow

**File**: `components/effects/HoverGlow.tsx`

**Purpose**: Add a cursor-following glow effect to any component.

**Technical Specs**:
```typescript
interface HoverGlowProps {
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  size?: number;
  followCursor?: boolean;
  blur?: number;
  className?: string;
}
```

**Implementation**:
```typescript
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';
import styles from './HoverGlow.module.css';

export const HoverGlow: React.FC<HoverGlowProps> = ({
  children,
  color = '#dc2626',
  intensity = 0.4,
  size = 300,
  followCursor = true,
  blur = 100,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();

  const getRelativePosition = () => {
    if (!containerRef.current || !followCursor) {
      return { x: '50%', y: '50%' };
    }

    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: mousePosition.x - rect.left,
      y: mousePosition.y - rect.top,
    };
  };

  const glowPosition = isHovered ? getRelativePosition() : { x: '50%', y: '50%' };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <motion.div
          className={styles.glow}
          style={{
            left: glowPosition.x,
            top: glowPosition.y,
            width: size,
            height: size,
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            filter: `blur(${blur}px)`,
            opacity: intensity,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: intensity }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      {children}
    </div>
  );
};
```

**CSS**:
```css
.container {
  position: relative;
  overflow: hidden;
}

.glow {
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
  will-change: transform, opacity;
}
```

---

## 5. Navigation Components

### 5.1 PremiumNavigation

**File**: `components/molecules/Navigation/PremiumNavigation.tsx`

**Purpose**: Enhanced navigation with glass morphism, blur effects, and smooth transitions.

**Technical Specs**:
```typescript
interface PremiumNavigationProps {
  sticky?: boolean;
  transparent?: boolean;
  blur?: boolean;
  showLogo?: boolean;
  items: NavItem[];
  rightContent?: React.ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}
```

**Features**:
- Glass morphism with backdrop blur
- Smooth scroll-based opacity changes
- Active link indicators with glow
- Mobile drawer with animations
- Wallet integration in right section

**Implementation**:
```typescript
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './PremiumNavigation.module.css';

export const PremiumNavigation: React.FC<PremiumNavigationProps> = ({
  sticky = true,
  transparent = true,
  blur = true,
  showLogo = true,
  items,
  rightContent,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Fade in background on scroll
  const backgroundOpacity = useTransform(
    scrollY,
    [0, 100],
    transparent ? [0, 0.8] : [0.8, 0.95]
  );

  const blurAmount = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(16px)']
  );

  return (
    <motion.nav
      className={`${styles.nav} ${sticky ? styles.sticky : ''}`}
      style={{
        backgroundColor: `rgba(10, 10, 10, ${backgroundOpacity})`,
        backdropFilter: blur ? blurAmount : 'none',
      }}
    >
      <div className={styles.container}>
        {/* Logo */}
        {showLogo && (
          <Link href="/" className={styles.logo}>
            <motion.div
              className={styles.logoIcon}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>R</span>
            </motion.div>
            <span className={styles.logoText}>RedPill AI</span>
          </Link>
        )}

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                {item.icon && <span className={styles.navIcon}>{item.icon}</span>}
                <span>{item.name}</span>
                {isActive && (
                  <motion.div
                    className={styles.activeIndicator}
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Content */}
        <div className={styles.rightSection}>
          {rightContent}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={styles.hamburger} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <motion.div
        className={styles.mobileDrawer}
        initial={{ x: '100%' }}
        animate={{ x: mobileOpen ? 0 : '100%' }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ x: 50, opacity: 0 }}
            animate={{
              x: mobileOpen ? 0 : 50,
              opacity: mobileOpen ? 1 : 0,
            }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={item.href}
              className={styles.mobileNavLink}
              onClick={() => setMobileOpen(false)}
            >
              {item.name}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.nav>
  );
};
```

---

## 6. Button Components

### 6.1 PremiumButton

**File**: `components/atoms/Button/PremiumButton.tsx`

**Purpose**: High-quality button with multiple variants and animations.

**Technical Specs**:
```typescript
interface PremiumButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  href?: string;
  onClick?: () => void;
  className?: string;
}
```

**Variants**:

1. **Primary**: Solid redpill color with glow
2. **Secondary**: Outlined with glass effect
3. **Ghost**: Transparent with hover fill
4. **Gradient**: Animated gradient background

**Implementation**:
```typescript
import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './PremiumButton.module.css';

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  glow = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  href,
  onClick,
  className = '',
}) => {
  const Component = href ? motion(Link) : motion.button;

  const buttonClasses = `
    ${styles.button}
    ${styles[variant]}
    ${styles[size]}
    ${glow ? styles.glow : ''}
    ${disabled ? styles.disabled : ''}
    ${loading ? styles.loading : ''}
    ${className}
  `;

  return (
    <Component
      href={href as any}
      onClick={!disabled && !loading ? onClick : undefined}
      className={buttonClasses}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      disabled={disabled || loading}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === 'left' && (
        <span className={styles.icon}>{icon}</span>
      )}
      <span className={styles.text}>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className={styles.icon}>{icon}</span>
      )}

      {/* Shimmer effect */}
      {variant === 'gradient' && (
        <motion.div
          className={styles.shimmer}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </Component>
  );
};
```

---

## Summary

This component specification document provides detailed implementation guidelines for all major UI components in the premium Web3 system. Each component includes:

1. Purpose and use cases
2. TypeScript interfaces
3. Visual behavior
4. Performance considerations
5. Implementation code
6. CSS styles
7. Usage examples

Implementation agents should refer to this document when building components to ensure consistency and quality across the application.
