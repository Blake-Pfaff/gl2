# Animations Reference

This document shows how to use the centralized animation library instead of hardcoded Framer Motion configurations.

## Location

All animations are defined in `/src/lib/animations.ts` - your single source of truth for motion design.

## How It Works

Similar to design tokens, all Framer Motion configurations are centralized:

```ts
import { animations } from "@/lib/animations";

// Use preset configurations
<motion.div {...animations.presets.pageContent}>

// Use individual variants
<motion.button variants={animations.variants.button}>

// Use standardized transitions
transition={animations.transitions.fast}
```

**You get consistent timing, easing, and motion patterns across your entire app!**

## Common Pattern Replacements

### Page Transitions

```jsx
// ❌ Before (hardcoded)
<motion.div
  initial={{ opacity: 0, y: 20, scale: 0.98 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: -20, scale: 1.02 }}
  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
>

// ✅ After (centralized)
<motion.div {...animations.presets.pageContent}>
```

### Button Interactions

```jsx
// ❌ Before (scattered configs)
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
>

// ✅ After (consistent)
<motion.button {...animations.presets.button}>
```

### Card Animations

```jsx
// ❌ Before (magic numbers)
<motion.div
  initial={{ opacity: 0, y: 20, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  whileHover={{ y: -4, scale: 1.02 }}
  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
>

// ✅ After (semantic)
<motion.div {...animations.presets.card}>
```

## Available Animations

### Presets (Ready-to-Use)

The most common animation patterns, fully configured:

- `animations.presets.pageContent` - Complete page transitions
- `animations.presets.button` - Button hover/tap interactions
- `animations.presets.card` - Card entrance + hover effects
- `animations.presets.listItem(delay)` - Staggered list items

### Transitions (Timing Configs)

Standardized timing for consistent feel:

- `animations.transitions.page` - 0.5s smooth page changes
- `animations.transitions.fast` - 0.2s quick interactions
- `animations.transitions.instant` - 0.1s immediate feedback
- `animations.transitions.smooth` - 0.3s gentle entrances
- `animations.transitions.spring` - Bouncy spring physics

### Variants (Motion States)

Organized by component type:

#### Page Variants

- `animations.variants.page.initial` - Page entering state
- `animations.variants.page.in` - Page visible state
- `animations.variants.page.out` - Page exiting state

#### Button Variants

- `animations.variants.button.rest` - Default state
- `animations.variants.button.hover` - Mouse hover
- `animations.variants.button.tap` - Press/click

#### Card Variants

- `animations.variants.card.hidden` - Before entrance
- `animations.variants.card.visible` - After entrance
- `animations.variants.card.hover` - Hover lift effect
- `animations.variants.card.tap` - Click feedback

#### Login Page Variants

- `animations.variants.login.heartContainer` - Heart logo entrance
- `animations.variants.login.heartHover` - Heart hover effect
- `animations.variants.login.title` - Title slide-in
- `animations.variants.login.form` - Form container entrance

#### Navigation Variants

- `animations.variants.nav.activeIcon` - Active tab scaling
- `animations.variants.nav.indicator` - Active dot entrance
- `animations.variants.nav.tap` - Navigation tap feedback

### Stagger Values

For sequential animations:

- `animations.stagger.items` - 0.1s between list items
- `animations.stagger.cards` - 0.1s between cards
- `animations.stagger.fast` - 0.05s rapid sequence
- `animations.stagger.slow` - 0.2s deliberate sequence

## Usage Examples

### Simple Page Component

```jsx
import { motion } from "framer-motion";
import { animations } from "@/lib/animations";

export default function MyPage() {
  return (
    <motion.div {...animations.presets.pageContent}>
      <h1>Page Content</h1>
    </motion.div>
  );
}
```

### Custom Button with Interactions

```jsx
import { motion } from "framer-motion";
import { animations } from "@/lib/animations";

export default function CustomButton({ children, disabled }) {
  return (
    <motion.button
      {...animations.presets.button}
      whileHover={disabled ? "rest" : "hover"}
      whileTap={disabled ? "rest" : "tap"}
    >
      {children}
    </motion.button>
  );
}
```

### Staggered List Animation

