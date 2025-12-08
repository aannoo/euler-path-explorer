/**
 * Notification System Module
 * Handles desktop and mobile notifications
 * Split from init.js for better maintainability
 */

import { $ } from '../utils/dom.js';
import { subscribe } from '../core/state.js';

// Track notification timeout for cleanup
let notificationTimeout = null;

/**
 * Show a notification message
 * @param {string} message - Message to display
 * @param {string} [type='info'] - Type: 'success', 'error', 'warning', 'info'
 * @param {number} [duration=3000] - Duration in ms
 */
export function showNotification(message, type = 'info', duration = 3000) {
  if (!message) return;

  const isMobile = window.innerWidth <= 768;
  const bannerId = isMobile ? 'mobile-notification-banner' : 'desktop-notification-banner';
  const banner = $(`#${bannerId}`);

  if (!banner) {
    console.warn(`Notification banner not found: ${bannerId}`);
    return;
  }

  // Clear any existing timeout
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

/**
 * Set up mobile notification
 * @private
 */
function setupMobileNotification(banner, message, type) {
  banner.textContent = message;
  banner.classList.remove('success', 'error', 'warning', 'info');
  banner.classList.add(type);
  banner.classList.add('show');
}

/**
 * Set up desktop notification
 * @private
 */
function setupDesktopNotification(banner, message, type) {
  const icon = banner.querySelector('.notification-icon');
  const text = banner.querySelector('.notification-text');

  if (!icon || !text) {
    console.warn('Desktop notification elements missing');
    return;
  }

  text.textContent = message;
  banner.classList.remove('success', 'error', 'warning', 'info');
  banner.classList.add(type);
  icon.className = `notification-icon fas fa-${getNotificationIcon(type)}`;
  banner.classList.add('active');
}

/**
 * Hide notification
 * @private
 */
function hideNotification(banner, isMobile) {
  banner.classList.remove(isMobile ? 'show' : 'active');
}

/**
 * Get icon class for notification type
 * @private
 */
function getNotificationIcon(type) {
  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  return icons[type] || icons.info;
}

/**
 * Initialize notification system
 * @returns {Function} Cleanup function
 */
export function initializeNotifications() {
  const unsubscribe = subscribe('ui.notification', (notification) => {
    if (notification) {
      showNotification(notification.message || notification, notification.type, notification.duration);
    }
  });

  return () => {
    unsubscribe();
    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
      notificationTimeout = null;
    }
  };
}

/**
 * Clear current notification timeout
 */
export function clearNotificationTimeout() {
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    notificationTimeout = null;
  }
}
