module.exports = {
  rules: {
    // Custom rule to discourage hardcoded Tailwind classes
    "no-hardcoded-tailwind": {
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name.name === "className" && node.value?.value) {
              const className = node.value.value;

              // Check for hardcoded classes that should use tokens
              const violations = [
                // Text colors
                {
                  pattern: /text-gray-\d+/,
                  suggest:
                    "text-primary, text-secondary, text-muted, text-subtle",
                },
                { pattern: /text-red-\d+/, suggest: "text-error" },
                { pattern: /text-primary-\d+/, suggest: "text-link" },

                // Spacing
                { pattern: /px-6(?!\w)/, suggest: "px-page-x" },
                { pattern: /py-8(?!\w)/, suggest: "py-page-y" },
                { pattern: /p-4(?!\w)/, suggest: "p-component" },
                { pattern: /p-3(?!\w)/, suggest: "p-compact" },
                { pattern: /space-y-6(?!\w)/, suggest: "space-y-section" },

                // Border radius
                { pattern: /rounded-full(?!\w)/, suggest: "rounded-button" },
                {
                  pattern: /rounded-2xl(?!\w)/,
                  suggest: "rounded-card or rounded-input",
                },
                { pattern: /rounded-lg(?!\w)/, suggest: "rounded-small" },

                // Typography
                { pattern: /text-3xl(?!\w)/, suggest: "text-hero" },
                { pattern: /text-2xl(?!\w)/, suggest: "text-heading" },
                { pattern: /text-lg(?!\w)/, suggest: "text-subheading" },
                { pattern: /text-sm(?!\w)/, suggest: "text-body" },
                { pattern: /text-xs(?!\w)/, suggest: "text-caption" },
              ];

              violations.forEach(({ pattern, suggest }) => {
                if (pattern.test(className)) {
                  context.report({
                    node,
                    message: `Consider using design token instead: ${suggest}`,
                    data: { suggest },
                  });
                }
              });
            }
          },
        };
      },
    },
  },
};
