/**
 * Desktop UI Module
 * Desktop controls, resize handling, and graph controls
 * Split from init.js for better maintainability
 */

import { $, $$ } from '../utils/dom.js';
import { on } from '../utils/events.js';
import { setState, getState } from '../core/state.js';
import { CanvasGestureController } from '../utils/canvas-gesture.js';
import { SigmaCore } from '../graph/sigma-facade.js';

// Module state
let contentLayer = null;
let graphControls = null;
let resizeHandler = null;
let canvasGesture = null;

/**
 * RAF-throttled resize handler factory
 * @param {Function} callback - Resize callback
 * @returns {Function} Throttled callback
 */
function throttledResize(callback) {
  let ticking = false;

  return function() {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  };
}

/**
 * Initialize desktop interface
 * @returns {Function} Cleanup function
 */
export function initializeDesktopInterface() {
  contentLayer = $('#content-layer');
  graphControls = $('#graph-controls');

  setupDesktopControls();
  setupGraphModeControls();
  setupSidebarToggle();

  resizeHandler = throttledResize(handleResize);
  window.addEventListener('resize', resizeHandler);

  return () => {
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
    }
  };
}

/**
 * Set up desktop sidebar toggle — clicking the EULER title collapses/expands
 */
export function setupSidebarToggle() {
  const layer = contentLayer || $('#content-layer');
  if (!layer) return;
  contentLayer = layer;

  // Restore collapsed state from localStorage
  const isCollapsed = localStorage.getItem('euler_sidebar_collapsed') === 'true';
  if (isCollapsed) {
    layer.classList.add('collapsed');
    // Sync graph layer — CSS sibling selector can't reach it (graph-layer precedes content-layer in DOM)
    applyCollapsedGraphWidth(true);
  }

  // Wire EULER logo click to toggle
  const eulerLogo = $('#euler-logo');
  if (eulerLogo) {
    on(eulerLogo, 'click', () => toggleSidebar());
  }
}

/**
 * Apply/remove collapsed width on graph-layer and resize handle via JS.
 * The CSS `.content-layer.collapsed ~ .graph-layer` selector can't work because
 * graph-layer appears before content-layer in the DOM.
 */
function applyCollapsedGraphWidth(collapsed) {
  const graphLayer = document.querySelector('.graph-layer');
  const resizeHandle = document.getElementById('desktop-resize-handle');
  if (graphLayer) {
    graphLayer.style.width = collapsed ? 'calc(100% - 60px)' : '';
  }
  if (resizeHandle) {
    resizeHandle.style.left = collapsed ? '60px' : '';
  }
}

/**
 * Toggle sidebar collapsed state
 */
function toggleSidebar() {
  const layer = contentLayer || $('#content-layer');
  if (!layer) return;
  contentLayer = layer;

  const isCollapsed = layer.classList.toggle('collapsed');
  localStorage.setItem('euler_sidebar_collapsed', isCollapsed);
  setState('ui.sidebarCollapsed', isCollapsed);

  // Animate graph layer width (CSS transition on content-layer handles content side)
  const graphLayer = document.querySelector('.graph-layer');
  const resizeHandle = document.getElementById('desktop-resize-handle');
  const TRANSITION = 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  if (graphLayer) graphLayer.style.transition = TRANSITION;
  if (resizeHandle) resizeHandle.style.transition = 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  applyCollapsedGraphWidth(isCollapsed);

  setTimeout(() => {
    if (graphLayer) graphLayer.style.transition = '';
    if (resizeHandle) resizeHandle.style.transition = '';
    const sigma = SigmaCore.getInstance();
    if (sigma) sigma.refresh();
    // Refit EULER text to new container width
    const eulerText = document.getElementById('eulerText');
    if (eulerText && window._eulerTextFitter) window._eulerTextFitter.fit(eulerText);
  }, 350);
}

/**
 * Set up desktop graph control buttons
 */
