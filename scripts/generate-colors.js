const chroma = require("chroma-js");
const fs = require("fs");
const path = require("path");

// Base color - change this single value to update your entire color scheme
const BASE_COLOR = "#14b8a6"; // Current teal color

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
}`;

  const newCSS = `@import "tailwindcss";

${themeBlock}
`;

  fs.writeFileSync(cssPath, newCSS);
  console.log("✅ Generated color scale from:", BASE_COLOR);
  console.log("📝 Updated globals.css with new primary colors");

  // Log the generated colors for reference
  console.log("\n🎨 Generated colors:");
  Object.entries(colors).forEach(([shade, hex]) => {
    console.log(`  primary-${shade}: ${hex}`);
  });
}

// Generate and apply the colors
const colors = generateColorScale(BASE_COLOR);
updateGlobalCSS(colors);
