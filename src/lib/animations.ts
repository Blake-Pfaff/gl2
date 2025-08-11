// Animation Library - Centralized Framer Motion configurations
// Similar to design tokens, all animations are defined here for easy maintenance

// =============================================================================
// TRANSITIONS - Reusable transition configurations
// =============================================================================

export const transitions = {
  // Standard page transition
  page: {
    type: "tween" as const,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    duration: 0.5,
  },

  // Quick interactions
  fast: {
    type: "tween" as const,
    ease: "easeOut" as const,
    duration: 0.2,
  },

  // Instant feedback
  instant: {
    type: "tween" as const,
    ease: "easeOut" as const,
    duration: 0.1,
  },

  // Smooth entrances
  smooth: {
    type: "tween" as const,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    duration: 0.3,
  },

  // Gentle spring
  spring: {
    type: "spring" as const,
    damping: 25,
    stiffness: 120,
  },
} as const;

// =============================================================================
// EASING CURVES - Custom easing for consistent feel
// =============================================================================

export const easings = {
  smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
  easeOut: "easeOut" as const,
  easeIn: "easeIn" as const,
  linear: "linear" as const,
} as const;

// =============================================================================
// ANIMATION VARIANTS - All motion variants in one place
// =============================================================================

// Page Transitions - using section spacing token for movement
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 24, // 24px ≈ 1.5rem (section spacing)
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -24, // 24px ≈ 1.5rem (section spacing)
    scale: 1.02,
  },
} as const;

// Button Interactions
export const buttonVariants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.98,
    transition: transitions.instant,
  },
} as const;

// Card Animations - using spacing tokens for movement
export const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24, // 24px ≈ 1.5rem (section spacing)
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  hover: {
    y: -6, // small upward movement for hover effect
    scale: 1.02,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.98,
    transition: transitions.instant,
  },
} as const;

// Login Page Elements
export const loginVariants = {
  // Heart logo
  heartContainer: {
    initial: { scale: 0.8 },
    animate: { scale: 1 },
    transition: { delay: 0.2, duration: 0.4, ease: easings.easeOut },
  },
  heartHover: {
    scale: 1.1,
    transition: transitions.fast,
  },

  // Title - using section spacing token for movement
  title: {
    initial: { y: 24 }, // 24px ≈ 1.5rem (section spacing)
    animate: { y: 0 },
    transition: { delay: 0.4, duration: 0.4 },
  },

  // Form container - using compact spacing token for subtle movement
  form: {
    initial: { y: 12, opacity: 0.8 }, // 12px ≈ 0.75rem (compact spacing)
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.6, duration: 0.3 },
  },
} as const;

// Navigation Elements
export const navVariants = {
  // Active icon scaling
  activeIcon: {
    scale: 1.2,
    transition: transitions.fast,
  },

  // Active indicator
  indicator: {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: transitions.fast,
  },

  // Tap feedback
  tap: {
    scale: 0.95,
    transition: transitions.instant,
  },
} as const;

// Grid/List Animations
export const gridVariants = {
  container: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  },
} as const;

