/**
 * Canvas Gesture Controller - Bypasses DOM event issues
 * Provides smooth gesture control by using invisible canvas overlay
 */

// IMPROVED: Configuration constants for maintainability
const GESTURE_CONFIG = {
  // Snap zone boundaries
  MIDDLE_ZONE_START: 0.4,
  MIDDLE_ZONE_END: 0.6,
  EDGE_ZONE_THRESHOLD: 0.25,
  EDGE_ZONE_THRESHOLD_HIGH: 0.75,
  
  // Velocity thresholds (px/ms)
  VELOCITY: {
    SUPER_FAST: 4.0,
    FAST: 2.0,
    MODERATE: 1.0,
    MIDDLE_ZONE_OVERRIDE: 1.5  // Higher threshold to break out of middle
  },
  
  // Animation durations (ms)
  ANIMATION: {
    SUPER_FAST: 100,
    FAST: 200,
    MODERATE: 400,
    SLOW: 700,
    TAP: 200
  },
  
  // Gesture detection
  GESTURE_THRESHOLD: 5,        // px movement to detect gesture intent
  TAP_THRESHOLD: 5,           // px movement for tap detection
  TAP_DURATION: 200,          // ms for tap detection
  VELOCITY_SAMPLE_TIME: 150,  // ms to keep velocity samples
  MAX_VELOCITY_SAMPLES: 5,    // number of samples for smoothing
  
  // Visual feedback
  ZONE_HEIGHT: 80,            // Height of gesture zones - restore to 80px to match original design
  DEBUG_OPACITY: 0.3,         // Opacity for debug zones
  
  // Progress limits
  MAX_PROGRESS: 0.91          // Keep tab accessible
};

export class CanvasGestureController {
  constructor(options = {}) {
    this.contentElement = options.contentElement;
    this.onProgressChange = options.onProgressChange || (() => {});
    this.onModeChange = options.onModeChange || (() => {});
    
    // IMPROVED: Production mode detection
    const isProduction = !window.location.hostname.includes('localhost') && 
                        !window.location.hostname.includes('127.0.0.1') &&
                        !window.location.hostname.includes('192.168.') &&
                        !window.location.search.includes('debug=true');
    this.enableDebug = (options.debug === true) && !isProduction;
    
    // Gesture state
    this.isGestureActive = false;
    this.gestureStartY = 0;
    this.gestureCurrentY = 0;
    this.gestureStartTime = 0;
    this.gestureVelocityY = 0;
    this.initialProgress = 0;
    
    // IMPROVED: Initialize velocity tracking for release velocity detection
    this.velocityHistory = [];
    this.lastMoveTime = Date.now();
    this.lastMoveY = 0;
    this.releaseVelocity = 0; // Track actual release velocity
    
    // Current state
    this.currentMode = 'normal'; // normal, split, retracted
    this.currentProgress = 0; // 0 to 1 (0 = normal, 1 = fully retracted)
    this.maxProgress = GESTURE_CONFIG.MAX_PROGRESS; // Use constant

    // PERFORMANCE FIX: Cache for getBoundingClientRect to avoid layout thrashing
    this._cachedCanvasRect = null;
    this._cachedScreenHeight = window.innerHeight;
    this._rectCacheTime = 0;
    
    // NEW: Gesture detection improvements
    this.gestureThreshold = GESTURE_CONFIG.GESTURE_THRESHOLD; // Use constant
    this.gestureStartZone = null; // Track where the gesture started
    this.allowScrolling = false; // Whether to allow content scrolling
    this.wasRecentGesture = false; // Track if we just had a gesture (to avoid click conflicts)
    
    // Create and setup canvas
    this.setupCanvas();
    
    console.log('🎨 Canvas Gesture Controller initialized with gesture zones');
  }
  
