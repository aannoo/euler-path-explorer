# EULER CSS Documentation

This documentation covers the CSS architecture, utility classes, and best practices for the EULER design system.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Design System](#design-system)
3. [Utility Classes](#utility-classes)
4. [Component Styles](#component-styles)
5. [Performance Optimizations](#performance-optimizations)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)

## Architecture Overview

The EULER CSS is organized into a modular structure:

- **base.css**: Core variables, reset, and foundational styles
- **components.css**: Main component file that imports modular component files
- **utility.css**: Utility class system for consistent styling
- **optimization.css**: Performance optimizations for animations and transitions

Component-specific files are organized by functionality:
- **sidebar.css**: Sidebar and tab panel styles
- **form-elements.css**: Form controls and input styles
- **edge-list.css**: Edge list component styles
- **results-panel.css**: Results display styles

## Design System

The EULER design system is built on geometric shapes with a distinctive style:

### Core Principles

#### Geometric Language
- Sharp corners (0px border-radius)
- Triangular indicators
- Full-width components

#### Feedback & Interaction
- Immediate visual feedback (0s transitions for clicks)
- Subtle hover states (0.1s transitions)
- Active states: 2px downward transform

#### Visual Hierarchy
- Card stack approach
- Left-edge indicators (3px normal, 6px focus/active)
- Consistent shadow depth

### CSS Variables

All design tokens are stored in CSS variables in `base.css`. Key categories include:

#### Colors
```css
--primary-color: #ff5a1f;
--secondary-color: #ff8f29;
--dark-blue: #0F172A;
--blue-grey: #1E293B;
--light-color: #f5f0e6;
```

#### Spacing
```css
--spacing-0: 0;           /* 0px */
--spacing-1: 5px;         /* Very tight spacing */
--spacing-2: 10px;        /* Standard small spacing */
--spacing-3: 15px;        /* Medium spacing */
--spacing-4: 20px;        /* Standard large spacing */
/* Additional spacing variables up to --spacing-8 */
```

#### Typography
```css
--font-size-xs: calc(0.75 * var(--fluid-base-size));
--font-size-sm: calc(0.875 * var(--fluid-base-size));
--font-size-base: var(--fluid-base-size);
--font-size-md: calc(1.125 * var(--fluid-base-size));
/* Additional font size variables */
```

#### Transitions
```css
--transition-fast: 0.1s ease-in-out;      /* Quick transitions for hover */
--transition-normal: 0.0s ease-in-out;    /* No transition (immediate) */
--transition-slow: 0.3s ease-in-out;      /* Slower transitions */
```

## Utility Classes

The utility class system provides reusable styling patterns for consistent component development.

### When to Use Utility Classes

1. **DO USE** utility classes for:
   - Common layout patterns (flex, spacing, alignment)
   - Consistent styling (colors, borders, typography)
   - Responsive behavior (mobile/tablet variations)
   - Interactive states (hover, active)

2. **DON'T USE** utility classes for:
   - Complex component-specific styles
   - Animations that are unique to a component
   - Highly specific layouts that aren't reused

### Layout Utilities

```css
.flex           /* display: flex */
.flex-col       /* flex-direction: column */
.flex-center    /* align and justify center */
.flex-between   /* justify-content: space-between */
.flex-around    /* justify-content: space-around */
.flex-wrap      /* flex-wrap: wrap */
.flex-grow      /* flex-grow: 1 */
.w-100          /* width: 100% */
.h-100          /* height: 100% */
.position-relative
.position-absolute
```

### Spacing Utilities

```css
.m-0, .mt-0, .mb-0, .ml-0, .mr-0  /* margin utilities */
.p-0, .pt-0, .pb-0, .pl-0, .pr-0  /* padding utilities */
.gap-sm, .gap-md, .gap-lg         /* gap utilities for flex containers */
```

### Typography Utilities

```css
.text-uppercase
.text-center, .text-right, .text-left
.font-mono
.font-bold, .font-semibold, .font-normal
.letter-spacing-wide, .letter-spacing-wider
```

### Color Utilities

```css
/* Text colors */
.text-primary, .text-secondary, .text-accent, .text-error, .text-success

/* Background colors */
.bg-dark-1, .bg-dark-2, .bg-dark-3, .bg-dark-4
.bg-primary-light, .bg-primary-medium, .bg-error-light, .bg-success-light
```

### Border Utilities

```css
/* Standard left borders */
.border-left-primary, .border-left-secondary

/* State-based left borders */
.border-left-focus, .border-left-error, .border-left-success

/* Border width and style */
.border-width-normal, .border-width-focus
.border-solid, .border-dashed

/* Interactive borders */
.border-left-interactive, .border-left-active
```

### Display Utilities

```css
.hidden, .visible
.opacity-0, .opacity-50, .opacity-100
.overflow-hidden, .overflow-auto, .overflow-y-auto, .overflow-x-hidden
```

### Interactive State Utilities

```css
.interactive          /* Adds hover effects and cursor pointer */
.interactive-focus    /* Adds focus styling for accessibility */
.cursor-pointer, .disabled
```

### Transition Utilities

```css
.transition-fast, .transition-normal, .transition-slow, .transition-none
```

### Shadow Utilities

```css
.shadow-sm, .shadow-md, .shadow-lg
```

### Z-index Utilities

```css
.z-base, .z-content, .z-ui, .z-dropdown, .z-modal
```

### Geometric Shape Utilities

```css
.triangle-right, .triangle-down
```

### Accessibility Utilities

```css
.visually-hidden, .focus-outline, .focus-within-visible
```

### Responsive Utilities

```css
/* Tablet (max-width: 992px) */
.tablet-only, .desktop-only, .tablet-w-100, .tablet-flex-col

/* Mobile (max-width: 576px) */
.mobile-only, .mobile-hide, .mobile-w-100, .mobile-flex-col, .mobile-text-center
```

## Component Styles

EULER uses a component-based architecture with specific style files for each major UI component.

### Core Components

- **Sidebar**: Tab panels and collapsible navigation
- **Form Elements**: Standardized inputs, buttons, and controls
- **Edge List**: Graph edge management interface
- **Results Panel**: Algorithm output display

### Component Guidelines

1. **Minimal Specificity**: Keep selectors as simple as possible
2. **Single Responsibility**: Each component file handles one UI element
3. **State Management**: Use standard class names for states (.active, .disabled, etc.)
4. **Utility Extension**: Use utility classes to extend component styles

## Performance Optimizations

The `optimization.css` file contains performance-focused enhancements:

### Hardware Acceleration

```css
.hardware-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
```

### Property-Specific Optimizations

```css
.transform-optimized {
  will-change: transform;
}

.opacity-optimized {
  will-change: opacity;
}
```

### Animation Optimizations

- Use transform and opacity for animations instead of properties that trigger layout
- Optimize transitions by specifying exact properties instead of `all`
- Use containment for scrollable elements

## Usage Examples

Here are examples of how to effectively use the EULER design system:

### Button with Utility Classes

HTML:
```html
<button class="border-left-primary text-uppercase font-bold letter-spacing-wide interactive">
  Submit
</button>
```

What this creates:
- Button with a 3px left orange border
- Uppercase bold text with wider letter spacing
- Interactive hover and active states

### Card Component with Utility Classes

HTML:
```html
<div class="border-left-secondary flex-col gap-md bg-dark-3 p-4">
  <h3 class="text-uppercase letter-spacing-wide">Card Title</h3>
  <p class="text-secondary">Card content goes here</p>
  <div class="flex flex-between">
    <button class="interactive">Cancel</button>
    <button class="interactive border-left-primary">Submit</button>
  </div>
</div>
```

What this creates:
- Card with secondary color left border
- Vertical layout with medium spacing between children
- Dark background with padding
- Horizontal button layout with space between

### Form Input with State Changes

HTML:
```html
<div class="position-relative">
  <input 
    class="border-left-primary w-100 font-mono" 
    type="text"
    id="username"
    onfocus="this.classList.replace('border-left-primary', 'border-left-focus')"
    onblur="this.classList.replace('border-left-focus', 'border-left-primary')"
  >
  <span class="text-error hidden" id="error-message">Error message here</span>
</div>
```

What this creates:
- Full-width input with primary left border
- Changes to yellow focus border when focused
- Monospace font for input text
- Hidden error message that can be toggled via JavaScript

### Responsive Layout

HTML:
```html
<div class="flex gap-md tablet-flex-col mobile-w-100">
  <div class="flex-grow border-left-primary">Sidebar</div>
  <div class="flex-grow flex-col gap-sm">Main Content</div>
</div>
```

What this creates:
- Horizontal layout on desktop
- Vertical layout on tablet
- Full-width layout on mobile
- Medium spacing between elements
- Equal width columns that grow to fill space

### Interactive Element with Feedback

HTML:
```html
<div class="border-left-interactive interactive">
  Click me
</div>
```

JavaScript:
```javascript
document.querySelector('.interactive').addEventListener('click', (e) => {
  e.target.classList.remove('border-left-interactive');
  e.target.classList.add('border-left-active', 'bg-primary-light');
});
```

What this creates:
- Element with interactive left border (3px secondary orange)
- Hover effect that widens the border
- When clicked, changes to active state (6px yellow) with light background

### Section Header with Triangle Indicator

HTML:
```html
<h3 class="border-left-secondary text-uppercase letter-spacing-wide triangle-right">
  Section Title
</h3>
```

What this creates:
- Uppercase section header with wider letter spacing
- Secondary left border
- Triangle indicator on the right side

## Best Practices

1. **Combine with component classes** - Use utility classes to extend component styles
2. **Be consistent** - Use the same pattern of utility classes across similar components
3. **Limit dependencies** - Make components independent with utility classes for shared styles
4. **Document usage** - Comment your code to explain utility class usage when not obvious
5. **Avoid transition: all** - Always specify exact properties for transitions
6. **Use hardware acceleration** - For elements with animations or transitions
7. **Keep specificity low** - Avoid deeply nested selectors
8. **Follow border standards** - 3px for normal, 6px for focus/active states
9. **Maintain transition timing** - 0s for active, 0.1s for hover

### When to Create Custom Components

While utility classes are powerful, there are times when creating custom component classes makes more sense:

1. When a pattern is repeated frequently with the same combination of utilities
2. When a component has complex, specific styling needs
3. When a component has multiple states or variations

In these cases, create a component class and use utility classes to extend it:

```css
/* Component CSS file */
.special-card {
  /* Base specific styling */
  border-radius: 4px;
  box-shadow: var(--shadow-lg);
}
```

```html
<!-- HTML usage -->
<div class="special-card border-left-primary flex-col gap-md">
  Content here
</div>
```

### Performance Guidelines

1. **Use will-change sparingly** - Only on elements that actually change frequently
2. **Prefer transform and opacity** - These properties don't trigger layout recalculation
3. **Avoid expensive animations on mobile** - Simplify or disable complex effects
4. **Add containment to scrollable areas** - Helps browser optimize rendering
5. **Be specific with transitions** - Never use `transition: all`

``` 