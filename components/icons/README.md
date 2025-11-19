# Premium SVG Icons - RedPill AI

Custom-designed, animated SVG icons for the RedPill AI homepage. These icons replace basic emojis with premium, Web3-themed components that feature smooth animations, gradients, and glow effects.

## RedPill Logo 💊

**NEW!** The crown jewel - an epic 3D animated pill capsule logo combining Matrix aesthetics, tech depth, and liquid effects.

### Quick Start
```tsx
import RedPillLogo from '@/components/icons/RedPillLogo';

<RedPillLogo size="xl" variant="default" animated={true} glow={true} />
```

### Features
- 🔴 3D pill capsule with realistic depth and rotation
- 💻 Matrix-style binary rain animation inside
- 💧 Liquid bubbles and wave effects
- ✨ Glass reflections and shine overlays
- 🌟 Pulsing glow system
- 🖱️ Interactive hover/click particle effects
- ⚡ 60 FPS smooth animations
- 📱 5 variants (default, simple, static, icon, wordmark)

### Documentation
- Full docs: `/docs/RedPillLogo-Documentation.md`
- Quick reference: `/docs/QUICK-REFERENCE.md`
- Visual showcase: `/docs/logo-showcase.html`

---

## Icons Overview

### 1. MemeIcon (🎭 → Custom)
**Design Concept:** Viral Spread Energy
- Speech bubble with sparkles showing viral potential
- Animated particles spreading outward
- Pulsing background glow
- Connected mini bubbles representing social spread

**Features:**
- Main speech bubble with chat tail
- Floating sparkles with rotation animation
- Viral spread nodes with connection lines
- Smiling face elements inside bubble
- Pulse and glow effects

**Animation:**
- Sparkles rotate and scale
- Bubbles float up and down
- Connection lines pulse
- Background glow breathes

---

### 2. ImageIcon (🎨 → Custom)
**Design Concept:** AI-Powered Layered Creation
- Stacked frames showing depth and layers
- Neural network nodes and connections
- Magic wand sparkle for AI enhancement

**Features:**
- Three layered frames with offset
- Different gradient fills per layer
- Neural network nodes (5 points)
- Connecting lines between nodes
- Rotating magic wand sparkle

**Animation:**
- Frames draw in sequence
- Nodes pulse and scale
- Connection lines flow with data
- Magic wand rotates continuously
- Background glow pulses

---

### 3. ThreadIcon (✍️ → Custom)
**Design Concept:** Social Network Flow
- Connected nodes representing thread structure
- Center hub with radiating connections
- Data particles flowing through network
- Orbital ring showing connectivity

**Features:**
- 5 connected nodes (top, left, right, bottom, center)
- Flowing connection lines
- Data particles moving through network
- Rotating dashed orbital ring
- Background flow gradient

**Animation:**
- Nodes pulse in sequence
- Connection lines flow outward from center
- Particles travel along paths
- Ring rotates slowly
- Flow gradient shifts

---

### 4. VoiceIcon (🎤 → Custom)
**Design Concept:** Voice Cloning Technology
- Professional microphone with stand
- Sound waves emanating both sides
- AI particles floating around
- Waveform visualization inside mic

**Features:**
- Detailed microphone (capsule, arc, stand, base)
- 3 levels of sound waves per side (6 total)
- Floating AI particles
- Internal waveform visualization
- Radial glow background

**Animation:**
- Sound waves pulse outward
- Each wave layer animates at different speed
- Mic body has subtle float
- Particles float upward
- Internal waveform bounces
- Background glow breathes

---

### 5. VocalRemoverIcon (🎵 → Custom)
**Design Concept:** Audio Stem Separation
- Split EQ bars showing vocal/instrumental separation
- Center dividing line
- Separation arrows
- Frequency spectrum at bottom

**Features:**
- Left side: Vocal EQ bars (3 bars, taller)
- Right side: Instrumental EQ bars (3 bars, shorter)
- Dashed center divider
- Bidirectional separation arrows
- Bottom frequency spectrum (12 bars total)
- Separation particles

**Animation:**
- EQ bars pulse at different rates
- Left side (vocals) more dynamic
- Right side (instrumental) steadier
- Arrows slide outward
- Center divider scrolls
- Frequency spectrum dances
- Particles split from center

---