// Dropdown Animations - using compact spacing token for subtle movements
export const dropdownVariants = {
  // Dropdown menu container
  menu: {
    initial: {
      opacity: 0,
      y: -12, // 12px ≈ 0.75rem (compact spacing)
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      y: -12, // 12px ≈ 0.75rem (compact spacing)
      scale: 0.95,
    },
  },

  // Individual dropdown items
  item: {
    initial: {
      opacity: 0,
      x: -12, // 12px ≈ 0.75rem (compact spacing)
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    hover: {
      x: 6, // small rightward movement for hover
    },
    tap: {
      scale: 0.98,
    },
  },

  // Dropdown button
  button: {
    rest: {
      scale: 1,
    },
    hover: {
      borderColor: "var(--color-primary-400)",
    },
    tap: {
      scale: 0.98,
    },
  },

  // Arrow icon rotation
  arrow: {
    closed: {
      rotate: 0,
    },
    open: {
      rotate: 180,
    },
  },

  // Backdrop
  backdrop: {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  },
} as const;

// =============================================================================
// STAGGER CONFIGURATIONS - For sequential animations
// =============================================================================

export const stagger = {
  // Standard stagger timing
  items: 0.1,
  cards: 0.1,
  fast: 0.05,
  slow: 0.2,
} as const;

// =============================================================================
// HELPER FUNCTIONS - Utilities for creating consistent animations
// =============================================================================

// Create staggered children animation
export const createStaggered = (delay: number = stagger.items) => ({
  animate: {
    transition: {
      staggerChildren: delay,
    },
  },
});

// Create entrance animation with delay - using section spacing token
export const createEntrance = (delay: number = 0) => ({
  initial: { opacity: 0, y: 24 }, // 24px ≈ 1.5rem (section spacing)
  animate: { opacity: 1, y: 0 },
  transition: { delay, ...transitions.smooth },
});

// Create hover lift effect - default uses small upward movement
export const createHover = (lift: number = -6) => ({
  // 6px for subtle hover lift
  whileHover: {
    y: lift,
    scale: 1.02,
    transition: transitions.fast,
  },
});

// =============================================================================
// PHONE INPUT ANIMATIONS - For phone number entry flow
// =============================================================================

export const phoneInputVariants = {
  // Back button with perfect spring feedback
  backButton: {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  },

  // Form container entrance
  formContainer: {
    initial: { opacity: 0, y: 24 }, // section spacing
    animate: { opacity: 1, y: 0 },
    transition: transitions.smooth,
  },

  // Input field focus states
  inputFocus: {
    initial: { borderColor: "var(--color-primary-300)" },
    focus: {
      borderColor: "var(--color-primary-400)",
      scale: 1.01,
    },
    blur: {
      borderColor: "var(--color-primary-300)",
      scale: 1,
    },
  },
} as const;

// =============================================================================
// VERIFICATION ANIMATIONS - For code input and keypad
// =============================================================================

export const verificationVariants = {
  // Code digit animation with spring bounce
  codeDigit: {
    empty: {
      scale: 1,
      borderColor: "rgb(var(--primary-300))",
    },
    filled: {
      scale: 1.1,
      borderColor: "rgb(var(--primary-400))",
    },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },

  // Digit text entrance
  digitText: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: "spring", stiffness: 500, damping: 30 },
  },

  // Keypad button interactions
  keypadButton: {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.9 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
  },

  // Keypad container entrance
  keypadContainer: {
    initial: { opacity: 0, y: 24, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: transitions.smooth,
  },
} as const;

// =============================================================================
// PRESET COMBINATIONS - Common animation patterns
// =============================================================================

export const presets = {
  // Standard page content
  pageContent: {
    variants: pageVariants,
    initial: "initial",
    animate: "in",
    exit: "out",
    transition: transitions.page,
  },

  // Interactive button
  button: {
    variants: buttonVariants,
    initial: "rest",
    whileHover: "hover",
    whileTap: "tap",
  },

  // Card with hover
  card: {
    variants: cardVariants,
    initial: "hidden",
    animate: "visible",
    whileHover: "hover",
    whileTap: "tap",
  },

  // Staggered list item - using section spacing token
  listItem: (delay: number = 0) => ({
    initial: { opacity: 0, y: 24 }, // 24px ≈ 1.5rem (section spacing)
    animate: { opacity: 1, y: 0 },
    transition: { delay: delay * stagger.items, ...transitions.smooth },
  }),
} as const;

// =============================================================================
// EXPORT DEFAULT - Main animation config object
// =============================================================================

export const animations = {
  transitions,
  easings,
  variants: {
    page: pageVariants,
    button: buttonVariants,
    card: cardVariants,
    login: loginVariants,
    nav: navVariants,
    grid: gridVariants,
    dropdown: dropdownVariants,
    phoneInput: phoneInputVariants,
    verification: verificationVariants,
  },
  stagger,
  presets,
  utils: {
    createStaggered,
    createEntrance,
    createHover,
  },
} as const;

export default animations;
