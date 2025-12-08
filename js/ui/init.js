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
  console.log('🎨 initializeCanvasGestureInterface() called');
  console.log('📱 Window dimensions:', window.innerWidth, 'x', window.innerHeight);
  
  contentLayer = $('#content-layer');
  graphViewTab = $('#graph-view-tab');
  graphControls = $('#graph-controls');
  
  console.log('🔍 Elements found:');
  console.log('  - contentLayer:', !!contentLayer, contentLayer ? contentLayer.tagName : 'null');
  console.log('  - graphViewTab:', !!graphViewTab, graphViewTab ? graphViewTab.tagName : 'null');
  console.log('  - graphControls:', !!graphControls);
  
  if (!contentLayer) {
    console.error('❌ contentLayer not found for canvas gesture interface');
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
    console.log('🖥️ Desktop mode: using side-by-side layout');
    setState('ui.contentMode', 'desktop');
  } else {
    // Mobile mode: initialize canvas gesture controller
    console.log('📱 Mobile mode: initializing canvas gesture');
    
    canvasGesture = new CanvasGestureController({
      contentElement: contentLayer,
      debug: false, // Disable debugging for clean production experience
      onProgressChange: (progress, translateY) => {
        if (canvasGesture && canvasGesture.enableDebug) {
          console.log('📊 Progress changed:', { progress, translateY });
        }
        
        // Update UI elements based on position
        updateUIForProgress(progress);
      },
      onModeChange: (mode, progress) => {
        if (canvasGesture && canvasGesture.enableDebug) {
          console.log('🔄 Mode changed:', { mode, progress });
        }
        
        // Update state
        setState('ui.contentMode', mode);
        
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
  console.log('🎯 setupGraphViewTabHandlers() called');
  
  if (!graphViewTab) {
    console.error('❌ graphViewTab not found in setupGraphViewTabHandlers');
    return;
  }
  
  // OLD DOM DRAG SYSTEM DISABLED - Canvas gesture handles all gestures now
  console.log('🚫 OLD DOM drag system disabled - canvas gesture handles all interactions');
  
  // Keep only click for tap-to-toggle as fallback
  on(graphViewTab, 'click', (e) => {
    console.log('🔥 GRAPH VIEW TAB CLICKED (fallback)');
    
    // Only handle if canvas gesture is not active
    if (!canvasGesture) {
      console.log('✅ Canvas not active, processing click fallback');
      e.preventDefault();
      e.stopPropagation();
      toggleContentLayer();
    } else {
      console.log('⏭️ Canvas active, ignoring click (canvas handles taps)');
    }
  });
  
  console.log('✅ setupGraphViewTabHandlers complete (canvas-only mode)');
}

function setupGraphViewTab() {
  console.log('🎯 setupGraphViewTab() called');
  console.log('  - graphViewTab element:', !!graphViewTab);
  
  if (!graphViewTab) {
    console.error('❌ graphViewTab not found in setupGraphViewTab');
    return;
  }
  
  console.log('📋 Current graphViewTab classes:', graphViewTab.className);
  console.log('📋 Current graphViewTab style.display:', graphViewTab.style.display);
  
  // Set up the event handlers
  setupGraphViewTabHandlers();
  
  // OLD DOM DRAG SYSTEM DISABLED - Canvas gesture handles all interactions
  console.log('🚫 OLD DOM global drag handlers disabled - canvas gesture system active');
  
  // Keep only debug touch listener
  on(document, 'touchstart', (e) => {
    const touch = e.touches[0];
    console.log('🌍 GLOBAL TOUCH START DEBUG:', {
      touchX: touch.clientX,
      touchY: touch.clientY,
      target: e.target.tagName,
      targetClass: e.target.className,
      targetId: e.target.id
    });
    
    // Check what element is at this position
    const elementAtTouch = document.elementFromPoint(touch.clientX, touch.clientY);
    console.log('  - Element at touch point:', elementAtTouch);
    console.log('  - Touch element tag:', elementAtTouch?.tagName);
    console.log('  - Touch element class:', elementAtTouch?.className);
    console.log('  - Touch element id:', elementAtTouch?.id);
    
    // If touch is in top area, check if tab should be there
    if (touch.clientY < 100) {
      console.log('🔍 Touch in top 100px - checking tab position');
      const tab = document.getElementById('graph-view-tab');
      if (tab) {
        console.log('  - Tab found, checking position');
        console.log('  - Is touched element the tab?', elementAtTouch === tab);
        console.log('  - Tab rect:', tab.getBoundingClientRect());
      }
    }
  }, true);
  
  console.log('✅ setupGraphViewTab complete (canvas-only mode)');
}

function startDrag(e) {
  // OLD DOM DRAG SYSTEM DISABLED - Canvas gesture system handles all interactions
  console.log('🚫 OLD startDrag called but disabled - canvas gesture active');
  return;
  
  console.log('🚀 startDrag called', {
    eventType: e.type,
    target: e.target.tagName,
    targetClass: e.target.className
  });
  
  // Prevent default touch behaviors immediately
  e.preventDefault();
  
  isDragging = false; // Will be set to true if actual dragging occurs
  dragCooldown = false; // Clear any existing cooldown
  
  const touch = e.touches ? e.touches[0] : e;
  startY = touch.clientY;
  currentY = startY;
  
  console.log('📍 startDrag set startY to:', startY);
  
  // Get current transform value
  const transform = contentLayer.style.transform;
  const match = transform.match(/translateY\((-?\d+(?:\.\d+)?)%\)/);
  initialTransform = match ? parseFloat(match[1]) : 0;
  
  console.log('🔄 Initial transform from content-layer:', initialTransform);
  
  contentLayer.classList.add('dragging');
  graphViewTab.classList.add('dragging');
}

function drag(e) {
  // OLD DOM DRAG SYSTEM DISABLED - Canvas gesture system handles all interactions
  console.log('🚫 OLD drag called but disabled - canvas gesture active');
  return;
  
  if (startY === 0) return;
  
  const touch = e.touches ? e.touches[0] : e;
  currentY = touch.clientY;
  
  const deltaY = startY - currentY;
  const dragThreshold = 10; // Higher threshold to better distinguish drag from click
  
  console.log('🖱️ drag event:', {
    currentY,
    deltaY,
    isDragging,
    threshold: dragThreshold,
    absDistance: Math.abs(deltaY)
  });
  
  if (Math.abs(deltaY) > dragThreshold) {
    // Now that we're actually dragging, prevent default behavior
    e.preventDefault();
    isDragging = true;
    
    console.log('✅ Threshold exceeded - now in drag mode');
  }
  
  if (isDragging) {
    // Calculate new position
    const percentChange = (deltaY / window.innerHeight) * 100;
    let newTransform = initialTransform - percentChange;
    
    // Constrain to valid range: 0% (normal) to -85% (retracted)
    newTransform = Math.max(-85, Math.min(0, newTransform));
    
    console.log('🎯 Applying transform:', newTransform);
    
    // Apply transform to content
    contentLayer.style.transform = `translateY(${newTransform}%)`;
    
    // Update UI based on position (this will handle tab positioning)
    updateUIForPosition(newTransform);
  }
}

function endDrag(e) {
  // OLD DOM DRAG SYSTEM DISABLED - Canvas gesture system handles all interactions
  console.log('🚫 OLD endDrag called but disabled - canvas gesture active');
  return;
  
  console.log('🔚 endDrag called', {
    startY,
    isDragging,
    hasEvent: !!e
  });
  
  if (startY === 0) {
    console.log('⏭️ endDrag: startY is 0, returning early');
    return;
  }
  
  const wasActuallyDragging = isDragging;
  
  if (wasActuallyDragging) {
    console.log('✅ Processing drag end with snapping...');
    // Determine final position based on current position
    const transform = getCurrentTransform();
    let finalPosition;
    
    if (transform > -25) {
      finalPosition = 0; // Snap to normal
    } else if (transform > -55) {
      finalPosition = -50; // Snap to split view
    } else {
      finalPosition = -85; // Snap to retracted (less extreme)
    }
    
    setContentPosition(finalPosition);
    
    // Set cooldown to prevent immediate clicks after drag
    dragCooldown = true;
    setTimeout(() => {
      dragCooldown = false;
      console.log('🔓 Drag cooldown cleared');
    }, 300); // 300ms cooldown
  }
  
  // Reset drag state
  resetDragState();
}

function resetDragState() {
  console.log('🔄 Resetting drag state');
  
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
  console.log('🔄 toggleContentLayer called');
  console.log('  - currentMode:', currentMode);
  
  switch (currentMode) {
    case 'normal':
      console.log('📤 Switching from normal to retracted (-85%)');
      setContentPosition(-85); // Less retraction to avoid jarring jump
      break;
    case 'split':
      console.log('📤 Switching from split to retracted (-85%)');
      setContentPosition(-85); // Less retraction to avoid jarring jump
      break;
    case 'retracted':
      console.log('📥 Switching from retracted to normal (0%)');
      setContentPosition(0); // Return to normal
      break;
    default:
      console.log('⚠️ Unknown mode:', currentMode, '- defaulting to retracted');
      setContentPosition(-85);
  }
}

function setContentPosition(position) {
  console.log('🎯 setContentPosition called with position:', position);
  console.log('  - contentLayer element:', !!contentLayer);
  
  // Add stack trace to see what's calling this
  if (position === -50) {
    console.log('🚨 STACK TRACE for -50 position:');
    console.trace();
  }
  
  if (!contentLayer) {
    console.error('❌ contentLayer not found in setContentPosition');
    return;
  }
  
  console.log('🧹 Removing existing classes...');
  contentLayer.classList.remove('retracted', 'split-view');
  
  // Remove body classes for mobile states
  document.body.classList.remove('mobile-split-view', 'mobile-retracted');
  
  console.log('🔄 Applying transform: translateY(' + position + '%)');
  contentLayer.style.transform = `translateY(${position}%)`;
  
  // Set content mode and classes based on position
  if (position === 0) {
    console.log('📥 Setting normal state');
    setState('ui.contentMode', 'normal');
  } else if (position === -50) {
    console.log('📑 Adding split-view class and state');
    contentLayer.classList.add('split-view');
    document.body.classList.add('mobile-split-view');
    setState('ui.contentMode', 'split');
  } else if (position <= -75) {
    console.log('📤 Adding retracted class and state');
    contentLayer.classList.add('retracted');
    document.body.classList.add('mobile-retracted');
    setState('ui.contentMode', 'retracted');
  }
  
  console.log('🎨 Calling updateUIForPosition...');
  updateUIForPosition(position);
  
  console.log('✅ setContentPosition complete');
  console.log('  - Final transform:', contentLayer.style.transform);
  console.log('  - Final classes:', contentLayer.className);
}

function updateUIForPosition(position) {
  console.log('🎨 updateUIForPosition called with position:', position);
  
  // Update graph info strip
  const graphInfoStrip = document.getElementById('graph-info-strip');
  if (graphInfoStrip) {
    if (position <= -75) {
      // Show info strip in graph mode
      console.log('🔢 Showing graph info strip');
      graphInfoStrip.classList.add('active');
    } else {
      // Hide info strip in normal mode
      console.log('🔢 Hiding graph info strip');
      graphInfoStrip.classList.remove('active');
    }
  } else {
    console.log('❌ Graph info strip element not found');
  }
  
  // Update graph view tab - keep it natural, don't jump to fixed position
  if (position <= -75) {
    // In graph mode but keep tab natural - just change the text
    console.log('📍 Position <= -75, entering graph mode (natural tab position)');
    if (graphViewTab) {
      graphViewTab.innerHTML = '<i class="fas fa-arrow-down"></i> CONTENT VIEW <i class="fas fa-arrow-down"></i>';
    }
    
    // Show graph controls
    console.log('📱 Showing graph controls');
    if (graphControls) {
      graphControls.style.display = 'flex';
    }
  } else {
    console.log('📍 Position > -75, normal content mode');
    if (graphViewTab) {
      graphViewTab.innerHTML = '<i class="fas fa-arrow-up"></i> GRAPH VIEW <i class="fas fa-arrow-up"></i>';
    }
    
    // Hide graph controls
    console.log('📱 Hiding graph controls');
    if (graphControls) {
      graphControls.style.display = 'none';
    }
  }
  
  console.log('✅ updateUIForPosition complete');
}

function updateGraphInfoStrip() {
  console.log('📊 Updating graph info strip');
  
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
  
  console.log('📊 Graph info strip updated:', { nodeCount, edgeCount, useSimpleStats });
}

// Make updateGraphInfoStrip available globally
window.updateGraphInfoStrip = updateGraphInfoStrip;

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
  
  console.log('📐 handleResize() called');
  console.log('  - Window size:', window.innerWidth, 'x', window.innerHeight);
  console.log('  - isMobile:', isMobile, '(width <= 768)');
  console.log('  - isDesktop:', isDesktop, '(width > 768)');
  console.log('  - mobileSimpleControls found:', !!mobileSimpleControls);
  
  if (isMobile) {
    // Switch to mobile layout
    console.log('📱 Switching to mobile layout...');
    if (mobileSimpleControls) {
      mobileSimpleControls.style.display = 'block';
      console.log('✅ Showed mobile simple controls');
    }
    
    // Initialize canvas gesture if not already active
    if (!canvasGesture && contentLayer) {
      console.log('🎨 Initializing canvas gesture for mobile...');
      canvasGesture = new CanvasGestureController({
        contentElement: contentLayer,
        debug: false, // Disable debugging for clean production experience
        onProgressChange: (progress, translateY) => {
          updateUIForProgress(progress);
        },
        onModeChange: (mode, progress) => {
          setState('ui.contentMode', mode);
          updateTabForMode(mode);
          updateGraphControlsForMode(mode);
        }
      });
      setState('ui.contentMode', 'normal');
      console.log('✅ Canvas gesture initialized');
    }
    
    setupMobileSupport();
  } else {
    // Switch to desktop layout
    console.log('🖥️ Switching to desktop layout...');
    if (mobileSimpleControls) {
      mobileSimpleControls.style.display = 'none';
      console.log('✅ Hid mobile simple controls');
    }
    
    // Reset any mobile transformations
    if (contentLayer) {
      console.log('🔄 Resetting mobile transformations...');
      contentLayer.style.transform = '';
      contentLayer.classList.remove('retracted', 'split-view', 'dragging');
      console.log('✅ Mobile transformations reset');
    }
    
    // Hide mobile-specific UI elements
    if (graphControls) graphControls.style.display = 'none';
    
    setState('ui.contentMode', 'desktop');
    console.log('✅ Desktop layout activated');
  }
  
  console.log('✅ handleResize complete');
}

// ========== DEBUG FUNCTIONS ==========

window.debugCanvas = function() {
  console.log('🎨 CANVAS GESTURE DEBUG REPORT:');
  console.log('===============================');
  console.log('📱 Window size:', window.innerWidth, 'x', window.innerHeight);
  console.log('📋 Current UI mode:', getState('ui.contentMode'));
  console.log('🎨 Canvas gesture active:', !!canvasGesture);
  console.log('');
  
  if (canvasGesture) {
    console.log('🎨 Canvas Gesture State:');
    console.log('  - Current mode:', canvasGesture.getMode());
    console.log('  - Current progress:', canvasGesture.getProgress());
    console.log('  - Max progress:', canvasGesture.maxProgress);
    console.log('  - Canvas element:', !!canvasGesture.canvas);
  }
  
  console.log('🔍 Elements:');
  console.log('  - contentLayer:', !!contentLayer, contentLayer ? contentLayer.id : 'null');
  console.log('  - graphViewTab:', !!graphViewTab, graphViewTab ? graphViewTab.id : 'null');
  console.log('  - graphControls:', !!graphControls);
  console.log('');
  
  if (contentLayer) {
    console.log('📦 Content Layer:');
    console.log('  - Transform:', contentLayer.style.transform || 'none');
    console.log('  - Classes:', contentLayer.className);
    console.log('  - Display:', window.getComputedStyle(contentLayer).display);
    console.log('  - Z-index:', window.getComputedStyle(contentLayer).zIndex);
  }
  
  console.log('===============================');
  console.log('💡 To test: Try dragging from anywhere on screen');
};

// Canvas gesture test functions
window.testCanvasGesture = function() {
  if (canvasGesture) {
    console.log('🧪 Testing canvas gesture modes...');
    
    setTimeout(() => {
      console.log('📤 Setting to retracted...');
      canvasGesture.setProgress(0.85);
    }, 1000);
    
    setTimeout(() => {
      console.log('📑 Setting to split...');
      canvasGesture.setProgress(0.5);
    }, 3000);
    
    setTimeout(() => {
      console.log('📥 Setting to normal...');
      canvasGesture.setProgress(0);
    }, 5000);
  } else {
    console.error('❌ Canvas gesture not active');
  }
};

// Also expose manually trigger functions
window.testGraphViewTab = function() {
  console.log('🧪 Testing graph view tab...');
  if (graphViewTab) {
    console.log('✅ Graph view tab found');
  } else {
    console.error('❌ Graph view tab not found');
  }
};

window.forceRetract = function() {
  console.log('🧪 Manually forcing content retraction...');
  if (canvasGesture) {
    canvasGesture.setProgress(0.85);
  } else {
    console.error('❌ Canvas gesture not active');
  }
};

window.forceNormal = function() {
  console.log('🧪 Manually forcing content to normal...');
  if (canvasGesture) {
    canvasGesture.setProgress(0);
  } else {
    console.error('❌ Canvas gesture not active');
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
  window.addEventListener('resize', throttledResize(handleResize));
  
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
    window.removeEventListener('resize', handleResize);
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
    console.warn(`Notification banner not found: ${bannerId}`);
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
    console.warn('Desktop notification elements missing');
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
        if (contentLayer) contentLayer.style.transform = 'translateY(-85%)';
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
  console.log('🎨 updateUIForProgress called with progress:', progress);
  
  // Graph info strip removed - no longer updating it
  
  console.log('✅ updateUIForProgress complete');
}

function updateTabForMode(mode) {
  if (!graphViewTab) return;
  
  console.log('📍 Updating tab for mode:', mode);
  
  // Update tab text based on mode (removed class manipulation)
  if (mode === 'retracted') {
    graphViewTab.innerHTML = '<i class="fas fa-arrow-down"></i> CONTENT VIEW <i class="fas fa-arrow-down"></i>';
  } else {
    graphViewTab.innerHTML = '<i class="fas fa-arrow-up"></i> GRAPH VIEW <i class="fas fa-arrow-up"></i>';
  }
}

function updateGraphControlsForMode(mode) {
  if (!graphControls) return;
  
  console.log('📱 Updating graph controls for mode:', mode);
  
  // Show/hide graph controls based on mode
  if (mode === 'retracted') {
    graphControls.style.display = 'flex';
  } else {
    graphControls.style.display = 'none';
  }
} 