function setupDesktopControls() {
  const controls = {
    '#desktop-zoom-in': 'zoom-in',
    '#desktop-zoom-out': 'zoom-out',
    '#desktop-fit': 'fit',
    '#desktop-layout-circle': 'layout-circle',
    '#desktop-layout-grid': 'layout-grid',
    '#desktop-layout-random': 'layout-random',
    '#desktop-reset': 'reset',
    '#desktop-animate': 'animate'
  };

  Object.entries(controls).forEach(([selector, action]) => {
    const btn = $(selector);
    if (btn) {
      on(btn, 'click', () => handleGraphControl(action));
    }
  });
}

/**
 * Set up mobile graph mode controls
 */
function setupGraphModeControls() {
  const controls = {
    '#graph-zoom-in': 'zoom-in',
    '#graph-zoom-out': 'zoom-out',
    '#graph-fit': 'fit',
    '#graph-layout-circle': 'layout-circle',
    '#graph-animate': 'animate',
    '#graph-export': 'export'
  };

  Object.entries(controls).forEach(([selector, action]) => {
    const btn = $(selector);
    if (btn) {
      on(btn, 'click', () => handleGraphControl(action));
    }
  });
}

/**
 * Handle graph control action
 * @param {string} action - Control action
 */
function handleGraphControl(action) {
  setState('graph.control', { action, timestamp: Date.now() });
  setState(`graph.${action}`, { timestamp: Date.now() });
}

/**
 * Handle window resize
 */
function handleResize() {
  const isMobile = window.innerWidth <= 768;
  const isDesktop = window.innerWidth > 768;
  const mobileSimpleControls = $('.mobile-simple-controls');

  if (isMobile) {
    if (mobileSimpleControls) {
      mobileSimpleControls.style.display = 'block';
    }

    // Initialize canvas gesture if not active
    if (!canvasGesture && contentLayer) {
      canvasGesture = new CanvasGestureController({
        contentElement: contentLayer,
        debug: false,
        onProgressChange: (progress, translateY) => {
          // Progress updates
        },
        onModeChange: (mode, progress) => {
          setState('ui.contentMode', mode);
        }
      });
      setState('ui.contentMode', 'normal');
    }
  } else {
    if (mobileSimpleControls) {
      mobileSimpleControls.style.display = 'none';
    }

    // Reset mobile transformations
    if (contentLayer) {
      contentLayer.style.transform = '';
      contentLayer.classList.remove('retracted', 'split-view', 'dragging');
    }

    if (graphControls) {
      graphControls.style.display = 'none';
    }

    setState('ui.contentMode', 'desktop');
  }
}

/**
 * Set up section navigation
 */
export function setupSectionNavigation() {
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

/**
 * Scroll to section
 * @param {string} sectionId - Section ID
 */
function scrollToSection(sectionId) {
  const section = $(`#${sectionId}-section`);
  if (section) {
    section.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

/**
 * Navigate to section (public API)
 * @param {string} sectionId - Section ID
 */
export function navigateToSection(sectionId) {
  scrollToSection(sectionId);
}

/**
 * Update graph info strip
 */
export function updateGraphInfoStrip() {
  const edgeInput = document.getElementById('edges');
  if (!edgeInput) return;

  const edgeText = edgeInput.value.trim();
  const edges = edgeText.match(/\[([^\]]+)\]/g) || [];
  const nodes = new Set();
  const edgeList = [];

  edges.forEach(edge => {
    const content = edge.slice(1, -1);
    const parts = content.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      nodes.add(parts[0]);
      nodes.add(parts[1]);
      edgeList.push([parts[0], parts[1]]);
    }
  });

  const nodeCount = nodes.size;
  const edgeCount = edges.length;

  const nodeCountEl = document.getElementById('node-count');
  const edgeCountEl = document.getElementById('edge-count');

  if (nodeCountEl) nodeCountEl.textContent = nodeCount;
  if (edgeCountEl) edgeCountEl.textContent = edgeCount;
}

// NOTE: Removed window.updateGraphInfoStrip - use setState('ui.edgeInputChanged', Date.now()) instead
// Subscribers in init.js handle the update via state.js pub/sub
