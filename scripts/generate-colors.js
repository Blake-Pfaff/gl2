const chroma = require("chroma-js");
const fs = require("fs");
const path = require("path");

// Base color - change this single value to update your entire color scheme
const BASE_COLOR = "#d4af37"; // Medium gold color

function generateColorScale(baseColor) {
  const color = chroma(baseColor);

  // Generate a color scale from very light to very dark
  const scale = chroma
    .scale([
      color.luminance(0.95), // 50 - very light
      color.luminance(0.85), // 100 - light
      color.luminance(0.75), // 200 - light
      color.luminance(0.6), // 300 - medium-light
      color.luminance(0.45), // 400 - medium
      baseColor, // 500 - base color
      color.darken(0.5), // 600 - medium-dark
      color.darken(1), // 700 - dark
      color.darken(1.5), // 800 - very dark
      color.darken(2), // 900 - darkest
    ])
    .mode("hsl");

  return {
    50: scale(0).hex(),
    100: scale(0.111).hex(),
    200: scale(0.222).hex(),
    300: scale(0.333).hex(),
    400: scale(0.444).hex(),
    500: scale(0.555).hex(),
    600: scale(0.666).hex(),
    700: scale(0.777).hex(),
    800: scale(0.888).hex(),
    900: scale(1).hex(),
  };
}

function updateGlobalCSS(colors) {
  const cssPath = path.join(__dirname, "../src/app/globals.css");

  const themeBlock = `@theme {
  /* Primary Colors */
  --color-primary-50: ${colors[50]};
  --color-primary-100: ${colors[100]};
  --color-primary-200: ${colors[200]};
  --color-primary-300: ${colors[300]};
  --color-primary-400: ${colors[400]};
  --color-primary-500: ${colors[500]};
  --color-primary-600: ${colors[600]};
  --color-primary-700: ${colors[700]};
  --color-primary-800: ${colors[800]};
  --color-primary-900: ${colors[900]};

  /* Semantic Text Colors */
  --color-text-primary: #111827;    /* text-gray-900 - main headings */
  --color-text-secondary: #374151;  /* text-gray-700 - body text */
  --color-text-muted: #6b7280;      /* text-gray-500 - captions, icons */
  --color-text-subtle: #9ca3af;     /* text-gray-400 - placeholders */
  --color-text-inverse: #ffffff;    /* text-white - on dark backgrounds */
  --color-text-error: #dc2626;      /* text-red-600 - error messages */
  --color-text-success: #059669;    /* text-emerald-600 - success messages */
  --color-text-link: ${colors[600]}; /* text-primary-600 - links */

  /* Typography Scale */
  --font-size-hero: 1.875rem;       /* text-3xl - hero headings */
  --font-size-heading: 1.5rem;      /* text-2xl - page headings */
  --font-size-subheading: 1.125rem; /* text-lg - section headings */
  --font-size-body: 0.875rem;       /* text-sm - body text */
  --font-size-caption: 0.75rem;     /* text-xs - captions */

  /* Font Weights */
  --font-weight-light: 300;         /* font-light */
  --font-weight-normal: 400;        /* font-normal */
  --font-weight-medium: 500;        /* font-medium - labels */
  --font-weight-semibold: 600;      /* font-semibold - buttons */
  --font-weight-bold: 700;          /* font-bold - headings */

  /* Custom Spacing Scale */
  --spacing-page-x: 1.5rem;         /* px-6 - horizontal page padding */
  --spacing-page-y: 2rem;           /* py-8 - vertical page padding */
  --spacing-section: 1.5rem;        /* space-y-6 - between form sections */
  --spacing-component: 1rem;        /* p-4 - component internal padding */
  --spacing-compact: 0.75rem;       /* p-3 - compact padding */
  
  /* Custom Border Radius */
  --radius-button: 9999px;          /* rounded-full - buttons */
  --radius-card: 1rem;              /* rounded-2xl - cards, modals */
  --radius-input: 1rem;             /* rounded-2xl - form inputs */
  --radius-small: 0.5rem;           /* rounded-lg - small elements */
  
  /* Custom Dimensions */
  --size-button-height: 3.5rem;     /* py-4 px-6 - button height */
  --size-input-height: 3.5rem;      /* py-4 px-5 - input height */
  --size-avatar: 5rem;              /* w-20 h-20 - profile avatars */
  --size-card-image: 12rem;         /* h-48 - card images */
}`;

  const newCSS = `@import "tailwindcss";

${themeBlock}
`;

  fs.writeFileSync(cssPath, newCSS);
  console.log("✅ Generated color scale from:", BASE_COLOR);
  console.log("📝 Updated globals.css with design tokens");

  // Log the generated colors for reference
  console.log("\n🎨 Generated colors:");
  Object.entries(colors).forEach(([shade, hex]) => {
    console.log(`  primary-${shade}: ${hex}`);
  });

  console.log("\n🎯 Design tokens added:");
  console.log("  - Layout spacing (page-x, page-y, section, component)");
  console.log("  - Border radius (button, card, input, small)");
  console.log("  - Typography scales (heading, body, caption)");
  console.log("  - Component dimensions (button, input, avatar, card)");
  console.log("  - Transition timing");
}

// Generate and apply the colors
const colors = generateColorScale(BASE_COLOR);
updateGlobalCSS(colors);
