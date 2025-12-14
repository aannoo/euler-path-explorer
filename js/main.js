/**
 * EULER - Main Application Entry Point
 */
import { $, $$ } from './utils/dom.js';
import { on, setupEvents } from './utils/events.js';
import { getState, setState, subscribe } from './core/state.js';
import { initializeUI, showNotification } from './ui/init.js';
import { initializeSigmaGraph } from './graph/sigma-controller.js';
import * as SigmaAdapter from './graph/sigma-adapter.js';
import { initDesktopResize, cleanupDesktopResize } from './ui/desktop-resize.js';

// Log to confirm ES modules are working

// Track if this is the first graph render
let isFirstGraphRender = true;

// Orbital Welcome State Management
const handleOrbitalWelcome = () => {
  const orbitalWelcome = $('#orbital-welcome');
  
  if (!orbitalWelcome) {
    return null;
  }

  // Dynamic calculation values
  let calculatedValues = {};

  // Calculate dynamic values for the orbital animation
  const calculateDynamicValues = () => {
    const graphContainer = $('.graph-container');
    if (!graphContainer) {
      return;
    }

    // Ensure container has layout before measuring
    if (graphContainer.offsetWidth === 0 || graphContainer.offsetHeight === 0) {
      setTimeout(calculateDynamicValues, 50);
      return;
    }

    // Get container dimensions
    const containerRect = graphContainer.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // Calculate target aspect ratio for the container
    const targetAspectRatio = containerWidth / containerHeight;
    
    // The center circle is fixed at 300px (always perfectly round)
    const centerCircleSize = 300;
    
    // Target size to exactly fill container (use smaller dimension to fit)
    const targetSize = Math.min(containerWidth, containerHeight);
    
    // Calculate scale to make center circle exactly match container
    const finalScale = targetSize / centerCircleSize;
    
    // Store values
    calculatedValues = {
      containerWidth,
      containerHeight,
      targetAspectRatio,
      centerCircleSize,
      targetSize,
      finalScale
    };
  };

  // Create container border elements
  const createContainerBorder = () => {
    const graphContainer = $('.graph-container');
    if (!graphContainer) return null;

    // Create border elements
    const borders = {
      top: document.createElement('div'),
      bottom: document.createElement('div'),
      left: document.createElement('div'),
      right: document.createElement('div')
    };

    // Style all borders
    Object.values(borders).forEach(border => {
      border.className = 'container-border';
      border.style.cssText = `
        position: absolute;
        background: var(--primary-color);
        opacity: 0;
        z-index: 60;
        pointer-events: none;
        transition: opacity 0.8s ease;
      `;
      graphContainer.appendChild(border);
    });

    // Position specific borders
    borders.top.style.cssText += `top: 0; left: 0; right: 0; height: 12px;`;
    borders.bottom.style.cssText += `bottom: 0; left: 0; right: 0; height: 12px;`;
    borders.left.style.cssText += `top: 0; bottom: 0; left: 0; width: 12px;`;
    borders.right.style.cssText += `top: 0; bottom: 0; right: 0; width: 12px;`;

    return borders;
  };

  // Create the borders
  const containerBorders = createContainerBorder();

  // Function to show borders
  const showContainerBorders = () => {
    if (containerBorders) {
      Object.values(containerBorders).forEach(border => {
        border.style.opacity = '1';
      });
    }
  };

  // Function to hide borders
  const hideContainerBorders = () => {
    if (containerBorders) {
      Object.values(containerBorders).forEach(border => {
        border.style.opacity = '0';
      });
    }
  };

  // Function to remove borders
  const removeContainerBorders = () => {
    if (containerBorders) {
      Object.values(containerBorders).forEach(border => {
        border.remove();
      });
    }
  };

  // Subscribe to state changes to trigger expansion
  const calculationUnsubscribe = subscribe('ui.calculationStarted', (calculationStarted) => {
    
    if (isFirstGraphRender && calculationStarted) {
      triggerOrbitalExpansion();
    }
  });
  
  const savedGraphUnsubscribe = subscribe('ui.savedGraphLoaded', (savedGraphLoaded) => {
    
    if (isFirstGraphRender && savedGraphLoaded) {
      triggerOrbitalExpansion();
    }
  });

  // Function to trigger the orbital expansion animation
  const triggerOrbitalExpansion = () => {
    
    if (!orbitalWelcome) {
      return;
    }
    
    // Calculate dynamic values for the animation
    calculateDynamicValues();
    
    // Set the CSS properties for the expansion animation
    if (calculatedValues.finalScale && calculatedValues.targetAspectRatio) {
      document.documentElement.style.setProperty('--final-scale', calculatedValues.finalScale);
      document.documentElement.style.setProperty('--target-aspect-ratio', calculatedValues.targetAspectRatio);
    }
    
    // Start the orbital expansion animation
    orbitalWelcome.classList.add('graph-loaded');
    
    // Also add class to graph-layer for CSS targeting
    const graphLayer = document.getElementById('graph-layer');
    if (graphLayer) {
      graphLayer.classList.add('graph-loaded-state');
    }
    
    // Show container borders after morph completes (0.8s delay)
    setTimeout(() => {
      showContainerBorders();
    }, 800);
    
    // Hide borders and cleanup after complete animation (3s total)
    setTimeout(() => {
      hideContainerBorders();
      setTimeout(() => {
        orbitalWelcome.classList.add('hidden');
        removeContainerBorders();
      }, 800); // Wait for fade out
    }, 3000);
    
    isFirstGraphRender = false;
  };

  // Initial calculation on load
  setTimeout(calculateDynamicValues, 100);

  // NOTE: Removed window.triggerOrbitalAnimation - use setState('ui.calculationStarted', true) instead
  // The subscription above handles the animation trigger via state.js pub/sub

  // Return cleanup function
  return () => {
    calculationUnsubscribe();
    savedGraphUnsubscribe();
    removeContainerBorders();
  };
};

