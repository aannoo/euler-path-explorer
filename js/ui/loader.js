/**
 * Loader Module
 * Handles loader animations for the application
 * 
 * Usage:
 * - showCalcLoader('Message here', nodeCount) - Display the loader with custom message and conditional behavior
 * - updateLoaderProgress('New message') - Update the message during processing
 * - hideCalcLoader() - Hide the loader when processing completes
 */
import { $ } from '../utils/dom.js';

// Constants for transition timing (in ms)
const FADE_IN_DURATION = 500;  
const ELEMENTS_TRANSITION_DELAY = 300;
const FADE_OUT_DURATION = 700;

// Node count threshold for simple vs full loader
const NODE_COUNT_THRESHOLD = 10;

// Track loading state to prevent overlapping operations
let isLoading = false;

/**
 * Show the global loader with an optional message and conditional behavior based on node count
 * @param {string} [message='Processing Graph...'] - Message to display
 * @param {number} [nodeCount=50] - Number of nodes in the graph (determines loader type)
 * @returns {Promise} Resolves when animations have completed
 */
export const showCalcLoader = (message = 'Processing Graph...', nodeCount = 50) => {
  return new Promise(resolve => {
    // If already loading, just update the message and resolve
    if (isLoading) {
      updateLoaderProgress(message);
      resolve();
      return;
    }
    
    
    // For small graphs, skip loader entirely - just resolve immediately
    if (nodeCount < NODE_COUNT_THRESHOLD) {
      resolve();
      return;
    }
    
    // Use full orbital animation for larger graphs
    
    // Set loading state flag
    isLoading = true;
    
    // Get all required elements
    const elements = {
      loader: $('#global-loader'),
      progress: $('#loader-progress'),
      graphCircle: $('#orbit-graph-circle'),
      cyContainer: $('#cy'),
      orbitalPaths: $('.orbit-paths')
    };
    
    // Update message
    if (elements.progress) {
      elements.progress.textContent = message;
    }
    
    // Fade in the loader
    if (elements.loader) {
      elements.loader.classList.add('show');
    }
    
    // Add loading class to main circle for glow effect
    if (elements.graphCircle) {
      elements.graphCircle.classList.add('loading');
    }
    
    // Hide animated elements with proper opacity
    if (elements.cyContainer) {
      elements.cyContainer.style.opacity = '0.01';
    }
    
    if (elements.orbitalPaths) {
      elements.orbitalPaths.style.opacity = '0.01';
    }
    
    // Wait for transitions to complete before allowing processing to continue
    setTimeout(resolve, FADE_IN_DURATION);
  });
};

/**
 * Update the loader progress message
 * @param {string} message - New message to display
 */
export const updateLoaderProgress = (message) => {
  const progress = $('#loader-progress');
  if (progress) {
    progress.textContent = message;
  }
};

/**
 * Hide the global loader with a smooth transition
 * @returns {Promise} Resolves when animations have completed
 */
export const hideCalcLoader = () => {
  return new Promise(resolve => {
    // If not in loading state, just resolve immediately
    if (!isLoading) {
      resolve();
      return;
    }
    
    // Get all required elements
    const elements = {
      loader: $('#global-loader'),
      graphCircle: $('#orbit-graph-circle'),
      cyContainer: $('#cy'),
      orbitalPaths: $('.orbit-paths')
    };
    
    // First restore the animated elements opacity BEFORE hiding the loader
    // This way they start fading in while the loader is still visible
    if (elements.cyContainer) {
      elements.cyContainer.style.opacity = '1';
    }
    
    if (elements.orbitalPaths) {
      elements.orbitalPaths.style.opacity = '1';
    }
    
    // Remove loading class from main circle
    if (elements.graphCircle) {
      elements.graphCircle.classList.remove('loading');
    }
    
    // Wait a moment to let elements start becoming visible
    // before starting to fade out the loader
    setTimeout(() => {
      // Only now start fading out the loader
      if (elements.loader) {
        elements.loader.classList.remove('show');
      }
      
      // Reset loading state
      isLoading = false;
      
      // Give extra time for all transitions to complete
      // This longer delay ensures everything is fully visible before resolving
      setTimeout(resolve, FADE_OUT_DURATION);
    }, ELEMENTS_TRANSITION_DELAY);
  });
};

/**
 * Cancel any loading operation immediately (for error states)
 * Bypasses animations for critical situations
 */
export const cancelLoading = () => {
  const elements = {
    loader: $('#global-loader'),
    graphCircle: $('#orbit-graph-circle'),
    cyContainer: $('#cy'),
    orbitalPaths: $('.orbit-paths')
  };
  
  // Reset all elements immediately
  if (elements.loader) elements.loader.classList.remove('show');
  if (elements.graphCircle) elements.graphCircle.classList.remove('loading');
  if (elements.cyContainer) elements.cyContainer.style.opacity = '1';
  if (elements.orbitalPaths) elements.orbitalPaths.style.opacity = '1';
  
  // Reset loading state
  isLoading = false;
};