  setupCanvas() {
    // Create canvas element - but make it only cover gesture zones initially
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'gesture-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
      pointer-events: none;
      background: transparent;
      touch-action: none;
    `;
    
    // Add to document
    document.body.appendChild(this.canvas);
    
    // Get context
    this.ctx = this.canvas.getContext('2d');
    
    // Setup canvas sizing
    this.resizeCanvas();
    // PERFORMANCE FIX: RAF-throttled resize handler
    this._resizeRAFId = null;
    window.addEventListener('resize', () => {
      if (this._resizeRAFId) return;
      this._resizeRAFId = requestAnimationFrame(() => {
        this.resizeCanvas();
        this._resizeRAFId = null;
      });
    });
    
    // Create gesture zone elements instead of full-screen canvas
    this.setupGestureZones();
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // PERFORMANCE FIX: Invalidate rect cache on resize
    this._cachedCanvasRect = null;
    this._cachedScreenHeight = window.innerHeight;
  }

  // PERFORMANCE FIX: Get cached canvas rect to avoid layout thrashing
  // Only recalculates if cache is stale (>100ms old) or null
  _getCanvasRect() {
    const now = Date.now();
    if (!this._cachedCanvasRect || (now - this._rectCacheTime) > 100) {
      this._cachedCanvasRect = this.canvas.getBoundingClientRect();
      this._rectCacheTime = now;
    }
    return this._cachedCanvasRect;
  }

  // PERFORMANCE FIX: Refresh cache at gesture start for accurate tracking
  _refreshRectCache() {
    this._cachedCanvasRect = this.canvas.getBoundingClientRect();
    this._cachedScreenHeight = window.innerHeight;
    this._rectCacheTime = Date.now();
  }
  
  getTouchZone(x, y) {
    // IMPROVED: Better zone detection using constants
    // PERFORMANCE FIX: Use cached screen height instead of window.innerHeight
    const screenHeight = this._cachedScreenHeight || window.innerHeight;
    const tabThreshold = GESTURE_CONFIG.ZONE_HEIGHT; // Use constant
    const edgeThreshold = 50; // Edge zones for full-screen gestures
    
    // Tab zones (primary gesture areas)
    if (this.currentMode === 'retracted') {
      // When retracted, tab should be at top
      if (y < tabThreshold) return 'tab-top';
    } else {
      // When normal/split, tab is at bottom  
      if (y > screenHeight - tabThreshold) return 'tab-bottom';
    }
    
    // Edge zones (secondary gesture areas)
    if (y < edgeThreshold) return 'top-edge';
    if (y > screenHeight - edgeThreshold) return 'bottom-edge';
    
    // Content zone (should allow scrolling unless clear gesture)
    return 'content';
  }
  
  handleGestureStart(x, y, e) {
    const zone = this.getTouchZone(x, y);
    this.gestureStartZone = zone;
    
    // ENHANCED: Haptic feedback for better mobile experience
    this.triggerHapticFeedback('light');
    
    if (this.enableDebug) {
      console.log('🎯 Gesture start:', { x, y, zone, currentMode: this.currentMode });
    }
    
    this.isGestureActive = true;
    this.gestureStartY = y;
    this.gestureCurrentY = y;
    this.gestureStartTime = Date.now();
    this.initialProgress = this.currentProgress;
    this.allowScrolling = (zone === 'content'); // Allow scrolling in content areas initially
    
    // IMPROVED: Initialize velocity tracking
    this.velocityHistory = [];
    this.lastMoveTime = Date.now();
    this.lastMoveY = y;
    this.releaseVelocity = 0; // Track actual release velocity
    
    // PERFORMANCE FIX: Remove CSS transitions during gesture for immediate response
    if (this.contentElement) {
      this.contentElement.style.transition = 'none';
      this.contentElement.style.setProperty('transition', 'none', 'important');
    }
    
    // NEW: Visual feedback during drag - add active state to tab
    this.addDragVisualFeedback();
    
    // Visual feedback
    if (this.enableDebug) {
      this.showTouchPoint(x, y);
    }
    
    // SMART SCROLL DETECTION: Only prevent default for gesture zones
    if (zone !== 'content') {
      e.preventDefault();
      return true;
    }
    
    // For content zone, wait to see if it's a scroll or gesture
    return false; // Let event bubble for now
  }
  
  handleGestureMove(x, y, e) {
    if (!this.isGestureActive) return false;
    
    this.gestureCurrentY = y;
    const deltaY = this.gestureStartY - this.gestureCurrentY;
    const screenHeight = window.innerHeight;
    
    // Check if movement exceeds gesture threshold
    const movementMagnitude = Math.abs(deltaY);
    const isGestureIntent = movementMagnitude > this.gestureThreshold || this.gestureStartZone !== 'content';
    
    // If in content area and movement is small, allow scrolling
    if (this.allowScrolling && !isGestureIntent) {
      return false; // Let DOM handle scrolling
    }
    
    // Once gesture intent is detected, take control
    if (isGestureIntent && this.allowScrolling) {
      this.allowScrolling = false; // Switch to gesture mode
      if (this.enableDebug) {
        console.log('🔄 Switching from scroll to gesture mode');
      }
    }
    
    // FIXED: 1:1 drag ratio - direct pixel-to-pixel mapping
    // Full screen height = full gesture range for natural 1:1 feel
    const maxTranslateDistance = screenHeight; // Use full screen height instead of 85%
    let progressDelta = deltaY / maxTranslateDistance; // Direct 1:1 mapping
    
    // Apply to current progress
    let newProgress = this.initialProgress + progressDelta;
    newProgress = Math.max(0, Math.min(1, newProgress)); // Clamp 0-1
    
    // PERFORMANCE FIX: Direct transform update without animation
    this.updateProgressImmediate(newProgress);
    
    // NEW: Show snap zone indicators during drag
    this.updateSnapZoneIndicator(newProgress);
    
    // FIXED: Track release velocity (last few samples) instead of average velocity
    const now = Date.now();
    const timeDelta = now - this.lastMoveTime;
    const yDelta = y - this.lastMoveY;
    
    if (timeDelta > 0 && timeDelta < 100) { // Ignore if too much time passed (pause)
      // FIXED: Correct velocity direction (up = positive, down = negative)
      const instantVelocity = (this.lastMoveY - y) / timeDelta; // Inverted to match gesture direction
      
      // Keep velocity samples for release velocity calculation using constants
      this.velocityHistory.push({
        velocity: instantVelocity,
        time: now,
        y: y
      });
      
      // IMPROVED: Use constants for memory management
      if (this.velocityHistory.length > GESTURE_CONFIG.MAX_VELOCITY_SAMPLES) {
        this.velocityHistory.shift();
      }
      
      // Keep only recent samples using constant
      this.velocityHistory = this.velocityHistory.filter(
        sample => now - sample.time < GESTURE_CONFIG.VELOCITY_SAMPLE_TIME
      );
      
      this.lastMoveTime = now;
      this.lastMoveY = y;
    }
    
    // Calculate velocity for momentum (reverted to simpler method)
    const gestureDuration = Date.now() - this.gestureStartTime;
    if (gestureDuration > 0) {
      this.gestureVelocityY = deltaY / gestureDuration; // pixels per ms
    }
    
    if (this.enableDebug) {
      console.log('🖱️ Gesture move:', { deltaY, newProgress, velocity: this.gestureVelocityY, ratio: '1:1' });
    }
    
    e.preventDefault();
    return true;
  }
  
  handleGestureEnd(x, y, e) {
    if (!this.isGestureActive) return false;
    
    const gestureDuration = Date.now() - this.gestureStartTime;
    const deltaY = this.gestureStartY - this.gestureCurrentY;
    
    // FIXED: Calculate actual release velocity from recent movement samples
    if (this.velocityHistory.length > 0) {
      // Use average of recent samples for smooth release velocity
      const recentSamples = this.velocityHistory.slice(-3); // Last 3 samples
      this.releaseVelocity = recentSamples.reduce((sum, sample) => sum + sample.velocity, 0) / recentSamples.length;
    } else {
      // Fallback to average velocity if no samples
      this.releaseVelocity = gestureDuration > 0 ? deltaY / gestureDuration : 0;
    }
    
    if (this.enableDebug) {
      console.log('🔚 Gesture end:', { 
        deltaY,
        averageVelocity: this.gestureVelocityY,
        releaseVelocity: this.releaseVelocity,
        releaseSpeed: Math.abs(this.releaseVelocity),
        velocitySamples: this.velocityHistory.length,
        duration: gestureDuration,
        currentProgress: this.currentProgress.toFixed(2),
        direction: this.releaseVelocity > 0 ? 'UP (retract)' : 'DOWN (expand)'
      });
    }
    
    // NEW: Remove visual feedback
    this.removeDragVisualFeedback();
    
    // NEW: Clear snap zone indicators
    this.updateSnapZoneIndicator(-1); // Pass invalid progress to clear indicators
    
    // PERFORMANCE FIX: Faster tap detection using constants
    const wasTap = Math.abs(deltaY) < GESTURE_CONFIG.TAP_THRESHOLD && 
                   gestureDuration < GESTURE_CONFIG.TAP_DURATION;
    
    // FIXED: Don't set CSS transition - we're controlling timing with JavaScript
    // The CSS transition was overriding our dynamic animation durations!
    if (this.contentElement) {
      this.contentElement.style.transition = 'none'; // Let JavaScript handle all timing
    }
    
    if (wasTap) {
      // Quick tap - toggle mode with smooth animation
      if (this.enableDebug) {
        console.log('👆 Tap detected - toggling mode');
      }
      this.triggerHapticFeedback('medium'); // Clear haptic feedback for taps
      this.handleTap();
    } else {
      // Drag gesture - snap based on position and velocity
      if (this.enableDebug) {
        console.log('🖱️ Drag detected - snapping to position');
      }
      let targetProgress;
      
      // RESEARCH-BASED: Hybrid snap logic like Android BottomSheetBehavior
      const inMiddleZone = this.currentProgress >= GESTURE_CONFIG.MIDDLE_ZONE_START && 
                          this.currentProgress <= GESTURE_CONFIG.MIDDLE_ZONE_END;
      const normalVelocityThreshold = GESTURE_CONFIG.VELOCITY.MODERATE;
      const middleZoneVelocityThreshold = GESTURE_CONFIG.VELOCITY.MIDDLE_ZONE_OVERRIDE;
      
      // FIXED: Use release velocity instead of average velocity for flick detection
      const releaseSpeed = Math.abs(this.releaseVelocity);
      
      if (inMiddleZone && releaseSpeed < middleZoneVelocityThreshold) {
        // In middle zone with moderate velocity - prefer middle (magnetic pull)
        targetProgress = 0.5;
        if (this.enableDebug) {
          console.log('🧲 Middle zone magnetic pull - snap to 0.5 (release velocity:', releaseSpeed.toFixed(2), ')');
        }
      } else if (releaseSpeed > normalVelocityThreshold) {
        // Fast gesture - momentum overrides position (like real platforms)
        targetProgress = this.releaseVelocity > 0 ? this.maxProgress : 0;
        if (this.enableDebug) {
          console.log('⚡ Momentum override - velocity snap:', this.releaseVelocity > 0 ? 'retracted' : 'normal', '(release velocity:', releaseSpeed.toFixed(2), ')');
        }
      } else {
        // Slow gesture - snap to nearest position
        if (this.currentProgress < GESTURE_CONFIG.EDGE_ZONE_THRESHOLD) {
          targetProgress = 0; // normal
        } else if (this.currentProgress < GESTURE_CONFIG.EDGE_ZONE_THRESHOLD_HIGH) {
          targetProgress = 0.5; // split
        } else {
          targetProgress = this.maxProgress; // retracted
        }
        if (this.enableDebug) {
          console.log('🐌 Position-based snap to:', targetProgress, '(release velocity:', releaseSpeed.toFixed(2), ')');
        }
      }
      
      // MOBILE-TUNED: Dynamic animation duration based on real mobile velocity patterns
      let animationDuration;
      if (releaseSpeed > GESTURE_CONFIG.VELOCITY.SUPER_FAST) {
        // Very fast flick - super quick animation (like throwing)
        animationDuration = GESTURE_CONFIG.ANIMATION.SUPER_FAST;
      } else if (releaseSpeed > GESTURE_CONFIG.VELOCITY.FAST) {
        // Fast flick - quick animation
        animationDuration = GESTURE_CONFIG.ANIMATION.FAST;
      } else if (releaseSpeed > GESTURE_CONFIG.VELOCITY.MODERATE) {
        // Moderate drag - normal animation  
        animationDuration = GESTURE_CONFIG.ANIMATION.MODERATE;
      } else {
        // Slow drag - much slower animation (more deliberate)
        animationDuration = GESTURE_CONFIG.ANIMATION.SLOW;
      }
      
      // ENHANCED: Haptic feedback based on snap type
      if (releaseSpeed > GESTURE_CONFIG.VELOCITY.FAST) {
        this.triggerHapticFeedback('medium'); // Stronger feedback for fast snaps
      } else {
        this.triggerHapticFeedback('light'); // Gentle feedback for slow snaps
      }
      
      if (this.enableDebug) {
        console.log('⏱️ Animation duration:', animationDuration + 'ms', 'for velocity:', releaseSpeed.toFixed(2));
      }
      this.animateToProgress(targetProgress, animationDuration);
    }
    
    this.isGestureActive = false;
    this.wasRecentGesture = true;
    
    // Clear recent gesture flag after a short delay
    setTimeout(() => {
      this.wasRecentGesture = false;
    }, 300);
    
    e.preventDefault();
    return true;
  }
  
  // NEW: Handle tap to toggle between modes
  handleTap() {
    if (this.enableDebug) {
      console.log('🎯 handleTap() called - current mode:', this.currentMode);
    }
    
    let targetProgress;
    switch (this.currentMode) {
      case 'normal':
        targetProgress = this.maxProgress; // Go to retracted
        if (this.enableDebug) {
          console.log('📤 Tap: normal -> retracted');
        }
        break;
      case 'split':
        // From split, go to the opposite end based on current position
        targetProgress = this.currentProgress > 0.5 ? 0 : this.maxProgress;
        if (this.enableDebug) {
          console.log('📑 Tap: split -> ', targetProgress === 0 ? 'normal' : 'retracted');
        }
        break;
      case 'retracted':
        targetProgress = 0; // Go to normal
        if (this.enableDebug) {
          console.log('📥 Tap: retracted -> normal');
        }
        break;
      default:
        targetProgress = 0;
    }
    
    this.animateToProgress(targetProgress, GESTURE_CONFIG.ANIMATION.TAP); // Use constant
  }
  
  // PERFORMANCE FIX: New immediate update method without mode changes during drag
  updateProgressImmediate(progress) {
    this.currentProgress = progress;
    
    // Update content transform immediately - use full range
    const translateY = -progress * 100; // 0% to -100% for full range
    if (this.contentElement) {
      this.contentElement.style.transform = `translateY(${translateY}%)`;
    }
    
    // Always notify of progress changes (but skip mode change during drag for performance)
    this.onProgressChange(progress, translateY);
  }
  
  updateProgress(progress) {
    this.currentProgress = progress;
    
    // Update content transform - use full range  
    const translateY = -progress * 100; // 0% to -100% for full range
    if (this.contentElement) {
      this.contentElement.style.transform = `translateY(${translateY}%)`;
    }
    
    // Determine mode based on progress
    let newMode;
    if (progress < 0.25) {
      newMode = 'normal';
    } else if (progress < 0.65) {
      newMode = 'split';
    } else {
      newMode = 'retracted';
    }
    
    // Notify of mode changes
    if (newMode !== this.currentMode) {
      this.currentMode = newMode;
      this.onModeChange(newMode, progress);
    }
    
    // Always notify of progress changes
    this.onProgressChange(progress, translateY);
  }
  
  animateToProgress(targetProgress, duration = 350) { // IMPROVED: Better default duration
    const startProgress = this.currentProgress;
    const progressDelta = targetProgress - startProgress;
    const startTime = Date.now();
    
    // MOBILE DEBUG: Track actual animation timing
    if (this.enableDebug) {
      console.log('🎬 Animation START:', {
        from: startProgress.toFixed(2),
        to: targetProgress.toFixed(2),
        expectedDuration: duration + 'ms',
        timestamp: startTime
      });
    }
    
    // CRITICAL: Ensure NO CSS transitions interfere on mobile
    if (this.contentElement) {
      this.contentElement.style.transition = 'none !important';
      this.contentElement.style.webkitTransition = 'none !important';
      this.contentElement.style.setProperty('transition', 'none', 'important');
      this.contentElement.style.setProperty('-webkit-transition', 'none', 'important');
    }
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      
      // FIXED: Natural mobile easing - ease-out for smooth deceleration
      const easeT = 1 - Math.pow(1 - t, 2); // Quadratic ease-out - feels natural on mobile
      
      const newProgress = startProgress + (progressDelta * easeT);
      
      this.updateProgress(newProgress);
      
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        // MOBILE DEBUG: Log actual completion time
        if (this.enableDebug) {
          const actualDuration = Date.now() - startTime;
          console.log('🎬 Animation END:', {
            expectedDuration: duration + 'ms',
            actualDuration: actualDuration + 'ms',
            difference: (actualDuration - duration) + 'ms',
            efficiency: ((actualDuration / duration) * 100).toFixed(1) + '%'
          });
        }
      }
    };
    
    animate();
  }
  
  attachEventListeners() {
    // Touch events
    this.canvas.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      // PERFORMANCE FIX: Refresh rect cache at gesture start, then use cached value
      this._refreshRectCache();
      const rect = this._cachedCanvasRect;
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      const zone = this.getTouchZone(x, y);
      
      // Only handle touches in tab zones - let content area touches pass through
      if (zone === 'tab-top' || zone === 'tab-bottom') {
        const handled = this.handleGestureStart(x, y, e);
        if (handled) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
      // For all other zones (content, edges), let the event pass through completely
    }, { passive: false });
    
    this.canvas.addEventListener('touchmove', (e) => {
      // Only handle touchmove if we have an active gesture
      if (!this.isGestureActive) {
        return; // Let content scroll normally
      }

      const touch = e.touches[0];
      // PERFORMANCE FIX: Use cached rect instead of calling getBoundingClientRect on every move
      const rect = this._getCanvasRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      const handled = this.handleGestureMove(x, y, e);
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, { passive: false });
    
    this.canvas.addEventListener('touchend', (e) => {
      if (!this.isGestureActive) return;

      const touch = e.changedTouches[0];
      // PERFORMANCE FIX: Use cached rect for touchend
      const rect = this._getCanvasRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      const handled = this.handleGestureEnd(x, y, e);
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, { passive: false });
    
    // Mouse events for desktop testing
    let mouseDown = false;

    this.canvas.addEventListener('mousedown', (e) => {
      mouseDown = true;
      // PERFORMANCE FIX: Refresh rect cache at gesture start
      this._refreshRectCache();
      const rect = this._cachedCanvasRect;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.handleGestureStart(x, y, e);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (!mouseDown) return;
      // PERFORMANCE FIX: Use cached rect for mousemove
      const rect = this._getCanvasRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.handleGestureMove(x, y, e);
    });

    this.canvas.addEventListener('mouseup', (e) => {
      if (!mouseDown) return;
      mouseDown = false;
      // PERFORMANCE FIX: Use cached rect for mouseup
      const rect = this._getCanvasRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.handleGestureEnd(x, y, e);
    });
  }
  
  // Visual feedback for debugging
  showTouchPoint(x, y) {
    const point = document.createElement('div');
    point.style.cssText = `
      position: fixed;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 0, 0.6);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1998;
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%);
      animation: canvas-touch-ripple 0.6s ease-out forwards;
    `;
    
    document.body.appendChild(point);
    setTimeout(() => point.remove(), 600);
    
    // Add CSS animation if not exists
    if (!document.getElementById('canvas-gesture-styles')) {
      const style = document.createElement('style');
      style.id = 'canvas-gesture-styles';
      style.textContent = `
        @keyframes canvas-touch-ripple {
          0% { 
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% { 
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }
        
        /* Gesture active state for consistent mobile feedback */
        .gesture-active {
          background: #FFA726 !important; /* Bright orange to match CSS */
          box-shadow: 0 4px 12px rgba(255, 167, 38, 0.8) !important;
          border-top: 2px solid #FFB74D !important;
          color: #000 !important;
          opacity: 1 !important;
          transform: scale(0.98);
        }
        
        /* Ensure visual feedback works on mobile */
        #graph-view-tab.gesture-active {
          background: #FFA726 !important; /* Bright orange to match CSS */
          box-shadow: 0 4px 12px rgba(255, 167, 38, 0.8) !important;
          border-top-color: #FFB74D !important;
          color: #000 !important;
          opacity: 1 !important;
          backdrop-filter: none !important;
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
        
        /* Force solid background on mobile webkit */
        @supports (-webkit-touch-callout: none) {
          .gesture-active {
            background: #FFA726 !important;
            opacity: 1 !important;
          }
          #graph-view-tab.gesture-active {
            background: #FFA726 !important;
            opacity: 1 !important;
            backdrop-filter: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // API methods
  setProgress(progress, animate = true) {
    if (animate) {
      this.animateToProgress(progress);
    } else {
      this.updateProgress(progress);
    }
  }
  
  getProgress() {
    return this.currentProgress;
  }
  
  getMode() {
    return this.currentMode;
  }
  
  destroy() {
    // Clean up visual feedback
    this.removeDragVisualFeedback();
    this.updateSnapZoneIndicator(-1); // Clear indicators
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    
    if (this.topGestureZone && this.topGestureZone.parentNode) {
      this.topGestureZone.parentNode.removeChild(this.topGestureZone);
    }
    
    if (this.bottomGestureZone && this.bottomGestureZone.parentNode) {
      this.bottomGestureZone.parentNode.removeChild(this.bottomGestureZone);
    }
    
    const styles = document.getElementById('canvas-gesture-styles');
    if (styles) {
      styles.remove();
    }
  }
  
  setupGestureZones() {
    // FIXED: Properly sized gesture zones that match actual tab dimensions
    const tab = document.getElementById('graph-view-tab');
    const tabHeight = tab ? tab.offsetHeight : GESTURE_CONFIG.ZONE_HEIGHT;
    const zoneHeight = Math.max(tabHeight, GESTURE_CONFIG.ZONE_HEIGHT);
    
    // Create transparent overlay elements only in gesture zones
    this.topGestureZone = document.createElement('div');
    this.topGestureZone.id = 'top-gesture-zone';
    this.topGestureZone.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: ${zoneHeight}px;
      z-index: 99;
      pointer-events: auto;
      background: ${this.enableDebug ? `rgba(255, 0, 0, ${GESTURE_CONFIG.DEBUG_OPACITY})` : 'transparent'};
      touch-action: none;
      border: ${this.enableDebug ? '2px solid red' : 'none'};
      display: ${this.enableDebug ? 'block' : 'none'};
    `;
    
    this.bottomGestureZone = document.createElement('div');
    this.bottomGestureZone.id = 'bottom-gesture-zone';
    this.bottomGestureZone.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: ${zoneHeight}px;
      z-index: 99;
      pointer-events: auto;
      background: ${this.enableDebug ? `rgba(0, 255, 0, ${GESTURE_CONFIG.DEBUG_OPACITY})` : 'transparent'};
      touch-action: none;
      border: ${this.enableDebug ? '2px solid green' : 'none'};
      display: ${this.enableDebug ? 'block' : 'none'};
    `;
    
    // IMPROVED: Only add zones in debug mode to avoid blocking interactions
    if (this.enableDebug) {
      document.body.appendChild(this.topGestureZone);
      document.body.appendChild(this.bottomGestureZone);
      
      // DEBUG: Log gesture zone positions and tab position
      console.log('🎨 Debug gesture zones created:');
      console.log('  - Top zone:', this.topGestureZone.getBoundingClientRect());
      console.log('  - Bottom zone:', this.bottomGestureZone.getBoundingClientRect());
    }
    
    // Check where the tab actually is
    if (tab) {
      console.log('  - Tab position:', tab.getBoundingClientRect());
      console.log('  - Tab computed style:', {
        position: getComputedStyle(tab).position,
        zIndex: getComputedStyle(tab).zIndex,
        display: getComputedStyle(tab).display
      });
    }
    
    // Attach events based on debug mode
    if (this.enableDebug) {
      this.attachGestureZoneEvents();
    }
    this.attachDirectTabEvents();
  }
  
  attachGestureZoneEvents() {
    // Attach events to top and bottom gesture zones
    [this.topGestureZone, this.bottomGestureZone].forEach((zone, index) => {
      const zoneName = index === 0 ? 'TOP' : 'BOTTOM';
      
      zone.addEventListener('touchstart', (e) => {
        console.log(`🎯 ${zoneName} ZONE TOUCHSTART:`, {
          zone: zoneName,
          touches: e.touches.length,
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY
        });
        
        const touch = e.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        
        // CRITICAL FIX: Check if touch is on an interactive element (like the tab)
        const elementAtPoint = document.elementFromPoint(x, y);
        console.log('🎯 Touch on element:', elementAtPoint?.tagName, elementAtPoint?.className, elementAtPoint?.id);
        
        if (this.isInteractiveElement(elementAtPoint)) {
          console.log('🔗 Interactive element detected, entering DOM passthrough mode');
          this.enterDomInteractionMode(elementAtPoint, e);
          return; // Let DOM handle the event
        }
        
        const handled = this.handleGestureStart(x, y, e);
        if (handled) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, { passive: false });
      
      zone.addEventListener('touchmove', (e) => {
        if (!this.isGestureActive) return;
        
        const touch = e.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        
        const handled = this.handleGestureMove(x, y, e);
        if (handled) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, { passive: false });
      
      zone.addEventListener('touchend', (e) => {
        if (!this.isGestureActive) return;
        
        const touch = e.changedTouches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        
        const handled = this.handleGestureEnd(x, y, e);
        if (handled) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, { passive: false });
    });
  }
  
  // NEW: Check if element is interactive (tab, buttons, links, etc.)
  isInteractiveElement(element) {
    if (!element) return false;
    
    // Check for specific IDs that should be interactive
    if (element.id === 'graph-view-tab') {
      if (this.enableDebug) {
        console.log('✅ Found graph-view-tab - allowing interaction');
      }
      return true;
    }
    
    // Check common interactive elements
    const interactiveTags = ['a', 'button', 'input', 'textarea', 'select', 'label'];
    if (interactiveTags.includes(element.tagName.toLowerCase())) {
      return true;
    }
    
    // Check for click handlers
    if (element.onclick || element.getAttribute('onclick')) {
      return true;
    }
    
    // Check for role attributes
    const role = element.getAttribute('role');
    if (role && ['button', 'link', 'tab', 'menuitem'].includes(role)) {
      return true;
    }
    
    // PERFORMANCE FIX: Check cursor via style attribute first (avoids getComputedStyle)
    // Only fall back to getComputedStyle if style attribute doesn't have cursor
    const inlineStyle = element.style?.cursor;
    if (inlineStyle === 'pointer') {
      return true;
    }
    // Only check computed style if we haven't found pointer yet and element has classList
    // This is a tradeoff - we skip deep CSS cursor checks for performance
    if (element.classList && (
      element.classList.contains('clickable') ||
      element.classList.contains('btn') ||
      element.classList.contains('button')
    )) {
      return true;
    }
    
    // Check parent element (for nested structures)
    if (element.parentElement && element.parentElement.id === 'graph-view-tab') {
      if (this.enableDebug) {
        console.log('✅ Found child of graph-view-tab - allowing interaction');
      }
      return true;
    }
    
    return false;
  }
  
  // NEW: Temporarily disable canvas for DOM interaction
  enterDomInteractionMode(element, originalEvent) {
    if (this.enableDebug) {
      console.log('🔄 Entering DOM interaction mode for:', element.tagName, element.className);
    }
    
    // Temporarily disable gesture zones
    this.topGestureZone.style.pointerEvents = 'none';
    this.bottomGestureZone.style.pointerEvents = 'none';
    
    // Re-enable after touch ends or short delay
    const enableGestureZones = () => {
      this.topGestureZone.style.pointerEvents = 'auto';
      this.bottomGestureZone.style.pointerEvents = 'auto';
      if (this.enableDebug) {
        console.log('🔄 DOM interaction mode disabled - gesture zones re-enabled');
      }
      
      document.removeEventListener('touchend', enableGestureZones);
      document.removeEventListener('touchcancel', enableGestureZones);
    };
    
    document.addEventListener('touchend', enableGestureZones, { once: true });
    document.addEventListener('touchcancel', enableGestureZones, { once: true });
    
    // Safety timeout in case events don't fire
    setTimeout(enableGestureZones, 500);
  }
  
  // NEW: Attach events directly to the tab to bypass z-index issues
  attachDirectTabEvents() {
    const tab = document.getElementById('graph-view-tab');
    if (!tab) {
      if (this.enableDebug) {
        console.warn('⚠️ graph-view-tab not found for direct event attachment');
      }
      return;
    }
    
    if (this.enableDebug) {
      console.log('📍 Attaching direct events to tab element');
      console.log('📍 Tab computed style before events:', {
        touchAction: getComputedStyle(tab).touchAction,
        pointerEvents: getComputedStyle(tab).pointerEvents,
        userSelect: getComputedStyle(tab).userSelect,
        webkitUserSelect: getComputedStyle(tab).webkitUserSelect,
        webkitTouchCallout: getComputedStyle(tab).webkitTouchCallout
      });
    }
    
    // CRITICAL: Set CSS properties to ensure touch events work
    tab.style.touchAction = 'none';
    tab.style.webkitUserSelect = 'none';
    tab.style.userSelect = 'none';
    tab.style.webkitTouchCallout = 'none';
    
    if (this.enableDebug) {
      console.log('📍 Tab style updated for touch events');
    }
    
    tab.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      const handled = this.handleGestureStart(touch.clientX, touch.clientY, e);
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, { passive: false });
    
    tab.addEventListener('touchmove', (e) => {
      if (!this.isGestureActive) return;
      const touch = e.touches[0];
      const handled = this.handleGestureMove(touch.clientX, touch.clientY, e);
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, { passive: false });
    
    tab.addEventListener('touchend', (e) => {
      if (!this.isGestureActive) return;
      const touch = e.changedTouches[0];
      const handled = this.handleGestureEnd(touch.clientX, touch.clientY, e);
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, { passive: false });
    
    // DEBUGGING: Add more event listeners to see what events ARE firing
    tab.addEventListener('touchcancel', (e) => {
      // Handle touch cancel if needed
    });
    
    tab.addEventListener('pointerdown', (e) => {
      // Handle pointer events if needed  
    });
    
    // CRITICAL: Add mouse events for Chrome DevTools testing
    let mouseDown = false;
    
    tab.addEventListener('mousedown', (e) => {
      mouseDown = true;
      
      const handled = this.handleGestureStart(e.clientX, e.clientY, e);
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
    
    tab.addEventListener('mousemove', (e) => {
      if (!mouseDown || !this.isGestureActive) return;
      
      const handled = this.handleGestureMove(e.clientX, e.clientY, e);
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
    
    tab.addEventListener('mouseup', (e) => {
      if (!mouseDown) return;
      mouseDown = false;
      
      if (this.isGestureActive) {
        const handled = this.handleGestureEnd(e.clientX, e.clientY, e);
        if (handled) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    });
    
    // Handle mouse leaving the tab area
    tab.addEventListener('mouseleave', (e) => {
      if (mouseDown && this.isGestureActive) {
        mouseDown = false;
        this.handleGestureEnd(e.clientX, e.clientY, e);
      }
    });
    
    // Also add click fallback for tap gestures
    tab.addEventListener('click', (e) => {
      // Only handle if no gesture was active (pure click)
      if (!this.wasRecentGesture) {
        this.handleTap();
        e.preventDefault();
        e.stopPropagation();
      }
    });
    
    // Only keep essential event listeners for production
    if (this.enableDebug) {
      // GLOBAL DEBUG: Listen to ALL touch events on document to see what's happening
      document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const elementAtTouch = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elementAtTouch === tab || elementAtTouch?.closest('#graph-view-tab')) {
          console.log('🌍 GLOBAL DEBUG: Touch on tab area detected');
          console.log('  - Actual target:', e.target.tagName, e.target.className);
          console.log('  - Element at point:', elementAtTouch.tagName, elementAtTouch.className);
          console.log('  - Event path:', e.composedPath().map(el => el.tagName || el.constructor.name).slice(0, 5));
        }
      }, { passive: true, capture: true });
    }
  }
  
  // ENHANCED: Haptic feedback for mobile responsiveness
  triggerHapticFeedback(intensity = 'light') {
    if (!navigator.vibrate) return;
    
    const patterns = {
      light: [10],           // Quick tap
      medium: [15, 10, 15],  // Double pulse for snaps
      strong: [20, 15, 20]   // Strong pulse for major actions
    };
    
    navigator.vibrate(patterns[intensity] || patterns.light);
  }
  
  // NEW: Visual feedback during drag for better mobile UX
  addDragVisualFeedback() {
    const tab = document.getElementById('graph-view-tab');
    if (!tab) return;
    
    // FIXED: Bright orange colors to make tab stand out
    tab.style.transform = 'scale(0.98)';
    tab.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
    tab.style.boxShadow = '0 4px 12px rgba(255, 167, 38, 0.8)'; // Bright orange glow
    tab.style.backgroundColor = '#FFA726'; // Bright orange background
    tab.style.color = '#000'; // Black text for contrast
    tab.style.opacity = '1'; // Remove any transparency
    
    // Add visual class for CSS styling
    tab.classList.add('gesture-active');
    
    if (this.enableDebug) {
      console.log('✨ Added drag visual feedback');
    }
  }
  
  removeDragVisualFeedback() {
    const tab = document.getElementById('graph-view-tab');
    if (!tab) return;
    
    // Remove visual feedback - but keep the bright orange base color
    tab.style.transform = '';
    tab.style.transition = '';
    tab.style.boxShadow = '';
    tab.style.backgroundColor = ''; // Let CSS handle background (will be orange)
    tab.style.color = ''; // Let CSS handle color (will be black)
    tab.style.opacity = '';
    
    // Remove visual class
    tab.classList.remove('gesture-active');
    
    if (this.enableDebug) {
      console.log('✨ Removed drag visual feedback');
    }
  }
  
  // ENHANCED: Better snap zone feedback with progress visualization
  updateSnapZoneIndicator(progress) {
    const tab = document.getElementById('graph-view-tab');
    if (!tab) return;
    
    // Clear previous indicators
    tab.style.borderLeft = '';
    tab.style.borderRadius = '';
    tab.style.background = '';
    
    if (progress < 0) return; // Clear indicators
    
    // Show visual feedback based on snap zones using constants
    const inMiddleZone = progress >= GESTURE_CONFIG.MIDDLE_ZONE_START && 
                        progress <= GESTURE_CONFIG.MIDDLE_ZONE_END;
    const nearEdges = progress < GESTURE_CONFIG.EDGE_ZONE_THRESHOLD || 
                     progress > GESTURE_CONFIG.EDGE_ZONE_THRESHOLD_HIGH;
    
    if (inMiddleZone) {
      // Bright green for middle zone with orange base
      tab.style.borderLeft = '4px solid #4CAF50';
      tab.style.borderRadius = '0 8px 8px 0';
      tab.style.background = `linear-gradient(to right, 
        #FF9800 0%, 
        rgba(76, 175, 80, 0.3) 40%, 
        rgba(76, 175, 80, 0.2) 60%, 
        #FF9800 100%)`;
    } else if (nearEdges) {
      // Bright yellow for edge zones to contrast with orange
      tab.style.borderLeft = '3px solid #FFEB3B';
      tab.style.background = `linear-gradient(to right, 
        #FF9800 0%,
        rgba(255, 235, 59, 0.3) ${progress * 100}%, 
        #FF9800 ${progress * 100}%)`;
    } else {
      // Subtle white progress indicator with orange base
      tab.style.background = `linear-gradient(to right, 
        #FF9800 0%,
        rgba(255, 255, 255, 0.2) ${progress * 100}%, 
        #FF9800 ${progress * 100}%)`;
    }
  }
} 