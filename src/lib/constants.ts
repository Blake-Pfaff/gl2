// Application Constants
// Centralized configuration for consistent values across the app

export const APP_CONFIG = {
  // Application Identity
  name: "Goldy Locks",
  shortName: "GL",
  description: "Find your perfect match",

  // URLs and Links
  website: "https://goldylocks.app",
  support: "support@goldylocks.app",

  // Feature Flags
  features: {
    googleAuth: true,
    emailVerification: true,
    phoneVerification: true,
  },

  // Validation Rules
  validation: {
    passwordMinLength: 6,
    usernameMinLength: 3,
    phoneMaxLength: 15,
  },

  // UI Constants
  ui: {
    animationDuration: 300,
    toastDuration: 3000,
    debounceDelay: 500,
  },
} as const;

// Commonly used constants
export const { name: APP_NAME } = APP_CONFIG;
export const { validation: VALIDATION_RULES } = APP_CONFIG;
export const { features: FEATURES } = APP_CONFIG;

// Export individual values for convenience
export const {
  passwordMinLength: MIN_PASSWORD_LENGTH,
  usernameMinLength: MIN_USERNAME_LENGTH,
  phoneMaxLength: MAX_PHONE_LENGTH,
} = VALIDATION_RULES;