// Make Sigma adapter available globally for components that need it
window.SigmaAdapter = SigmaAdapter;

// Store cleanup functions for proper application teardown
let cleanupFunctions = [];
let stateSubscriptions = [];

/**
 * Clean up all application resources to prevent memory leaks
 */
function cleanupApplication() {
  
  // Execute all registered cleanup functions
  cleanupFunctions.forEach(cleanup => {
    if (typeof cleanup === 'function') {
      try {
        cleanup();
      } catch (error) {
        // Cleanup error - continue with remaining cleanups
      }
    }
  });
  
  // Clear all state subscriptions
  stateSubscriptions.forEach(unsubscribe => {
    if (typeof unsubscribe === 'function') {
      try {
        unsubscribe();
      } catch (error) {
        // Unsubscribe error - continue with remaining unsubscriptions
      }
    }
  });
  
  // Clear timeout for notification banner
  if (window._notificationTimeout) {
    clearTimeout(window._notificationTimeout);
    delete window._notificationTimeout;
  }
  
  // Destroy Sigma if it exists
  if (window.SigmaAdapter && typeof window.SigmaAdapter.destroySigma === 'function') {
    window.SigmaAdapter.destroySigma();
  }
  
  // Clear references
  cleanupFunctions = [];
  stateSubscriptions = [];
  window.SigmaAdapter = null;
  window.GraphController = null;
}

// Make cleanup function available globally
window.cleanupEULER = cleanupApplication;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  
  // Implement loading sequence: simple loader → orbital → graph
  setTimeout(() => {
    // Hide simple loader
    const pageLoader = document.getElementById('page-loader');
    if (pageLoader) {
      pageLoader.classList.add('fade-out');
    }
    
    // Show orbital animation
    const orbital = document.getElementById('orbital-welcome');
    if (orbital) {
      orbital.classList.remove('hidden');
      orbital.classList.add('show');
    }
  }, 200); // Small delay to ensure everything is loaded
  
  // Check if orbital element exists at startup
  const orbitalCheck = document.getElementById('orbital-welcome');
  
  // Initialize orbital welcome state
  const orbitalCleanup = handleOrbitalWelcome();
  if (orbitalCleanup) {
    stateSubscriptions.push(orbitalCleanup);
  }
  
  // Initialize graph system with Sigma.js FIRST
  // This sets up the listeners for graph control events
  const graphController = initializeSigmaGraph('#cy');
  if (graphController && typeof graphController.cleanup === 'function') {
    cleanupFunctions.push(graphController.cleanup);
  }
  
  // Initialize UI components AFTER graph listeners are set up
  // This ensures desktop controls can communicate with the graph
  const uiCleanup = initializeUI();
  if (typeof uiCleanup === 'function') {
    cleanupFunctions.push(uiCleanup);
  }
  
  // Initialize desktop resize functionality (desktop only)
  initDesktopResize();
  cleanupFunctions.push(cleanupDesktopResize);
  
  // Display initialization message
  showNotification('Application initialized successfully', 'success');
  
  // Test DOM selectors
  const eulerLogo = $('#euler-logo');
  
  // Test multiple selectors
  const tabButtons = $$('.sidebar-tab');
  
  // Subscribe to state changes
  const unsubscribeTab = subscribe('ui.activeTab', (activeTab) => {
  });
  stateSubscriptions.push(unsubscribeTab);
  
  // Set up event handlers for sidebar tabs
  const tabHandlers = [];
  tabButtons.forEach(tab => {
    const handler = () => {
      const tabId = tab.getAttribute('data-tab');
      
      // Update state
      setState('ui.activeTab', tabId);
      
      // Update UI (in a real implementation, this would be handled by a component)
      tabButtons.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update tab panes
      $$('.tab-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === `${tabId}-tab`);
      });
    };
    
    on(tab, 'click', handler);
    tabHandlers.push({ element: tab, event: 'click', handler });
  });
  
  // Add cleanup for tab handlers
  cleanupFunctions.push(() => {
    tabHandlers.forEach(({ element, event, handler }) => {
      if (element && element.removeEventListener) {
        element.removeEventListener(event, handler);
      }
    });
  });
  
  // Subscribe to sidebar state changes
  const unsubscribeSidebar = subscribe('ui.sidebarExpanded', (expanded) => {
  });
  stateSubscriptions.push(unsubscribeSidebar);
  
  // Make graph modules available globally for the UI controls
  window.GraphController = graphController;
  
  // Add unload event listener to clean up resources when page is closed
  window.addEventListener('beforeunload', cleanupApplication);
}); 