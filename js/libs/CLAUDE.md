# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Libs Module Overview

Contains symlinked local development libraries.

### cool-text-fit.es.js
- **What**: Text fitting library symlinked from `~/Dev/ctf/cool-text-fit/`
- **Used by**: `ui/desktop-resize.js` for responsive text when resizing panels
- **Import**: `import CoolTextFit from '../libs/cool-text-fit.es.js'`
- **Source docs**: See `~/Dev/ctf/cool-text-fit/CLAUDE.md` for full architecture

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
- Original version backup (644 lines)