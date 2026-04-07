/**
 * UI Initialization Module - Canvas Gesture Interface
 * Uses canvas overlay to bypass DOM event issues
 */
import { $, $$ } from '../utils/dom.js';
import { on } from '../utils/events.js';
import { getState, setState, subscribe } from '../core/state.js';
import { CanvasGestureController } from '../utils/canvas-gesture.js';
import { 
  createToggleButton,
  createPropertyToggle,
  createExplanationToggle
} from './components.js';
import { initializeSavedGraphs } from './saved-graphs.js';
import { initializeEulerToggles } from './euler-toggles.js';
import { initVisualEditor } from './visual-editor.js';

// ========== PERFORMANCE: RAF THROTTLE UTILITY ==========

// PERFORMANCE FIX: RAF-based throttle for high-frequency events like resize
let resizeRAFId = null;
function throttledResize(callback) {
  return function(...args) {
    if (resizeRAFId) return; // Skip if already scheduled
    resizeRAFId = requestAnimationFrame(() => {
      callback.apply(this, args);
      resizeRAFId = null;
    });
  };
}

// ========== CANVAS GESTURE INTERFACE MANAGEMENT ==========

let contentLayer;
let graphViewTab;
let graphControls;
let canvasGesture;

// Initialize the canvas gesture interface
function initializeCanvasGestureInterface() {
  
  contentLayer = $('#content-layer');
  graphViewTab = $('#graph-view-tab');
  graphControls = $('#graph-controls');
  
  
  if (!contentLayer) {
    return;
  }
  
  // Always set up these components
  setupSectionNavigation();
  setupGraphModeControls();
  setupDesktopControls();
  
  // Check if we're on desktop or mobile
  const isDesktop = window.innerWidth > 768;
  
  if (isDesktop) {
    // Desktop mode: disable canvas gesture, use side-by-side layout
    setState('ui.contentMode', 'desktop');
  } else {
    // Mobile mode: initialize canvas gesture controller
    
    canvasGesture = new CanvasGestureController({
      contentElement: contentLayer,
      debug: false, // Disable debugging for clean production experience
      onProgressChange: (progress, translateY) => {
        if (canvasGesture && canvasGesture.enableDebug) {
        }
        
        // Update UI elements based on position
        updateUIForProgress(progress);
      },
      onModeChange: (mode, progress) => {
        if (canvasGesture && canvasGesture.enableDebug) {
        }
        
        // Update state
        setState('ui.contentMode', mode);
        
        // Apply CSS classes to content-layer element
        const contentLayer = $('#content-layer');
        if (contentLayer) {
          contentLayer.classList.remove('retracted', 'split-view');
          if (mode === 'retracted') {
            contentLayer.classList.add('retracted');
          } else if (mode === 'split') {
            contentLayer.classList.add('split-view');
          }
        }
        
        // Update tab text and graph controls
        updateTabForMode(mode);
        updateGraphControlsForMode(mode);
      }
    });
    
    // Set up mobile support
    setupMobileSupport();
    setState('ui.contentMode', 'normal');
  }
}

// ========== SECTION NAVIGATION ==========

function setupSectionNavigation() {
  // Set up sticky header navigation
  const sectionHeaders = $$('.section-header[data-section]');
  
  sectionHeaders.forEach(header => {
    on(header, 'click', () => {
      const section = header.getAttribute('data-section');
      scrollToSection(section);
    });

    on(header, 'keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        header.click();
      }
    });
  });
}

function scrollToSection(sectionId) {
  const section = $(`#${sectionId}-section`);
  if (section) {
    section.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// ========== GRAPH VIEW TAB HANDLING ==========

function setupGraphViewTabHandlers() {
  
  if (!graphViewTab) {
    return;
  }
  
  // OLD DOM DRAG SYSTEM DISABLED - Canvas gesture handles all gestures now
  
  // Keep only click for tap-to-toggle as fallback
  on(graphViewTab, 'click', (e) => {
    
    // Only handle if canvas gesture is not active
    if (!canvasGesture) {
      e.preventDefault();
      e.stopPropagation();
      toggleContentLayer();
    } else {
    }
  });

  on(graphViewTab, 'keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      graphViewTab.click();
    }
  });
  
}

function setupGraphViewTab() {
  
  if (!graphViewTab) {
    return;
  }
  
  
  // Set up the event handlers
  setupGraphViewTabHandlers();
  
  // OLD DOM DRAG SYSTEM DISABLED - Canvas gesture handles all interactions
  
  // Debug touch listener removed - canvas gesture handles all interactions
  
}