```jsx
import { motion } from "framer-motion";
import { animations } from "@/lib/animations";

export default function ItemList({ items }) {
  return (
    <div>
      {items.map((item, index) => (
        <motion.div key={item.id} {...animations.presets.listItem(index)}>
          {item.content}
        </motion.div>
      ))}
    </div>
  );
}
```

### Complex Component with Multiple Animations

```jsx
import { motion } from "framer-motion";
import { animations } from "@/lib/animations";

export default function LoginForm() {
  return (
    <div>
      {/* Logo with custom animation */}
      <motion.div {...animations.variants.login.heartContainer}>
        <motion.svg whileHover={animations.variants.login.heartHover}>
          {/* Heart SVG */}
        </motion.svg>
      </motion.div>

      {/* Title */}
      <motion.h1 {...animations.variants.login.title}>Login</motion.h1>

      {/* Form */}
      <motion.form {...animations.variants.login.form}>
        {/* Form content */}
      </motion.form>
    </div>
  );
}
```

## Utility Functions

Create custom animations with helpers:

```jsx
// Entrance with custom delay
const delayedEntrance = animations.utils.createEntrance(0.5);

// Hover lift with custom distance
const customHover = animations.utils.createHover(-8);

// Staggered children container
const staggerContainer = animations.utils.createStaggered(0.15);
```

## Customizing Animations

### Changing Global Timing

Edit `/src/lib/animations.ts` to affect all animations:

```ts
// Make all interactions faster
export const transitions = {
  fast: {
    duration: 0.15, // was 0.2s
    ease: "easeOut",
  },
  // ... other transitions
};
```

### Adding New Component Variants

```ts
// Add new component animations
export const modalVariants = {
  closed: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
} as const;

// Add to main variants object
export const animations = {
  variants: {
    // ... existing variants
    modal: modalVariants,
  },
  // ... rest of config
};
```

### Creating New Presets

```ts
// Add commonly used patterns
export const presets = {
  // ... existing presets
  modal: {
    variants: modalVariants,
    initial: "closed",
    animate: "open",
    exit: "closed",
    transition: transitions.smooth,
  },
} as const;
```

## Benefits

1. **Consistency**: All animations use the same timing and easing
2. **Easy Updates**: Change one value, update entire app
3. **Semantic**: `login.heartContainer` is clearer than magic numbers
4. **Type Safety**: TypeScript ensures correct usage
5. **Performance**: Reused objects reduce memory allocation
6. **Maintainability**: Centralized like design tokens

## Most Common Patterns

Based on current usage in your app:

### High Priority (use these most)

- `animations.presets.pageContent` - Every page transition
- `animations.presets.button` - All interactive buttons
- `animations.presets.card` - User cards, content cards
- `animations.transitions.fast` - Hover/tap feedback

### Medium Priority

- `animations.variants.login.*` - Login page elements
- `animations.variants.nav.*` - Navigation interactions
- `animations.stagger.items` - List/grid item delays

## Animation Performance Tips

1. **Prefer transform properties**: `x`, `y`, `scale`, `rotate` over `top`, `left`, `width`, `height`
2. **Use `layoutId`** for element transitions between states
3. **Add `will-change: transform`** for complex animations
4. **Avoid animating `opacity`** on elements with many children

## Integration with Design Tokens

Your animations work seamlessly with design tokens:

```jsx
// Animations + Design Tokens = Perfect Harmony
<motion.button
  {...animations.presets.button}
  className="px-page-x py-component rounded-button bg-primary-500"
>
  Animated Button with Design Tokens
</motion.button>
```

## Example Migration

Instead of scattered animation configs:

```jsx
// ❌ Before (inconsistent, scattered)
<motion.div
  initial={{ opacity: 0, y: 25 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
>
  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    Click me
  </motion.button>
</motion.div>
```

Use this clean, centralized approach:

```jsx
// ✅ After (consistent, maintainable)
<motion.div {...animations.presets.pageContent}>
  <motion.button {...animations.presets.button}>Click me</motion.button>
</motion.div>
```

Much cleaner and more maintainable! ✨

## Debugging Animations

Add temporary debugging to see animation values:

```jsx
<motion.div
  {...animations.presets.pageContent}
  onAnimationStart={() => console.log("Animation started")}
  onAnimationComplete={() => console.log("Animation completed")}
>
```

Perfect for understanding timing and sequencing! 🎭
