# Simple Loader Feature

## Overview

For graphs with fewer than 10 nodes, the application now uses a simple opacity transition (0.1s out and 0.1s in) instead of the full orbital loading animation. This provides a more responsive user experience for small graphs while maintaining the dramatic orbital animation for larger, more complex graphs.

## Implementation Details

### Threshold
- **Small graphs**: < 10 nodes → Simple opacity transition
- **Large graphs**: ≥ 10 nodes → Full orbital animation

### Timing
- **Fade out**: 100ms
- **Fade in**: 100ms
- **Total transition time**: ~200ms (vs ~2-3 seconds for full orbital animation)

### Modified Files

#### `js/ui/loader.js`
- ✅ Added `showSimpleTransition()` function for small graphs
- ✅ Added `hideSimpleTransition()` function 
- ✅ Modified `showCalcLoader()` to accept `nodeCount` parameter
- ✅ Modified `hideCalcLoader()` to handle simple transition mode
- ✅ Updated `cancelLoading()` to reset simple transition state
- ✅ Set `NODE_COUNT_THRESHOLD = 10` for the 10-node threshold

#### `js/graph/sigma-controller.js`
- ✅ Modified `handleCalculation()` to parse edges and calculate node count before showing loader
- ✅ Pass node count to `showCalcLoader(message, nodeCount)`

#### `js/ui/saved-graphs.js`
- ✅ Modified `handleLoadGraph()` to calculate node count from saved graph edges
- ✅ Modified `handleRegularExample()` to calculate node count from example edges
- ✅ Both functions now pass node count to `showCalcLoader()`

### Affected Elements

The simple transition applies to:
- `#cy` (main graph container)
- `.orbit-paths` (orbital animation paths)

These elements are faded to 0.1 opacity during the transition, then restored to full opacity.

### Behavior

1. **User triggers calculation** (via Calculate button, loading saved graph, or example)
2. **System parses edges** to determine node count
3. **Conditional loader**:
   - If nodes < 10: Simple 0.1s opacity transition
   - If nodes ≥ 10: Full orbital animation with progress messages
4. **Graph processing** continues normally
5. **Transition reversal** when processing completes

## Testing

To test the feature:

1. **Small graphs** (should use simple transition):
   - "Simple Circuit" example (4 nodes)
   - "Simple Path" example (4 nodes) 
   - Custom graphs with edges like: `[a,b],[b,c],[c,d]`
   - Any graph with fewer than 10 nodes

2. **Large graphs** (should use full orbital animation):
   - "K5 Complete Graph" example (5 nodes - still uses simple transition with new threshold)
   - Random generator with 10+ vertices
   - Custom graphs with 10+ nodes

3. **Console verification**:
   - Look for: `"Using simple opacity transition for X nodes"` (small graphs)
   - Look for: `"Using full orbital animation for X nodes"` (large graphs)
   - Look for: `"Graph has X nodes, threshold is 10"` (threshold check)

## Benefits

- **Performance**: Faster loading experience for small graphs (under 10 nodes)
- **User Experience**: Immediate feedback without waiting for complex animations
- **Scalability**: Maintains dramatic effect for complex graphs where loading time is more justified
- **Backwards Compatibility**: Large graphs continue to use the existing orbital animation system 

## Configuration

The threshold can be adjusted by changing the `NODE_COUNT_THRESHOLD` constant in `js/ui/loader.js`:

```javascript
// Node count threshold for simple vs full loader
const NODE_COUNT_THRESHOLD = 10; // Change this value to adjust threshold
``` 