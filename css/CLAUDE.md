# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CSS Architecture Overview

The CSS system consists of 19 files totaling ~5,237 lines, organized in a modular architecture with a mobile-first, dark-themed design centered around an orange (#ff5a1f) color scheme.

## CSS Loading Strategy

### HTML Link Order (index.html)
Files are loaded in this specific order via `<link>` tags:
1. base.css (foundation + imports utility.css, optimization.css)
2. layout.css (responsive breakpoints)
3. components.css (imports sidebar, form-elements, edge-list, results-panel)
4. buttons.css
5. branding.css
6. graph-controls.css
7. notifications.css
8. saved-graphs.css
9. custom-icons.css
10. euler-toggles.css
11. loading.css
12. orbital-animation.css

### Import Dependencies
- **base.css** → imports utility.css, optimization.css
- **components.css** → imports sidebar.css, form-elements.css, edge-list.css, results-panel.css

## Critical Breakpoint: 768px

This single breakpoint determines completely different interaction models:

**Desktop (≥769px)**
- Side-by-side layout: 35% content panel | 65% graph panel
- Hover-based interactions
- Desktop-specific controls visible
- No gesture system

**Mobile (≤768px)**
- Layered sliding interface (content slides over graph)
- Canvas-based gesture system
- Touch-optimized controls
- Simplified animations

## Color System

```css
/* Primary Palette - DO NOT CHANGE */
--primary-color: #ff5a1f      /* Orange theme */
--secondary-color: #ff8f29    /* Light orange */
--dark-blue: #0F172A          /* Primary dark */
--blue-grey: #1E293B          /* Secondary dark */
--text-primary: #F8FAFC       /* High contrast white */
--focus-outline-color: #ffdd00 /* Yellow for accessibility */
```

## JavaScript-CSS Integration Points

### Dynamic CSS Variables (Set by JS)
```css
--final-scale           /* Orbital animation expansion scale */
--target-aspect-ratio   /* Container aspect for morphing */
```

### Critical State Classes
- `.graph-loaded-state` - Triggers orbital expansion animation
- `.mobile-split-view` - Mobile gesture intermediate state
- `.mobile-retracted` - Mobile gesture fully retracted
- `.gesture-active` - Active touch feedback
- `.notification-active` - Alert display state

### Data Attributes
- `data-notification-state="showing|hiding"` - Notification animations
- `data-section` - Section navigation targets
- `data-tab` - Tab switching

## Performance Patterns

### Hardware Acceleration
Apply to animated elements:
```css
.hardware-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
}
```

### Animation Rules
- Only animate `transform` and `opacity` properties
- Never animate layout-triggering properties (width, height, padding)
- Use CSS containment for complex components: `contain: content`

## File-Specific Guidelines

### layout.css (758 lines) - LARGEST FILE
- Contains ALL responsive breakpoint logic
- Desktop layout starts at line 24
- Mobile layout starts at line 353
- Gesture feedback styling at lines 322-350

### saved-graphs.css (470 lines)
- Handles graph card UI, expandable actions, save forms
- Triangle indicators use CSS borders technique
- Example vs user graph distinction via classes

### orbital-animation.css (315 lines)
- Multi-stage animation sequences
- Initial circle: 300px fixed size
- Expansion uses dynamic CSS variables from JavaScript
- Animation sequence: entrance → morph → scale → fade

### optimization.css (171 lines)
- Performance-specific rules only
- Hardware acceleration helpers
- Transition optimizations
- Selector efficiency guidelines

## Common CSS Tasks

### Adding New Component Styles
1. Determine if it's a component, layout, or utility style
2. Add to appropriate existing file or create new component file
3. If creating new file, add `<link>` tag to index.html in correct order
4. Use existing CSS variables from base.css

### Modifying Responsive Behavior
- All breakpoint logic is in layout.css
- Search for `@media (min-width: 769px)` for desktop
- Search for `@media (max-width: 768px)` for mobile
- Test both mobile gesture states and desktop resize

### Working with Animations
- Define in orbital-animation.css or component file
- Use only transform/opacity for performance
- Add hardware acceleration class if needed
- Test on mobile devices for performance

## File Notes

- **layout.css** - 758 lines, contains all responsive logic
- **Backup files** - layout.css.backup and layout_temp.css exist
- **saved-graphs.css** - Handles UI and logic together
- **loading.css** - Small file with 40 lines

## Design System Details

### Spacing System Values
```css
--spacing-1: 0.25rem;    /* 4px */
--spacing-2: 0.5rem;     /* 8px */
--spacing-3: 0.75rem;    /* 12px */
--spacing-4: 1rem;       /* 16px */
--spacing-5: 1.25rem;    /* 20px */
--spacing-6: 1.5rem;     /* 24px */
```

### Typography Scale
```css
--font-size-xs: 0.75rem;   /* 12px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-base: 1rem;    /* 16px */
--font-size-lg: 1.125rem;  /* 18px */
--font-size-xl: 1.25rem;   /* 20px */
```

### Border System
```css
--border-radius: 8px;
--border-radius-sm: 4px;
--border-radius-lg: 12px;
--section-border-width: 3px;
```

## CSS Spacing Convention

Per base.css guidelines (lines 57-76):
- **Use PADDING for**: Internal component spacing, consistent heights, container spacing
- **Use MARGIN for**: Between components, position adjustment, vertical rhythm
- **Rules**: Prefer padding-bottom over margin-bottom, use var(--spacing-X) variables

## Testing Considerations

### Mobile Gesture States
Test three positions:
1. Normal (content covers graph)
2. Split (~50% retracted)
3. Retracted (graph fully visible)

### Orbital Animation
1. Page load sequence
2. First graph calculation trigger
3. Mobile vs desktop behavior

### Dark Mode
- Application is dark-only
- No light mode support
- Ensure contrast ratios meet WCAG AA standards

## Component Patterns

### State Management Pattern
```css
.component {
  border-left: var(--section-border-width) solid var(--border-primary);
  transition: border-left-color 0.2s ease;
}

.component.active {
  border-left-color: var(--focus-outline-color);
  border-left-width: calc(var(--section-border-width) * 2);
}
```

### Interactive Elements Pattern
```css
.interactive {
  transition: all 0.2s ease;
  cursor: pointer;
}

.interactive:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
```

## Animation Flow Details

1. **Page Load**: Simple loader → orbital animation shows (800ms delay)
2. **Graph Calculation**: `graph-loaded-state` applied → orbital expansion → background visible
3. **Mobile**: Orbital hidden, background immediately visible

### Key Animation Components
```
graph-layer (container)
├── #cy (sigma graph visualization)
├── graph-container (background + orbital)
│   ├── euler-background (subtle 0.05 opacity)
│   └── orbital-welcome (animation system)
└── desktop-graph-controls (bottom-right controls)
```

## Accessibility Requirements

1. Maintain color contrast ratios (WCAG AA)
2. Use semantic HTML structures
3. Provide focus indicators (--focus-outline-color: #ffdd00)
4. Support keyboard navigation
5. Test with screen readers