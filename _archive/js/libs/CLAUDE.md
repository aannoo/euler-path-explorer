# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Libs Module Overview

This directory only keeps local guidance files now. Runtime code should import published packages directly.

### cool-text-fit
- **What**: Text fitting library now installed from npm
- **Used by**: `ui/desktop-resize.js` for responsive text when resizing panels
- **Import**: `import CoolTextFit from 'cool-text-fit'`
- **API**: `new CoolTextFit({...})`, `ctf.fit(element)`, `ctf.disconnectAll()`, `ctf.cleanup()`

### API Reference
```javascript
// Constructor options
new CoolTextFit({
  mode: 'width',           // 'width' | 'balanced' | 'height'
  textBounds: 'line-box',  // 'line-box' | 'ink-box'
  fontSize: { min: 14, max: 200 },
  scaleX: { min: 0.5, max: 2 },
  letterSpacing: { max: 60 },  // Note: only max, no min
  fontWidth: 'auto',       // 'auto' | { min: 100, max: 100 }
  alignment: 'auto',       // 'auto' | 'left' | 'center' | 'right'
  observe: true,           // ResizeObserver + MutationObserver
  debounceMs: 0,
  waitForFonts: false      // false = immediate fit + background refit
});

// Fitting
ctf.fit(element, optionalOverrides);
ctf.disconnect(element);
ctf.disconnectAll();
```

### cool-text-fit.es.js.backup
- Removed after the npm package migration
