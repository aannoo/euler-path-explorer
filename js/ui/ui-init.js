/**
 * UI Initialization Module
 * Main orchestration for UI initialization
 * Split from init.js for better maintainability
 *
 * Migration from init.js (1,045 lines) to modular structure:
 * - notifications.js (~120 lines) - Notification system
 * - mobile-ui.js (~220 lines) - Mobile interface and gestures
 * - desktop-ui.js (~200 lines) - Desktop controls and resize
 * - ui-init.js (~150 lines) - Main orchestration (this file)
 */

import { $, $$ } from '../utils/dom.js';
import { on } from '../utils/events.js';
import { setState, subscribe } from '../core/state.js';

// Import modular components
import { showNotification, initializeNotifications } from './notifications.js';
import { initializeMobileInterface, setContentMode, getContentMode } from './mobile-ui.js';
import { initializeDesktopInterface, setupSectionNavigation, navigateToSection } from './desktop-ui.js';
import { createExplanationToggle } from './components.js';
import { initializeSavedGraphs } from './saved-graphs.js';
import { initializeEulerToggles } from './euler-toggles.js';
import { initVisualEditor } from './visual-editor.js';

/**
 * Initialize the entire UI
 * @returns {Function} Cleanup function
 */
export function initializeUI() {
  const cleanupFunctions = [];

  // Initialize section navigation
  setupSectionNavigation();

  // Initialize mobile interface
  const mobileCleanup = initializeMobileInterface();
  cleanupFunctions.push(mobileCleanup);

  // Initialize desktop interface
  const desktopCleanup = initializeDesktopInterface();
  cleanupFunctions.push(desktopCleanup);

  // Initialize notification system
  const notificationCleanup = initializeNotifications();
  cleanupFunctions.push(notificationCleanup);

  // Set up explanation toggle in results panel
  const explanationToggle = createExplanationToggle(
    '#show-more',
    '#explanation'
  );
  if (explanationToggle) {
    cleanupFunctions.push(explanationToggle);
  }

  // Set up EULER toggle switches
  const eulerTogglesCleanup = initializeEulerToggles();
  if (eulerTogglesCleanup) {
    cleanupFunctions.push(eulerTogglesCleanup);
  }

  // Set up editor mode switch
  const editorModeCleanup = setupEditorModeSwitch();
  if (editorModeCleanup) {
    cleanupFunctions.push(editorModeCleanup);
  }

  // Initialize saved graphs
  initializeSavedGraphs();

  // Initialize visual editor
  initVisualEditor();

  // Return combined cleanup function
  return () => {
    cleanupFunctions.forEach(cleanup => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    });
  };
}

/**
 * Set up editor mode switch (text/visual)
 * @returns {Function} Cleanup function
 */
function setupEditorModeSwitch() {
  const editorModes = $$('.mode-btn');
  const eventIds = [];

  editorModes.forEach(btn => {
    const id = on(btn, 'click', () => {
      const mode = btn.getAttribute('data-mode');

      // Update button states
      editorModes.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update sliding background
      const editorModeSwitch = $('#editor-mode-container');
      if (editorModeSwitch) {
        if (mode === 'visual') {
          editorModeSwitch.classList.add('visual-active');
        } else {
          editorModeSwitch.classList.remove('visual-active');
        }
      }

      // Update editor panes
      const textMode = $('#text-editor-mode');
      const visualMode = $('#visual-editor-mode');

      if (mode === 'text') {
        textMode?.classList.add('active');
        visualMode?.classList.remove('active');
      } else {
        textMode?.classList.remove('active');
        visualMode?.classList.add('active');
      }

      setState('ui.editorMode', mode);
    });

    eventIds.push(id);
  });

  return () => {
    // Event cleanup handled by events.js
  };
}

// Re-export public functions for backward compatibility
export { showNotification } from './notifications.js';
export { setContentMode, getContentMode } from './mobile-ui.js';
export { navigateToSection } from './desktop-ui.js';

// Expose on window for global access (backward compatibility)
if (typeof window !== 'undefined') {
  window.showNotification = showNotification;
  window.navigateToSection = navigateToSection;
  window.setContentMode = setContentMode;
}
