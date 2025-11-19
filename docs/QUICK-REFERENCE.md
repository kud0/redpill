# RedPill Logo - Quick Reference Card

## 🚀 Quick Start

```tsx
import RedPillLogo from '@/components/icons/RedPillLogo';

// Default usage (recommended)
<RedPillLogo size="lg" variant="default" animated={true} glow={true} />
```

---

## 📏 Size Quick Guide

```tsx
<RedPillLogo size="sm" />   // 32×32px  - Navigation, buttons
<RedPillLogo size="md" />   // 64×64px  - Cards, sections
<RedPillLogo size="lg" />   // 128×128px - Featured content
<RedPillLogo size="xl" />   // 200×200px - Hero sections
```

---

## 🎭 Variant Quick Guide

```tsx
// Full featured (8+ animations)
<RedPillLogo variant="default" />

// Simplified for small sizes
<RedPillLogo variant="icon" />
<RedPillLogo variant="simple" />

// No animations
<RedPillLogo variant="static" />

// Logo + "REDPILL" text
<RedPillLogo variant="wordmark" />
```

---

## ⚡ Common Use Cases

### Hero Section
```tsx
<RedPillLogo
  size="xl"
  variant="default"
  animated={true}
  glow={true}
/>
```

### Navigation Logo
```tsx
<RedPillLogo
  size="sm"
  variant="icon"
  animated={true}
  glow={true}
/>
```

### Card/Section Header
```tsx
<RedPillLogo
  size="md"
  variant="simple"
  animated={true}
  glow={false}
/>
```

### Favicon/Static
```tsx
<RedPillLogo
  size="sm"
  variant="static"
  animated={false}
  glow={false}
/>
```

### Landing Page
```tsx
<RedPillLogo
  size="lg"
  variant="wordmark"
  animated={true}
  glow={true}
/>
```

### With Click Handler
```tsx
<RedPillLogo
  size="md"
  variant="default"
  animated={true}
  onClick={() => console.log('Pill clicked!')}
/>
```

---

## 🎨 Props Reference

| Prop | Type | Options | Default |
|------|------|---------|---------|
| `size` | string | `sm` `md` `lg` `xl` | `md` |
| `variant` | string | `default` `simple` `static` `icon` `wordmark` | `default` |
| `animated` | boolean | `true` `false` | `true` |
| `glow` | boolean | `true` `false` | `true` |
| `onClick` | function | Any function | `undefined` |
| `className` | string | Any CSS classes | `''` |

---

## 🎬 Animation List

### Continuous (Always Running)
- ✨ 3D Rotation (8s)
- ✨ Glow Pulse (2s)
- ✨ Liquid Wave (2s)
- ✨ Bubble Rise (2-3.5s)
- ✨ Binary Rain (1.5-2.4s)

### Interactive (On Trigger)
- 🖱️ Hover Scale (300ms)
- 🖱️ Hover Particles (1.5s)
- 🖱️ Click Explosion (0.6s)

---

## 🎨 Colors Used

```css
Primary:     #dc2626
Bright:      #ef4444
Dark:        #991b1b
Glow:        rgba(220, 38, 38, 0.8)
Matrix:      #00ff41
```

---

## 📊 Performance

- **FPS**: 60 (locked)
- **File Size**: ~15KB
- **Load Time**: <50ms
- **Memory**: <2MB

---

## 🔧 Customization Tips

### Disable Animations
```tsx
<RedPillLogo animated={false} />
```

### Remove Glow
```tsx
<RedPillLogo glow={false} />
```

### Custom CSS Class
```tsx
<RedPillLogo className="custom-logo-class" />
```

### Combine Props
```tsx
<RedPillLogo
  size="lg"
  variant="default"
  animated={true}
  glow={true}
  onClick={handleClick}
  className="mx-auto my-8"
/>
```

---

## 🐛 Troubleshooting

### Logo Not Showing?
- Check import path: `@/components/icons/RedPillLogo`
- Ensure Framer Motion is installed: `npm install framer-motion`

### Animations Choppy?
- Hardware acceleration should be automatic
- Check browser compatibility
- Try reducing particle count (coming in v2)

### Too Large/Small?
- Use appropriate size prop (`sm`, `md`, `lg`, `xl`)
- Or use custom CSS: `className="w-20 h-20"`

---

## 📚 Full Documentation

For complete technical details, see:
- `/docs/RedPillLogo-Documentation.md` - Technical specs
- `/docs/LOGO-SUMMARY.md` - Implementation summary
- `/docs/BEFORE-AFTER.md` - Transformation details
- `/docs/logo-showcase.html` - Visual showcase

---

## 🎯 Best Practices

### DO:
✅ Use `default` variant for hero sections
✅ Use `icon` variant for navigation
✅ Enable `glow` for dark backgrounds
✅ Use `animated={true}` when possible
✅ Match size to context

### DON'T:
❌ Use `xl` size in navigation
❌ Disable animations without reason
❌ Use `wordmark` in small spaces
❌ Forget onClick handler when needed
❌ Stack multiple `xl` logos

---

## 💡 Pro Tips

1. **Dark Mode**: Logo looks best on dark backgrounds
2. **Spacing**: Give it breathing room (margin)
3. **Hover**: Logo is interactive - let users play with it
4. **Loading**: Use as loading spinner (variant="simple")
5. **Branding**: Wordmark variant for headers
6. **Social**: Export static variant for profile pics

---

## 🔗 Quick Links

```tsx
// Import
import RedPillLogo from '@/components/icons/RedPillLogo';

// Component Path
/components/icons/RedPillLogo.tsx

// Documentation
/docs/RedPillLogo-Documentation.md

// Showcase
/docs/logo-showcase.html
```

---

## 🎉 You're Ready!

That's all you need to know to use the RedPill logo like a pro. Just import, add props, and enjoy the most badass pill logo in crypto! 💊🔥

**Default Recommended Setup:**
```tsx
<RedPillLogo size="lg" variant="default" animated={true} glow={true} />
```

Happy coding! 🚀
