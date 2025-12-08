/**
 * DOM utility functions
 * Provides simplified DOM selection and manipulation
 */

/**
 * Select a single element matching the selector
 * @param {string} selector - CSS selector
 * @return {Element|null} The selected element or null
 */
export const $ = selector => document.querySelector(selector);

/**
 * Select all elements matching the selector
 * @param {string} selector - CSS selector
 * @return {Array<Element>} Array of matched elements
 */
export const $$ = selector => Array.from(document.querySelectorAll(selector));

/**
 * Simple element cache to avoid repeated DOM queries
 */
const cache = new Map();

/**
 * Select an element and cache the result
 * @param {string} selector - CSS selector
 * @return {Element|null} The selected element or null
 */
export const cached = (selector) => {
  if (!cache.has(selector)) {
    cache.set(selector, $(selector));
  }
  return cache.get(selector);
};

/**
 * Clear the element cache
 */
export const clearCache = () => cache.clear(); 