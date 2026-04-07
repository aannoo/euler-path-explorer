/**
 * Mobile UI Module
 * Mobile interface, canvas gestures, and touch handling
 * Split from init.js for better maintainability
 */

import { $, $$ } from '../utils/dom.js';
import { on } from '../utils/events.js';
import { getState, setState } from '../core/state.js';
import { CanvasGestureController } from '../utils/canvas-gesture.js';

// Module state
let contentLayer = null;
let graphViewTab = null;
let graphControls = null;
let canvasGesture = null;

/**
 * Initialize mobile canvas gesture interface
 * @returns {Function} Cleanup function
 */
export function initializeMobileInterface() {
  contentLayer = $('#content-layer');
  graphViewTab = $('#graph-view-tab');
  graphControls = $('#graph-controls');

  if (!contentLayer) {
    return () => {};
  }

  const isDesktop = window.innerWidth > 768;

  if (isDesktop) {
    setState('ui.contentMode', 'desktop');
    return () => {};
  }

  // Initialize canvas gesture controller for mobile
  canvasGesture = new CanvasGestureController({
    contentElement: contentLayer,
    debug: false,
    onProgressChange: (progress, translateY) => {
      updateUIForProgress(progress);
    },
    onModeChange: (mode, progress) => {
      setState('ui.contentMode', mode);
      updateTabForMode(mode);
      updateGraphControlsForMode(mode);
    }
  });

  setupMobileSupport();
  setState('ui.contentMode', 'normal');

  return () => {
    if (canvasGesture && canvasGesture.cleanup) {
      canvasGesture.cleanup();
    }
    canvasGesture = null;
  };
}

/**
 * Set up mobile-specific support
 */
function setupMobileSupport() {
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    const mobileSimpleControls = $('.mobile-simple-controls');
    if (mobileSimpleControls) {
      mobileSimpleControls.style.display = 'block';
    }

    setupMobileFormSync();
    setupTouchEnhancements();
  }
}

/**
 * Sync mobile form inputs with main form
 */
function setupMobileFormSync() {
  const mobileDirected = $('#mobile-directed');
  const mobileWeighted = $('#mobile-weighted');
  const directedInput = $('#directed');
  const weightedInput = $('#weighted');

  if (mobileDirected && directedInput) {
    on(mobileDirected, 'change', () => {
      directedInput.value = mobileDirected.checked ? 'true' : 'false';
      setState('graph.directed', mobileDirected.checked);
    });
  }

  if (mobileWeighted && weightedInput) {
    on(mobileWeighted, 'change', () => {
      weightedInput.value = mobileWeighted.checked ? 'true' : 'false';
      setState('graph.weighted', mobileWeighted.checked);
    });
  }
}

/**
 * Set up touch-friendly enhancements
 */
function setupTouchEnhancements() {
  if (!contentLayer) return;

  contentLayer.style.webkitOverflowScrolling = 'touch';

  const controls = $$('.section-header, .graph-view-tab, .graph-control-btn');
  controls.forEach(control => {
    control.style.touchAction = 'manipulation';
  });
}

/**
 * Update UI based on gesture progress
 * @param {number} progress - Progress value 0-1
 */
function updateUIForProgress(progress) {
  // Progress-based UI updates if needed
}

/**
 * Update tab text based on mode
 * @param {string} mode - Current mode
 */
function updateTabForMode(mode) {
  if (!graphViewTab) return;

  if (mode === 'retracted') {
    graphViewTab.innerHTML = '<i class="fas fa-arrow-down"></i> CONTENT VIEW <i class="fas fa-arrow-down"></i>';
  } else {
    graphViewTab.innerHTML = '<i class="fas fa-arrow-up"></i> GRAPH VIEW <i class="fas fa-arrow-up"></i>';
  }
}

/**
 * Update graph controls visibility based on mode
 * @param {string} mode - Current mode
 */
function updateGraphControlsForMode(mode) {
  if (!graphControls) return;

  if (mode === 'retracted') {
    graphControls.style.display = 'flex';
  } else {
    graphControls.style.display = 'none';
  }
}

/**
 * Set content layer position programmatically
 * @param {string} mode - 'normal', 'split', or 'retracted'
 */
export function setContentMode(mode) {
  if (canvasGesture) {
    switch (mode) {
      case 'normal':
        canvasGesture.setProgress(0);
        break;
      case 'split':
        canvasGesture.setProgress(0.5);
        break;
      case 'retracted':
        canvasGesture.setProgress(canvasGesture.maxProgress || 0.85);
        break;
    }
  } else if (contentLayer) {
    switch (mode) {
      case 'normal':
        contentLayer.style.transform = 'translateY(0%)';
        break;
      case 'split':
        contentLayer.style.transform = 'translateY(-50%)';
        break;
      case 'retracted':
        contentLayer.style.transform = 'translateY(-85%)';
        break;
    }
  }
}

/**
 * Get current content mode
 * @returns {string} Current mode
 */
export function getContentMode() {
  return getState('ui.contentMode');
}

/**
 * Get canvas gesture controller instance
 * @returns {CanvasGestureController|null}
 */
export function getCanvasGesture() {
  return canvasGesture;
}

/**
 * Check if mobile mode is active
 * @returns {boolean}
 */
export function isMobileMode() {
  return window.innerWidth <= 768;
}

// Debug functions
if (typeof window !== 'undefined') {
  window.debugCanvas = function() {
    if (canvasGesture) {
    }
  };

  window.forceRetract = function() {
    if (canvasGesture) {
      canvasGesture.setProgress(0.85);
    }
  };

  window.forceNormal = function() {
    if (canvasGesture) {
      canvasGesture.setProgress(0);
    }
  };
}
