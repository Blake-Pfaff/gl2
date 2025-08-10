# Design Tokens Reference

This document shows how to use the design tokens instead of hardcoded Tailwind classes.

## How It Works in Tailwind v4

When you define custom properties in the `@theme` block, Tailwind v4 automatically generates utility classes:

```css
@theme {
  --spacing-page-x: 1.5rem;
  --radius-button: 9999px;
  --font-size-heading: 1.5rem;
}
```

This generates utilities like:

- `px-page-x` → `padding-left: 1.5rem; padding-right: 1.5rem;`
- `rounded-button` → `border-radius: 9999px;`
- `text-heading` → `font-size: 1.5rem;`

**You use them exactly like any other Tailwind utility - no `[]` brackets needed!**

## Common Pattern Replacements

### Spacing & Layout

```jsx
// ❌ Before (hardcoded)
<div className="px-6 py-8">
<div className="space-y-6">
<div className="p-4">
<div className="p-3">

// ✅ After (semantic)
<div className="px-page-x py-page-y">
<div className="space-y-section">
<div className="p-component">
<div className="p-compact">
```

### Border Radius

```jsx
// ❌ Before
<button className="rounded-full">
<div className="rounded-2xl">
<input className="rounded-2xl">
<div className="rounded-lg">

// ✅ After
<button className="rounded-button">
<div className="rounded-card">
<input className="rounded-input">
<div className="rounded-small">
```

### Typography & Colors

```jsx
// ❌ Before (hardcoded colors and typography)
<h1 className="text-3xl font-bold text-gray-900">
<h2 className="text-lg font-semibold text-gray-800">
<p className="text-sm text-gray-700">
<span className="text-xs text-gray-500">
<p className="text-red-600">Error!</p>
<a className="text-primary-600 font-medium">

// ✅ After (semantic)
<h1 className="text-hero font-bold text-primary">
<h2 className="text-subheading font-semibold text-primary">
<p className="text-body text-secondary">
<span className="text-caption text-muted">
<p className="text-body text-error">Error!</p>
<a className="text-body text-link font-medium">
```

### Component Dimensions

```jsx
// ❌ Before
<button className="py-4 px-6">
<input className="py-4 px-5">
<div className="w-20 h-20"> // avatar
<div className="h-48"> // card image

// ✅ After
<button className="h-button-height px-6">
<input className="h-input-height px-5">
<div className="w-avatar h-avatar">
<div className="h-card-image">
```

## Available Design Tokens

After running `npm run generate-colors`, you get these utility classes:

### Spacing

- `px-page-x` / `py-page-y` - Main page padding
- `p-component` - Standard component padding
- `p-compact` - Compact padding
- `space-y-section` - Section spacing

### Border Radius

- `rounded-button` - Full rounded buttons
- `rounded-card` - Card/modal corners
- `rounded-input` - Form input corners
- `rounded-small` - Small element corners

### Text Colors (Semantic)

- `text-primary` - Main headings (gray-900)
- `text-secondary` - Body text (gray-700)
- `text-muted` - Captions, icons (gray-500)
- `text-subtle` - Placeholders (gray-400)
- `text-inverse` - On dark backgrounds (white)
- `text-error` - Error messages (red-600)
- `text-success` - Success messages (emerald-600)
- `text-link` - Links (primary-600)

### Typography Scale

- `text-hero` - Hero headings (3xl)
- `text-heading` - Page headings (2xl)
- `text-subheading` - Section headings (lg)
- `text-body` - Body text (sm)
- `text-caption` - Small text (xs)

### Font Weights

- `font-light` - Light text (300)
- `font-normal` - Normal text (400)
- `font-medium` - Labels (500)
- `font-semibold` - Buttons (600)
- `font-bold` - Headings (700)

### Dimensions

- `h-button-height` - Standard button height
- `h-input-height` - Form input height
- `w-avatar` / `h-avatar` - Profile avatar size
- `h-card-image` - Card image height

## Benefits

1. **Consistency**: All spacing/sizing uses the same values
2. **Easy Updates**: Change one token, update entire app
3. **Semantic**: `px-page-x` is clearer than `px-6`
4. **Design System**: Proper foundation for scaling
5. **No Arbitrary Values**: Clean utility classes, not `px-[1.5rem]`

## Most Common Patterns Found

Based on analysis of your codebase:

### High Priority (use these first)

- `px-6` → `px-page-x` (appears 8+ times)
- `py-8` → `py-page-y`
- `p-4` → `p-component` (appears 10+ times)
- `rounded-full` → `rounded-button` (appears 15+ times)
- `rounded-2xl` → `rounded-card` (appears 8+ times)

### Medium Priority

- `space-y-6` → `space-y-section`
- `p-3` → `p-compact`
- `text-sm` → `text-body`
- `rounded-lg` → `rounded-small`

## Usage with Color Generation

When you run `npm run generate-colors`:

1. Change `BASE_COLOR` for different brand colors
2. All primary colors AND design tokens update together
3. Complete design system in one command! 🚀

## Example Migration

Instead of this mess:

```jsx
<div className="px-6 py-8 bg-white rounded-2xl shadow-lg">
  <h1 className="text-2xl font-bold mb-6">
  <button className="px-6 py-4 bg-primary-500 text-white rounded-full">
</div>
```

Use this clean, semantic version:

```jsx
<div className="px-page-x py-page-y bg-white rounded-card shadow-lg">
  <h1 className="text-heading font-bold mb-section">
  <button className="px-6 h-button-height bg-primary-500 text-white rounded-button">
</div>
```

Much cleaner and more maintainable! ✨