function startDrag(e) {
  // OLD DOM DRAG SYSTEM DISABLED - Canvas gesture system handles all interactions
  return;
}

function drag(e) {
  // OLD DOM DRAG SYSTEM DISABLED - Canvas gesture system handles all interactions
  return;
}

function endDrag(e) {
  // OLD DOM DRAG SYSTEM DISABLED - Canvas gesture system handles all interactions
  return;
}

function resetDragState() {
  
  // Clear drag classes
  contentLayer.classList.remove('dragging');
  graphViewTab.classList.remove('dragging');
  
  // Reset drag variables (but don't reset dragCooldown here - let it expire naturally)
  startY = 0;
  currentY = 0;
  isDragging = false;
  
  // Remove debug indicator if it exists
  const debugDiv = document.getElementById('drag-debug');
  if (debugDiv) {
    debugDiv.remove();
  }
}

function getCurrentTransform() {
  const transform = contentLayer.style.transform;
  const match = transform.match(/translateY\((-?\d+(?:\.\d+)?)%\)/);
  return match ? parseFloat(match[1]) : 0;
}

function toggleContentLayer() {
  const currentMode = getState('ui.contentMode');
  
  switch (currentMode) {
    case 'normal':
      setContentPosition(-91); // Less retraction to avoid jarring jump
      break;
    case 'split':
      setContentPosition(-91); // Less retraction to avoid jarring jump
      break;
    case 'retracted':
      setContentPosition(0); // Return to normal
      break;
    default:
      setContentPosition(-91);
  }
}

function setContentPosition(position) {
  
  // Add stack trace to see what's calling this
  if (position === -50) {
  }
  
  if (!contentLayer) {
    return;
  }
  
  contentLayer.classList.remove('retracted', 'split-view');
  
  // Remove body classes for mobile states
  document.body.classList.remove('mobile-split-view', 'mobile-retracted');
  
  contentLayer.style.transform = `translateY(${position}%)`;
  
  // Set content mode and classes based on position
  if (position === 0) {
    setState('ui.contentMode', 'normal');
  } else if (position === -50) {
    contentLayer.classList.add('split-view');
    document.body.classList.add('mobile-split-view');
    setState('ui.contentMode', 'split');
  } else if (position <= -75) {
    contentLayer.classList.add('retracted');
    document.body.classList.add('mobile-retracted');
    setState('ui.contentMode', 'retracted');
  }
  
  updateUIForPosition(position);
  
}

function updateUIForPosition(position) {
  
  // Update graph info strip
  const graphInfoStrip = document.getElementById('graph-info-strip');
  if (graphInfoStrip) {
    if (position <= -75) {
      // Show info strip in graph mode
      graphInfoStrip.classList.add('active');
    } else {
      // Hide info strip in normal mode
      graphInfoStrip.classList.remove('active');
    }
  } else {
  }
  
  // Update graph view tab - keep it natural, don't jump to fixed position
  if (position <= -75) {
    // In graph mode but keep tab natural - just change the text
    if (graphViewTab) {
      graphViewTab.innerHTML = '<i class="fas fa-arrow-down"></i> CONTENT VIEW <i class="fas fa-arrow-down"></i>';
    }
    
    // Show graph controls
    if (graphControls) {
      graphControls.style.display = 'flex';
    }
  } else {
    if (graphViewTab) {
      graphViewTab.innerHTML = '<i class="fas fa-arrow-up"></i> GRAPH VIEW <i class="fas fa-arrow-up"></i>';
    }
    
    // Hide graph controls
    if (graphControls) {
      graphControls.style.display = 'none';
    }
  }
  
}

