/**
 * UI Components Module
 * Provides reusable UI components with state management
 */
import { $, $$ } from '../utils/dom.js';
import { on } from '../utils/events.js';
import { getState, setState, subscribe } from '../core/state.js';

/**
 * Create a toggle button that syncs with application state
 * @param {string|Element} selector - Button element or selector
 * @param {string} statePath - Path to state value
 * @param {Object} options - Configuration options
 * @return {Function} Cleanup function
 */
export const createToggleButton = (selector, statePath, options = {}) => {
  const element = typeof selector === 'string' ? $(selector) : selector;
  if (!element) return null;
  
  const {
    activeClass = 'active',
    activeText,
    inactiveText,
    onChange
  } = options;
  
  // Initial state
  const updateDisplay = () => {
    const isActive = getState(statePath);
    
    // Update class
    element.classList.toggle(activeClass, isActive);
    
    // Update text if provided
    if (activeText && inactiveText) {
      element.textContent = isActive ? activeText : inactiveText;
    }
    
    // Call onChange if provided
    if (onChange) {
      onChange(isActive);
    }
  };
  
  // Set up initial state
  updateDisplay();
  
  // Subscribe to state changes
  const unsubscribe = subscribe(statePath, updateDisplay);
  
  // Add click handler
  const handleClick = () => {
    const currentState = getState(statePath);
    setState(statePath, !currentState);
  };
  
  element.addEventListener('click', handleClick);
  
  // Return clean-up function
  return () => {
    unsubscribe();
    element.removeEventListener('click', handleClick);
  };
};

/**
 * Create a tab system that syncs with application state
 * @param {string} tabsSelector - Selector for tab buttons
 * @param {string} panesSelector - Selector for content panes
 * @param {string} statePath - Path to active tab state
 * @param {Object} options - Configuration options
 * @return {Function} Cleanup function
 */
export const createTabs = (tabsSelector, panesSelector, statePath, options = {}) => {
  const tabs = $$(tabsSelector);
  const panes = $$(panesSelector);
  
  if (!tabs.length || !panes.length) return null;
  
  const {
    activeClass = 'active',
    tabAttribute = 'data-tab'
  } = options;
  
  // Function to update UI based on state
  const updateTabs = () => {
    const activeTab = getState(statePath);
    
    // Update tab buttons
    tabs.forEach(tab => {
      const tabId = tab.getAttribute(tabAttribute);
      tab.classList.toggle(activeClass, tabId === activeTab);
    });
    
    // Update tab panes
    panes.forEach(pane => {
      const isActive = pane.id === `${activeTab}-tab`;
      pane.classList.toggle(activeClass, isActive);
    });
  };
  
  // Set up click handlers for tabs
  const handlers = tabs.map(tab => {
    return on(tab, 'click', () => {
      const tabId = tab.getAttribute(tabAttribute);
      setState(statePath, tabId);
    });
  });
  
  // Initial update
  updateTabs();
  
  // Subscribe to state changes
  const unsubscribe = subscribe(statePath, updateTabs);
  
  // Return cleanup function
  return () => {
    unsubscribe();
  };
};

/**
 * Create single toggle property control
 * @param {string} selector - Element selector
 * @param {string} statePath - Path to state
 * @param {Object} options - Configuration options
 * @return {Function} Cleanup function
 */
export const createPropertyToggle = (selector, statePath, options = {}) => {
  const element = $(selector);
  if (!element) return null;
  
  const {
    dataAttribute = 'data-value',
    trueText = 'ON',
    falseText = 'OFF',
    trueClass = 'active',
    onChange
  } = options;
  
  // Function to update button based on state
  const updateButton = () => {
    const value = getState(statePath);
    const isActive = value === true;
    
    // Update attribute
    element.setAttribute(dataAttribute, String(value));
    
    // Update class
    element.classList.toggle(trueClass, isActive);
    
    // Update inner text (look for a span inside or use the whole element)
    const textElement = element.querySelector('span') || element;
    textElement.textContent = isActive ? trueText : falseText;
    
    // Call onChange if provided
    if (onChange) {
      onChange(value);
    }
  };
  
  // Set up click handler
  const handleClick = () => {
    const currentValue = getState(statePath);
    setState(statePath, !currentValue);
  };
  
  element.addEventListener('click', handleClick);
  
  // Initial update
  updateButton();
  
  // Subscribe to state changes
  const unsubscribe = subscribe(statePath, updateButton);
  
  // Return cleanup function
  return () => {
    unsubscribe();
    element.removeEventListener('click', handleClick);
  };
};

/**
 * Create explanation toggle for results panel
 * @param {string} buttonSelector - Show explanation button selector
 * @param {string} contentSelector - Explanation content selector
 * @return {Function} Cleanup function
 */
export const createExplanationToggle = (buttonSelector, contentSelector) => {
  const button = $(buttonSelector);
  const content = $(contentSelector);
  
  if (!button || !content) return null;
  
  // Ensure the explanation is hidden by default
  setState('ui.explanationVisible', false);
  content.classList.add('hidden');
  
  return createToggleButton(button, 'ui.explanationVisible', {
    activeText: 'Hide explanation',
    inactiveText: 'Show explanation',
    onChange: (visible) => {
      content.classList.toggle('hidden', !visible);
    }
  });
}; 