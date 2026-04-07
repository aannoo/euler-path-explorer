/**
 * EULER Toggle Switches Module
 * Handles the functionality for the enhanced EULER toggle switches
 */
import { $, $$ } from '../utils/dom.js';
import { on } from '../utils/events.js';
import { getState, setState, subscribe } from '../core/state.js';
import { updateCurrentGraphSection } from './saved-graphs.js';

/**
 * Initialize EULER toggle switches
 */
export const initializeEulerToggles = () => {
  // Get references to toggle elements
  const directedToggle = $('#directed-toggle');
  const directionInput = $('#direction-input');
  const weightedToggle = $('#weighted-toggle');
  const weightInput = $('#weight-input');
  
  // Update UI based on directed state
  const updateDirectedUI = () => {
    const isDirected = getState('graph.directed');
    directionInput.checked = isDirected;
    directedToggle.classList.toggle('active', isDirected);
    
    // Update hidden input for legacy code compatibility
    $('#directed').value = String(isDirected);
  };
  
  // Update UI based on weighted state
  const updateWeightedUI = () => {
    const isWeighted = getState('graph.weighted');
    weightInput.checked = isWeighted;
    weightedToggle.classList.toggle('active', isWeighted);
    
    // Update hidden input for legacy code compatibility
    $('#weighted').value = String(isWeighted);
    
    // Show/hide weighted hint (now includes Chinese Postman info)
    $('#weighted-hint').classList.toggle('hidden', !isWeighted);
    
    // Update toggle appearance
    if (!isWeighted) {
      weightedToggle.classList.add('inactive');
    } else {
      weightedToggle.classList.remove('inactive');
    }
  };
  
  // Add Chinese flag hover effect - only when toggle is inactive
  on(weightedToggle, 'mouseenter', () => {
    // Check if toggle is currently active by looking at CSS class (more reliable than state)
    const isActive = weightedToggle.classList.contains('active');
    
    // Only show Chinese flag if toggle is not active (not weighted)
    if (!isActive) {
      weightedToggle.classList.remove('inactive');
      const weightedToggleRect = weightedToggle.getBoundingClientRect();
      
      // Create or update flag element
      let flagElement = document.getElementById('weighted-flag');
      if (!flagElement) {
        flagElement = document.createElement('span');
        flagElement.id = 'weighted-flag';
        flagElement.className = 'euler-flag';
        flagElement.innerHTML = '🇨🇳';
        document.body.appendChild(flagElement);
      }
      
      // Position flag next to toggle (this still needs to be dynamic)
      flagElement.style.left = `${weightedToggleRect.right + 10}px`;
      flagElement.style.top = `${weightedToggleRect.top + weightedToggleRect.height/2 - 10}px`;
      flagElement.classList.add('visible');
    }
  });
  
  on(weightedToggle, 'mouseleave', () => {
    // Check if toggle is currently active by looking at CSS class (more reliable than state)
    const isActive = weightedToggle.classList.contains('active');
    if (!isActive) {
      weightedToggle.classList.add('inactive');
    }
    
    // Hide flag
    const flagElement = document.getElementById('weighted-flag');
    if (flagElement) {
      flagElement.classList.remove('visible');
      setTimeout(() => {
        if (flagElement.parentNode) {
          flagElement.parentNode.removeChild(flagElement);
        }
      }, 300);
    }
  });
  
  // Set up click handlers that first update UI then update state
  on(directedToggle, 'click', () => {
    // Check for pending state first, fall back to current state
    const pendingState = getState('graph.pendingDirected');
    const currentState = getState('graph.directed');
    // Use pending state if it exists, otherwise use current state
    const effectiveState = pendingState !== undefined ? pendingState : currentState;
    const newState = !effectiveState;
    
    // Update the UI first
    directionInput.checked = newState;
    directedToggle.classList.toggle('active', newState);
    $('#directed').value = String(newState);
    
    // Then update the state (pendingDirected instead of directly updating directed)
    setState('graph.pendingDirected', newState);
    setState('graph.directed', newState);
    updateCurrentGraphSection();
  });
  
  on(weightedToggle, 'click', () => {
    // Check for pending state first, fall back to current state
    const pendingState = getState('graph.pendingWeighted');
    const currentState = getState('graph.weighted');
    // Use pending state if it exists, otherwise use current state
    const effectiveState = pendingState !== undefined ? pendingState : currentState;
    const newState = !effectiveState;
    
    // Update the UI first
    weightInput.checked = newState;
    weightedToggle.classList.toggle('active', newState);
    $('#weighted').value = String(newState);
    
    // Show/hide weighted hint
    $('#weighted-hint').classList.toggle('hidden', !newState);
    
    // Update toggle appearance
    weightedToggle.classList.toggle('inactive', !newState);
    
    // Then update the state
    setState('graph.pendingWeighted', newState);
    setState('graph.weighted', newState);
    updateCurrentGraphSection();
  });
  
  // Set up state subscriptions
  const directedUnsub = subscribe('graph.directed', updateDirectedUI);
  const weightedUnsub = subscribe('graph.weighted', updateWeightedUI);
  
  // Initial update
  updateDirectedUI();
  updateWeightedUI();
  
  // Return cleanup function
  return () => {
    if (directedUnsub) directedUnsub();
    if (weightedUnsub) weightedUnsub();
    
    // Clean up flag element if it exists
    const flagElement = document.getElementById('weighted-flag');
    if (flagElement && flagElement.parentNode) {
      flagElement.parentNode.removeChild(flagElement);
    }
  };
};

/**
 * Create a single EULER toggle switch
 * @param {string} selector - Toggle element selector
 * @param {string} statePath - Path to state value
 * @return {Function} Cleanup function
 */
export const createEulerToggle = (selector, statePath) => {
  const toggle = $(selector);
  if (!toggle) return null;
  
  // Function to update toggle based on state
  const updateToggle = () => {
    const value = getState(statePath);
    toggle.classList.toggle('active', value);
  };
  
  // Set up click handler
  const handleClick = () => {
    const currentValue = getState(statePath);
    setState(statePath, !currentValue);
  };
  
  on(toggle, 'click', handleClick);
  
  // Initial update
  updateToggle();
  
  // Subscribe to state changes
  const unsubscribe = subscribe(statePath, updateToggle);
  
  // Return cleanup function
  return () => {
    unsubscribe();
    toggle.removeEventListener('click', handleClick);
  };
}; 
