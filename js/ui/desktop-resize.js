/**
 * Desktop Resize Handler - Ghost/Preview Mode
 * Shows preview during drag, only updates layout on drop for maximum performance
 */

import CoolTextFit from 'cool-text-fit';

let isResizing = false;
let startX = 0;
let startContentWidth = 35;

// Ghost preview elements
let ghostLine = null;
let previewOverlay = null;

// CoolTextFit instance for fullWidthText
let textFitter = null;

export function initDesktopResize() {
  if (window.innerWidth <= 768) return;
  
  const resizeHandle = document.getElementById('desktop-resize-handle');
  const contentLayer = document.querySelector('.content-layer');
  const graphLayer = document.querySelector('.graph-layer');
  
  if (!resizeHandle || !contentLayer || !graphLayer) {
    return;
  }
  
  // Create ghost preview elements
  createGhostElements();
  
  // Initialize CoolTextFit for fullWidthText
  initTextFitter();
  
  
  resizeHandle.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  document.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('resize', handleWindowResize, { passive: true });
}

function createGhostElements() {
  // Create ghost divider line
  ghostLine = document.createElement('div');
  ghostLine.className = 'ghost-resize-line';
  ghostLine.style.cssText = `
    position: fixed;
    top: 0;
    width: 4px;
    height: 100vh;
    background: var(--secondary-color);
    box-shadow: 0 0 15px rgba(255, 152, 0, 0.8);
    z-index: 9999;
    display: none;
    pointer-events: none;
    border-radius: 1px;
  `;
  
  // Create preview overlay with percentage display
  previewOverlay = document.createElement('div');
  previewOverlay.className = 'resize-preview-overlay';
  previewOverlay.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    color: var(--primary-color);
    padding: 12px 16px;
    border-radius: 6px;
    font-family: 'Inter', monospace;
    font-size: 13px;
    font-weight: 600;
    z-index: 10000;
    display: none;
    pointer-events: none;
    border: 1px solid var(--primary-color);
    backdrop-filter: blur(10px);
  `;
  
  document.body.appendChild(ghostLine);
  document.body.appendChild(previewOverlay);
}

function handleMouseDown(e) {
  isResizing = true;
  startX = e.clientX;
  
  const contentLayer = document.querySelector('.content-layer');
  startContentWidth = (contentLayer.getBoundingClientRect().width / window.innerWidth) * 100;
  
  const resizeHandle = document.getElementById('desktop-resize-handle');
  resizeHandle.classList.add('resizing');
  document.body.style.cursor = 'ew-resize';
  document.body.style.userSelect = 'none';
  
  // Show ghost elements
  ghostLine.style.display = 'block';
  previewOverlay.style.display = 'block';
  
  // Set initial ghost position
  const currentPosition = (startContentWidth / 100) * window.innerWidth;
  ghostLine.style.left = `${currentPosition}px`;
  
  e.preventDefault();
}

function handleMouseMove(e) {
  if (!isResizing) return;
  
  // Calculate new position (no DOM layout changes!)
  const deltaX = e.clientX - startX;
  const deltaPercent = (deltaX / window.innerWidth) * 100;
  const newContentWidth = startContentWidth + deltaPercent;
  const constrainedWidth = Math.max(20, Math.min(70, newContentWidth));
  const graphWidth = 100 - constrainedWidth;
  
  // Update ghost line position (only transform, no layout!)
  const newPosition = (constrainedWidth / 100) * window.innerWidth;
  ghostLine.style.left = `${newPosition}px`;
  
  // Update preview text
  previewOverlay.innerHTML = `
    <div style="margin-bottom: 4px;">📊 Layout Preview</div>
    <div>Content: <span style="color: #fff;">${constrainedWidth.toFixed(1)}%</span></div>
    <div>Graph: <span style="color: #fff;">${graphWidth.toFixed(1)}%</span></div>
  `;
}

function handleMouseUp(e) {
  if (!isResizing) return;
  
  // Calculate final position
  const deltaX = e.clientX - startX;
  const deltaPercent = (deltaX / window.innerWidth) * 100;
  const newContentWidth = startContentWidth + deltaPercent;
  const constrainedWidth = Math.max(20, Math.min(70, newContentWidth));
  const graphWidth = 100 - constrainedWidth;
  
  // Get elements
  const contentLayer = document.querySelector('.content-layer');
  const graphLayer = document.querySelector('.graph-layer');
  const resizeHandle = document.getElementById('desktop-resize-handle');
  
  // Add smooth transition for the animation
  contentLayer.style.transition = 'width 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)';
  graphLayer.style.transition = 'width 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)';
  resizeHandle.style.transition = 'left 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)';
  
  // NOW update the actual layout (with smooth animation!)
  contentLayer.style.width = `${constrainedWidth}%`;
  graphLayer.style.width = `${graphWidth}%`;
  resizeHandle.style.left = `${constrainedWidth}%`;
  
  // Hide ghost elements immediately
  ghostLine.style.display = 'none';
  previewOverlay.style.display = 'none';
  
  // Remove transitions after animation completes
  setTimeout(() => {
    contentLayer.style.transition = '';
    graphLayer.style.transition = '';
    resizeHandle.style.transition = '';
    
    // Fit the EULER text after layout animation completes
    fitEulerText();
  }, 400);
  
  // Cleanup
  isResizing = false;
  resizeHandle.classList.remove('resizing');
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
  
}

function handleWindowResize() {
  if (window.innerWidth <= 768) {
    const contentLayer = document.querySelector('.content-layer');
    const graphLayer = document.querySelector('.graph-layer');
    const resizeHandle = document.getElementById('desktop-resize-handle');
    
    if (contentLayer) contentLayer.style.width = '';
    if (graphLayer) graphLayer.style.width = '';
    if (resizeHandle) resizeHandle.style.left = '';
    
    // Hide ghost elements
    if (ghostLine) ghostLine.style.display = 'none';
    if (previewOverlay) previewOverlay.style.display = 'none';
  } else {
    // Fit text when window resizes on desktop
    setTimeout(() => fitEulerText(), 100);
  }
}

export function cleanupDesktopResize() {
  const resizeHandle = document.getElementById('desktop-resize-handle');
  if (resizeHandle) {
    resizeHandle.classList.remove('resizing');
  }
  
  // Remove ghost elements
  if (ghostLine) {
    ghostLine.remove();
    ghostLine = null;
  }
  if (previewOverlay) {
    previewOverlay.remove();
    previewOverlay = null;
  }
  
  // Clean up text fitter
  if (textFitter) {
    textFitter.disconnectAll();
    textFitter = null;
    delete window._eulerTextFitter;
  }
  
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
  isResizing = false;
}
function initTextFitter() {
  // balanced: fills both width and height — CTF uses fontWidth then scaleX to close the gap
  // Wide scaleX range: distortion is intentional, edge-to-edge fill
  textFitter = new CoolTextFit({
    mode: 'height',       // fill height first, then stretch width via fontWidth + scaleX
    textBounds: 'ink-box',
    alignment: 'left',    // scaleX expands rightward, not from center
    scaleX: { min: 0.5, max: 4 },
    waitForFonts: true
  });
  // Expose for cross-module refit (e.g. after sidebar toggle)
  window._eulerTextFitter = textFitter;
  // fit() registers the element with CTF's ResizeObserver and triggers first fit
  fitEulerText();
}

function fitEulerText() {
  const eulerText = document.getElementById('eulerText');
  if (!eulerText || !textFitter) return;
  // Let CTF handle everything: fontWidth → scaleX → transforms on its wrapper span
  textFitter.fit(eulerText);
}
