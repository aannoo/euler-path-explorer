/**
 * Event Handling Module
 * Provides centralized event management
 */
import { $ } from './dom.js';

// Store all registered event handlers
const handlers = new Map();

/**
 * Attach an event listener to an element
 * @param {string|Element} element - DOM element or selector
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @return {string|null} Handler ID for removal or null if element not found
 */
export const on = (element, event, handler) => {
  // If selector string provided, get the element
  if (typeof element === 'string') {
    element = $(element);
  }
  
  if (!element) return null;
  
  // Generate unique ID
  const id = `${event}:${Math.random().toString(36).slice(2)}`;
  
  // Store handler data
  handlers.set(id, { element, event, handler });
  
  // Attach event listener
  element.addEventListener(event, handler);
  
  // Return ID for removal
  return id;
};

/**
 * Remove an event listener
 * @param {string} id - Handler ID returned from on()
 * @return {boolean} Success
 */
export const off = (id) => {
  if (!handlers.has(id)) return false;
  
  const { element, event, handler } = handlers.get(id);
  
  // Remove event listener
  element.removeEventListener(event, handler);
  
  // Remove from handlers map
  handlers.delete(id);
  
  return true;
};

/**
 * Set up multiple event handlers
 * @param {Object} config - Configuration object mapping selectors to event maps
 * @return {Function} Cleanup function to remove all handlers
 */
export const setupEvents = (config) => {
  const ids = [];
  
  // Format: { '.selector': { 'click': handler } }
  Object.entries(config).forEach(([selector, events]) => {
    Object.entries(events).forEach(([eventName, handler]) => {
      const id = on(selector, eventName, handler);
      if (id) ids.push(id);
    });
  });
  
  // Return function to clean up all handlers
  return () => ids.forEach(off);
}; 