function updateGraphInfoStrip() {
  
  // Get current graph data from edge input
  const edgeInput = document.getElementById('edges');
  if (!edgeInput) return;
  
  const edgeText = edgeInput.value.trim();
  const edges = edgeText.match(/\[([^\]]+)\]/g) || [];
  const nodes = new Set();
  const edgeList = [];
  
  // Parse edges and collect nodes
  edges.forEach(edge => {
    const content = edge.slice(1, -1); // Remove brackets
    const parts = content.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      const from = parts[0];
      const to = parts[1];
      nodes.add(from);
      nodes.add(to);
      edgeList.push([from, to]);
    }
  });
  
  const nodeCount = nodes.size;
  const edgeCount = edges.length;
  
  // Update DOM elements
  const nodeCountEl = document.getElementById('node-count');
  const edgeCountEl = document.getElementById('edge-count');
  const graphStats = document.getElementById('graph-stats');
  const graphMathNotation = document.getElementById('graph-math-notation');
  const vertexSet = document.getElementById('vertex-set');
  const edgeSet = document.getElementById('edge-set');
  
  if (nodeCountEl) nodeCountEl.textContent = nodeCount;
  if (edgeCountEl) edgeCountEl.textContent = edgeCount;
  
  // Decide between simple stats and mathematical notation
  const useSimpleStats = nodeCount > 6 || edgeCount > 8;
  
  if (useSimpleStats) {
    // Show simple stats for larger graphs
    if (graphStats) graphStats.style.display = 'block';
    if (graphMathNotation) graphMathNotation.style.display = 'none';
  } else {
    // Show mathematical notation for small graphs
    if (graphStats) graphStats.style.display = 'none';
    if (graphMathNotation) graphMathNotation.style.display = 'flex';
    
    // Generate mathematical notation
    if (vertexSet && edgeSet) {
      // Create vertex set notation
      const vertices = Array.from(nodes).sort();
      const vertexNotation = vertices.map((v, i) => 
        vertices.length <= 3 ? `v<sub>${i+1}</sub>` : v
      ).join(', ');
      vertexSet.innerHTML = vertexNotation;
      
      // Create edge set notation  
      const edgeNotation = edgeList.slice(0, 6).map(([from, to]) => {
        // For small graphs, use vertex subscripts
        if (vertices.length <= 3) {
          const fromIndex = vertices.indexOf(from) + 1;
          const toIndex = vertices.indexOf(to) + 1;
          return `v<sub>${fromIndex}</sub>v<sub>${toIndex}</sub>`;
        } else {
          return `${from}${to}`;
        }
      }).join(', ');
      
      // Add ellipsis if too many edges
      const finalEdgeNotation = edgeList.length > 6 ? edgeNotation + ', ...' : edgeNotation;
      edgeSet.innerHTML = finalEdgeNotation;
    }
  }
  
}

// Subscribe to edge input changes to update graph info strip
// Uses state.js pub/sub instead of window global
const edgeInputChangeUnsubscribe = subscribe('ui.edgeInputChanged', () => {
  updateGraphInfoStrip();
});

// ========== GRAPH MODE CONTROLS ==========

function setupGraphModeControls() {
  // Graph control buttons (mobile)
  const zoomInBtn = $('#graph-zoom-in');
  const zoomOutBtn = $('#graph-zoom-out');
  const fitBtn = $('#graph-fit');
  const layoutBtn = $('#graph-layout-circle');
  const animateBtn = $('#graph-animate');
  const exportBtn = $('#graph-export');
  
  if (zoomInBtn) on(zoomInBtn, 'click', () => handleGraphControl('zoom-in'));
  if (zoomOutBtn) on(zoomOutBtn, 'click', () => handleGraphControl('zoom-out'));
  if (fitBtn) on(fitBtn, 'click', () => handleGraphControl('fit'));
  if (layoutBtn) on(layoutBtn, 'click', () => handleGraphControl('layout-circle'));
  if (animateBtn) on(animateBtn, 'click', () => handleGraphControl('animate'));
  if (exportBtn) on(exportBtn, 'click', () => handleGraphControl('export'));
}

function setupDesktopControls() {
  // Desktop graph control buttons
  const desktopZoomInBtn = $('#desktop-zoom-in');
  const desktopZoomOutBtn = $('#desktop-zoom-out');
  const desktopFitBtn = $('#desktop-fit');
  const desktopLayoutCircleBtn = $('#desktop-layout-circle');
  const desktopLayoutGridBtn = $('#desktop-layout-grid');
  const desktopLayoutRandomBtn = $('#desktop-layout-random');
  const desktopResetBtn = $('#desktop-reset');
  const desktopAnimateBtn = $('#desktop-animate');
  
  if (desktopZoomInBtn) on(desktopZoomInBtn, 'click', () => handleGraphControl('zoom-in'));
  if (desktopZoomOutBtn) on(desktopZoomOutBtn, 'click', () => handleGraphControl('zoom-out'));
  if (desktopFitBtn) on(desktopFitBtn, 'click', () => handleGraphControl('fit'));
  if (desktopLayoutCircleBtn) on(desktopLayoutCircleBtn, 'click', () => handleGraphControl('layout-circle'));
  if (desktopLayoutGridBtn) on(desktopLayoutGridBtn, 'click', () => handleGraphControl('layout-grid'));
  if (desktopLayoutRandomBtn) on(desktopLayoutRandomBtn, 'click', () => handleGraphControl('layout-random'));
  if (desktopResetBtn) on(desktopResetBtn, 'click', () => handleGraphControl('reset'));
  if (desktopAnimateBtn) on(desktopAnimateBtn, 'click', () => handleGraphControl('animate'));
}

