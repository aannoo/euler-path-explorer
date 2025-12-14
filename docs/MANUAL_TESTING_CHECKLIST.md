# EULER App Manual Testing Checklist

This checklist covers manual testing scenarios for the EULER Euler Path Explorer application.

## Pre-requisites
- [ ] Dev server running on http://localhost:8888
- [ ] Browser DevTools open (Console + Network tabs)
- [ ] Test on both Desktop (≥769px) and Mobile (≤768px) viewports

---

## 1. Application Load & Initialization

### 1.1 Initial Load
- [ ] Page loads without console errors
- [ ] Orbital welcome animation plays smoothly
- [ ] Euler portrait displays correctly
- [ ] Loading indicator disappears after init
- [ ] All CSS styles applied (orange theme visible)

### 1.2 Performance Targets
- [ ] LCP (Largest Contentful Paint) < 1500ms
- [ ] No render-blocking errors in console
- [ ] Force layout stops after ~3 seconds (check CPU)

---

## 2. Graph Input (Input Tab)

### 2.1 Text Mode Input
- [ ] Default example graph loads: `[a,b],[b,c],[c,d],[d,a]`
- [ ] Can clear input field
- [ ] Can type custom edge list
- [ ] Input validates on change (red border for invalid)

### 2.2 Edge List Formats
Test each format parses correctly:
- [ ] Basic: `[a,b],[b,c],[c,a]`
- [ ] Weighted: `[a,b,5],[b,c,3],[c,a,7]`
- [ ] Euler line: `A-B` (bidirectional)
- [ ] Euler line directed: `A->B`
- [ ] JSON format: `[{"source":"a","target":"b"}]`

### 2.3 Visual Editor Mode
- [ ] Toggle switches between Text/Visual modes
- [ ] Can add nodes by clicking canvas
- [ ] Can add edges by connecting nodes
- [ ] Can delete nodes/edges
- [ ] Changes sync to text input

### 2.4 Graph Options
- [ ] Directed toggle works (arrows appear on edges)
- [ ] Weighted toggle works (weight labels appear)
- [ ] Options persist when switching modes

---

## 3. Graph Visualization (Sigma.js)

### 3.1 Display
- [ ] Graph renders in canvas area
- [ ] Nodes display with labels
- [ ] Edges connect correct nodes
- [ ] Colors match theme (orange accents)

### 3.2 Interactions
- [ ] Pan: Click and drag canvas
- [ ] Zoom: Mouse wheel / pinch zoom
- [ ] Node hover: Highlights node
- [ ] Node click: Selects node
- [ ] Edge click: Selects edge

### 3.3 Layout Controls (Desktop)
- [ ] Zoom In button works
- [ ] Zoom Out button works
- [ ] Fit to Screen button works
- [ ] Force layout animates then stops

---

## 4. Euler Path Calculation

### 4.1 Calculate Button
- [ ] Button is visible and clickable
- [ ] Click triggers calculation
- [ ] Results appear in Results tab
- [ ] No console errors during calculation

### 4.2 Results Display
- [ ] Path displayed as vertex sequence
- [ ] Explanation text shows (circuit/path/none)
- [ ] Animation controls appear (if path exists)

### 4.3 Path Animation
- [ ] Play button starts animation
- [ ] Pause button pauses animation
- [ ] Step forward/back works
- [ ] Reset returns to start
- [ ] Edges highlight during animation
- [ ] Current position indicator visible

### 4.4 Algorithm Correctness
Test known cases:
- [ ] Triangle `[a,b],[b,c],[c,a]` → Circuit exists
- [ ] Path `[a,b],[b,c]` → Path exists (not circuit)
- [ ] Star graph (4+ odd vertices) → No path exists
- [ ] Weighted graph → Chinese Postman activates

---

## 5. Saved Graphs (Saved Tab)

### 5.1 Example Graphs
- [ ] Example graphs section visible
- [ ] Can load "Simple Circuit" example
- [ ] Can load "Weighted Graph" example
- [ ] Can load "Directed Graph" example
- [ ] "Random Euler Graph" generates valid graph

### 5.2 Save Functionality
- [ ] Save button visible
- [ ] Can save current graph with name
- [ ] Saved graph appears in list
- [ ] Saved graph persists after page reload

### 5.3 Graph Management
- [ ] Can load saved graph
- [ ] Can rename saved graph
- [ ] Can duplicate saved graph
- [ ] Can delete saved graph
- [ ] Confirmation before delete

### 5.4 Import/Export
- [ ] Export graph to JSON works
- [ ] Import graph from JSON works
- [ ] Export to PNG image works

---

## 6. Mobile-Specific Tests (≤768px viewport)

### 6.1 Layout
- [ ] Content panel slides over graph
- [ ] "GRAPH VIEW" tab visible at bottom
- [ ] Tabs switch correctly (Input/Results/Saved)

### 6.2 Gestures
- [ ] Swipe up: Expands content panel
- [ ] Swipe down: Retracts content panel
- [ ] Tap "GRAPH VIEW": Shows full graph
- [ ] Touch interactions work on graph

### 6.3 Responsiveness
- [ ] No horizontal scroll
- [ ] All buttons tappable (44px+ touch targets)
- [ ] Text readable without zooming

---

## 7. Desktop-Specific Tests (≥769px viewport)

### 7.1 Layout
- [ ] Side-by-side layout (controls left, graph right)
- [ ] Sidebar expandable/collapsible
- [ ] Graph takes ~65% width

### 7.2 Controls
- [ ] All desktop zoom controls visible
- [ ] Keyboard shortcuts work (if implemented)

---

## 8. Error Handling

### 8.1 Invalid Input
- [ ] Invalid edge format shows error notification
- [ ] Empty graph shows appropriate message
- [ ] Malformed JSON shows parse error

### 8.2 Edge Cases
- [ ] Single vertex graph handles correctly
- [ ] Self-loop edge handles correctly
- [ ] Disconnected graph shows warning
- [ ] Very large graph (100+ nodes) doesn't crash

---

## 9. Performance Checks

### 9.1 Memory
- [ ] No memory leaks after repeated calculations
- [ ] Cleanup works on page unload
- [ ] Console shows no "detached DOM" warnings

### 9.2 CPU
- [ ] Force layout stops (not 20%+ constant CPU)
- [ ] Idle CPU near 0% after settling
- [ ] Animations smooth (60fps)

### 9.3 Console Cleanliness
- [ ] No console.log spam in production
- [ ] Only legitimate warnings/errors shown
- [ ] No "undefined" or "null" errors

---

## 10. Accessibility

### 10.1 Keyboard Navigation
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] Enter/Space activates buttons

### 10.2 Screen Reader
- [ ] Buttons have accessible names
- [ ] Form fields have labels
- [ ] Results announced

---

## Test Results Summary

| Category | Pass | Fail | Notes |
|----------|------|------|-------|
| Load & Init | | | |
| Graph Input | | | |
| Visualization | | | |
| Calculation | | | |
| Saved Graphs | | | |
| Mobile | | | |
| Desktop | | | |
| Error Handling | | | |
| Performance | | | |
| Accessibility | | | |

**Tested By:** _______________
**Date:** _______________
**Browser/Version:** _______________
**Device/Viewport:** _______________