## Technical Details

### Color Scheme
All icons use the RedPill brand gradient:
- Primary: `#dc2626` (red-600)
- Secondary: `#ef4444` (red-500)
- Tertiary: `#991b1b` (red-800)
- Accent: `#fca5a5` (red-200)

### Gradients Used
```typescript
// Linear gradient (horizontal)
<linearGradient id="gradient-1">
  <stop offset="0%" stopColor="#dc2626" />
  <stop offset="50%" stopColor="#ef4444" />
  <stop offset="100%" stopColor="#991b1b" />
</linearGradient>

// Radial gradient (glow)
<radialGradient id="radial-glow">
  <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.6" />
  <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
</radialGradient>
```

### Effects
- **Glow Filter:** All icons use `feGaussianBlur` with `stdDeviation="2-2.5"`
- **Stroke Width:** 2-2.5px for main elements, 1-1.5px for details
- **Corner Radius:** 1.5-4px for rounded elements

### Animations

#### Framer Motion Props
```typescript
// Hover animation (all icons)
whileHover={{ scale: 1.1, rotate: [-3 to 5] }}
transition={{ type: 'spring', stiffness: 300, damping: 10 }}

// Pulse animation
animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
transition={{ duration: 2-3, repeat: Infinity, ease: 'easeInOut' }}

// Rotation animation
animate={{ rotate: 360 }}
transition={{ duration: 4-10, repeat: Infinity, ease: 'linear' }}

// Path drawing
animate={{ pathLength: [0, 1] }}
transition={{ duration: 1-1.5, ease: 'easeOut' }}
```

## Usage

### Basic Import
```tsx
import MemeIcon from '@/components/icons/MemeIcon';
import ImageIcon from '@/components/icons/ImageIcon';
// ... etc
```

### Or use barrel export
```tsx
import { MemeIcon, ImageIcon, ThreadIcon } from '@/components/icons';
```

### Props
```typescript
interface IconProps {
  className?: string;  // Additional CSS classes
  size?: number;       // Icon size in pixels (default: 48)
}
```

### Example Usage
```tsx
// Default size (48x48)
<MemeIcon />

// Custom size (64x64)
<ImageIcon size={64} />

// With custom classes
<ThreadIcon className="drop-shadow-2xl" size={72} />

// In a grid
<div className="flex gap-4">
  <MemeIcon size={56} />
  <ImageIcon size={56} />
  <ThreadIcon size={56} />
  <VoiceIcon size={56} />
  <VocalRemoverIcon size={56} />
</div>
```

## Performance

### Optimization
- SVG-based (vector, scales perfectly)
- No external image files
- Minimal DOM nodes
- GPU-accelerated animations (transform, opacity)
- Lazy animation initialization

### Bundle Impact
- Each icon: ~2-3KB (minified)
- Total: ~12-15KB for all 5 icons
- Tree-shakeable with barrel exports

## Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile: Full support (iOS 12+, Android 5+)

## Accessibility
All icons are decorative and include:
- `aria-hidden="true"` (recommended for decorative SVGs)
- Focus indicators via parent links
- Proper contrast ratios

## Design Principles

1. **Premium Feel:** Gradients, glows, and smooth animations
2. **Web3 Aesthetic:** Geometric, modern, tech-forward
3. **Red Pill Theme:** Consistent brand colors throughout
4. **Interactive:** Hover states provide feedback
5. **Performant:** Optimized animations, minimal repaints

## Customization

### Changing Colors
Modify gradient definitions in each icon component:
```tsx
<linearGradient id="custom-gradient">
  <stop offset="0%" stopColor="#yourColor1" />
  <stop offset="100%" stopColor="#yourColor2" />
</linearGradient>
```

### Adjusting Animations
Modify Framer Motion props:
```tsx
animate={{ scale: [1, 1.2, 1] }}  // Increase scale range
transition={{ duration: 3 }}       // Slow down
```

### Removing Hover Effects
Remove `whileHover` prop from root `<motion.svg>` element

## Future Enhancements
- Add sound effects on hover (optional)
- Create dark/light mode variants
- Add loading skeleton versions
- Create larger showcase variants (128x128+)
- Add alternative color schemes

## Credits
Designed and developed for RedPill AI
Icons created: 2025
Style: Web3/Crypto Premium