function handleGraphControl(action) {
  // Emit events that the graph system can listen to
  setState('graph.control', { action, timestamp: Date.now() });
  
  // Also emit specific action for the graph to handle directly
  setState(`graph.${action}`, { timestamp: Date.now() });
}

// ========== MOBILE SUPPORT ==========

function setupMobileSupport() {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // Show mobile simple controls
    const mobileSimpleControls = $('.mobile-simple-controls');
    if (mobileSimpleControls) {
      mobileSimpleControls.style.display = 'block';
    }
    
    // Set up mobile form sync
    setupMobileFormSync();
    
    // Add touch-friendly enhancements
    setupTouchEnhancements();
  }
}

function setupMobileFormSync() {
  // Sync mobile checkboxes with main form
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

function setupTouchEnhancements() {
  // Improve touch scrolling
  contentLayer.style.webkitOverflowScrolling = 'touch';
  
  // Prevent zoom on double tap for control elements
  const controls = $$('.section-header, .graph-view-tab, .graph-control-btn');
  controls.forEach(control => {
    control.style.touchAction = 'manipulation';
  });
}

// ========== WINDOW RESIZE HANDLING ==========

function handleResize() {
  const isMobile = window.innerWidth <= 768;
  const isDesktop = window.innerWidth > 768;
  const mobileSimpleControls = $('.mobile-simple-controls');
  
  
  if (isMobile) {
    // Switch to mobile layout
    if (mobileSimpleControls) {
      mobileSimpleControls.style.display = 'block';
    }
    
    // Initialize canvas gesture if not already active
    if (!canvasGesture && contentLayer) {
      canvasGesture = new CanvasGestureController({
        contentElement: contentLayer,
        debug: false, // Disable debugging for clean production experience
        onProgressChange: (progress, translateY) => {
          updateUIForProgress(progress);
        },
        onModeChange: (mode, progress) => {
          setState('ui.contentMode', mode);
          
          // Apply CSS classes to content-layer element
          const contentLayer = $('#content-layer');
          if (contentLayer) {
            contentLayer.classList.remove('retracted', 'split-view');
            if (mode === 'retracted') {
              contentLayer.classList.add('retracted');
            } else if (mode === 'split') {
              contentLayer.classList.add('split-view');
            }
          }
          
          updateTabForMode(mode);
          updateGraphControlsForMode(mode);
        }
      });
      setState('ui.contentMode', 'normal');
    }
    
    setupMobileSupport();
  } else {
    // Switch to desktop layout
    if (mobileSimpleControls) {
      mobileSimpleControls.style.display = 'none';
    }
    
    // Reset any mobile transformations
    if (contentLayer) {
      contentLayer.style.transform = '';
      contentLayer.classList.remove('retracted', 'split-view', 'dragging');
    }
    
    // Hide mobile-specific UI elements
    if (graphControls) graphControls.style.display = 'none';
    
    setState('ui.contentMode', 'desktop');
  }
  
}

// ========== DEBUG FUNCTIONS ==========

window.debugCanvas = function() {
  
  if (canvasGesture) {
  }
  
  
  if (contentLayer) {
  }
  
};

// Canvas gesture test functions
window.testCanvasGesture = function() {
  if (canvasGesture) {
    
    setTimeout(() => {
      canvasGesture.setProgress(0.85);
    }, 1000);
    
    setTimeout(() => {
      canvasGesture.setProgress(0.5);
    }, 3000);
    
    setTimeout(() => {
      canvasGesture.setProgress(0);
    }, 5000);
  }
};

// Also expose manually trigger functions
window.testGraphViewTab = function() {
  if (graphViewTab) {
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

// ========== MAIN INITIALIZATION ==========

export const initializeUI = () => {
  // Initialize canvas gesture interface
  initializeCanvasGestureInterface();
  
  // Set up mobile support
  setupMobileSupport();
  
  // Set up graph controls
  setupGraphModeControls();
  setupDesktopControls();
  
  // Set up window resize handler
  // PERFORMANCE FIX: Use RAF-throttled resize to prevent excessive calls
  const throttledResizeHandler = throttledResize(handleResize);
  window.addEventListener('resize', throttledResizeHandler);
  
  // Set up explanation toggle in results panel
  const explanationToggle = createExplanationToggle(
    '#show-more',
    '#explanation'
  );
  
  // Set up EULER toggle switches (for desktop)
  const eulerTogglesCleanup = initializeEulerToggles();
  
  // Set up editor mode switch
  const editorModes = $$('.mode-btn');
  
  editorModes.forEach(btn => {
    on(btn, 'click', () => {
      const mode = btn.getAttribute('data-mode');
      
      // Update UI
      editorModes.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update sliding background animation
      const editorModeSwitch = $('#editor-mode-container');
      if (editorModeSwitch) {
        if (mode === 'visual') {
          editorModeSwitch.classList.add('visual-active');
        } else {
          editorModeSwitch.classList.remove('visual-active');
        }
      }
      
      // Update editor modes
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
  });
  
  // Initialize saved graphs
  initializeSavedGraphs();
  
  // Set up notification system
  subscribe('ui.notification', (notification) => {
    showNotification(notification);
  });
  
  // Initialize visual editor
  initVisualEditor();
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', throttledResizeHandler);
    if (explanationToggle) explanationToggle();
    if (eulerTogglesCleanup) eulerTogglesCleanup();
  };
};

// ========== NOTIFICATION SYSTEM ==========

// Track notification timeout for cleanup
let notificationTimeout = null;

export function showNotification(message, type = 'info', duration = 3000) {
  if (!message) return;
  
  const isMobile = window.innerWidth <= 768;
  const bannerId = isMobile ? 'mobile-notification-banner' : 'desktop-notification-banner';
  const banner = $(`#${bannerId}`);
  
  if (!banner) {
    return;
  }
  
  // Clear any existing timeout to prevent conflicts
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    notificationTimeout = null;
  }
  
  // Set up notification content
  if (isMobile) {
    setupMobileNotification(banner, message, type);
  } else {
    setupDesktopNotification(banner, message, type);
  }
  
  // Auto-hide after duration
  notificationTimeout = setTimeout(() => {
    hideNotification(banner, isMobile);
    notificationTimeout = null;
  }, duration);
}

function setupMobileNotification(banner, message, type) {
  banner.textContent = message;
  
  // Add type class for mobile styling (previously missing)
  banner.classList.remove('success', 'error', 'warning', 'info');
  banner.classList.add(type);
  banner.classList.add('show');
}

function setupDesktopNotification(banner, message, type) {
  const icon = banner.querySelector('.notification-icon');
  const text = banner.querySelector('.notification-text');
  
  if (!icon || !text) {
    return;
  }
  
  // Set content
  text.textContent = message;
  
  // Set type and icon
  banner.classList.remove('success', 'error', 'warning', 'info');
  banner.classList.add(type);
  
  icon.className = `notification-icon fas fa-${getNotificationIcon(type)}`;
  banner.classList.add('active');
}

function hideNotification(banner, isMobile) {
  banner.classList.remove(isMobile ? 'show' : 'active');
}

function getNotificationIcon(type) {
  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle', 
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  return icons[type] || icons.info;
}

// ========== UTILITY FUNCTIONS ==========

// Smooth scroll to specific section
export function navigateToSection(sectionId) {
  scrollToSection(sectionId);
}

// Set content layer position programmatically
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
  } else {
    // Fallback for desktop or when canvas gesture not available
    switch (mode) {
      case 'normal':
        if (contentLayer) contentLayer.style.transform = 'translateY(0%)';
        break;
      case 'split':
        if (contentLayer) contentLayer.style.transform = 'translateY(-50%)';
        break;
      case 'retracted':
        if (contentLayer) contentLayer.style.transform = 'translateY(-91%)';
        break;
    }
  }
}

// Get current content mode
export function getContentMode() {
  return getState('ui.contentMode');
}

// ========== CANVAS GESTURE UI HELPERS ==========

function updateUIForProgress(progress) {
  
  // Graph info strip removed - no longer updating it
  
}

function updateTabForMode(mode) {
  if (!graphViewTab) return;
  
  
  // Update tab text based on mode (removed class manipulation)
  if (mode === 'retracted') {
    graphViewTab.innerHTML = '<i class="fas fa-arrow-down"></i> CONTENT VIEW <i class="fas fa-arrow-down"></i>';
  } else {
    graphViewTab.innerHTML = '<i class="fas fa-arrow-up"></i> GRAPH VIEW <i class="fas fa-arrow-up"></i>';
  }
}

function updateGraphControlsForMode(mode) {
  if (!graphControls) return;
  
  
  // Show/hide graph controls based on mode
  if (mode === 'retracted') {
    graphControls.style.display = 'flex';
  } else {
    graphControls.style.display = 'none';
  }
} 
